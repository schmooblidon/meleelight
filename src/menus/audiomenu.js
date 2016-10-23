// sounds, music
masterVolume = [0.5,0.3];
audioMenuNames = ["Sounds","Music"];
audioMenuSelected = 0;
function audioMenuControls(i){
  var menuMove = false;
  var audioLevelMoveUp = false;
  var audioLevelMoveDown = false;
  if (player[i].inputs.b[0] && !player[i].inputs.b[1]){
    sounds.menuBack.play();
    player[i].inputs.b[1] = true;
    gameMode = 1;
  }
  else if (player[i].inputs.lStickAxis[0].y > 0.7){
    stickHoldEach[i] = true;
    if (stickHold == 0){
      audioMenuSelected--;
      menuMove = true;
      stickHold++;
    }
    else {
      stickHold++;
      if (stickHold % 10 == 0){
        audioMenuSelected--;
        menuMove = true;
      }
    }
  }
  else if (player[i].inputs.lStickAxis[0].y < -0.7){
    stickHoldEach[i] = true;
    if (stickHold == 0){
      audioMenuSelected++;
      menuMove = true;
      stickHold++;
    }
    else {
      stickHold++;
      if (stickHold % 10 == 0){
        audioMenuSelected++;
        menuMove = true;
      }
    }
  }
  else if (player[i].inputs.lStickAxis[0].x > 0.7){
    stickHoldEach[i] = true;
    if (stickHold == 0){
      audioLevelMoveUp = true;
      stickHold++;
    }
    else {
      stickHold++;
      if (stickHold % 10 == 0){
        audioLevelMoveUp = true;
      }
    }
  }
  else if (player[i].inputs.lStickAxis[0].x < -0.7){
    stickHoldEach[i] = true;
    if (stickHold == 0){
      audioLevelMoveDown = true;
      stickHold++;
    }
    else {
      stickHold++;
      if (stickHold % 10 == 0){
        audioLevelMoveDown = true;
      }
    }
  }
  else {
    stickHoldEach[i] = false;
    if (i == ports-1){
      var stickHoldAll = false;
      for (var j=0;j<ports;j++){
        if (stickHoldEach[j]){
          stickHoldAll = true;
          break;
        }
      }
      if (!stickHoldAll){
        stickHold = 0;
      }
    }
  }
  if (menuMove){
    sounds.menuSelect.play();
    if (audioMenuSelected == -1){
      audioMenuSelected = 1;
    }
    else if (audioMenuSelected == 2){
      audioMenuSelected = 0;
    }
  }
  else if (audioLevelMoveUp){
    sounds.menuSelect.play();
    masterVolume[audioMenuSelected] += 0.1;
    if (masterVolume[audioMenuSelected] > 1){
      masterVolume[audioMenuSelected] = 1;
    }
  }
  else if (audioLevelMoveDown){
    sounds.menuSelect.play();
    masterVolume[audioMenuSelected] -= 0.1;
    if (masterVolume[audioMenuSelected] < 0){
      masterVolume[audioMenuSelected] = 0;
    }
  }
  if (audioLevelMoveDown || audioLevelMoveUp){
    if (audioMenuSelected == 0){
      changeVolume(sounds,masterVolume[0],0);
    }
    else {
      changeVolume(music,masterVolume[1],1);
    }
  }
}

function drawAudioMenu(){
  clearScreen();
  var bgGrad =bg1.createLinearGradient(0,0,1200,750);
  bgGrad.addColorStop(0,"rgb(11, 65, 39)");
  bgGrad.addColorStop(1,"rgb(8, 20, 61)");
  bg1.fillStyle=bgGrad;
  bg1.fillRect(0,0,canvasBG1.width,canvasBG1.height);
  bg2.lineWidth = 3;
  shine += 0.01;
  if (shine > 1.8){
    shine = -0.8;
  }
  var opacity = (shine < 0)?(0.05+(0.25/0.8)*(0.8+shine)):((shine > 1)?(0.3-(0.25/0.8)*(shine-1)):0.3);
  var bgGrad =bg2.createLinearGradient(0,0,1200,750);
  bgGrad.addColorStop(0,"rgba(255, 255, 255,0.05)");
  bgGrad.addColorStop(Math.min(Math.max(0,shine),1),"rgba(255,255,255,"+opacity+")");
  bgGrad.addColorStop(1,"rgba(255, 255, 255,0.05)");
  //ui.strokeStyle = "rgba(255,255,255,0.13)";
  bg2.strokeStyle = bgGrad;
  bg2.beginPath();
  for (var i=0;i<60;i++){
    bg2.moveTo(0+(i*30),0);
    bg2.lineTo(0+(i*30),750);
    bg2.moveTo(0,0+(i*30));
    bg2.lineTo(1200,0+(i*30));
  }
  bg2.stroke();
  ui.fillStyle = "rgba(0,0,0,0.5)";
  ui.lineWidth = 10;
  ui.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ui.strokeRect(95,125,1010,650);
  ui.fillRect(95,125,1010,650);
  ui.textAlign = "center";
  ui.fillStyle = "rgba(255, 255, 255, 0.5)";
  ui.font = "italic 900 80px Arial";
  ui.fillText("Audio",600,100);
  ui.font = "italic 900 50px Arial";
  ui.fillText("Sounds",225,275);
  ui.fillText("Music",225,525);
  for (var i=0;i<2;i++){
    if (i == audioMenuSelected){
      //ui.fillStyle = "rgba(255, 255, 255, 0.7)";
      ui.fillStyle = "rgba(255, 255, 255, 0.3)";
    }
    else {
      ui.fillStyle = "rgba(255, 255, 255, 0.1)";
      //ui.fillStyle = "rgba(0, 0, 0, 0.8)";
    }
    ui.beginPath();
    ui.moveTo(200,350+i*250);
    ui.lineTo(1000,200+i*250);
    ui.lineTo(1000,350+i*250);
    ui.closePath();
    ui.fill();
    if (i == 0){
      var bgGrad =ui.createLinearGradient(200,0,1200,0);
      bgGrad.addColorStop(0,"rgb(12, 75, 13)");
      bgGrad.addColorStop(1,"rgb(15, 75, 255)");
      ui.fillStyle=bgGrad;
    }
    else {
      var bgGrad =ui.createLinearGradient(200,0,1200,0);
      bgGrad.addColorStop(0,"rgb(11, 13, 65)");
      bgGrad.addColorStop(1,"rgb(255, 15, 73)");
      ui.fillStyle=bgGrad;
    }
    ui.beginPath();
    ui.moveTo(200,350+i*250);
    ui.lineTo(200+(masterVolume[i]*800),350+i*250-(masterVolume[i]*150));
    ui.lineTo(200+(masterVolume[i]*800),350+i*250);
    ui.closePath();
    ui.fill();
    if (i == audioMenuSelected){
      ui.fillStyle = "rgba(255, 255, 255, 1)";
    }
    else {
      ui.fillStyle = "rgba(136, 136, 136, 1)";
    }
    ui.beginPath();
    ui.arc(200+(masterVolume[i]*800),350+i*250-(masterVolume[i]*75),15+(masterVolume[i]*65),0,twoPi);
    ui.closePath();
    ui.fill();
  }

}
