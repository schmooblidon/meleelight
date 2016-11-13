startUpTimer = 0;
var hohlogo = new Image();
hohlogo .src = "assets/hohlogo.png";
function drawStartUp(){
  startUpTimer++;
  ui.fillStyle = "rgb(16,16,16)";
  ui.fillRect(0,0,layers.UI.width,layers.UI.height);
  ui.font = "900 25px Arial";
  ui.textAlign = "center";
  if (startUpTimer == 200){
    $("#logoVid").remove();
  }
  else if (startUpTimer > 200){
    ui.fillStyle = "white";
    ui.fillText("WITH MUSIC FROM",600,290);
    ui.drawImage(hohlogo,375,305);
    if (startUpTimer > 350){
      ui.fillStyle = "rgba(16,16,16,"+Math.min(1,(startUpTimer-350)/20)+")";
    }
    else {
      ui.fillStyle = "rgba(16,16,16,"+Math.max(0,1-(startUpTimer-200)/20)+")";
    }
    ui.fillRect(0,0,layers.UI.width,layers.UI.height);
  }
  if (startUpTimer == 370){
    changeGamemode(0);
  }
}
