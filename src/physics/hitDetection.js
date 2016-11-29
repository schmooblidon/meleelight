/* eslint-disable */

window.hitQueue = [];
window.phantomQueue = [];

const angleConversion = Math.PI / 180;

window.hitDetection = function(p) {
  var attackerClank = false;
  for (var i = 0; i < 4; i++) {
    if (playerType[i] > -1) {
      if (i != p) {
        // check if victim is already in hitList
        var inHitList = false;
        for (var k = 0; k < player[p].hitboxes.hitList.length; k++) {
          if (i == player[p].hitboxes.hitList[k]) {
            inHitList = true;
            break;
          }
        }
        if (!inHitList) {
          var storedPhantom = -1;
          for (var j = 0; j < 4; j++) {
            if (player[p].hitboxes.active[j] && player[p].phys.prevFrameHitboxes.active[j]) {
              var interpolate = true;
            } else {
              var interpolate = false;
            }
            if (player[p].hitboxes.active[j] && !(player[p].phys.thrownHitbox && player[p].phys.thrownHitboxOwner ==
                i) && player[p].hitboxes.id[j].type != 7) {
              //console.log(player[i].phys.shielding);
              // clank == 6 means special clank
              if (player[p].hitboxes.id[j].clank == 1 || (player[p].hitboxes.id[j].clank == 2 && player[p].phys.grounded) ||
                player[p].hitboxes.id[j].clank == 6) {
                for (var k = 0; k < 4; k++) {
                  if (player[i].hitboxes.active[k] && (player[i].hitboxes.id[k].clank == 1 || (player[i].hitboxes.id[
                      k].clank == 2 && player[i].phys.grounded) || (player[p].hitboxes.id[j].clank == 6 && player[i]
                      .hitboxes.id[k].clank != 6))) {

                    var clankHit = hitHitCollision(i, p, j, k);
                    if (clankHit[0]) {

                      var diff = player[p].hitboxes.id[j].dmg - player[i].hitboxes.id[k].dmg;
                      if (player[p].hitboxes.id[j].clank == 6) {
                        attackerClank = true;
                        drawVfx("clank", clankHit[1]);
                        player[p].phys.hurtBoxState = 1;
                        player[p].phys.intangibleTimer = 1;
                        // double check still in action state for some weird case
                        if (aS[cS[p]][player[p].actionState].specialClank) {
                          aS[cS[p]][player[p].actionState].onClank(p);
                        }
                      } else {
                        if (diff >= 9) {
                          // victim clank
                          // attacker cut through
                          player[i].hit.hitlag = Math.floor(player[p].hitboxes.id[j].dmg * (1 / 3) + 3);
                          turnOffHitboxes(i);
                          aS[cS[i]].CATCHCUT.init(i);
                        } else if (diff <= -9) {
                          // attacker clank
                          // victim cut through
                          player[p].hit.hitlag = Math.floor(player[i].hitboxes.id[k].dmg * (1 / 3) + 3);
                          attackerClank = true;
                          turnOffHitboxes(p);
                          aS[cS[p]].CATCHCUT.init(p);
                        } else {
                          // both clank
                          player[i].hit.hitlag = Math.floor(player[p].hitboxes.id[j].dmg * (1 / 3) + 3);
                          player[p].hit.hitlag = Math.floor(player[i].hitboxes.id[k].dmg * (1 / 3) + 3);
                          attackerClank = true;
                          turnOffHitboxes(i);
                          aS[cS[i]].CATCHCUT.init(i);
                          turnOffHitboxes(p);
                          aS[cS[p]].CATCHCUT.init(p);
                        }
                        sounds.clank.play();
                        drawVfx("clank", clankHit[1]);
                        player[p].hitboxes.hitList.push(i);
                        player[p].hasHit = true;
                      }
                      break;
                    }

                  }
                }
              }
              if (!attackerClank) {
                if (player[i].phys.shielding && player[p].hitboxes.id[j].hitGrounded && (hitShieldCollision(i, p, j,
                    false) || (interpolate && (hitShieldCollision(i, p, j, true) || interpolatedHitCircleCollision(
                    player[i].phys.shieldPositionReal, player[i].phys.shieldSize, p, j))))) {
                  hitQueue.push([i, p, j, true, false, false]);
                  player[p].hitboxes.hitList.push(i);
                  setHasHit(p, j);
                  break;
                } else if (player[i].phys.hurtBoxState != 1) {
                  //
                  if ((player[p].hitboxes.id[j].hitGrounded && player[i].phys.grounded) || (player[p].hitboxes.id[j].hitAirborne &&
                      !player[i].phys.grounded))
                    if (hitHurtCollision(i, p, j, false) || (interpolate && (interpolatedHitHurtCollision(i, p, j) ||
                        hitHurtCollision(i, p, j, true)))) {
                      if (!hitHurtCollision(i, p, j, false, true) && (interpolate ? !interpolatedHitHurtCollision(i,
                          p, j, true) : true)) {
                        storedPhantom = j;
                      } else {
                        hitQueue.push([i, p, j, false, false, false, false]);
                        player[p].hitboxes.hitList.push(i);
                        setHasHit(p, j);
                        break;
                      }
                    }
                }
              }
            }
            if (storedPhantom > -1) {
              hitQueue.push([i, p, storedPhantom, false, false, false, true]);
              player[p].hitboxes.hitList.push(i);
              setHasHit(p, storedPhantom);
            }
          }
        }

      }
    }
  }
}

