
import {player, fg2, playerType, characterSelections, screenShake, percentShake} from "main/main";
import {rotateVector} from "main/render";
import {sounds} from "main/sfx";
import {knockbackSounds, segmentSegmentCollision, getKnockback, getHitstun} from "physics/hitDetection";
import {findCollision} from "./environmentalCollision";
import {moveECB} from "../main/util/ecbTransform";
import {pickSmallestSweep} from "../main/util/findSmallestWithin";
import {subtract} from "../main/linAlg";
import {actionStates} from "physics/actionStateShortcuts";
import {drawVfx} from "main/vfx/drawVfx";
import {activeStage} from "stages/activeStage";
import {createHitbox} from "../main/util/createHitBox";
import {Vec2D} from "../main/util/Vec2D";
import {Segment2D} from "../main/util/Segment2D";

import {drawLaserLine} from "../main/vfx/dVfx/laser";
import {chromaticAberration} from "../main/vfx/chromaticAberration";
import {unmakeColour} from "../main/vfx/makeColour";

import {sweepCircleVsSweepCircle, sweepCircleVsAABB} from "./interpolatedCollision";
/* eslint-disable */

export let aArticles = [];
export let destroyArticleQueue = [];
export let articleHitQueue = [];

export function resetAArticles (){
  aArticles = [];
}
// 0.00390583333333333333333333333333 = hitbox size multiplier
export const articles = {
    "LASER": {
        name: "LASER",
        canTurboCancel: false,
        init: function(options) {
          const p = options.p;
          const x = options.x;
          const y = options.y;
          const rotate = options.rotate;
          const isFox = (options.isFox !== undefined) ? options.isFox : true;
          const partOfThrow = options.partOfThrow || false;
          this.strokeStyle = isFox ? "rgba(255, 59, 59,0.6)" : "rgba(73,130,234,0.6)";
          this.fillStyle   = isFox ? "rgb(255, 193, 193)" : "rgb(225, 255, 255)";
            var obj = {
                hitList: [],
                rotate: rotate,
                destroyOnHit: true,
                clank: false,
                timer: 0,
                vel: new Vec2D((isFox ? 7 : 5) * Math.cos(rotate) * player[p].phys.face, (isFox ? 7 : 5) * Math.sin(rotate)),
                pos: new Vec2D(player[p].phys.pos.x + (x * player[p].phys.face), player[p].phys.pos.y + y),
                posPrev1: new Vec2D(player[p].phys.pos.x, player[p].phys.pos.y + y),
                posPrev2: new Vec2D(player[p].phys.pos.x, player[p].phys.pos.y + y),
                posPrev3: new Vec2D(player[p].phys.pos.x, player[p].phys.pos.y + y),
                posPrev : new Vec2D(player[p].phys.pos.x, player[p].phys.pos.y + y),
                hb: new createHitbox(new Vec2D(0, 0), 1.172, 3, 361, isFox ? 0 : partOfThrow ? 0 : 100, 0, isFox ? 0 : partOfThrow ? 0 : 5, 0, 0, 1, 1),
                ecb: [ new Vec2D( player[p].phys.pos.x + (x * player[p].phys.face)     , player[p].phys.pos.y + y - 0.01 )
                     , new Vec2D( player[p].phys.pos.x + (x * player[p].phys.face) + 10, player[p].phys.pos.y + y        )
                     , new Vec2D( player[p].phys.pos.x + (x * player[p].phys.face)     , player[p].phys.pos.y + y + 0.01 )
                     , new Vec2D( player[p].phys.pos.x + (x * player[p].phys.face) - 10, player[p].phys.pos.y + y        )]
            };
            aArticles.push({
              name: "LASER",
              player:p,
              instance:obj
            });
            articles.LASER.main(aArticles.length - 1);
        },
        main: function(i) {
            aArticles[i].instance.timer++;
            if (aArticles[i].instance.timer > 4) {
                aArticles[i].instance.posPrev.x = aArticles[i].instance.posPrev3.x;
                aArticles[i].instance.posPrev.y = aArticles[i].instance.posPrev3.y;
            }
            if (aArticles[i].instance.timer > 3) {
                aArticles[i].instance.posPrev3.x = aArticles[i].instance.posPrev2.x;
                aArticles[i].instance.posPrev3.y = aArticles[i].instance.posPrev2.y;
            }
            if (aArticles[i].instance.timer > 2) {
                aArticles[i].instance.posPrev2.x = aArticles[i].instance.posPrev1.x;
                aArticles[i].instance.posPrev2.y = aArticles[i].instance.posPrev1.y;
            }
            if (aArticles[i].instance.timer > 1) {
                aArticles[i].instance.posPrev1.x = aArticles[i].instance.pos.x;
                aArticles[i].instance.posPrev1.y = aArticles[i].instance.pos.y;
            }
            aArticles[i].instance.pos.x += aArticles[i].instance.vel.x;
            aArticles[i].instance.ecb[0].x += aArticles[i].instance.vel.x;
            aArticles[i].instance.ecb[1].x += aArticles[i].instance.vel.x;
            aArticles[i].instance.ecb[2].x += aArticles[i].instance.vel.x;
            aArticles[i].instance.ecb[3].x += aArticles[i].instance.vel.x;
            aArticles[i].instance.pos.y += aArticles[i].instance.vel.y;
            aArticles[i].instance.ecb[0].y += aArticles[i].instance.vel.y;
            aArticles[i].instance.ecb[1].y += aArticles[i].instance.vel.y;
            aArticles[i].instance.ecb[2].y += aArticles[i].instance.vel.y;
            aArticles[i].instance.ecb[3].y += aArticles[i].instance.vel.y;
            if (wallDetection(i) || aArticles[i].instance.timer > 200) {
                destroyArticleQueue.push(i);
            }
        },
        draw: function(i) {
            fg2.save();
            var h = new Vec2D((aArticles[i].instance.pos.x * activeStage.scale) + activeStage.offset[0], (aArticles[i].instance.pos.y * -activeStage.scale) +
                activeStage.offset[1]);
            var t = new Vec2D((aArticles[i].instance.posPrev.x * activeStage.scale) + activeStage.offset[0], (aArticles[i].instance.posPrev.y * -
                    activeStage.scale) + activeStage.offset[1]);
            var d = (h.x > t.x) ? 1 : -1;
            var r = aArticles[i].instance.rotate;
            var v1 = rotateVector(-4, 2, -r);
            var v2 = rotateVector(4, 2, -r);
            var v3 = rotateVector(4, -2, -r);
            var v4 = rotateVector(-4, -2, -r);
            chromaticAberration( fg2, (c1, c2) => drawLaserLine(h,t,v1,v2,v3,v4,d,c1,c2), unmakeColour(this.strokeStyle), unmakeColour(this.fillStyle), 0.8
                               , new Vec2D ( -0.3 * Math.sin(r) * activeStage.scale, - 0.3 * Math.cos(r) * activeStage.scale) );
            fg2.restore();

        }
    },

    "ILLUSION": {
        name: "ILLUSION",
        noDraw: true,
        canTurboCancel: true,
        init: function(options) {
            const p = options.p;
            const type = options.type;
            const isFox = options.isFox || true;
            var obj = {
                hitList: [],
                destroyOnHit: false,
                clank: true,
                timer: 0,
                pos: new Vec2D(player[p].phys.posPrev.x, player[p].phys.posPrev.y + 5),
                posPrev: new Vec2D(player[p].phys.posPrev.x, player[p].phys.posPrev.y + 5),
                hb: new createHitbox(new Vec2D(0, 0), 4.160, 7, isFox ? 80 : 270, isFox ? 60 : 70, isFox ? 68 : 70, 0, 1, 1, 1, 1),
                ecb: [new Vec2D(player[p].phys.posPrev.x, player[p].phys.posPrev.y - 10), new Vec2D(player[p].phys.posPrev
                        .x + 10, player[p].phys.posPrev.y), new Vec2D(player[p].phys.posPrev.x, player[p].phys.posPrev.y +
                    10), new Vec2D(player[p].phys.posPrev.x - 10, player[p].phys.posPrev.y)]
            };
            // if ground
            if (type) {
                if (isFox) {
                   obj.hb.kg = 40; 
                }
                else {
                    obj.hb.angle = 65;
                    obj.hb.kg = 60;
                    obj.hb.bk = 74;
                }
            }
            aArticles.push({
              name: "ILLUSION",
              player: p,
              instance: obj
            });
            articles.ILLUSION.main(aArticles.length - 1);
        },
        main: function(i) {
            var p = aArticles[i].player;
            aArticles[i].instance.timer++;
            aArticles[i].instance.posPrev = new Vec2D(aArticles[i].instance.pos.x, aArticles[i].instance.pos.y);
            aArticles[i].instance.pos = new Vec2D(player[p].phys.posPrev.x, player[p].phys.posPrev.y);
            aArticles[i].instance.ecb = [new Vec2D(player[p].phys.posPrev.x, player[p].phys.posPrev.y - 10), new Vec2D(player[p]
                    .phys.posPrev.x + 10, player[p].phys.posPrev.y), new Vec2D(player[p].phys.posPrev.x, player[p].phys.posPrev
                    .y + 10), new Vec2D(player[p].phys.posPrev.x - 10, player[p].phys.posPrev.y)];
            if (aArticles[i].instance.timer > 5) {
                destroyArticleQueue.push(i);
            }
        }
    }
};

