var marthPic = new Image();
marthPic.src = "assets/css/marth.png";
var puffPic = new Image();
puffPic.src = "assets/css/puff.png";
var foxPic = new Image();
foxPic.src = "assets/css/fox.png";
var handPoint = new Image();
handPoint.src = "assets/hand/handpoint.png";
var handOpen = new Image();
handOpen.src = "assets/hand/handopen.png";
var handGrab = new Image();
handGrab.src = "assets/hand/handgrab.png";

choosingTag = -1;
handType = [0,0,0,0];
handPos = [new Vec2D(140,700),new Vec2D(365,700),new Vec2D(590,700),new Vec2D(815,700)];
tokenPos = [new Vec2D(475,268),new Vec2D(515,268),new Vec2D(475,308),new Vec2D(515,308)];
chosenChar = [0,0,0,0];
tokenGrabbed = [false,false,false,false];
whichTokenGrabbed = [-1,-1,-1,-1];
occupiedToken = [false,false,false,false];
bHold = [0,0,0,0];

readyToFight = false;

rtfFlash = 25;
rtfFlashD = 1;

function changeCharacter(i,c){
  cS[i] = c;
  player[i].actionState = "WAIT";
  player[i].timer = 0;
  player[i].charAttributes = chars[cS[i]].attributes;
  player[i].charHitboxes = chars[cS[i]].hitboxes;
}