window.setHasHit = function(p, j) {
  // for turbo mode. if not a grab and not counter and not a midthrow hitbox.
  if (player[p].hitboxes.id[j].type != 2 && player[p].hitboxes.id[j].type != 6 && player[p].actionState.substr(0, 5) !=
    "THROW") {
    player[p].hasHit = true;
  }
}

window.hitHitCollision = function(i, p, j, k) {
  var hbpos = new Vec2D(player[p].phys.pos.x + (player[p].hitboxes.id[j].offset[player[p].hitboxes.frame].x * player[
    p].phys.face), player[p].phys.pos.y + player[p].hitboxes.id[j].offset[player[p].hitboxes.frame].y);
  var hbpos2 = new Vec2D(player[i].phys.pos.x + (player[i].hitboxes.id[k].offset[player[i].hitboxes.frame].x * player[
    i].phys.face), player[i].phys.pos.y + player[i].hitboxes.id[k].offset[player[i].hitboxes.frame].y);
  var hitPoint = new Vec2D((hbpos.x + hbpos2.x) / 2, (hbpos.y + hbpos2.y) / 2);

  return [(Math.pow(hbpos2.x - hbpos.x, 2) + Math.pow(hbpos.y - hbpos2.y, 2) <= Math.pow(player[p].hitboxes.id[j].size +
    player[i].hitboxes.id[k].size, 2)), hitPoint];
}

window.hitShieldCollision = function(i, p, j, previous) {
  if (previous) {
    var hbpos = new Vec2D(player[p].phys.posPrev.x + (player[p].phys.prevFrameHitboxes.id[j].offset[player[p].phys.prevFrameHitboxes
      .frame].x * player[p].phys.facePrev), player[p].phys.posPrev.y + player[p].phys.prevFrameHitboxes.id[j].offset[
      player[p].phys.prevFrameHitboxes.frame].y);
  } else {
    var hbpos = new Vec2D(player[p].phys.pos.x + (player[p].hitboxes.id[j].offset[player[p].hitboxes.frame].x *
      player[p].phys.face), player[p].phys.pos.y + player[p].hitboxes.id[j].offset[player[p].hitboxes.frame].y);
  }
  var shieldpos = player[i].phys.shieldPositionReal;

  return (Math.pow(shieldpos.x - hbpos.x, 2) + Math.pow(hbpos.y - shieldpos.y, 2) <= Math.pow(player[p].hitboxes.id[j]
    .size + player[i].phys.shieldSize, 2));
}

window.interpolatedHitCircleCollision = function(circlePos, r, p, j) {
  var collision = false;
  var h1 = new Vec2D(player[p].phys.posPrev.x + (player[p].phys.prevFrameHitboxes.id[j].offset[player[p].phys.prevFrameHitboxes
    .frame].x * player[p].phys.facePrev), player[p].phys.posPrev.y + player[p].phys.prevFrameHitboxes.id[j].offset[
    player[p].phys.prevFrameHitboxes.frame].y);
  var h2 = new Vec2D(player[p].phys.pos.x + (player[p].hitboxes.id[j].offset[player[p].hitboxes.frame].x * player[p].phys
    .face), player[p].phys.pos.y + player[p].hitboxes.id[j].offset[player[p].hitboxes.frame].y);
  var segment = new Segment2D(h1.x, h1.y, h2.x - h1.x, h2.y - h1.y);
  var segment2 = new Segment2D(h1.x, h1.y, circlePos.x - h1.x, circlePos.y - h1.y);
  var point3 = segment2.project(segment);
  var segment3 = new Segment2D(h1.x, h1.y, point3.x, point3.y);
  var segment4 = new Segment2D(circlePos.x, circlePos.y, (segment3.x + segment3.vecx) - circlePos.x, (segment3.y +
    segment3.vecy) - circlePos.y);
  if (segment4.segLength() <= r + player[p].hitboxes.id[j].size) {
    if (segment.segLength() >= segment3.segLength()) {
      var a = new Vec2D(segment.vecx, segment.vecy);
      var b = new Vec2D(segment3.vecx, segment3.vecy);
      if (0 <= b.dot(a)) {
        collision = true;
      }
    }
  }
  return collision;
}

