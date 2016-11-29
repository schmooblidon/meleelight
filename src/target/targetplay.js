/* eslint-disable */

window.targetTesting = false;
window.targetPlayer = 0;
window.targetStagePlaying = 0;
window.targetDestroyed = [false,false,false,false,false,false,false,false,false,false];
window.targetsDestroyed = 0;
window.endTargetGame = false;

window.targetRecords = [[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]];
window.devRecords = [[14.22,10.42,14.38,12.20,12.68,9.15,11.00,11.63,18.40,11.35],[15.80,13.93,22.45,14.85,14.40,10.22,14.68,14.55,22.70,12.80],[10.65,9.98,12.10,7.37,7.25,9.47,9.50,8.33,14.18,8.83]];

window.medalTimes = [[
  [30,21,17],
  [29,20,15],
  [35,24,19],
  [32,21,15],
  [35,23,15],
  [30,20,13],
  [33,21,14],
  [35,23,15],
  [38,27,21],
  [30,20,14]],
  [[32,22,17],
  [32,24,18],
  [40,32,26],
  [33,24,18],
  [33,25,17],
  [30,20,13],
  [33,25,17],
  [33,24,18],
  [39,30,24],
  [29,20,15]],
  [[25,18,13],
  [27,19,13],
  [30,21,14],
  [29,21,11],
  [27,18,10],
  [30,20,12],
  [31,21,13],
  [30,20,11],
  [30,22,16],
  [28,19,11]]
];

window.medalsEarned = [[
  [false,false,false],
  [false,false,false],
  [false,false,false],
  [false,false,false],
  [false,false,false],
  [false,false,false],
  [false,false,false],
  [false,false,false],
  [false,false,false],
  [false,false,false]],
  [[false,false,false],
  [false,false,false],
  [false,false,false],
  [false,false,false],
  [false,false,false],
  [false,false,false],
  [false,false,false],
  [false,false,false],
  [false,false,false],
  [false,false,false]],
  [[false,false,false],
  [false,false,false],
  [false,false,false],
  [false,false,false],
  [false,false,false],
  [false,false,false],
  [false,false,false],
  [false,false,false],
  [false,false,false],
  [false,false,false]]
];

window.getTargetCookies = function(){
  for (var i=0;i<3;i++){
    for (var j=0;j<20;j++){
      var r = getCookie(i+"target"+j);
      if (r != null && r != undefined && r != "null"){
        targetRecords[i][j] = Number(r);
      }
    }
  }
}

window.giveMedals = function(){
  for (var i=0;i<3;i++){
    for (var j=0;j<10;j++){
      for (var k=0;k<3;k++){
        if (targetRecords[i][j] != -1 && targetRecords[i][j] <= medalTimes[i][j][k]){
          medalsEarned[i][j][k] = true;
        }
      }
    }
  }
}

window.startTargetGame = function(p,test){
  endTargetGame = false;
  if (test){
    stage = stageTemp;
  }
  targetTesting = test;
  backgroundType = Math.round(Math.random());
  changeGamemode(5);
  targetDestroyed = [false,false,false,false,false,false,false,false,false,false];
  targetsDestroyed = 0;
  vfxQueue = [];
  aArticles = [];
  initializePlayers(p,true);
  renderPlayer(p);

  player[p].phys.pos = new Vec2D(stage.startingPoint.x,stage.startingPoint.y);
  matchTimer = 0;
  startTimer = 1.5;
  starting = true;
  drawVfx("start",new Vec2D(0,0));
  findingPlayers = false;
  playing = true;

  player[p].inCSS = false;
  player[p].stocks = 1;
}

window.destroyTarget = function(i){
  targetDestroyed[i] = true;
  targetsDestroyed++;
  drawVfx("targetDestroy",stage.target[i]);
  sounds.targetBreak.play();
  if (targetsDestroyed == stage.target.length){
    endTargetGame = true;
  }
}

window.targetHitDetection = function(p){
  for (var i=0;i<stage.target.length;i++){
    if (!targetDestroyed[i]){
      for (var j=0;j<4;j++){
        if (player[p].hitboxes.active[j]){
          if (hitTargetCollision(p,j,i,false) || (player[p].hitboxes.active[j] && player[p].phys.prevFrameHitboxes.active[j] && (hitTargetCollision(p,j,i,true) || interpolatedHitCircleCollision(new Vec2D(stage.target[i].x,stage.target[i].y),7,p,j)))){
            player[p].hasHit = true;
            destroyTarget(i);
            break;
          }
        }
      }
      for (var a=0;a<aArticles.length;a++){
        var articleDestroyed = false;
        if (aArticles[a][2].timer > 1){
          var interpolate = true;
        }
        else {
          var interpolate = false;
        }
        if (articleTargetCollision(a,i,false) || (interpolate && (articleTargetCollision(a,i,true) || interpolatedArticleCircleCollision(a,new Vec2D(stage.target[i].x,stage.target[i].y),7)))){
          if (articles[aArticles[a][0]].canTurboCancel){
            player[aArticles[a][1]].hasHit = true;
          }
          destroyTarget(i);
          destroyArticleQueue.push(a);
          break;
        }
      }
    }
  }
}

window.hitTargetCollision = function(p,j,t,previous){
  if (previous){
    var hbpos = new Vec2D(player[p].phys.posPrev.x+(player[p].phys.prevFrameHitboxes.id[j].offset[player[p].phys.prevFrameHitboxes.frame].x*player[p].phys.facePrev),player[p].phys.posPrev.y+player[p].phys.prevFrameHitboxes.id[j].offset[player[p].phys.prevFrameHitboxes.frame].y);
  }
  else {
    var hbpos = new Vec2D(player[p].phys.pos.x+(player[p].hitboxes.id[j].offset[player[p].hitboxes.frame].x*player[p].phys.face),player[p].phys.pos.y+player[p].hitboxes.id[j].offset[player[p].hitboxes.frame].y);
  }
  var targetPos = new Vec2D(stage.target[t].x,stage.target[t].y);

  return (Math.pow(targetPos.x-hbpos.x,2) + Math.pow(hbpos.y-targetPos.y,2) <= Math.pow(player[p].hitboxes.id[j].size+7,2));
}

window.articleTargetCollision = function(a,t,previous){
  if (previous){
    var hbpos = aArticles[a][2].posPrev;
  }
  else {
    var hbpos = aArticles[a][2].pos;
  }
  var targetpos = new Vec2D(stage.target[t].x,stage.target[t].y);

  return (Math.pow(targetpos.x-hbpos.x,2) + Math.pow(hbpos.y-targetpos.y,2) <= Math.pow(aArticles[a][2].hb.size+7,2));
}

window.targetTimerTick = function(){
  if (matchTimer + 0.016667 < 6000) {
    matchTimer += 0.016667;
  }
  $("#matchMinutes").empty().append(Math.floor(matchTimer/60));
  var sec = (matchTimer % 60).toFixed(2);
  $("#matchSeconds").empty().append(((sec.length<5)?"0"+sec:sec));
}
