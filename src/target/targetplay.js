targetTesting = false;
targetPlayer = 0;
targetStagePlaying = 0;
targetDestroyed = [false,false,false,false,false,false,false,false,false,false];
targetsDestroyed = 0;
endTargetGame = false;

targetRecords = [[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]];
worldRecords = [[14.05,10.40,14.62,12.98,12.77,9.27,10.15,11.95,18.72,11.98],[16.50,15.42,23.40,15.68,17.43,11.87,14.82,14.80,23.30,13.77],[99.99,99.99,99.99,99.99,99.99,99.99,99.99,99.99,99.99,99.99]];
worldRecordNames=[["schmoo","schmoo","Peabnut","Peabnut","schmoo","schmoo","schmoo","schmoo","iko","schmoo"],["schmoo","schmoo","schmoo","schmoo","schmoo","schmoo","schmoo","schmoo","schmoo","schmoo"],["schmoo","schmoo","schmoo","schmoo","schmoo","schmoo","schmoo","schmoo","schmoo","schmoo"]];

medalTimes = [[
  [30,21,17],
  [29,20,15],
  [35,24,19],
  [32,21,15],
  [35,23,15],
  [35,23,15],
  [35,23,15],
  [35,23,15],
  [38,27,21],
  [35,23,15]],
  [[35,25,20],
  [32,24,18],
  [45,32,26],
  [35,25,19],
  [37,26,20],
  [35,23,15],
  [36,25,17],
  [33,24,18],
  [39,31,26],
  [32,21,16]],
  [[30,21,17],
  [29,20,15],
  [35,24,19],
  [32,21,15],
  [35,23,15],
  [35,23,15],
  [35,23,15],
  [35,23,15],
  [38,27,21],
  [35,23,15]]
];

medalsEarned = [[
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

function startTargetGame(p,test){
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

function destroyTarget(i){
  targetDestroyed[i] = true;
  targetsDestroyed++;
  drawVfx("targetDestroy",stage.target[i]);
  sounds.targetBreak.play();
  if (targetsDestroyed == stage.target.length){
    endTargetGame = true;
  }
}

function targetHitDetection(p){
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

function hitTargetCollision(p,j,t,previous){
  if (previous){
    var hbpos = new Vec2D(player[p].phys.posPrev.x+(player[p].phys.prevFrameHitboxes.id[j].offset[player[p].phys.prevFrameHitboxes.frame].x*player[p].phys.facePrev),player[p].phys.posPrev.y+player[p].phys.prevFrameHitboxes.id[j].offset[player[p].phys.prevFrameHitboxes.frame].y);
  }
  else {
    var hbpos = new Vec2D(player[p].phys.pos.x+(player[p].hitboxes.id[j].offset[player[p].hitboxes.frame].x*player[p].phys.face),player[p].phys.pos.y+player[p].hitboxes.id[j].offset[player[p].hitboxes.frame].y);
  }
  var targetPos = new Vec2D(stage.target[t].x,stage.target[t].y);

  return (Math.pow(targetPos.x-hbpos.x,2) + Math.pow(hbpos.y-targetPos.y,2) <= Math.pow(player[p].hitboxes.id[j].size+7,2));
}

function articleTargetCollision(a,t,previous){
  if (previous){
    var hbpos = aArticles[a][2].posPrev;
  }
  else {
    var hbpos = aArticles[a][2].pos;
  }
  var targetpos = new Vec2D(stage.target[t].x,stage.target[t].y);

  return (Math.pow(targetpos.x-hbpos.x,2) + Math.pow(hbpos.y-targetpos.y,2) <= Math.pow(aArticles[a][2].hb.size+7,2));
}

function targetTimerTick(){
  matchTimer += 0.016667;
  $("#matchMinutes").empty().append(Math.floor(matchTimer/60));
  var sec = (matchTimer % 60).toFixed(2);
  $("#matchSeconds").empty().append(((sec.length<5)?"0"+sec:sec));
}