window.segmentSegmentCollision = function(a1, a2, b1, b2) {
  var intersection = new Vec2D(0, 0);
  var b = new Vec2D(a2.x - a1.x, a2.y - a1.y);
  var d = new Vec2D(b2.x - b1.x, b2.y - b1.y);
  var bDotDPerp = b.x * d.y - b.y * d.x;
  // if b dot d == 0, it means the lines are parallel so have infinite intersection points
  if (bDotDPerp == 0) {
    return false;
  }
  var c = new Vec2D(b1.x - a1.x, b1.y - a1.y);
  var t = (c.x * d.y - c.y * d.x) / bDotDPerp;
  if (t < 0 || t > 1) {
    return false;
  }
  var u = (c.x * b.y - c.y * b.x) / bDotDPerp;
  if (u < 0 || u > 1) {
    return false;
  }
  intersection = new Vec2D(a1.x + t * b.x, a1.y + t * b.y);
  return true;
}

window.interpolatedHitHurtCollision = function(i, p, j, phantom) {
  // a1 is line1 start, a2 is line1 end, b1 is line2 start, b2 is line2 end
  phantom = phantom || false;
  var hurt = player[i].phys.hurtbox;
  if (phantom) {
    var hb = player[p].phys.interPolatedHitbox[j];
  } else {
    var hb = player[p].phys.interPolatedHitboxPhantom[j];
  }

  if (segmentSegmentCollision(new Vec2D(hurt.min.x, hurt.min.y), new Vec2D(hurt.max.x, hurt.min.y), hb[0], hb[1]) ||
    segmentSegmentCollision(new Vec2D(hurt.min.x, hurt.min.y), new Vec2D(hurt.max.x, hurt.min.y), hb[2], hb[3])) {
    return true;
  } else if (segmentSegmentCollision(new Vec2D(hurt.min.x, hurt.min.y), new Vec2D(hurt.min.x, hurt.max.y), hb[0], hb[
      1]) || segmentSegmentCollision(new Vec2D(hurt.min.x, hurt.min.y), new Vec2D(hurt.min.x, hurt.max.y), hb[2], hb[
      3])) {
    return true;
  } else if (segmentSegmentCollision(new Vec2D(hurt.min.x, hurt.max.y), new Vec2D(hurt.max.x, hurt.max.y), hb[0], hb[
      1]) || segmentSegmentCollision(new Vec2D(hurt.min.x, hurt.max.y), new Vec2D(hurt.max.x, hurt.max.y), hb[2], hb[
      3])) {
    return true;
  } else if (segmentSegmentCollision(new Vec2D(hurt.max.x, hurt.max.y), new Vec2D(hurt.max.x, hurt.min.y), hb[0], hb[
      1]) || segmentSegmentCollision(new Vec2D(hurt.max.x, hurt.max.y), new Vec2D(hurt.max.x, hurt.min.y), hb[2], hb[
      3])) {
    return true;
  } else {
    return false;
  }
}

window.hitHurtCollision = function(i, p, j, previous, phantom) {
  phantom = phantom || false;
  var offset = player[p].hitboxes.id[j].offset[player[p].hitboxes.frame];
  if (player[p].actionState == "DAMAGEFLYN") {
    offset = player[p].hitboxes.id[j].offset[0];
  }
  if (previous) {
    var hbpos = new Vec2D(player[p].phys.posPrev.x + (player[p].phys.prevFrameHitboxes.id[j].offset[player[p].phys.prevFrameHitboxes
      .frame].x * player[p].phys.facePrev), player[p].phys.posPrev.y + player[p].phys.prevFrameHitboxes.id[j].offset[
      player[p].phys.prevFrameHitboxes.frame].y);
  } else {
    var hbpos = new Vec2D(player[p].phys.pos.x + (offset.x * player[p].phys.face), player[p].phys.pos.y + offset.y);
  }
  var hurtCenter = new Vec2D((player[i].phys.hurtbox.min.x + player[i].phys.hurtbox.max.x) / 2, (player[i].phys.hurtbox
    .min.y + player[i].phys.hurtbox.max.y) / 2);

  var distance = new Vec2D(Math.abs(hbpos.x - hurtCenter.x), Math.abs(hbpos.y - hurtCenter.y));

  var hurtWidth = 8;
  var hurtHeight = 18;

  if (distance.x > (hurtWidth / 2 + player[p].hitboxes.id[j].size - (phantom ? gameSettings.phantomThreshold : 0))) {
    return false; }
  if (distance.y > (hurtHeight / 2 + player[p].hitboxes.id[j].size - (phantom ? gameSettings.phantomThreshold : 0))) {
    return false; }

  if (distance.x <= (hurtWidth / 2)) {
    return true; }
  if (distance.y <= (hurtHeight / 2)) {
    return true; }

  var cornerDistance_sq = Math.pow(distance.x - hurtWidth / 2, 2) +
    Math.pow(distance.y - hurtHeight / 2, 2);

  return (cornerDistance_sq <= (Math.pow(player[p].hitboxes.id[j].size - (phantom ? gameSettings.phantomThreshold : 0),
    2)));
}