function cssControls(i){
  if (choosingTag == -1){
    if (player[i].inputs.b[0]){
      bHold[i]++;
      if (bHold[i] == 60){
        sounds.menuBack.play();
        gameMode = 1;
      }
    }
    else {
      bHold[i] = 0;
    }
    handPos[i].x += player[i].inputs.lStickAxis[0].x*12;
    handPos[i].y += -player[i].inputs.lStickAxis[0].y*12;
    if (handPos[i].x > 1200){
      handPos[i].x = 1200;
    }
    else if (handPos[i].x < 0){
      handPos[i].x = 0;
    }
    if (handPos[i].y > 750){
      handPos[i].y = 750;
    }
    else if (handPos[i].y < 0){
      handPos[i].y = 0;
    }
    if (handPos[i].y < 400 && handPos[i].y > 160){
      handType[i] = 1;
      if (player[i].inputs.b[0] && !player[i].inputs.b[1] && playerType[i] == 0 && whichTokenGrabbed[i] == -1){
        handType[i] = 2;
        tokenPos[i] = new Vec2D(handPos[i].x,handPos[i].y);
        tokenGrabbed[i] = true;
        whichTokenGrabbed[i] = i;
        occupiedToken[i] = true;
      }
      if (tokenGrabbed[whichTokenGrabbed[i]]){
        handType[i] = 2;
        tokenPos[whichTokenGrabbed[i]] = new Vec2D(handPos[i].x,handPos[i].y);
        if (handPos[i].y > 240 && handPos[i].y < 335){
          // - 43
            if (handPos[i].x > 452 && handPos[i].x < 547){
              if (chosenChar[whichTokenGrabbed[i]] != 0){
                chosenChar[whichTokenGrabbed[i]] = 0;
                changeCharacter(whichTokenGrabbed[i],0);
                sounds.menuSelect.play();
              }
              if (player[i].inputs.a[0] && !player[i].inputs.a[1]){
                tokenGrabbed[whichTokenGrabbed[i]] = false;
                occupiedToken[whichTokenGrabbed[i]] = false;
                tokenPos[whichTokenGrabbed[i]] = new Vec2D(473+(whichTokenGrabbed[i]%2)*40,268+(whichTokenGrabbed[i]>1?40:0));
                whichTokenGrabbed[i] = -1;
                sounds.marth.play();
              }
            }
            else if (handPos[i].x > 547 && handPos[i].x < 642){
              if (chosenChar[whichTokenGrabbed[i]] != 1){
                chosenChar[whichTokenGrabbed[i]] = 1;
                changeCharacter(whichTokenGrabbed[i],1);
                sounds.menuSelect.play();
              }
              if (player[i].inputs.a[0] && !player[i].inputs.a[1]){

                tokenGrabbed[whichTokenGrabbed[i]] = false;
                occupiedToken[whichTokenGrabbed[i]] = false;
                tokenPos[whichTokenGrabbed[i]] = new Vec2D(568+(whichTokenGrabbed[i]%2)*40,268+(whichTokenGrabbed[i]>1?40:0));
                whichTokenGrabbed[i] = -1;
                sounds.jigglypuff.play();
              }
            }
            else if (handPos[i].x > 642 && handPos[i].x < 737){
              if (chosenChar[whichTokenGrabbed[i]] != 2){
                chosenChar[whichTokenGrabbed[i]] = 2;
                changeCharacter(whichTokenGrabbed[i],2);
                sounds.menuSelect.play();
              }
              if (player[i].inputs.a[0] && !player[i].inputs.a[1]){

                tokenGrabbed[whichTokenGrabbed[i]] = false;
                occupiedToken[whichTokenGrabbed[i]] = false;
                tokenPos[whichTokenGrabbed[i]] = new Vec2D(663+(whichTokenGrabbed[i]%2)*40,268+(whichTokenGrabbed[i]>1?40:0));
                whichTokenGrabbed[i] = -1;
                sounds.fox.play();
              }
            }
        }
      }
      else {
        for (var j=0;j<4;j++){
          //console.log(j+" "+occupiedToken[j]);
          if (!occupiedToken[j] && (playerType[j] == 1 || i == j)){
            if (handPos[i].y > tokenPos[j].y-20 && handPos[i].y < tokenPos[j].y+20 && handPos[i].x > tokenPos[j].x-20 && handPos[i].x < tokenPos[j].x+20){
              if (player[i].inputs.a[0] && !player[i].inputs.a[1]){
                handType[i] = 2;
                whichTokenGrabbed[i] = j;
                tokenPos[whichTokenGrabbed[i]] = new Vec2D(handPos[i].x,handPos[i].y);
                tokenGrabbed[whichTokenGrabbed[i]] = true;
                occupiedToken[whichTokenGrabbed[i]] = true;
                break;
              }
            }
          }
        }

      }
    }
    else {
      handType[i] = 0;
      console.log("test");
      tokenPos[whichTokenGrabbed[i]] = new Vec2D(518+(whichTokenGrabbed[i]%2)*40+chosenChar[whichTokenGrabbed[i]]*93,268+(whichTokenGrabbed[i]>1?40:0));
      //tokenPos[i] = new Vec2D(518+(i%2)*40,268+(i>1?40:0));
      //tokenGrabbed[i] = false;
      if (whichTokenGrabbed[i] > -1 && tokenGrabbed[whichTokenGrabbed[i]] == true){
        tokenGrabbed[whichTokenGrabbed[i]] = false;
        occupiedToken[whichTokenGrabbed[i]] = false;
      }
      whichTokenGrabbed[i] = -1;
      for (var j=0;j<4;j++){
        if (handPos[i].y > 430 && handPos[i].y < 485 && handPos[i].x > 109+j*225 && handPos[i].x < 207+j*225){
          if (player[i].inputs.a[0] && !player[i].inputs.a[1]){
            sounds.menuSelect.play();
            togglePort(j);
            hasTag[j] = false;
          }
        }
      }
    }
    if (handPos[i].y < 160 && handPos[i].x > 920){
      if (player[i].inputs.a[0] && !player[i].inputs.a[1]){
        sounds.menuBack.play();
        gameMode = 1;
      }
    }
    if (player[i].inputs.x[0] && !player[i].inputs.x[1]){
      sounds.menuSelect.play();
      pPal[i]++;
      if (pPal[i] > 6){
        pPal[i] = 0;
      }
    }
    if (player[i].inputs.y[0] && !player[i].inputs.y[1]){
      sounds.menuSelect.play();
      pPal[i]--;
      if (pPal[i] < 0){
        pPal[i] = 6;
      }
    }
    if (player[i].inputs.dpadup[0] && !player[i].inputs.dpadup[1]){
      /*cS[i] = 2;
      player[i].charAttributes = chars[cS[i]].attributes;
      player[i].charHitboxes = chars[cS[i]].hitboxes;*/
    }
    if (handPos[i].y > 100 && handPos[i].y < 160 && handPos[i].x > 380 && handPos[i].x < 910){
      if (player[i].inputs.a[0] && !player[i].inputs.a[1]){
        sounds.menuSelect.play();
        versusMode = 1 - versusMode;
      }
    }

    if (handPos[i].y > 640 && handPos[i].y < 680 && handPos[i].x > 130+i*225 && handPos[i].x < 310+i*225){
      if (player[i].inputs.a[0] && !player[i].inputs.a[1]){
        // do tag
        if (handPos[i].x < 154+i*225){
          // random
          sounds.menuSelect.play();
          hasTag[i] = true;
          tagText[i] = randomTags[Math.round((randomTags.length-1)*Math.random())];
        }
        else if (handPos[i].x > 286+i*225){
          // remove
          sounds.menuSelect.play();
          hasTag[i] = false;
        }
        else {
          // set
          sounds.menuSelect.play();
          hasTag[i] = true;
          choosingTag = i;
          ui.fillStyle = "rgba(0,0,0,0.8)";
          ui.fillRect(0,0,layers.UI.width,layers.UI.height);
          $("#pTagEdit"+i).show().select();

        }
      }
    }
  }
  else if (choosingTag == i && player[i].inputs.a[0] && !player[i].inputs.a[1]){
    sounds.menuSelect.play();
    tagText[choosingTag] = $("#pTagEdit"+choosingTag).val();
    $("#pTagEdit"+choosingTag).hide();
    choosingTag = -1;
  }
  if (readyToFight && choosingTag == -1){
    if (pause[i][0] && !pause[i][1]){
      sounds.menuForward.play();
      //startGame();
      gameMode = 6;
    }
  }
}

