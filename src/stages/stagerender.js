
function drawStage(){
  c.strokeStyle = "#db80cc";
  c.lineWidth = 1;
  for (var j=0;j<stage.ground.length;j++){
    c.beginPath();
    c.moveTo((stage.ground[j][0].x*stage.scale) +stage.offset[0],(stage.ground[j][0].y*-stage.scale)+stage.offset[1]);
    c.lineTo((stage.ground[j][1].x*stage.scale) +stage.offset[0],(stage.ground[j][1].y*-stage.scale)+stage.offset[1]);
    c.closePath();
    c.stroke();
  }
  c.strokeStyle = "#ed6767";
  for (var j=0;j<stage.ceiling.length;j++){
    c.beginPath();
    c.moveTo((stage.ceiling[j][0].x*stage.scale) +stage.offset[0],(stage.ceiling[j][0].y*-stage.scale)+stage.offset[1]);
    c.lineTo((stage.ceiling[j][1].x*stage.scale) +stage.offset[0],(stage.ceiling[j][1].y*-stage.scale)+stage.offset[1]);
    c.closePath();
    c.stroke();
  }
  for (var j=0;j<stage.box.length;j++){
    c.fillRect((stage.box[j].min.x*stage.scale)+stage.offset[0],(stage.box[j].max.y*-stage.scale)+stage.offset[1],(stage.box[j].max.x-stage.box[j].min.x)*stage.scale,(stage.box[j].max.y-stage.box[j].min.y)*stage.scale);
  }
  c.strokeStyle = "#4794c6";
  for (var j=0;j<stage.platform.length;j++){
      c.beginPath();
      c.moveTo((stage.platform[j][0].x*stage.scale) +stage.offset[0],(stage.platform[j][0].y*-stage.scale)+stage.offset[1]);
      c.lineTo((stage.platform[j][1].x*stage.scale) +stage.offset[0],(stage.platform[j][1].y*-stage.scale)+stage.offset[1]);
      c.closePath();
      c.stroke();
  }
  c.strokeStyle = "#47c648";
  for (var k=0;k<stage.wallL.length;k++){
      c.beginPath();
      c.moveTo((stage.wallL[k][0].x*stage.scale) +stage.offset[0],(stage.wallL[k][0].y*-stage.scale)+stage.offset[1]);
      c.lineTo((stage.wallL[k][1].x*stage.scale) +stage.offset[0],(stage.wallL[k][1].y*-stage.scale)+stage.offset[1]);
      c.closePath();
      c.stroke();
  }
  c.strokeStyle = "#9867de";
  for (var l=0;l<stage.wallR.length;l++){
      c.beginPath();
      c.moveTo((stage.wallR[l][0].x*stage.scale) +stage.offset[0],(stage.wallR[l][0].y*-stage.scale)+stage.offset[1]);
      c.lineTo((stage.wallR[l][1].x*stage.scale) +stage.offset[0],(stage.wallR[l][1].y*-stage.scale)+stage.offset[1]);
      c.closePath();
      c.stroke();
  }
  c.strokeStyle = "#e7a44c";
  //c.fillStyle = "rgba(228, 159, 70, 0.2)";
  for (var j=0;j<stage.ledge.length;j++){
    var e = stage.ledge[j];
    c.beginPath();
    if (e[1]){
      c.moveTo(stage.box[e[0]].max.x*stage.scale+stage.offset[0],(stage.box[e[0]].max.y-Math.min(10,(stage.box[e[0]].max.y-stage.box[e[0]].min.y)/2))*-stage.scale+stage.offset[1]);
      c.lineTo(stage.box[e[0]].max.x*stage.scale+stage.offset[0],stage.box[e[0]].max.y*-stage.scale+stage.offset[1]);
      c.lineTo((stage.box[e[0]].max.x-Math.min(10,(stage.box[e[0]].max.x-stage.box[e[0]].min.x)/2))*stage.scale+stage.offset[0],stage.box[e[0]].max.y*-stage.scale+stage.offset[1]);
    }
    else {
      c.moveTo(stage.box[e[0]].min.x*stage.scale+stage.offset[0],(stage.box[e[0]].max.y-Math.min(10,(stage.box[e[0]].max.y-stage.box[e[0]].min.y)/2))*-stage.scale+stage.offset[1]);
      c.lineTo(stage.box[e[0]].min.x*stage.scale+stage.offset[0],stage.box[e[0]].max.y*-stage.scale+stage.offset[1]);
      c.lineTo((stage.box[e[0]].min.x+Math.min(10,(stage.box[e[0]].max.x-stage.box[e[0]].min.x)/2))*stage.scale+stage.offset[0],stage.box[e[0]].max.y*-stage.scale+stage.offset[1]);
    }
    c.closePath();
    c.stroke();
    c.fill();
    c.fill();

  }
  if (typeof stage.target != "undefined"){
    for (var k=0;k<stage.target.length;k++){
      if (!targetDestroyed[k]){
        var x = stage.target[k].x*stage.scale+stage.offset[0];
        var y = stage.target[k].y*-stage.scale+stage.offset[1];
        for (var j=0;j<5;j++){
          c.fillStyle = (j%2)?"white":"red";
          c.beginPath();
          c.arc(x,y,(25-j*5)*(stage.scale/4.5),0,twoPi);
          c.closePath();
          c.fill();
        }
      }
    }
  }
}