window.executeHits = function() {
  var grabQueue = [];
  var ignoreGrabs = [false, false, false, false];
  for (var i = 0; i < hitQueue.length; i++) {
    var v = hitQueue[i][0];
    var a = hitQueue[i][1];
    var h = hitQueue[i][2];
    var shieldHit = hitQueue[i][3];
    var isThrow = hitQueue[i][4];
    var drawBounce = hitQueue[i][5];
    var phantom = hitQueue[i][6] || false;
    if (gameMode == 2) {
      if (shieldHit) {
        sounds.blunthit.play();
        player[v].hit.hitlag = Math.floor(damage * (1 / 3) + 3);
        if (player[v].phys.powerShieldActive) {
          player[v].phys.powerShielded = true;
          player[v].hit.powershield = true;
          drawVfx("impactLand", player[v].phys.pos, player[v].phys.face);
          drawVfx("powershield", player[v].phys.shieldPositionReal, player[v].phys.face);
          sounds.powershield.play();
        }
        player[v].hit.shieldstun = ((Math.floor(damage) * ((0.65 * (1 - ((player[v].phys.shieldAnalog - 0.3) / 0.7))) +
          0.3)) * 1.5) + 2;
      } else {
        player[a].rpsPoints++;
        player[v].hit.hitlag = Math.floor(damage * (1 / 3) + 3);
        player[v].hit.knockback = getKnockback(player[a].hitboxes.id[h], damage, damage, 0, player[v].charAttributes.weight,
          false, false);
        player[v].hit.hitPoint = new Vec2D(player[a].phys.pos.x + (player[a].hitboxes.id[h].offset[player[a].hitboxes
          .frame].x * player[a].phys.face), player[a].phys.pos.y + player[a].hitboxes.id[h].offset[player[a].hitboxes
          .frame].y);
        if (player[a].phys.pos.x < player[v].phys.pos.x) {
          player[v].hit.reverse = false;
          player[v].phys.face = -1;
        } else {
          player[v].hit.reverse = true;
          player[v].phys.face = 1;
        }
        aS[cS[v]].DAMAGEN2.init(v);
        screenShake(player[v].hit.knockback);
        sounds.swordreallystronghit.play();
      }
    } else {
      if (player[v].actionState == "FURAFURA") {
        sounds.furaloop.stop(player[v].furaLoopID);
      }
      if (player[a].hitboxes.id[h].type == 2) {
        if (aS[cS[v]][player[v].actionState].canBeGrabbed) {
          grabQueue.push([a, v, false]);
        }
      } else if (player[a].hitboxes.id[h].type == 5) {
        aS[cS[v]].FURASLEEPSTART.init(v);
      } else {
        ignoreGrabs[v] = true;
        var damage = player[a].hitboxes.id[h].dmg;
        if (phantom) {
          phantomQueue.push([a, v]);
          player[v].phys.phantomDamage = 0.5 * damage;
        }
        player[v].phys.grabTech = false;
        if (player[a].phys.chargeFrames > 0) {
          damage *= 1 + (player[a].phys.chargeFrames * (0.3671 / 60));
        }
        if (!phantom) {
          player[a].hit.hitlag = Math.floor(damage * (1 / 3) + 3);
        }
        // do staling
        if (shieldHit) {
          //console.log("test");
          if (!player[v].phys.powerShieldActive) {
            player[v].phys.shieldHP -= damage;
            if (player[v].phys.shieldHP < 0) {
              player[v].phys.shielding = false;
              player[v].phys.cVel.y = 2.5;
              player[v].phys.grounded = false;
              player[v].phys.shieldHP = 0;
              drawVfx("breakShield", player[v].phys.pos, player[v].phys.face);
              aS[cS[v]].SHIELDBREAKFALL.init(v);
              sounds.shieldbreak.play();
              break;
            }
          }

          player[v].hit.hitlag = Math.floor(damage * (1 / 3) + 3);

          var vPushMultiplier = 0.6;
          if (player[v].phys.powerShieldActive) {
            vPushMultiplier = 1;
            player[v].phys.powerShielded = true;
            player[v].hit.powershield = true;
            drawVfx("impactLand", player[v].phys.pos, player[v].phys.face);
            drawVfx("powershield", player[v].phys.shieldPositionReal, player[v].phys.face);
            sounds.powershield.play();
          } else {
            drawVfx("clank", new Vec2D(player[a].phys.pos.x + (player[a].hitboxes.id[h].offset[player[a].hitboxes.frame]
              .x * player[a].phys.face), player[a].phys.pos.y + player[a].hitboxes.id[h].offset[player[a].hitboxes
              .frame].y));
          }
          player[v].hit.shieldstun = ((Math.floor(damage) * ((0.65 * (1 - ((player[v].phys.shieldAnalog - 0.3) / 0.7))) +
            0.3)) * 1.5) + 2;
          var victimPush = ((Math.floor(damage) * ((0.195 * (1 - ((player[v].phys.shieldAnalog - 0.3) / 0.7))) + 0.09)) +
            0.4) * vPushMultiplier;
          if (victimPush > 2) {
            victimPush = 2;
          }
          var attackerPush = (Math.floor(damage) * ((player[v].phys.shieldAnalog - 0.3) * 0.1)) + 0.02;

          if (player[a].phys.pos.x < player[v].phys.pos.x) {
            player[v].phys.cVel.x = victimPush
            player[a].phys.cVel.x -= attackerPush
          } else {
            player[v].phys.cVel.x = -victimPush
            player[a].phys.cVel.x += attackerPush
          }

          aS[cS[v]].GUARD.init(v);

        } else {
          if (player[v].phys.hurtBoxState == 0 || isThrow) {
            if (!phantom) {
              var crouching = aS[cS[v]][player[v].actionState].crouch;
              var vCancel = false;
              if (player[v].phys.vCancelTimer > 0) {
                if (aS[cS[v]][player[v].actionState].vCancel) {
                  vCancel = true;
                  sounds.vcancel.play();
                }
              }
              var jabReset = false;
              if (aS[cS[v]][player[v].actionState].downed && damage < 7) {
                jabReset = true;
              }
              player[v].hit.knockback = getKnockback(player[a].hitboxes.id[h], damage, damage, player[v].percent,
                player[v].charAttributes.weight, crouching, vCancel);
              player[v].hit.angle = player[a].hitboxes.id[h].angle;
              if (player[v].hit.angle == 361) {
                if (player[v].hit.knockback < 32.1) {
                  player[v].hit.angle = 0;
                } else if (player[v].hit.knockback >= 32.1) {
                  player[v].hit.angle = 44;
                }
              }

              player[v].hit.hitlag = Math.floor(damage * (1 / 3) + 3);

              if (aS[cS[a]][player[a].actionState].specialOnHit) {
                aS[cS[a]][player[a].actionState].onPlayerHit(a);
              }

              if (!isThrow) {
                player[v].hit.hitPoint = new Vec2D(player[a].phys.pos.x + (player[a].hitboxes.id[h].offset[player[a].hitboxes
                  .frame].x * player[a].phys.face), player[a].phys.pos.y + player[a].hitboxes.id[h].offset[player[
                  a].hitboxes.frame].y);
                if (player[a].phys.pos.x < player[v].phys.pos.x) {
                  player[v].hit.reverse = false;
                } else {
                  player[v].hit.reverse = true;
                }
                if (!jabReset && player[v].phys.grabbedBy == -1) {
                  player[v].phys.face = player[v].hit.reverse ? 1 : -1;
                }
              } else {
                player[a].hasHit = true;
                player[a].phys.grabbing = -1;
                player[v].phys.thrownHitbox = true;
                player[v].phys.thrownHitboxOwner = a;
                player[v].phys.pos = new Vec2D(player[a].phys.pos.x + (player[a].hitboxes.id[h].offset.x * player[a].phys
                  .face), player[a].phys.pos.y + player[a].hitboxes.id[h].offset.y);
                player[v].phys.grabbedBy = -1;
                player[v].hit.hitlag = 1;
                player[a].hit.hitlag = 1;
                if (player[a].phys.face == 1) {
                  player[v].hit.reverse = false;
                } else {
                  player[v].hit.reverse = true;
                }
                if (drawBounce) {
                  sounds.bounce.play();
                  drawVfx("groundBounce", player[v].phys.pos, player[v].phys.face);
                }
              }

              player[v].percent += damage;

              // if victim is grabbing someone, put the victim's grab victim into a grab release
              if (player[v].phys.grabbing > -1) {
                player[player[v].phys.grabbing].phys.grabbedBy = -1;
                aS[cS[player[v].phys.grabbing]].CAPTURECUT.init(player[v].phys.grabbing);
              }

              if (player[v].phys.grabbedBy == -1 || (player[v].phys.grabbedBy > -1 && player[v].hit.knockback > 50)) {
                if (player[v].phys.grabbedBy > -1) {
                  player[player[v].phys.grabbedBy].phys.grabbing = -1;
                  aS[cS[player[v].phys.grabbedBy]].WAIT.init(player[v].phys.grabbedBy);
                }
                player[v].hit.hitstun = getHitstun(player[v].hit.knockback);
                //console.log(player[v].hit.reverse);
                if (jabReset) {
                  aS[cS[v]].DOWNDAMAGE.init(v);
                } else if (player[v].hit.knockback >= 80 || isThrow) {
                  aS[cS[v]].DAMAGEFLYN.init(v, !isThrow);
                } else {
                  aS[cS[v]].DAMAGEN2.init(v);
                }
              } else {
                if (player[v].actionState != "THROWNPUFFDOWN") {
                  aS[cS[v]].CAPTUREDAMAGE.init(v);
                }
              }

              if (player[v].phys.grounded && player[v].hit.angle > 180) {
                if (player[v].hit.knockback >= 80) {
                  sounds.bounce.play();
                  drawVfx("groundBounce", player[v].phys.pos, player[v].phys.face);
                  player[v].hit.angle = 360 - player[v].hit.angle;
                  player[v].hit.knockback *= 0.8;
                }
              }
              screenShake(player[v].hit.knockback);
              percentShake(player[v].hit.knockback, v);
            }
            // else if phantomed
            else {
              player[v].hit.hitlag = Math.floor(damage * (1 / 3) + 3);
              player[v].hit.knockback = 0;
              player[v].hit.hitPoint = new Vec2D(player[a].phys.pos.x + (player[a].hitboxes.id[h].offset[player[a].hitboxes
                .frame].x * player[a].phys.face), player[a].phys.pos.y + player[a].hitboxes.id[h].offset[player[a]
                .hitboxes.frame].y);
            }
            //console.log(player[v].hit.knockback);
            if (!isThrow) {
              switch (player[a].hitboxes.id[h].type) {
                case 0:
                  // normal
                  drawVfx("normalhit", player[v].hit.hitPoint, player[v].phys.face);
                  break;
                case 1:
                  // slash
                  drawVfx("hitSparks", player[v].hit.hitPoint, player[v].phys.face);
                  drawVfx("hitFlair", player[v].hit.hitPoint, player[v].phys.face);
                  drawVfx("hitCurve", player[v].hit.hitPoint, player[v].phys.face, player[v].hit.angle);
                  break;
                case 3:
                  // fire
                  player[v].burning = 20;
                  drawVfx("firehit", player[v].hit.hitPoint, player[v].phys.face);
                  break;
                case 4:
                  // electric
                  player[v].shocked = 20;
                  drawVfx("electrichit", player[v].hit.hitPoint, player[v].phys.face);
                  break;
                default:
                  break;
              }

              knockbackSounds(player[a].hitboxes.id[h].type, player[v].hit.knockback, v);

            } else {
              sounds.stronghit.play();
            }
          } else {
            sounds.blunthit.play();
            if (!isThrow) {
              drawVfx("clank", new Vec2D(player[a].phys.pos.x + (player[a].hitboxes.id[h].offset[player[a].hitboxes.frame]
                .x * player[a].phys.face), player[a].phys.pos.y + player[a].hitboxes.id[h].offset[player[a].hitboxes
                .frame].y));
            }
          }
        }
      }
    }
  }
  for (var j = 0; j < grabQueue.length; j++) {
    if (!ignoreGrabs[grabQueue[j][0]]) {
      if (!grabQueue[j][2]) {
        if (player[grabQueue[j][1]].actionState == "GRAB" && player[grabQueue[j][1]].timer > 0 && player[grabQueue[j]
            [1]].timer < 14 && player[grabQueue[j][1]].phys.face != player[grabQueue[j][0]].phys.face) {
          executeGrabTech(grabQueue[j][0], grabQueue[j][1]);
          grabQueue[j][2] = true;
          ignoreGrabs[grabQueue[j][1]] = true;
        } else {
          for (var k = 0; k < grabQueue.length; k++) {
            if (k != j) {
              if (grabQueue[j][0] == grabQueue[k][1]) {
                executeGrabTech(grabQueue[j][0], grabQueue[k][0]);
                grabQueue[j][2] = true;
                grabQueue[k][2] = true;
                break;
              }
            }
          }
        }
      }
      if (!grabQueue[j][2]) {
        var a = grabQueue[j][0];
        var v = grabQueue[j][1];
        if (player[v].phys.grabbedBy == -1 && player[a].phys.grabbing == -1 && player[v].phys.hurtBoxState == 0 && !
          player[v].phys.grabTech) {
          player[v].phys.cVel = new Vec2D(0, 0);
          player[v].phys.kVel = new Vec2D(0, 0);
          player[a].phys.cVel = new Vec2D(0, 0);
          player[a].phys.kVel = new Vec2D(0, 0);
          player[v].phys.grabbedBy = a;
          player[v].phys.shielding = false;
          player[a].phys.grabbing = v;
          turnOffHitboxes(a);
          turnOffHitboxes(v);
          aS[cS[v]].CAPTUREPULLED.init(v);
        }
      }
    }
  }
}