function drawCSS(){
  clearScreen();
  var bgGrad =bg1.createLinearGradient(0,0,1200,700);
  bgGrad.addColorStop(0,"rgb(17, 12, 56)");
  bgGrad.addColorStop(1,"black");
  bg1.fillStyle=bgGrad;
  bg1.fillRect(0,0,layers.BG1.width,layers.BG1.height);
  ui.fillStyle = "rgb(85, 96, 107)";
  ui.strokeStyle = "rgb(144, 152, 161)";
  ui.save();
  ui.strokeStyle = "rgb(120, 127, 161)";
  ui.beginPath();
  ui.moveTo(-10,200);
  ui.lineTo(290,200);
  ui.arc(290,225,25,Math.PI*1.5,Math.PI*0.5);
  ui.lineTo(-10,250);
  ui.closePath();
  ui.stroke();
  ui.fillStyle = "rgb(29, 144, 61)";
  ui.beginPath();
  ui.arc(145,225,20,0,twoPi);
  ui.closePath();
  ui.fill();
  ui.fillStyle = "rgb(120, 127, 161)";
  ui.fillText("Push     to join",37,235);
  ui.fillStyle = "rgb(17, 71, 32)";
  ui.fillText("A",133,235);
  ui.restore();
  ui.save();
  ui.lineWidth = 3;
  ui.translate(layers.UI.width/2,layers.UI.height/2+20);
  for (var i=0;i<2;i++){
    ui.rotate(i*Math.PI);
    ui.beginPath();
    ui.moveTo(-10-layers.UI.width/2,-250);
    ui.lineTo(-300,-250);
    ui.bezierCurveTo(-240,-250,-240,-330,-180,-330);
    ui.lineTo(10+layers.UI.width/2,-330);
    ui.lineTo(10+layers.UI.width/2,-30-layers.UI.height/2);
    ui.lineTo(-10-layers.UI.width/2,-30-layers.UI.height/2);
    ui.closePath();
    ui.fill();
    ui.stroke();
  }
  ui.restore();
  ui.lineWidth = 3;
  ui.beginPath();
  ui.moveTo(410,80);
  ui.lineTo(950,80);
  ui.lineTo(955,105);
  ui.lineTo(946,130);
  ui.lineTo(406,130);
  ui.lineTo(400,105);
  ui.closePath();
  ui.stroke();
  ui.lineWidth = 5;
  ui.beginPath();
  ui.moveTo(412,81);
  ui.lineTo(422,81);
  ui.lineTo(412,105);
  ui.lineTo(418,129);
  ui.lineTo(408,129);
  ui.lineTo(402,105);
  ui.closePath();
  ui.fill();
  ui.stroke();
  ui.beginPath();
  ui.moveTo(938,81);
  ui.lineTo(948,81);
  ui.lineTo(953,105);
  ui.lineTo(944,129);
  ui.lineTo(934,129);
  ui.lineTo(943,105);
  ui.closePath();
  ui.fill();
  ui.stroke();
  ui.lineWidth = 3;
  ui.fillStyle = "black";
  ui.font = "italic 900 50px Arial";
  ui.save();
  ui.scale(1,1.9);
  ui.fillText("MELEE",50,65);
  ui.restore();
  ui.beginPath();
  ui.arc(305,85,30,0,twoPi);
  ui.closePath();
  ui.fill();
  ui.stroke();
  ui.fillStyle = "rgb(144, 152, 161)";
  ui.font = "700 32px Arial";
  ui.fillText("VS",284,98);
  ui.fillStyle = "rgb(219, 219, 219)";
  ui.save();
  ui.scale(1.25,1);
  if (versusMode){
    ui.fillText("An endless KO fest!",393,117);
  }
  else {
    ui.fillText("4-man survival test!",390,117);
  }
  ui.restore();
  ui.fillStyle = "rgba(0,0,0,0.65)";
  ui.beginPath();
  ui.moveTo(1100,0);
  ui.lineTo(1000,110);
  ui.lineTo(1020,125);
  ui.lineTo(1200,125);
  ui.lineTo(1200,0);
  ui.closePath();
  ui.fill();
  ui.fillStyle = "rgb(255, 222, 0)";
  ui.beginPath();
  ui.moveTo(1100,0);
  ui.lineTo(1000,110);
  ui.lineTo(1020,125);
  ui.lineTo(1200,125);
  ui.lineTo(1200,119);
  ui.lineTo(1015,119);
  ui.lineTo(1002,110);
  ui.lineTo(1102,0);
  ui.closePath();
  ui.fill();
  ui.font = "700 27px Arial";
  ui.fillText("BACK",1035,112);
  ui.fillStyle = "rgb(194, 24, 8)";
  ui.beginPath();
  ui.moveTo(1025,75);
  ui.lineTo(992,110);
  ui.lineTo(1010,125);
  ui.lineTo(972,110);
  ui.closePath();
  ui.fill();
  var bgGrad =ui.createLinearGradient(0,250,0,350);
  bgGrad.addColorStop(0,"rgb(41, 47, 68)");
  bgGrad.addColorStop(1,"rgb(85, 95, 128)");
  ui.lineWidth = 2;
  for (var j=0;j<3;j++){
    ui.fillStyle=bgGrad;
    ui.beginPath();
    ui.moveTo(457+j*95,265);
    ui.bezierCurveTo(457+j*95,245,457+j*95,245,477+j*95,245);
    ui.lineTo(522+j*95,245);
    ui.bezierCurveTo(542+j*95,245,542+j*95,245,542+j*95,265);
    ui.lineTo(542+j*95,310);
    ui.bezierCurveTo(542+j*95,330,542+j*95,330,522+j*95,330);
    ui.lineTo(477+j*95,330);
    ui.bezierCurveTo(457+j*95,330,457+j*95,330,457+j*95,310);
    ui.closePath();
    ui.fill();
    ui.stroke();
    switch (j){
      case 0:
        var add = 0;
        break;
      case 1:
        var add = 7;
        break;
      case 2:
        var add = 0;
        break;
      default:
        var add = 0;
        break;
    }
    ui.fillStyle = "black";
    ui.beginPath();
    ui.moveTo(540+j*95,305-add);
    ui.lineTo(540+j*95,310-add);
    ui.bezierCurveTo(540+j*95,328,540+j*95,328,522+j*95,328);
    ui.lineTo(487+j*95,328);
    ui.bezierCurveTo(459+j*95,328,459+j*95,328,459+j*95,310-add);
    ui.lineTo(459+j*95,305-add);
    ui.closePath();
    ui.fill();
    ui.fillStyle = "rgb(180, 180, 180)";
    ui.font = "700 18px Arial";
    switch (j){
      case 0:
        ui.fillText("MARTH",467+j*95,323);
        ui.drawImage(marthPic, 459+j*95, 247, 81, 58);
        break;
      case 1:
        ui.fillText("JIGGLY-",464+j*95,313);
        ui.fillText("PUFF",477+j*95,326);
        ui.drawImage(puffPic, 459+j*95, 247, 81, 51);
        break;
      case 2:
        ui.fillText("  F O X ",467+j*95,323);
        ui.drawImage(foxPic, 459+j*95, 247, 81, 58);
        break;
      default:
        break;
    }
  }
  ui.fillStyle = "rgb(49, 52, 56)";
  for (var i=0;i<4;i++){
    ui.fillRect(145+i*225,430,210,280);
    ui.strokeRect(145+i*225,430,210,280);
  }
  ui.fillStyle = "rgb(55, 58, 62)";
  ui.strokeStyle = "rgb(72, 77, 85)";
  for (var i=0;i<4;i++){
    ui.fillRect(158+i*225,440,184,260);
    ui.strokeRect(158+i*225,440,184,260);
  }
  ui.fillStyle = "rgba(255,255,255,0.1)";
  for (var i=0;i<4;i++){
    ui.fillRect(158+i*225,630,184,50);
  }
  ui.strokeStyle = "rgba(0,0,0,0.2)";
  ui.fillStyle = "rgba(0,0,0,0.2)";
  ui.lineWidth = 15;
  for (var i=0;i<4;i++){
    ui.beginPath();
    ui.moveTo(150+i*225,435);
    ui.lineTo(350+i*225,705);
    ui.closePath();
    ui.stroke();
    ui.beginPath();
    ui.arc(250+i*225,570,60,0,twoPi);
    ui.closePath();
    ui.stroke();
    ui.beginPath();
    ui.moveTo(150+i*225,570);
    ui.lineTo(350+i*225,570);
    ui.closePath();
    ui.stroke();
  }
  ui.lineWidth = 3;
  for (var i=0;i<4;i++){
    for (var j=0;j<7;j++){
      ui.beginPath();
      ui.arc(165+i*225+j*30,450,11,0,twoPi);
      ui.closePath();
      ui.fill();
      ui.beginPath();
      ui.arc(165+i*225+j*30,690,10,0,twoPi);
      ui.closePath();
      ui.stroke();
      if (j == 3){
        ui.fill();
      }
    }
  }
  for (var i=0;i<4;i++){
    if (playerType[i] > -1){
    if (playerType[i] == 0){
      switch (i){
        case 0:
          ui.fillStyle = "rgb(218, 51, 51)";
          break;
        case 1:
          ui.fillStyle = "rgb(51, 53, 218)";
          break;
        case 2:
          ui.fillStyle = "rgb(226, 218, 34)";
          break;
        case 3:
          ui.fillStyle = "rgb(44, 217, 29)";
          break;
        default:
          break;
      }
    }
    else {
      ui.fillStyle = "rgb(91, 91, 91)";
    }
    ui.fillRect(147+i*225,432,206,276);
    ui.fillStyle = "rgba(0,0,0,0.5)";
    ui.beginPath();
    ui.moveTo(152+i*225,465);
    ui.lineTo(210+i*225,465);
    ui.lineTo(230+i*225,450);
    ui.lineTo(318+i*225,450);
    ui.bezierCurveTo(338+i*225,450,338+i*225,450,338+i*225,470)
    ui.lineTo(338+i*225,708);
    ui.lineTo(152+i*225,708);
    ui.closePath();
    ui.fill();
    ui.save();
    ui.fillStyle = "rgba(0, 0, 0, 0.3)";
    ui.translate(250+i*225,615);
    ui.scale(1,0.3);
    ui.beginPath();
    ui.arc(0,0,50,0,twoPi);
    ui.closePath();
    ui.fill();
    ui.restore();
    ui.fillStyle = "black";
    ui.strokeStyle = "rgb(102, 102, 102)";
    ui.fillRect(152+i*225,640,196,60);
    ui.strokeRect(152+i*225,640,196,60);
    ui.save();
    ui.fillStyle = "rgb(84, 84, 84)";
    ui.font = "italic 900 45px Arial";
    ui.scale(14/8,1);
    var text = "P"+(i+1);
    if (playerType[i] == 1){
      text = "CP";
    }
    ui.fillText(text,87+i*225/(14/8),690)
    ui.restore();
    ui.fillRect(160+i*225,620,180,40);
    ui.strokeRect(160+i*225,620,180,40);
    ui.font = "900 24px Arial";
    if (playerType[i] == 0){
    ui.fillStyle = "rgb(42, 42, 42)";
      ui.fillRect(162+i*225,622,22,37);
      ui.fillRect(316+i*225,622,22,37);
      ui.fillStyle = "rgb(83, 83, 83)";
      ui.fillText("?",166+i*225,648);
      ui.fillText("x",319+i*225,647);
    }
    ui.font = "500 28px Arial";
    ui.fillStyle = "white";
    switch(chosenChar[i]){
      case 0:
        var text = "Marth";
        break;
      case 1:
        var text = "Jigglypuff";
        break;
      case 2:
        var text = "Fox";
        break;
      default:
        var text = "Unknown";
        break;
    }
    if (hasTag[i]){
      var text = tagText[i];
    }
    ui.textAlign = "center";
    ui.fillText(text,250+i*225,650);
    ui.textAlign = "start";
  }
  }
  ui.fillStyle = "rgb(82, 81, 81)";
  for (var i=0;i<4;i++){
    ui.fillStyle = "rgb(82, 81, 81)";
      switch (playerType[i]){
        case 0:
          ui.fillStyle = "rgb(201, 178, 20)";
          break;
        case 1:
          ui.fillStyle = "rgb(161, 161, 161)";
          break;
        default:
          ui.fillStyle = "rgb(82, 81, 81)";
          break;
      }
    ui.beginPath();
    ui.moveTo(139+i*225,420);
    ui.lineTo(220+i*225,420);
    ui.lineTo(237+i*225,432);
    ui.lineTo(215+i*225,455);
    ui.lineTo(142+i*225,455);
    ui.lineTo(139+i*225,452);
    ui.closePath();
    ui.fill();
  }
  ui.fillStyle = "rgba(0, 0, 0,0.7)";
  ui.strokeStyle = "rgba(0, 0, 0,0.7)";
  ui.lineWidth = 4;
  for (var i=0;i<4;i++){
    ui.beginPath();
    ui.moveTo(160+i*225,424);
    ui.lineTo(215+i*225,424);
    ui.lineTo(228+i*225,432);
    ui.lineTo(210+i*225,451);
    ui.lineTo(160+i*225,451);
    ui.closePath();
    ui.fill();
    ui.beginPath();
    ui.moveTo(139+i*225,420);
    ui.lineTo(151+i*225,424);
    ui.lineTo(151+i*225,451);
    ui.lineTo(140+i*225,451);
    ui.stroke();
  }
  ui.fillStyle = "rgb(82, 81, 81)";
  ui.font = "700 22px Arial";
  for (var i=0;i<4;i++){
    ui.fillStyle = "rgb(82, 81, 81)";
    var text = "N/A";
      switch (playerType[i]){
        case 0:
          text = "HMN";
          ui.fillStyle = "rgb(201, 178, 20)";
          break;
        case 1:
          text = "CPU";
          ui.fillStyle = "rgb(161, 161, 161)";
          break;
        default:
          break;
      }

    ui.fillText(text,163+i*225,445);
  }
  for (var i=0;i<4;i++){
    if (playerType[i] > -1){
      var frame = Math.floor(player[i].timer);
      if (frame == 0){
        frame = 1;
      }
      var face = player[i].phys.face;

      var model = animations[cS[i]][aS[cS[i]][player[i].actionState].name][frame-1];

      switch (player[i].actionState){
        case 15:
        case 17:
        case 20:
        case 25:
        case 61:
        case 72:
        case 94:
          var model = animations[cS[i]][aS[cS[i]][player[i].actionState].name][0];
          break;
        default:
          break;
      }
      if (aS[cS[i]][player[i].actionState].reverseModel){
        face *= -1;
      }
      else if (player[i].actionState == 4){
        if (frame > 5){
          face *= -1;
        }
      }
      else if (player[i].actionState == 6){
        if (frame > 18){
          face *= -1;
        }
      }
      else if (player[i].actionState == 34){
        if (frame > 29){
          face *= -1;
        }
      }

      var col = palettes[pPal[i]][0];
      if (tokenGrabbed[i]){
        ui.globalAlpha = 0.6;
      }
      else {
        ui.globalAlpha = 1;
      }
      drawArrayPathNew(ui,col,face,(player[i].phys.pos.x*4.5*1.5) + 600,(player[i].phys.pos.y*-4.5) +480,model,player[i].charAttributes.charScale*1.5,player[i].charAttributes.charScale*1.5,0,0,0);
      //drawArrayPath(col,face,245+i*225,610,model,0.3,0.3);
      if (player[i].phys.shielding){
        var sCol = palettes[pPal[i]][2];
        ui.fillStyle = sCol+(0.6*player[i].phys.shieldAnalog)+")";
        ui.beginPath();
        ui.arc((player[i].phys.shieldPositionReal.x*4.5*1.5) + 600,(player[i].phys.shieldPositionReal.y*-4.5) +460,player[i].phys.shieldSize*4.5*1.5,twoPi,0);
        ui.fill();
      }
      ui.globalAlpha = 1;
    }
  }
  ui.font = "900 31px Arial";
  ui.lineWidth = 2;
  for (var i=0;i<4;i++){
    if (playerType[i] > -1){
    var bgGrad =ui.createLinearGradient(tokenPos[i].x-100,tokenPos[i].y,tokenPos[i].x+50,tokenPos[i].y);
    bgGrad.addColorStop(0,"rgb(255, 255, 255)");
    var text = "";
    switch (playerType[i]){
      case 0:
        text = "P"+(i+1);
        switch (i){
          case 0:
            bgGrad.addColorStop(1,"rgb(233, 57, 57)");
            break;
          case 1:
            bgGrad.addColorStop(1,"rgb(62, 130, 233)");
            break;
          case 2:
            bgGrad.addColorStop(1,"rgb(255, 253, 47)");
            break;
          case 3:
            bgGrad.addColorStop(1,"rgb(36, 242, 45)");
            break;
          default:
            break;
          }
        break;
      case 1:
        text = "CP";
        bgGrad.addColorStop(1,"rgb(135, 135, 135)");
      default:
        break;
    }
    ui.fillStyle = "rgba(0,0,0,0.4)";
    ui.beginPath();
    ui.arc(tokenPos[i].x,tokenPos[i].y,34,0,twoPi);
    ui.closePath();
    ui.fill();
    ui.fillStyle = bgGrad;
    ui.beginPath();
    ui.arc(tokenPos[i].x,tokenPos[i].y,30,0,twoPi);
    ui.closePath();
    ui.fill();
    ui.fillStyle = "rgba(0,0,0,0.4)";
    ui.beginPath(tokenPos[i].y);
    //ui.moveTo(tokenPos[i].x,tokenPos[i].y+4);
    ui.arc(tokenPos[i].x,tokenPos[i].y,26,1.2*Math.PI,0.4*Math.PI);
    ui.arc(tokenPos[i].x-3,tokenPos[i].y,23,0.5*Math.PI,1.2*Math.PI,true);
    ui.closePath();
    ui.fill();
    ui.strokeStyle = "rgb(57, 57, 57)";
    ui.fillStyle = "rgb(207, 207, 207)";

    ui.fillText(text,tokenPos[i].x-22,tokenPos[i].y+13);
    ui.strokeText(text,tokenPos[i].x-22,tokenPos[i].y+13);
  }

  }
  // 72 95
  for (var i=0;i<ports;i++){

      switch (handType[i]){
        case 0:
          ui.drawImage(handPoint, handPos[i].x-40, handPos[i].y-30,101,133);
          break;
        case 1:
          ui.drawImage(handOpen, handPos[i].x-40, handPos[i].y-30,101,133);
          break;
        case 2:
          ui.drawImage(handGrab, handPos[i].x-40, handPos[i].y-30,101,133);
          break;
        default:
          break;
      }
      switch (i){
        case 0:
          ui.fillStyle = "rgb(233, 57, 57)";
          break;
        case 1:
          ui.fillStyle = "rgb(62, 130, 233)";
          break;
        case 2:
          ui.fillStyle = "rgb(255, 253, 47)";
          break;
        case 3:
          ui.fillStyle = "rgb(36, 242, 45)";
          break;
        default:
          break;
      }
      ui.fillText("P"+(i+1),handPos[i].x-15,handPos[i].y+60);
      ui.strokeText("P"+(i+1),handPos[i].x-15,handPos[i].y+60);
    }
    var readyPlayers = 0;
    for (var k=0;k<4;k++){
      if (playerType[k] > -1){
        readyPlayers++;
        if (readyPlayers >= 2){
          readyToFight = true;
        }
        else {
          readyToFight = false;
        }
        if (occupiedToken[k]){
          readyToFight = false;
          break;
        }
      }
    }
    if (readyToFight){
      ui.save();
      ui.fillStyle = "rgba(223, 31, 31, 0.8)";
      ui.beginPath();
      ui.moveTo(50,300);
      ui.bezierCurveTo(450,270,750,270,1150,300);
      ui.bezierCurveTo(750,280,450,280,50,300);
      ui.closePath();
      ui.fill();
      ui.beginPath();
      ui.moveTo(50,370);
      ui.bezierCurveTo(450,350,750,350,1150,370);
      //ui.bezierCurveTo(750,360,450,360,50,370);
      ui.bezierCurveTo(750,360,900,365,900,365);
      ui.bezierCurveTo(850,365,830,380,800,380);
      ui.lineTo(400,380);
      ui.bezierCurveTo(370,380,350,365,300,365);
      ui.bezierCurveTo(300,360,450,370,0,370);
      ui.closePath();
      ui.fill();
      ui.fillStyle="rgba(0,0,0,0.5)";
      ui.beginPath();
      ui.moveTo(50,300);
      ui.bezierCurveTo(450,280,750,280,1150,300);
      ui.arc(1150,335,35,Math.PI*1.5,Math.PI*0.5,true);
      //ui.lineTo(1150,370);
      ui.bezierCurveTo(750,350,450,350,50,370);
      ui.arc(50,335,35,Math.PI*0.5,Math.PI*1.5,true);
      ui.closePath();
      ui.fill();
      ui.scale(1.4,1);
      rtfFlash+=0.5*rtfFlashD;
      if (rtfFlash < 25){
        rtfFlashD = 1;
      }
      if (rtfFlash > 50){
        rtfFlashD = -1;
      }
      ui.fillStyle = "hsl(52, 85%, "+rtfFlash+"%)";
      ui.font = "italic 600 65px Arial";
      ui.rotate(-0.03);
      ui.fillText("READY",120,353);
      ui.rotate(0.03);
      ui.fillText("TO",390,342);
      ui.rotate(0.03);
      ui.fillText("FIGHT",520,329);
      ui.rotate(-0.03);
      ui.fillStyle = "rgb(193, 193, 193)";
      ui.font = "900 15px Arial";
      ui.scale(2.3/1.4,1);
      ui.fillText("PRESS START",205,373);
      ui.restore();
    }

    if (choosingTag > -1){
      ui.fillStyle = "rgba(0,0,0,0.8)";
      ui.fillRect(0,0,layers.UI.width,layers.UI.height);
      ui.fillStyle = "white";
      ui.textAlign = "center";
      //ui.fillText(text,250+i*225,650);
      ui.fillText("Type tag now",250+choosingTag*225,570);
      ui.fillText("Press A to finish",250+choosingTag*225,600);
      ui.textAlign = "start";
    }
}