var bgPos = [[-30,500,300,500,900,500,1230,450,358],[-30,400,300,400,900,400,1230,350,179]];
var direction = [[1,-1,1,-1,1,-1,1,-1,1],[-1,1,-1,1,-1,1,-1,1,-1]];
function bgStar(){
  var vSeed = Math.random();
  this.velocity = new Vec2D(5*vSeed*Math.sign(0.5-Math.random()),5*(1-vSeed)*Math.sign(0.5-Math.random()));
  this.colour = "hsl("+358*Math.random()+", 100%, 50%)";
  this.pos = new Vec2D(0,0);
  this.life = 0;
}
bgStars = [];
for (var p=0;p<20;p++){
  bgStars[p] = new bgStar();
  bgStars[p].pos = new Vec2D(600*Math.random()*Math.sign(bgStars[p].velocity.x),400*Math.random()*Math.sign(bgStars[p].velocity.y));
}
bgSparkle = 3;
function drawBackground(){
  bgSparkle--;
  var bgGrad =c.createLinearGradient(0,0,0,500);
  bgGrad.addColorStop(0,"rgb(24, 17, 66)");
  bgGrad.addColorStop(1,"black");
  c.fillStyle=bgGrad;
  c.fillRect(-100,-100,canvas.width+200,canvas.height+200);
  for (var p=0;p<20;p++){
    if (Math.abs(bgStars[p].pos.x) > 600 || Math.abs(bgStars[p].pos.y) > 400){
      bgStars[p] = new bgStar();
    }
    bgStars[p].pos.x += bgStars[p].velocity.x;
    bgStars[p].pos.y += bgStars[p].velocity.y;

    bgStars[p].life++;

    if (bgSparkle == 0){
      c.fillStyle = bgStars[p].colour;
      c.globalAlpha = Math.min(bgStars[p].life/300,1);
      c.beginPath();
      c.arc(600+bgStars[p].pos.x,375+bgStars[p].pos.y,5,twoPi,0);
      c.fill();

    }
  }
  if (bgSparkle == 0){
    bgSparkle = 2;
  }
  c.globalAlpha = 1;
  for (var k=1;k>-1;k--){
    for (var j=0;j<9;j++){
      //bgPos[j] += direction[j]*5*Math.random();
      if (j == 8){
        bgPos[k][j] += direction[k][j]*0.2*Math.random();
      }
      else {
        bgPos[k][j] += direction[k][j]*1*Math.random();
      }
      switch (j){
        case 0:
          if ((direction[k][j] == 1 && bgPos[k][j] > -10) || (direction[k][j] == -1 && bgPos[k][j] < -200)){
            direction[k][j] *= -1;
          }
          break;
        case 1:
          if ((direction[k][j] == 1 && bgPos[k][j] > 550-k*100) || (direction[k][j] == -1 && bgPos[k][j] < 450-k*100)){
            direction[k][j] *= -1;
          }
          break;
        case 2:
          if ((direction[k][j] == 1 && bgPos[k][j] > 550) || (direction[k][j] == -1 && bgPos[k][j] < 0)){
            direction[k][j] *= -1;
          }
          break;
        case 3:
          if ((direction[k][j] == 1 && bgPos[k][j] > 550-k*100) || (direction[k][j] == -1 && bgPos[k][j] < 450-k*100)){
            direction[k][j] *= -1;
          }
          break;
        case 4:
          if ((direction[k][j] == 1 && bgPos[k][j] > 1150) || (direction[k][j] == -1 && bgPos[k][j] < 600)){
            direction[k][j] *= -1;
          }
          break;
        case 5:
          if ((direction[k][j] == 1 && bgPos[k][j] > 550-k*100) || (direction[k][j] == -1 && bgPos[k][j] < 450-k*100)){
            direction[k][j] *= -1;
          }
          break;
        case 6:
          if ((direction[k][j] == 1 && bgPos[k][j] > 1400) || (direction[k][j] == -1 && bgPos[k][j] < 1210)){
            direction[k][j] *= -1;
          }
          break;
        case 7:
          if ((direction[k][j] == 1 && bgPos[k][j] > 550-k*100) || (direction[k][j] == -1 && bgPos[k][j] < 450-k*100)){
            direction[k][j] *= -1;
          }
          break;
        case 8:
          if ((direction[k][j] == 1 && bgPos[k][j] > 357) || (direction[k][j] == -1 && bgPos[k][j] < 1)){
            direction[k][j] *= -1;
          }
          break;
        default:
          break;
      }
    }
    c.fillStyle = "hsla("+bgPos[k][8]+", 100%, 50%, "+(0.15-k*0.07)+")";
    c.beginPath();
    c.moveTo(bgPos[k][0],bgPos[k][1]);
    c.bezierCurveTo(bgPos[k][2],bgPos[k][3],bgPos[k][4],bgPos[k][5],bgPos[k][6],bgPos[k][7]);
    if (k == 1){
      c.lineTo(bgPos[0][6],bgPos[0][7]);
      c.bezierCurveTo(bgPos[0][4],bgPos[0][5],bgPos[0][2],bgPos[0][3],bgPos[0][0],bgPos[0][1]);
    }
    else {
      c.lineTo(1200,750);
      c.lineTo(0,750);
    }
    c.closePath();
    c.fill();
  }
}