window.executeGrabTech = function(a, v) {
  if (player[a].phys.pos.x < player[v].phys.pos.x) {
    player[a].phys.face = 1;
    player[v].phys.face = -1;
  } else {
    player[a].phys.face = -1;
    player[v].phys.face = 1;
  }
  player[a].phys.grabTech = true;
  player[v].phys.grabTech = true;
  turnOffHitboxes(a);
  turnOffHitboxes(v);
  aS[cS[a]].CAPTURECUT.init(a);
  aS[cS[v]].CAPTURECUT.init(v);
  sounds.parry.play();
  drawVfx("shieldup", new Vec2D((player[a].phys.pos.x + player[v].phys.pos.x) / 2, player[a].phys.pos.y + 12), player[
    v].phys.face, 3);
}


window.getKnockback = function(hb, damagestaled, damageunstaled, percent, weight, crouching, vCancel) {
  if (hb.sk == 0) {
    var kb = ((0.01 * hb.kg) * ((1.4 * (((0.05 * (damageunstaled * (damagestaled + Math.floor(percent)))) + (
        damagestaled + Math.floor(percent)) * 0.1) * (2.0 - (2.0 * (weight * 0.01)) / (1.0 + (weight * 0.01))))) +
      18) + hb.bk);
  } else {
    //var kb = ((((setKnockback * 10 / 20) + 1) * 1.4 * (200/(weight + 100)) + 18) * (growth / 100)) + base;
    var kb = ((((hb.sk * 10 / 20) + 1) * 1.4 * (200 / (weight + 100)) + 18) * (hb.kg / 100)) + hb.bk;
  }
  if (kb > 2500) {
    kb = 2500;
  }
  if (crouching) {
    kb *= 0.67;
  }
  if (vCancel) {
    kb *= 0.95;
  }

  return kb;
}

