aArticles = [];
destroyArticleQueue = [];
articles = [];

function executeArticles(){
  destroyArticleQueue = [];
  for (var i=0;i<aArticles.length;i++){
    articles[aArticles[i][0]].main(i);
  }
}

function destroyArticles(){
  for (var k=0;k<destroyArticleQueue.length;k++){
    aArticles.splice(destroyArticleQueue[k]-k, 1);
  }
}

function renderArticles(){
  for (var i=0;i<aArticles.length;i++){
    articles[aArticles[i][0]].draw(i);
  }
}

articles[0] = {
  name : "LASER",
  init : function(p,y){
    var obj = {
      timer : 0,
      vel : new Vec2D(5*player[p].phys.face,0),
      pos : new Vec2D(player[p].phys.pos.x+(8*player[p].phys.face),player[p].phys.pos.y+7+y),
      posPrev : new Vec2D(player[p].phys.pos.x+(8*player[p].phys.face),player[p].phys.pos.y+7+y),
      hb : new hitboxObject(new hitbox(new Vec2D(0,0),1,3,361,0,0,0,0,0,1,1)),
      ecb : [new Vec2D(player[p].phys.pos.x+(8*player[p].phys.face),player[p].phys.pos.y+7+y-10),new Vec2D(player[p].phys.pos.x+(8*player[p].phys.face)+10,player[p].phys.pos.y+7+y),new Vec2D(player[p].phys.pos.x+(8*player[p].phys.face),player[p].phys.pos.y+7+y+10),new Vec2D(player[p].phys.pos.x+(8*player[p].phys.face)-10,player[p].phys.pos.y+7+y)]
    };
    aArticles.push([0,p,obj]);
    articles[0].main(aArticles.length-1);
  },
  main : function(i){
    aArticles[i][2].timer++;
    aArticles[i][2].pos.x += aArticles[i][2].vel.x;
    aArticles[i][2].ecb[0].x += aArticles[i][2].vel.x;
    aArticles[i][2].ecb[1].x += aArticles[i][2].vel.x;
    aArticles[i][2].ecb[2].x += aArticles[i][2].vel.x;
    aArticles[i][2].ecb[3].x += aArticles[i][2].vel.x;
    if (aArticles[i][2].timer > 4){
      aArticles[i][2].posPrev.x += aArticles[i][2].vel.x;
    }
    if (wallDetection(i) || aArticles[i][2].timer > 200){
      destroyArticleQueue.push(i);
    }
  },
  draw : function(i){
    c.save();
    c.strokeStyle = "rgb(255, 59, 59)";
    c.fillStyle = "rgb(255, 193, 193)";
    c.lineWidth = 2;
    var h = new Vec2D((aArticles[i][2].pos.x*stage.scale)+stage.offset[0],(aArticles[i][2].pos.y*-stage.scale)+stage.offset[1]);
    var t = new Vec2D((aArticles[i][2].posPrev.x*stage.scale)+stage.offset[0],(aArticles[i][2].posPrev.y*-stage.scale)+stage.offset[1]);
    var d = (h.x>t.x)?1:-1;
    c.beginPath();
    c.moveTo(h.x,h.y);
    c.lineTo(h.x-4*d,h.y+2);
    c.lineTo(t.x+4*d,t.y+2);
    c.lineTo(t.x,t.y);
    c.lineTo(t.x+4*d,t.y-2);
    c.lineTo(h.x-4*d,h.y-2);
    c.closePath();
    c.fill();
    c.stroke();
    c.restore();
  }
}

function wallDetection(i){
  for (var j=0;j<stage.wallL.length;j++){
    if (aArticles[i][2].ecb[1].y < stage.wallL[j][0].y && aArticles[i][2].ecb[1].y > stage.wallL[j][1].y && aArticles[i][2].ecb[1].x >= stage.wallL[j][1].x && aArticles[i][2].ecb[1].x < stage.wallL[j][1].x + 6){
      return true;
    }
  }
  for (var j=0;j<stage.wallR.length;j++){
    if (aArticles[i][2].ecb[3].y < stage.wallR[j][0].y && aArticles[i][2].ecb[3].y > stage.wallR[j][1].y && aArticles[i][2].ecb[3].x <= stage.wallR[j][1].x && aArticles[i][2].ecb[3].x > stage.wallR[j][1].x - 6){
      return true;
    }
  }
  return false;
}