export function executeArticles (){
  destroyArticleQueue = [];
  for (var i = 0; i < aArticles.length; i++) {
    articles[aArticles[i].name].main(i);
  }
}

export function destroyArticles (){
  for (var k = 0; k < destroyArticleQueue.length; k++) {
    aArticles.splice(destroyArticleQueue[k] - k, 1);
  }
}

export function renderArticles (){
  for (var i = 0; i < aArticles.length; i++) {
    if (!articles[aArticles[i].name].noDraw) {
      articles[aArticles[i].name].draw(i);
    }
  }
}

export function articlesHitDetection (){
    articleHitQueue = [];
    for (var a = 0; a < aArticles.length; a++) {
        var articleDestroyed = false;
        if (aArticles[a].instance.timer > 1) {
            var interpolate = true;
        } else {
            var interpolate = false;
        }
        for (var v = 0; v < 4; v++) {
            var inHitList = false;
            for (var n = 0; n < 4; n++) {
                if (v == aArticles[a].instance.hitList[n]) {
                    inHitList = true;
                    break;
                }
            }
            // if v isnt the owner, not destroyed and no in article's hitlist
            if (v != aArticles[a].player && !articleDestroyed && !inHitList && playerType[v] != -1) {
                // if article is clankable
                var attackerClank = false;
                if (aArticles[a].instance.clank) {
                    for (var k = 0; k < 4; k++) {
                        if (player[v].hitboxes.active[k] && (player[v].hitboxes.id[k].clank == 1 || (player[v].hitboxes.id[k].clank ==
                            2 && player[v].phys.grounded))) {
                            // ILL DO CLANKS TOMOZ
                          /*var clankHit = articleHitCollision(a,v,k);
                           if (clankHit[0]){

                           var diff = player[p].hitboxes.id[j].dmg - player[i].hitboxes.id[k].dmg;
                           if (diff >= 9){
                           // victim clank
                           // attacker cut through
                           player[i].hit.hitlag = Math.floor(player[p].hitboxes.id[j].dmg * (1/3) + 3);
                           turnOffHitboxes(i);
                           actionStates[characterSelections[i]][78].init(i);
                           }
                           else if (diff <= -9){
                           // attacker clank
                           // victim cut through
                           player[p].hit.hitlag = Math.floor(player[i].hitboxes.id[k].dmg * (1/3) + 3);
                           attackerClank = true;
                           articleDestroyed = true;
                           turnOffHitboxes(p);
                           actionStates[characterSelections[p]][78].init(p,input);
                           }
                           else {
                           // both clank
                           player[i].hit.hitlag = Math.floor(player[p].hitboxes.id[j].dmg * (1/3) + 3);
                           player[p].hit.hitlag = Math.floor(player[i].hitboxes.id[k].dmg * (1/3) + 3);
                           attackerClank = true;
                           articleDestroyed = true;
                           turnOffHitboxes(i);
                           actionStates[characterSelections[i]][78].init(i);
                           turnOffHitboxes(p);
                           actionStates[characterSelections[p]][78].init(p,input);
                           }
                           sounds.clank.play();
                           drawVfx("clank",clankHit[1]);
                           player[p].hitboxes.hitList.push(i);
                           break;
                           }*/

                        }
                    }
                }
                if (!attackerClank) {
                    var reflected = false;
                    for (var i = 0; i < 4; i++) {
                        if (player[v].hitboxes.active[i]) {
                            if (player[v].hitboxes.id[i].type == 7) {
                                if (articleHitCollision(a, v, i) || (interpolate && (articleHitCollision(a, v, i) ||
                                    interpolatedArticleCircleCollision(a, new Vec2D(player[v].phys.pos.x + player[v].hitboxes.id[i]
                                            .offset[0].x, player[v].phys.pos.y + player[v].hitboxes.id[i].offset[0].y), player[v].hitboxes
                                        .id[i].size)))) {
                                    if (player[v].actionState.substr(0, 11) == "DOWNSPECIAL") {
                                        // do shine reflect animation
                                        sounds.foxshinereflect.play();
                                    }
                                    // change ownership
                                    aArticles[a].player = v;
                                    // increase damage
                                    aArticles[a].instance.hb.dmg *= 1.5;
                                    // reflect
                                    if (aArticles[a].instance.vel != undefined || aArticles[a].instance.vel != null) {
                                        aArticles[a].instance.vel.x *= -1;
                                        aArticles[a].instance.vel.y *= -1;
                                    }
                                    reflected = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (!reflected) {
                        if (player[v].phys.shielding && (articleShieldCollision(a, v, false) || (interpolate && (
                            articleShieldCollision(a, v, true) || interpolatedArticleCircleCollision(a, player[v].phys.shieldPositionReal,
                                player[v].phys.shieldSize))))) {
                            articleHitQueue.push([a, v, true]);
                            aArticles[a].instance.hitList.push(v);
                            if (articles[aArticles[a].name].canTurboCancel) {
                                player[aArticles[a].player].hasHit = true;
                            }
                        } else if (player[v].phys.hurtBoxState != 1) {
                            if (articleHurtCollision(a, v, false) || (interpolate && (interpolatedArticleHurtCollision(a, v) ||
                                articleHurtCollision(a, v, true)))) {
                                articleHitQueue.push([a, v, false]);
                                aArticles[a].instance.hitList.push(v);
                                if (articles[aArticles[a].name].canTurboCancel) {
                                    player[aArticles[a].player].hasHit = true;
                                }
                                if (aArticles[a].instance.destroyOnHit) {
                                    destroyArticleQueue.push(a);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

export function executeArticleHits (input){
    for (var i = 0; i < articleHitQueue.length; i++) {
        var a = articleHitQueue[i][0];
        var v = articleHitQueue[i][1];
        var shieldHit = articleHitQueue[i][2];
        var o = aArticles[a].player;
        var hb = aArticles[a].instance.hb;

        var damage = hb.dmg;

        if (shieldHit) {
            if (player[v].phys.powerShieldReflectActive) {
                drawVfx({
                  name: "powershieldreflect",
                  pos: player[v].phys.shieldPositionReal,
                  face: player[v].phys.face
                });
                sounds.powershieldreflect.play();
                aArticles[a].player = v; // change ownership to victim
                // reflects velocity
                if (aArticles[a].instance.vel != undefined || aArticles[a].instance.vel != null) {
                    aArticles[a].instance.vel.x *= -1;
                    aArticles[a].instance.vel.y *= -1;
                }
                // cuts damage in half
                aArticles[a].instance.hb.dmg *= 0.5;
            } else {
                player[v].phys.shieldHP -= damage;
                if (player[v].phys.shieldHP < 0) {
                    player[v].phys.shielding = false;
                    player[v].phys.cVel.y = 2.5;
                    player[v].phys.grounded = false;
                    player[v].phys.shieldHP = 0;
                    drawVfx({
                      name: "breakShield",
                      pos: player[v].phys.pos,
                      face: player[v].phys.face
                    });
                    actionStates[characterSelections[v]].SHIELDBREAKFALL.init(v,input);
                    sounds.shieldbreak.play();
                    break;
                }
                if (aArticles[a].instance.destroyOnHit) {
                    destroyArticleQueue.push(a);
                }
                drawVfx({
                  name: "clank",
                  pos: aArticles[a].instance.pos,
                  face: 1
                });
                player[v].hit.hitlag = Math.floor(damage * (1 / 3) + 3);
                player[v].hit.shieldstun = ((Math.floor(damage) * ((0.65 * (1 - ((player[v].phys.shieldAnalog - 0.3) / 0.7))) +
                    0.3)) * 1.5) + 2;
                var victimPush = ((Math.floor(damage) * ((0.195 * (1 - ((player[v].phys.shieldAnalog - 0.3) / 0.7))) + 0.09)) +
                    0.4) * 0.6;
                if (victimPush > 2) {
                    victimPush = 2;
                }
                if (aArticles[a].instance.pos.x < player[v].phys.pos.x) {
                    player[v].phys.cVel.x = victimPush
                } else {
                    player[v].phys.cVel.x = -victimPush
                }
            }

            actionStates[characterSelections[v]].GUARD.init(v,input);

        } else {
            if (player[v].phys.hurtBoxState == 0) {
                var crouching = actionStates[characterSelections[v]][player[v].actionState].crouch;
                var vCancel = false;
                if (player[v].phys.vCancelTimer > 0) {
                    if (actionStates[characterSelections[v]][player[v].actionState].vCancel) {
                        vCancel = true;
                        sounds.vcancel.play();
                    }
                }
                player[v].hit.knockback = getKnockback(hb, damage, damage, player[v].percent, player[v].charAttributes.weight,
                    crouching, vCancel);

                player[v].hit.hitPoint = aArticles[a].instance.pos;
                player[v].percent += damage;

                switch (hb.type) {
                    case 0:
                        drawVfx({
                          name: "normalhit",
                          pos: player[v].hit.hitPoint,
                          face: player[v].phys.face
                        });
                        break;
                    case 1:
                        drawVfx({
                          name: "hitSparks",
                          pos: player[v].hit.hitPoint,
                          face: player[v].phys.face
                        });
                        drawVfx({
                          name: "hitFlair",
                          pos: player[v].hit.hitPoint,
                          face: player[v].phys.face
                        });
                        drawVfx({
                          name: "hitCurve",
                          pos: player[v].hit.hitPoint,
                          face: player[v].phys.face,
                          f: player[v].hit.angle
                        });
                        break;
                    default:
                        break;
                }

                knockbackSounds(hb.type, player[v].hit.knockback, v);

                if (player[v].hit.knockback > 0) {
                    player[v].hit.angle = hb.angle;
                    if (player[v].hit.angle == 361) {
                        if (player[v].hit.knockback < 32.1) {
                            player[v].hit.angle = 0;
                        } else if (player[v].hit.knockback >= 32.1) {
                            player[v].hit.angle = 44;
                        }
                    }

                    player[v].hit.hitlag = Math.floor(damage * (1 / 3) + 3);


                    if (aArticles[a].instance.pos.x < player[v].phys.pos.x) {
                        player[v].hit.reverse = false;
                        player[v].phys.face = -1;
                    } else {
                        player[v].hit.reverse = true;
                        player[v].phys.face = 1;
                    }



                    var isThrow = false;
                    if (player[v].phys.grabbedBy == -1 || (player[v].phys.grabbedBy > -1 && player[v].hit.knockback > 50)) {

                        player[v].hit.hitstun = getHitstun(player[v].hit.knockback);

                        if (player[v].hit.knockback >= 80 || isThrow) {
                            actionStates[characterSelections[v]].DAMAGEFLYN.init(v,input, !isThrow);
                        } else {
                            actionStates[characterSelections[v]].DAMAGEN2.init(v,input);
                        }
                    } else {
                        if (player[v].actionState != "THROWNPUFFDOWN") {
                            actionStates[characterSelections[v]].CAPTUREDAMAGE.init(v,input);
                        }
                    }

                    if (player[v].phys.grounded && player[v].hit.angle > 180) {
                        if (player[v].hit.knockback >= 80) {
                            sounds.bounce.play();
                            drawVfx({
                              name: "groundBounce",
                              pos: player[v].phys.pos,
                              face: player[v].phys.face
                            });
                            player[v].hit.angle = 360 - player[v].hit.angle;
                            player[v].hit.knockback *= 0.8;
                        }
                    }
                    screenShake(player[v].hit.knockback);
                    percentShake(player[v].hit.knockback, v);
                }

            } else {
                sounds.blunthit.play();
                drawVfx({
                  name: "clank",
                  pos: aArticles[a].instance.pos
                });
            }
        }
    }
}

export function wallDetection (i){
  const article = aArticles[i].instance;
  const ecbp = article.ecb;
  let ecb1;
  if (article.timer < 2) {
    const focus = article.posPrev;
    const offset = 0.0001;
    ecb1 = [ new Vec2D ( focus.x         , focus.y - offset ) 
           , new Vec2D ( focus.x + offset, focus.y          )
           , new Vec2D ( focus.x         , focus.y + offset )
           , new Vec2D ( focus.x - offset, focus.y          )
           ];
  }
  else {
    ecb1 = moveECB(ecbp, subtract(article.posPrev,article.pos));
  }
  let collisions = [];
  let thisCollision = null;
  for (var j = 0; j < activeStage.wallL.length; j++) {
    thisCollision = findCollision (ecb1, ecbp, [activeStage.wallL[j], ["l", j]] );
    if (thisCollision !== null ) {
      collisions.push(thisCollision);
    }
  }
  for (var j = 0; j < activeStage.wallR.length; j++) {
    thisCollision = findCollision (ecb1, ecbp, [activeStage.wallR[j], ["r", j]] );
    if (thisCollision !== null ) {
      collisions.push(thisCollision);
    }
  }
  for (var j = 0; j < activeStage.ceiling.length; j++) {
    thisCollision = findCollision (ecb1, ecbp, [activeStage.ceiling[j], ["c", j]] );
    if (thisCollision !== null ) {
      collisions.push(thisCollision);
    }
  }
  for (var j = 0; j < activeStage.ground.length; j++) {
    thisCollision = findCollision (ecb1, ecbp, [activeStage.ground[j], ["g", j]] );
    if (thisCollision !== null ) {
      collisions.push(thisCollision);;
    }
  }
  for (var j = 0; j < activeStage.platform.length; j++) {
    thisCollision = findCollision (ecb1, ecbp, [activeStage.platform[j], ["p", j]] );
    if (thisCollision !== null ) {
      collisions.push(thisCollision);
    }
  }
  let firstCollision = pickSmallestSweep(collisions);
  if (firstCollision !== null) {
    return firstCollision.sweep;
  }
  else {
    return null;
  }

}

export function articleHitCollision (a,v,k){
    var hbpos = aArticles[a].instance.pos;
    var hbpos2 = new Vec2D(player[v].phys.pos.x + (player[v].hitboxes.id[k].offset[player[v].hitboxes.frame].x * player[
            v].phys.face), player[v].phys.pos.y + player[v].hitboxes.id[k].offset[player[v].hitboxes.frame].y);
    var hitPoint = new Vec2D((hbpos.x + hbpos2.x) / 2, (hbpos.y + hbpos2.y) / 2);
    return (Math.pow(hbpos2.x - hbpos.x, 2) + Math.pow(hbpos.y - hbpos2.y, 2) <= Math.pow(aArticles[a].instance.hb.size +
        player[v].hitboxes.id[k].size, 2));

  //return [(Math.pow(hbpos2.x-hbpos.x,2) + Math.pow(hbpos.y-hbpos2.y,2) <= Math.pow(aArticles[a].instance.hb.size+player[v].hitboxes.id[k].size,2)),hitPoint];
}


export function articleShieldCollision (a,v,previous){
    if (previous) {
        var hbpos = aArticles[a].instance.posPrev;
    } else {
        var hbpos = aArticles[a].instance.pos;
    }
    var shieldpos = player[v].phys.shieldPositionReal;

    return (Math.pow(shieldpos.x - hbpos.x, 2) + Math.pow(hbpos.y - shieldpos.y, 2) <= Math.pow(aArticles[a].instance.hb.size +
        player[v].phys.shieldSize, 2));
}

export function interpolatedArticleCircleCollision (a,circlePos,r){
  const h1 = aArticles[a].instance.posPrev;
  const h2 = aArticles[a].instance.pos;
  const s  = aArticles[a].instance.hb.size

  const collision = sweepCircleVsSweepCircle ( h1, s, h2, s, circlePos, r, circlePos, r );

  if (collision === null) {
    return false;
  }
  else {
    return true;
  }
}

export function interpolatedArticleHurtCollision (a,v){
  const hurt = player[v].phys.hurtbox;
  const h1 = aArticles[a].instance.posPrev;
  const h2 = aArticles[a].instance.pos;
  const r  = aArticles[a].instance.hb.size

  const collision = sweepCircleVsAABB ( h1, r, h2, r, hurt.min, hurt.max );

  if (collision === null) {
    return false;
  }
  else {
    return true;
  }
}

export function articleHurtCollision (a,v,previous){
    if (previous) {
        var hbpos = aArticles[a].instance.posPrev;
    } else {
        var hbpos = aArticles[a].instance.pos;
    }
    var hurtCenter = new Vec2D((player[v].phys.hurtbox.min.x + player[v].phys.hurtbox.max.x) / 2, (player[v].phys.hurtbox
            .min.y + player[v].phys.hurtbox.max.y) / 2);
    var distance = new Vec2D(Math.abs(hbpos.x - hurtCenter.x), Math.abs(hbpos.y - hurtCenter.y));

    var hurtWidth = 8;
    var hurtHeight = 18;

    if (distance.x > (hurtWidth / 2 + aArticles[a].instance.hb.size)) {
        return false; }
    if (distance.y > (hurtHeight / 2 + aArticles[a].instance.hb.size)) {
        return false; }

    if (distance.x <= (hurtWidth / 2)) {
        return true; }
    if (distance.y <= (hurtHeight / 2)) {
        return true; }

    var cornerDistance_sq = Math.pow(distance.x - hurtWidth / 2, 2) +
        Math.pow(distance.y - hurtHeight / 2, 2);

    return (cornerDistance_sq <= (Math.pow(aArticles[a].instance.hb.size, 2)));
}