window.getLaunchAngle = function(trajectory, knockback, reverse, x, y, v) {
  var deadzone = false;
  //console.log(trajectory);
  var diAngle;
  if (knockback < 80 && player[v].phys.grounded && (trajectory == 0 || trajectory == 180)) {
    deadzone = true;
  }
  if (x < 0.2875 && x > -0.2875) {
    x = 0;
  }
  if (y < 0.2875 && y > -0.2875) {
    y = 0;
  }
  if (x == 0 && y < 0) {
    diAngle = 270;
  } else if (x == 0 && y > 0) {
    diAngle = 90;
  } else if (x == 0 && y == 0) {
    deadzone = true;
  } else {
    diAngle = Math.atan(y / x) * (180 / Math.PI) * 1;
    if (x < 0) {
      diAngle += 180;
    } else if (y < 0) {
      diAngle += 360;
    }
  }
  //console.log(deadzone);

  if (trajectory == 361) {
    if (knockback < 32.1) {
      if (reverse) {
        trajectory = 180;
      } else {
        trajectory = 0;
      }
    } else if (knockback >= 32.1) {
      if (reverse) {
        trajectory = 136;
      } else {
        trajectory = 44;
      }
    } else {
      prompt("Why would this ever get called?");
      trajectory = 440 * (knockback - 32);
      if (reverse) {
        trajectory = 180 - trajectory;
        if (trajectory < 0) {
          trajectory = 360 + trajectory;
        }
      }
    }
  } else {
    if (reverse) {
      trajectory = 180 - trajectory;
      if (trajectory < 0) {
        trajectory = 360 + trajectory;
      }
    }
  }

  //console.log(trajectory);

  if (!deadzone) {
    var rAngle = trajectory - diAngle;
    if (rAngle > 180) {
      rAngle -= 360;
    }

    var pDistance = Math.sin(rAngle * angleConversion) * Math.sqrt(x * x + y * y);

    var angleOffset = pDistance * pDistance * 18;
    if (angleOffset > 18) {
      angleOffset = 18;
    }

    if (rAngle < 0 && rAngle > -180) {
      angleOffset *= -1;
    }
  } else {
    var angleOffset = 0;
  }
  var newtraj = trajectory - angleOffset;
  if (newtraj < 0.01) {
    newtraj = 0;
  }
  return newtraj;
}

