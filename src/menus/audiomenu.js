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
  var bgGrad =c.createLinearGradient(0,0,1200,750);
  bgGrad.addColorStop(0,"rgb(11, 65, 39)");
  bgGrad.addColorStop(1,"rgb(8, 20, 61)");
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
  c.fillStyle = "rgba(0,0,0,0.5)";
  c.lineWidth = 10;
  c.strokeRect(95,125,1010,650);
  c.fillRect(95,125,1010,650);
  c.textAlign = "center";
  c.fillStyle = "rgba(255, 255, 255, 0.5)";
  c.font = "italic 900 80px Arial";
  c.fillText("Audio",600,100);
  c.font = "italic 900 50px Arial";
  c.fillText("Sounds",225,275);
  c.fillText("Music",225,525);
  for (var i=0;i<2;i++){
    if (i == audioMenuSelected){
      //c.fillStyle = "rgba(255, 255, 255, 0.7)";
      c.fillStyle = "rgba(255, 255, 255, 0.3)";
    }
    else {
      c.fillStyle = "rgba(255, 255, 255, 0.1)";
      //c.fillStyle = "rgba(0, 0, 0, 0.8)";
    }
    c.beginPath();
    c.moveTo(200,350+i*250);
    c.lineTo(1000,200+i*250);
    c.lineTo(1000,350+i*250);
    c.closePath();
    c.fill();
    if (i == 0){
      var bgGrad =c.createLinearGradient(200,0,1200,0);
      bgGrad.addColorStop(0,"rgb(12, 75, 13)");
      bgGrad.addColorStop(1,"rgb(15, 75, 255)");
      c.fillStyle=bgGrad;
    }
    else {
      var bgGrad =c.createLinearGradient(200,0,1200,0);
      bgGrad.addColorStop(0,"rgb(11, 13, 65)");
      bgGrad.addColorStop(1,"rgb(255, 15, 73)");
      c.fillStyle=bgGrad;
    }
    c.beginPath();
    c.moveTo(200,350+i*250);
    c.lineTo(200+(masterVolume[i]*800),350+i*250-(masterVolume[i]*150));
    c.lineTo(200+(masterVolume[i]*800),350+i*250);
    c.closePath();
    c.fill();
    if (i == audioMenuSelected){
      c.fillStyle = "rgba(255, 255, 255, 1)";
    }
    else {
      c.fillStyle = "rgba(136, 136, 136, 1)";
    }
    c.beginPath();
    c.arc(200+(masterVolume[i]*800),350+i*250-(masterVolume[i]*75),15+(masterVolume[i]*65),0,twoPi);
    c.closePath();
    c.fill();
  }

}
