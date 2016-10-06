angB = 0;
angles = [0,Math.PI];
angR = 0;
mlVel = 0;
mlPos = 0;
mlDir = 1;

circlePos = [[200,0,0.4,1,200],[600,240,0.21,1,250],[10,600,0.7,-1,150],[350,500,0.65,-1,270],[1000,50,0.9,1,200],[900,400,0.1,-1,260]];
var p = 1;
lightDust = [];
for (var k=0;k<20;k++){
  lightDust[k] = [Math.random()*3+2,330+(k*26+26*Math.random()),520,0.2];
}
function drawStartScreen(){
  c.fillStyle = "rgba(46, 8, 154, 1)";
  var grd=c.createRadialGradient(600,375,5,600,375,750);
  grd.addColorStop(0,"#27005b");
  grd.addColorStop(0.25,"#2b0170");
  grd.addColorStop(0.5,"#2b005b");
  grd.addColorStop(0.75,"#35005b");
  grd.addColorStop(1,"#38005b");
  c.fillStyle = grd;
  c.fillRect(0,0,canvas.width,canvas.height);
  c.save();
  c.scale(1.5,1);
  c.shadowBlur=60;
  c.shadowColor="rgba(147, 14, 42, 1)";
  c.shadowOffsetX = -3150;
  c.fillStyle = "rgba(147, 14, 42, 0.5)";
  c.translate(2440,380);
  var ang = 0;
  for (var i=0;i<10;i++){
    c.beginPath();
    c.arc(0,0,720,ang,ang+Math.PI/20);
    c.lineTo(0,0);
    c.closePath();
    c.fill();
    ang += Math.PI/5;
  }
  c.restore();
  c.save();
  c.lineWidth = 60;
  c.strokeStyle = "rgba(92, 18, 18, 0.2)";
  for (var j=0;j<6;j++){
    circlePos[j][0] += circlePos[j][2] * circlePos[j][3];
    circlePos[j][1] += circlePos[j][2] * circlePos[j][3];
    if (circlePos[j][0] > 1300 || circlePos[j][1] > 850){
      circlePos[j][0] -= 1;
      circlePos[j][1] -= 1;
      circlePos[j][3] *= -1;
    }
    if (circlePos[j][0] < -100 || circlePos[j][1] < -100){
      circlePos[j][0] += 1;
      circlePos[j][1] += 1;
      circlePos[j][3] *= -1;
    }
    c.beginPath();
    c.arc(Math.round(circlePos[j][0]),Math.round(circlePos[j][1]),circlePos[j][4],0,twoPi);
    c.closePath();
    c.stroke();
  }
  c.restore();
  c.save();
  c.fillStyle = "#333236";
  c.translate(600,375);
  angB+=0.001;
  var ang = angB;
  for (var i=0;i<30;i++){
    c.beginPath();
    c.arc(0,0,720,ang,ang+Math.PI/30);
    c.lineTo(0,0);
    c.closePath();
    c.fill();
    ang += Math.PI/15;
  }
  c.restore();
  var grd=c.createRadialGradient(600,375,5,600,375,300);
  grd.addColorStop(0,"rgb(51, 51, 51)");
  grd.addColorStop(1,"rgba(51, 51, 51, 0)");
  c.fillStyle = grd;
  c.fillRect(0,0,canvas.width,canvas.height);
  c.save();
  c.lineWidth = 3;
  c.strokeStyle = "rgba(149, 255, 131, 0.12)";
  c.scale(1.3,1.1);
  var rad = 20;
  for (var n=0;n<15;n++){
    c.beginPath();
    c.arc(515,530+n*10,rad,0,twoPi);
    c.closePath();
    c.stroke();
    rad += 30+n*5;
  }
  c.restore();
  c.save();
  c.lineWidth = 3;
  c.strokeStyle = "rgba(149, 255, 131, 0.12)";
  c.translate(670,580);
//  angles[0] += 0.001;
  //angles[1] -= 0.001;
  angR+=0.001;
  c.rotate(angR)
  var angs = [angles[0],angles[1]];
  for (var m=0;m<25;m++){
    c.beginPath();
    c.moveTo(0,0);
    c.bezierCurveTo(6000*Math.cos(angs[0]),6000*Math.sin(angs[0]),6000*Math.cos(angs[1]),6000*Math.sin(angs[1]),0,0);
    c.closePath();
    c.stroke();
    angs[0] += Math.PI/16;
    angs[1] -= Math.PI/16;
  }
  c.restore();
  c.save();
  c.strokeStyle = "rgba(0, 0, 0, 0.3)";
  c.strokeStyle = "rgba(255, 255, 255, 0.6)";
  c.lineWidth = 5;
  c.globalCompositeOperation="xor";
  var bgGrad =c.createLinearGradient(0,0,0,390);
  bgGrad.addColorStop(0,"rgba(0, 0, 0, 1)");
  bgGrad.addColorStop(1,"rgba(255, 255, 255, 0.5)");
  c.fillStyle=bgGrad;
  c.textAlign = "center";
  c.font="900 250px Arial";
  c.strokeText("Melee",600,350);
  c.fillText("Melee",600,350);
  c.globalCompositeOperation="lighter";
  var bgGrad =c.createLinearGradient(0,440+mlPos,0,500+mlPos);
  bgGrad.addColorStop(0,"rgba(255, 255, 255,0.45)");
  bgGrad.addColorStop(1,"rgba(255, 255, 255,0.2)");
  c.fillStyle = bgGrad;
  c.shadowBlur = 30;
  c.shadowColor="rgba(255, 255, 255, 0.7)";
  c.font="900 150px Arial";
  c.fillText("LIGHT",600,500+mlPos);
  mlVel += 0.05*mlDir;
  mlPos += mlVel;
  if (Math.abs(mlVel) > 0.8){
    mlDir *= -1;
    if (mlDir == -1){
      for (var k=0;k<10;k++){

      }
    }
  }
  c.restore();
  for (var k=0;k<20;k++){
    if (lightDust[k][2] < 410){
      lightDust[k] = [Math.random()*3+2,330+(k*26+26*Math.random()),520,0.2];
    }
    lightDust[k][2] -= lightDust[k][0];
    lightDust[k][3] = Math.max(0,lightDust[k][3]-0.01);
    c.fillStyle = "rgba(155,155,255,"+lightDust[k][3]+")"
    c.beginPath();
    c.arc(lightDust[k][1],lightDust[k][2],10,0,twoPi);
    c.closePath();
    c.fill();
  }
  c.save();
  c.fillStyle = "#989898";
  c.beginPath();
  c.arc(600,580,30,0,twoPi);
  c.closePath();
  c.fill();
  c.fillStyle = "#6c6b6b";
  c.beginPath();
  c.arc(600,580,15,0,twoPi);
  c.closePath();
  c.fill();
  c.lineWidth = 7;
  c.font="900 40px monospace";
  c.textAlign = "center";
  c.fillStyle = "#f0c900";
  c.strokeStyle = "black";
  c.strokeText("PRESS START",600,600);
  c.fillText("PRESS START",600,600);
  c.fillStyle = "rgba(0,0,0,0.6)";
  c.beginPath();
  c.arc(600,-2900,3000,Math.PI*0.05,Math.PI*0.95);
  c.closePath();
  c.fill();
  c.beginPath();
  c.arc(600,3650,3000,Math.PI*1.05,Math.PI*1.95);
  c.closePath();
  c.fill();
  c.restore();


  /*
  c.save();
  c.lineWidth = 3;
  c.strokeStyle = "rgba(255, 255, 255, 0.26)";
  var s = 3;
  var olds = 1;
  for (var m=0;m<13;m++){

    olds = s;
    if (m > 5){
      s -= 0.145;
    }
    else {
      s -= 0.3;
    }
    c.scale(s,1);
    c.lineWidth = 3*(1/s)*1.2;
    c.beginPath();
    c.arc(670*(1/s),0,600,0,twoPi);
    c.closePath();
    c.stroke();
    c.scale(1/s,1);
  }
  c.restore();
  c.save();
  c.lineWidth = 3;
  c.strokeStyle = "rgba(255, 255, 255, 0.26)";
  var s = 0.5;
  var olds = 1;
  for (var m=0;m<13;m++){

    olds = s;
    s *= (14-m)*0.145;
    c.scale(s,1);
    c.lineWidth = 3*(1/s)*1.2;
    c.beginPath();
    c.arc(670*(1/s),1200,600,0,twoPi);
    c.closePath();
    c.stroke();
    c.scale(1/s,1);
  }
  c.restore();
  c.lineWidth = 3;
  c.strokeStyle = "rgba(255, 255, 255, 0.26)";
  c.beginPath();
  c.moveTo(670,0);
  c.lineTo(670,800);
  c.closePath();
  c.stroke();*/
}