window.getHorizontalVelocity = function(knockback, angle) {
  var initialVelocity = knockback * 0.03;
  var horizontalAngle = Math.cos(angle * angleConversion);
  var horizontalVelocity = initialVelocity * horizontalAngle;
  horizontalVelocity = Math.round(horizontalVelocity * 100000) / 100000;
  return horizontalVelocity;
}

window.getVerticalVelocity = function(knockback, angle, grounded, trajectory) {
  var initialVelocity = knockback * 0.03;
  var verticalAngle = Math.sin(angle * angleConversion);
  var verticalVelocity = initialVelocity * verticalAngle;
  verticalVelocity = Math.round(verticalVelocity * 100000) / 100000;
  if (knockback < 80 && grounded && (trajectory == 0 || trajectory == 180)) {
    verticalVelocity = 0;
  }
  return verticalVelocity;
}

window.getHorizontalDecay = function(angle) {
  var decay = 0.051 * Math.cos(angle * angleConversion)
  decay = Math.round(decay * 100000) / 100000;
  return decay;
}

window.getVerticalDecay = function(angle) {
  var decay = 0.051 * Math.sin(angle * angleConversion)
  decay = Math.round(decay * 100000) / 100000;
  return decay;
}

window.getHitstun = function(knockback) {
  //if (groundDownHitType == "Fly"){
  //knockback *= 1.25;
  //}
  return Math.floor(knockback * .4);
}

