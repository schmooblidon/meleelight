startUpTimer = 0;
function particle(){
  this.x = 600;
  this.y = 350;
  this.vx = -15+Math.random()*30;
  this.vy = -15+Math.random()*30;
  this.col = "hsla("+Math.round(358*Math.random())+", 100%, 50%, 0.1)";
  if (Math.abs(this.vx) < 5){
    this.vx = Math.sign(this.vx)*5;
  }
  if (Math.abs(this.vy) < 5){
    this.vy = Math.sign(this.vy)*5;
  }
}
particles = [];
for (var i=0;i<150;i++){
  particles.push(new particle());
}

function drawStartUp(){
  startUpTimer++;
  c.fillStyle = "rgba(0, 0, 0,0.1)";
  c.lineWidth = 3;
  c.strokeStyle = "rgba(255, 255, 255,0.1)";
  c.fillRect(0,0,canvas.width,canvas.height);
  if (startUpTimer > 30){
    if (startUpTimer > 40){
      for (var i=0;i<particles.length;i++){
        particles[i].x+=particles[i].vx;
        particles[i].y+=particles[i].vy;
        c.fillStyle = particles[i].col;
        c.beginPath();
        c.arc(particles[i].x,particles[i].y,12,0,twoPi);
        c.closePath();
        c.fill();
      }
    }
    c.fillStyle = "rgba(255,255,255,"+Math.min(1,((startUpTimer-30)/30))+")";
    c.font="900 "+Math.min(70,(startUpTimer-30)*5)+"px Arial";
    c.textAlign = "center";
    c.fillText("schmoo",canvas.width/2,canvas.height/2);
    c.font="900 "+Math.min(40,(startUpTimer-30)*3)+"px Arial";
    c.fillText("games",canvas.width/2,canvas.height/2+30);

    c.strokeStyle = "rgba(255,255,255,"+Math.max(0,((100-startUpTimer)/200))+")";
    c.font="900 "+(startUpTimer-30)*8+"px Arial";
    c.strokeText("schmoo",canvas.width/2,canvas.height/2);
    c.font="900 "+(startUpTimer-30)*5+"px Arial";
    c.strokeText("games",canvas.width/2,canvas.height/2+30);
    if (startUpTimer > 120){
      c.fillStyle = "rgba(0,0,0,"+(startUpTimer-120)/60+")";
      c.fillRect(0,0,canvas.width,canvas.height);
    }
    if (startUpTimer > 180){
      gameMode = 0;
    }
  }
}
