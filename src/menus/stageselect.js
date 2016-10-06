stageSelected = 4;
stageSelectTimer = 0;

stagePointerPos = [600,635];

var bfIcon = new Image();
bfIcon.src = "assets/stage-icons/bf.png";
var ysIcon = new Image();
ysIcon.src = "assets/stage-icons/ys.png";
var dlIcon = new Image();
dlIcon.src = "assets/stage-icons/dl.png";
var psIcon = new Image();
psIcon.src = "assets/stage-icons/ps.png";

function sssControls(i){
  stagePointerPos[0] += player[i].inputs.lStickAxis[0].x*15;
  stagePointerPos[1] += player[i].inputs.lStickAxis[0].y*-15;
  if (stagePointerPos[1] >= 450 && stagePointerPos[1] <= 540){
    for (var j=0;j<4;j++){
      if (stagePointerPos[0] >= 225+j*200 && stagePointerPos[0] <= 375+j*200){
        if (stageSelected != j){
          sounds.menuSelect.play();
        }
        stageSelected = j;
        break;
      }
    }
  }
  else if (stagePointerPos[0] >= 525 && stagePointerPos[0] <= 675 && stagePointerPos[1] >= 590 && stagePointerPos[1] <= 680){
    if (stageSelected != 4){
      sounds.menuSelect.play();
    }
    stageSelected = 4;
  }
  if (player[i].inputs.b[0] && !player[i].inputs.b[1]){
    sounds.menuBack.play();
    gameMode = 2;
  }
  else if ((player[i].inputs.s[0] && !player[i].inputs.s[1]) || (player[i].inputs.a[0] && !player[i].inputs.a[1])){
    sounds.menuForward.play();
    if (stageSelected == 4){
      stageSelected = Math.floor(Math.random()*3.99);
    }
    stageSelect = stageSelected;
    /*switch (stageSelected){
      case 0:
        stageSelect = "bf";
        break;
      case 1:
        stageSelect = "ys";
        break;
      case 2:
        stageSelect = "ps";
        break;
      case 3:
        stageSelect = "dl";
        break;
      default:
        break;
    }*/
    startGame();
  }
}

function drawSSS(){
  var bgGrad =c.createLinearGradient(0,0,1200,750);
  bgGrad.addColorStop(0,"rgb(17, 11, 65)");
  bgGrad.addColorStop(1,"rgb(61, 8, 37)");
  c.fillStyle=bgGrad;
  c.fillRect(0,0,canvas.width,canvas.height);
  c.lineWidth = 3;
  shine += 0.01;
  if (shine > 1.8){
    shine = -0.8;
  }
  var opacity = (shine < 0)?(0.05+(0.25/0.8)*(0.8+shine)):((shine > 1)?(0.3-(0.25/0.8)*(shine-1)):0.3);
  var bgGrad =c.createLinearGradient(0,0,1200,750);
  bgGrad.addColorStop(0,"rgba(255, 255, 255,0.05)");
  bgGrad.addColorStop(Math.min(Math.max(0,shine),1),"rgba(255,255,255,"+opacity+")");
  bgGrad.addColorStop(1,"rgba(255, 255, 255,0.05)");
  //c.strokeStyle = "rgba(255,255,255,0.13)";
  c.strokeStyle = bgGrad;
  c.beginPath();
  for (var i=0;i<60;i++){
    c.moveTo(0+(i*30),0);
    c.lineTo(0+(i*30),750);
    c.moveTo(0,0+(i*30));
    c.lineTo(1200,0+(i*30));
  }
  c.stroke();
  c.lineWidth = 4;
  c.strokeStyle = "rgba(255, 255, 255, 0.57)";
  c.strokeRect(198,98,804,304);
  c.fillStyle = "black";
  c.textAlign = "center";
  c.font = "500 16px Arial";
  c.lineWidth = 3;
  stageSelectTimer++;
  for (var i=0;i<4;i++){
    if (stageSelected == i){
      if (stageSelectTimer%8 > 4){
        c.strokeStyle = "rgb(251, 116, 155)";
      }
      else {
        c.strokeStyle = "rgb(255, 182, 204)";
      }
    }
    else {
      c.strokeStyle = "rgb(166, 166, 166)";
    }
    c.fillRect(225+i*200,450,150,90);
    c.strokeRect(225+i*200,450,150,90);
  }
  c.fillRect(525,590,150,90);
  c.fillStyle = "rgb(245, 144, 61)";
  c.strokeStyle = "rgb(245, 144, 61)";
  if (stageSelected == 4){
    if (stageSelectTimer%8 > 4){
      c.fillStyle = "rgb(251, 195, 149)";
      c.strokeStyle = "rgb(251, 195, 149)";
    }
  }
  c.font = "700 25px Arial";
  c.lineWidth = 4;
  c.strokeRect(525,590,150,90);
  c.fillText("RANDOM",600,665);
  c.font = "700 32px Arial";
  c.fillText("?",600,630);
  c.beginPath();
  c.arc(600,618,18,0,twoPi);
  c.closePath();
  c.stroke();

  c.fillStyle = "white";
  c.font = "500 16px Arial";
  c.fillText("BATTLEFIELD",300,530);
  c.fillText("Y-STORY",500,530);
  c.fillText("P-STADIUM",700,530);
  c.fillText("DREAMLAND",900,530);
  c.drawImage(bfIcon,227,452,146,55);
  c.drawImage(ysIcon,427,452,146,55);
  c.drawImage(psIcon,627,452,146,55);
  c.drawImage(dlIcon,827,452,146,55);
  c.textAlign = "start";
  c.fillStyle = "rgba(255,255,255,0.6)";
  c.font = "900 48px Arial";
  switch (stageSelected){
    case 0:
      c.drawImage(bfIcon,200,100,800,300);
      c.fillText("Battlefield",220,380);
      break;
    case 1:
      c.drawImage(ysIcon,200,100,800,300);
      c.fillText("Yoshi's Story",220,380);
      break;
    case 2:
      c.drawImage(psIcon,200,100,800,300);
      c.fillText("Pokemon Stadium",220,380);
      break;
    case 3:
      c.drawImage(dlIcon,200,100,800,300);
      c.fillText("Dreamland",220,380);
      break;
    case 4:
      c.textAlign = "center";
      c.lineWidth = 9;
      c.fillStyle = "rgba(0,0,0,0.7)";
      c.fillRect(202,102,796,296);
      c.fillStyle = "rgb(255, 161, 84)";
      c.strokeStyle = "rgb(255, 161, 84)";
      c.font = "900 100px Arial";
      c.fillText("?",600,230);
      c.fillText("RANDOM",600,355);
      c.beginPath();
      c.arc(600,192,55,0,twoPi);
      c.closePath();
      c.stroke();
      break;
    default:
      break;
  }
  c.textAlign = "center";
  c.lineWidth = 8;
  c.strokeStyle = "rgba(255,255,255,0.8)";
  c.beginPath();
  c.arc(stagePointerPos[0],stagePointerPos[1],40,0,twoPi);
  c.closePath();
  c.stroke();
}