window.knockbackSounds = function(type, knockback, v) {
  if (type == 4) {
    sounds.firestronghit.play();
  }
  if (knockback < 50) {
    switch (type) {
      case 0:
        sounds.normalweakhit.play();
        break;
      case 1:
        sounds.swordweakhit.play();
        break;
      case 3:
        sounds.fireweakhit.play();
        break;
      default:
        break;
    }
  } else if (knockback < 100) {
    switch (type) {
      case 0:
        sounds.normalmediumhit.play();
        break;
      case 1:
        sounds.swordmediumhit.play();
        break;
      case 3:
        sounds.firemediumhit.play();
        break;
      default:
        break;
    }
  } else if (knockback < 140) {
    switch (type) {
      case 0:
        sounds.normalstronghit.play();
        break;
      case 1:
        sounds.swordstronghit.play();
        break;
      case 3:
        sounds.firestronghit.play();
        break;
      default:
        break;
    }
  } else {
    switch (type) {
      case 0:
        sounds.normalstronghit.play();
        break;
      case 1:
        sounds.swordreallystronghit.play();
        break;
      case 3:
        sounds.bathit.play();
        sounds.firestronghit.play();
        break;
      default:
        break;
    }
    sounds.cheer.play();
    if (knockback < 280) {
      sounds.stronghit.play();
      switch (cS[v]) {
        case 0:
          sounds.weakhurt.play();
          break;
        case 2:
          sounds.foxweakhurt.play();
          break;
        default:
          break;
      }
    } else {
      sounds.strongerhit.play();
      switch (cS[v]) {
        case 0:
          sounds.stronghurt.play();
          break;
        case 1:
          sounds.puffhurt.play();
          break;
        case 2:
          sounds.foxstronghurt.play();
          break;
        default:
          break;
      }
    }
  }
}

window.checkPhantoms = function() {
  for (var i = 0; i < phantomQueue.length; i++) {
    var v = phantomQueue[i][1]
    if (player[v].hit.hitlag == 0 && player[v].phys.hurtBoxState == 0) {
      player[v].percent += player[v].phys.phantomDamage;
      player[v].phys.phantomDamage = 0;
      var a = phantomQueue[i][0];
      for (var j = 0; j < player[a].hitboxes.hitList.length; j++) {
        if (player[a].hitboxes.hitList[j] == v) {
          player[a].hitboxes.hitList.splice(j, 1);
          break;
        }
      }
      phantomQueue.splice(i, 1);
    }
  }
}
