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
  ui.fillStyle = "rgba(0, 0, 0,0.1)";
  ui.lineWidth = 3;
  ui.strokeStyle = "rgba(255, 255, 255,0.1)";
  ui.fillRect(0,0,layers.UI.width,layers.UI.height);
  if (startUpTimer > 30){
    if (startUpTimer > 40){
      for (var i=0;i<particles.length;i++){
        particles[i].x+=particles[i].vx;
        particles[i].y+=particles[i].vy;
        ui.fillStyle = particles[i].col;
        ui.beginPath();
        ui.arc(particles[i].x,particles[i].y,12,0,twoPi);
        ui.closePath();
        ui.fill();
      }
    }
    ui.fillStyle = "rgba(255,255,255,"+Math.min(1,((startUpTimer-30)/30))+")";
    ui.font="900 "+Math.min(70,(startUpTimer-30)*5)+"px Arial";
    ui.textAlign = "center";
    ui.fillText("schmoo",layers.UI.width/2,layers.UI.height/2);
    ui.font="900 "+Math.min(40,(startUpTimer-30)*3)+"px Arial";
    ui.fillText("games",layers.UI.width/2,layers.UI.height/2+30);

    ui.strokeStyle = "rgba(255,255,255,"+Math.max(0,((100-startUpTimer)/200))+")";
    ui.font="900 "+(startUpTimer-30)*8+"px Arial";
    ui.strokeText("schmoo",layers.UI.width/2,layers.UI.height/2);
    ui.font="900 "+(startUpTimer-30)*5+"px Arial";
    ui.strokeText("games",layers.UI.width/2,layers.UI.height/2+30);
    if (startUpTimer > 120){
      ui.fillStyle = "rgba(0,0,0,"+(startUpTimer-120)/60+")";
      ui.fillRect(0,0,layers.UI.width,layers.UI.height);
    }
    if (startUpTimer > 180){
      changeGamemode(0);
    }
  }
}
