var marthPic = new Image();
marthPic.src = "marth.png";
var puffPic = new Image();
puffPic.src = "puff.png";
var handPoint = new Image();
handPoint.src = "handpoint.png";
var handOpen = new Image();
handOpen.src = "handopen.png";
var handGrab = new Image();
handGrab.src = "handgrab.png";

choosingTag = -1;
handType = [0,0,0,0];
handPos = [new Vec2D(140,700),new Vec2D(365,700),new Vec2D(590,700),new Vec2D(815,700)];
tokenPos = [new Vec2D(518,268),new Vec2D(558,268),new Vec2D(518,308),new Vec2D(558,308)];
chosenChar = [0,0,0,0];
tokenGrabbed = [false,false,false,false];
whichTokenGrabbed = [-1,-1,-1,-1];
occupiedToken = [false,false,false,false];
bHold = [0,0,0,0];

readyToFight = false;

rtfFlash = 25;
rtfFlashD = 1;

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
            if (handPos[i].x > 495 && handPos[i].x < 590){
              if (chosenChar[whichTokenGrabbed[i]] != 0){
                chosenChar[whichTokenGrabbed[i]] = 0;
                cS[whichTokenGrabbed[i]] = 0;
                player[whichTokenGrabbed[i]].charAttributes = chars[cS[i]].attributes;
                player[whichTokenGrabbed[i]].charHitboxes = chars[cS[i]].hitboxes;
                sounds.menuSelect.play();
              }
              if (player[i].inputs.a[0] && !player[i].inputs.a[1]){
                tokenGrabbed[whichTokenGrabbed[i]] = false;
                occupiedToken[whichTokenGrabbed[i]] = false;
                tokenPos[whichTokenGrabbed[i]] = new Vec2D(518+(whichTokenGrabbed[i]%2)*40,268+(whichTokenGrabbed[i]>1?40:0));
                whichTokenGrabbed[i] = -1;
                sounds.marth.play();
              }
            }
            else if (handPos[i].x > 590 && handPos[i].x < 685){
              if (chosenChar[whichTokenGrabbed[i]] != 1){
                chosenChar[whichTokenGrabbed[i]] = 1;
                cS[whichTokenGrabbed[i]] = 1;
                player[whichTokenGrabbed[i]].charAttributes = chars[cS[whichTokenGrabbed[i]]].attributes;
                player[whichTokenGrabbed[i]].charHitboxes = chars[cS[whichTokenGrabbed[i]]].hitboxes;
                sounds.menuSelect.play();
              }
              if (player[i].inputs.a[0] && !player[i].inputs.a[1]){

                tokenGrabbed[whichTokenGrabbed[i]] = false;
                occupiedToken[whichTokenGrabbed[i]] = false;
                tokenPos[whichTokenGrabbed[i]] = new Vec2D(611+(whichTokenGrabbed[i]%2)*40,268+(whichTokenGrabbed[i]>1?40:0));
                whichTokenGrabbed[i] = -1;
                sounds.jigglypuff.play();
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
      cS[i] = 2;
      player[i].charAttributes = chars[cS[i]].attributes;
      player[i].charHitboxes = chars[cS[i]].hitboxes;
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
          c.fillStyle = "rgba(0,0,0,0.8)";
          c.fillRect(0,0,canvas.width,canvas.height);
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
  var bgGrad =c.createLinearGradient(0,0,1200,700);
  bgGrad.addColorStop(0,"rgb(17, 12, 56)");
  bgGrad.addColorStop(1,"black");
  c.fillStyle=bgGrad;
  c.fillRect(0,0,canvas.width,canvas.height);
  c.fillStyle = "rgb(85, 96, 107)";
  c.strokeStyle = "rgb(144, 152, 161)";
  c.save();
  c.strokeStyle = "rgb(120, 127, 161)";
  c.beginPath();
  c.moveTo(-10,200);
  c.lineTo(290,200);
  c.arc(290,225,25,Math.PI*1.5,Math.PI*0.5);
  c.lineTo(-10,250);
  c.closePath();
  c.stroke();
  c.fillStyle = "rgb(29, 144, 61)";
  c.beginPath();
  c.arc(145,225,20,0,twoPi);
  c.closePath();
  c.fill();
  c.fillStyle = "rgb(120, 127, 161)";
  c.fillText("Push     to join",37,235);
  c.fillStyle = "rgb(17, 71, 32)";
  c.fillText("A",133,235);
  c.restore();
  c.save();
  c.lineWidth = 3;
  c.translate(canvas.width/2,canvas.height/2+20);
  for (var i=0;i<2;i++){
    c.rotate(i*Math.PI);
    c.beginPath();
    c.moveTo(-10-canvas.width/2,-250);
    c.lineTo(-300,-250);
    c.bezierCurveTo(-240,-250,-240,-330,-180,-330);
    c.lineTo(10+canvas.width/2,-330);
    c.lineTo(10+canvas.width/2,-30-canvas.height/2);
    c.lineTo(-10-canvas.width/2,-30-canvas.height/2);
    c.closePath();
    c.fill();
    c.stroke();
  }
  c.restore();
  c.lineWidth = 3;
  c.beginPath();
  c.moveTo(410,80);
  c.lineTo(950,80);
  c.lineTo(955,105);
  c.lineTo(946,130);
  c.lineTo(406,130);
  c.lineTo(400,105);
  c.closePath();
  c.stroke();
  c.lineWidth = 5;
  c.beginPath();
  c.moveTo(412,81);
  c.lineTo(422,81);
  c.lineTo(412,105);
  c.lineTo(418,129);
  c.lineTo(408,129);
  c.lineTo(402,105);
  c.closePath();
  c.fill();
  c.stroke();
  c.beginPath();
  c.moveTo(938,81);
  c.lineTo(948,81);
  c.lineTo(953,105);
  c.lineTo(944,129);
  c.lineTo(934,129);
  c.lineTo(943,105);
  c.closePath();
  c.fill();
  c.stroke();
  c.lineWidth = 3;
  c.fillStyle = "black";
  c.font = "italic 900 50px Arial";
  c.save();
  c.scale(1,1.9);
  c.fillText("MELEE",50,65);
  c.restore();
  c.beginPath();
  c.arc(305,85,30,0,twoPi);
  c.closePath();
  c.fill();
  c.stroke();
  c.fillStyle = "rgb(144, 152, 161)";
  c.font = "700 32px Arial";
  c.fillText("VS",284,98);
  c.fillStyle = "rgb(219, 219, 219)";
  c.save();
  c.scale(1.25,1);
  if (versusMode){
    c.fillText("An endless KO fest!",393,117);
  }
  else {
    c.fillText("4-man survival test!",390,117);
  }
  c.restore();
  c.fillStyle = "rgba(0,0,0,0.65)";
  c.beginPath();
  c.moveTo(1100,0);
  c.lineTo(1000,110);
  c.lineTo(1020,125);
  c.lineTo(1200,125);
  c.lineTo(1200,0);
  c.closePath();
  c.fill();
  c.fillStyle = "rgb(255, 222, 0)";
  c.beginPath();
  c.moveTo(1100,0);
  c.lineTo(1000,110);
  c.lineTo(1020,125);
  c.lineTo(1200,125);
  c.lineTo(1200,119);
  c.lineTo(1015,119);
  c.lineTo(1002,110);
  c.lineTo(1102,0);
  c.closePath();
  c.fill();
  c.font = "700 27px Arial";
  c.fillText("BACK",1035,112);
  c.fillStyle = "rgb(194, 24, 8)";
  c.beginPath();
  c.moveTo(1025,75);
  c.lineTo(992,110);
  c.lineTo(1010,125);
  c.lineTo(972,110);
  c.closePath();
  c.fill();
  var bgGrad =c.createLinearGradient(0,250,0,350);
  bgGrad.addColorStop(0,"rgb(41, 47, 68)");
  bgGrad.addColorStop(1,"rgb(85, 95, 128)");
  c.lineWidth = 2;
  for (var j=0;j<2;j++){
    c.fillStyle=bgGrad;
    c.beginPath();
    c.moveTo(500+j*95,265);
    c.bezierCurveTo(500+j*95,245,500+j*95,245,520+j*95,245);
    c.lineTo(565+j*95,245);
    c.bezierCurveTo(585+j*95,245,585+j*95,245,585+j*95,265);
    c.lineTo(585+j*95,310);
    c.bezierCurveTo(585+j*95,330,585+j*95,330,565+j*95,330);
    c.lineTo(520+j*95,330);
    c.bezierCurveTo(500+j*95,330,500+j*95,330,500+j*95,310);
    c.closePath();
    c.fill();
    c.stroke();
    switch (j){
      case 0:
        var add = 0;
        break;
      case 1:
        var add = 7;
        break;
      default:
        var add = 0;
        break;
    }
    c.fillStyle = "black";
    c.beginPath();
    c.moveTo(583+j*95,305-add);
    c.lineTo(583+j*95,310-add);
    c.bezierCurveTo(583+j*95,328,583+j*95,328,565+j*95,328);
    c.lineTo(520+j*95,328);
    c.bezierCurveTo(502+j*95,328,502+j*95,328,502+j*95,310-add);
    c.lineTo(502+j*95,305-add);
    c.closePath();
    c.fill();
    c.fillStyle = "rgb(180, 180, 180)";
    c.font = "700 18px Arial";
    switch (j){
      case 0:
        c.fillText("MARTH",510+j*95,323);
        c.drawImage(marthPic, 502+j*95, 247, 81, 58);
        break;
      case 1:
        c.fillText("JIGGLY-",507+j*95,313);
        c.fillText("PUFF",520+j*95,326);
        c.drawImage(puffPic, 502+j*95, 247, 81, 51);
        break;
      default:
        break;
    }
  }
  c.fillStyle = "rgb(49, 52, 56)";
  for (var i=0;i<4;i++){
    c.fillRect(145+i*225,430,210,280);
    c.strokeRect(145+i*225,430,210,280);
  }
  c.fillStyle = "rgb(55, 58, 62)";
  c.strokeStyle = "rgb(72, 77, 85)";
  for (var i=0;i<4;i++){
    c.fillRect(158+i*225,440,184,260);
    c.strokeRect(158+i*225,440,184,260);
  }
  c.fillStyle = "rgba(255,255,255,0.1)";
  for (var i=0;i<4;i++){
    c.fillRect(158+i*225,630,184,50);
  }
  c.strokeStyle = "rgba(0,0,0,0.2)";
  c.fillStyle = "rgba(0,0,0,0.2)";
  c.lineWidth = 15;
  for (var i=0;i<4;i++){
    c.beginPath();
    c.moveTo(150+i*225,435);
    c.lineTo(350+i*225,705);
    c.closePath();
    c.stroke();
    c.beginPath();
    c.arc(250+i*225,570,60,0,twoPi);
    c.closePath();
    c.stroke();
    c.beginPath();
    c.moveTo(150+i*225,570);
    c.lineTo(350+i*225,570);
    c.closePath();
    c.stroke();
  }
  c.lineWidth = 3;
  for (var i=0;i<4;i++){
    for (var j=0;j<7;j++){
      c.beginPath();
      c.arc(165+i*225+j*30,450,11,0,twoPi);
      c.closePath();
      c.fill();
      c.beginPath();
      c.arc(165+i*225+j*30,690,10,0,twoPi);
      c.closePath();
      c.stroke();
      if (j == 3){
        c.fill();
      }
    }
  }
  for (var i=0;i<4;i++){
    if (playerType[i] > -1){
    if (playerType[i] == 0){
      switch (i){
        case 0:
          c.fillStyle = "rgb(218, 51, 51)";
          break;
        case 1:
          c.fillStyle = "rgb(51, 53, 218)";
          break;
        case 2:
          c.fillStyle = "rgb(226, 218, 34)";
          break;
        case 3:
          c.fillStyle = "rgb(44, 217, 29)";
          break;
        default:
          break;
      }
    }
    else {
      c.fillStyle = "rgb(91, 91, 91)";
    }
    c.fillRect(147+i*225,432,206,276);
    c.fillStyle = "rgba(0,0,0,0.5)";
    c.beginPath();
    c.moveTo(152+i*225,465);
    c.lineTo(210+i*225,465);
    c.lineTo(230+i*225,450);
    c.lineTo(318+i*225,450);
    c.bezierCurveTo(338+i*225,450,338+i*225,450,338+i*225,470)
    c.lineTo(338+i*225,708);
    c.lineTo(152+i*225,708);
    c.closePath();
    c.fill();
    c.save();
    c.fillStyle = "rgba(0, 0, 0, 0.3)";
    c.translate(250+i*225,615);
    c.scale(1,0.3);
    c.beginPath();
    c.arc(0,0,50,0,twoPi);
    c.closePath();
    c.fill();
    c.restore();
    c.fillStyle = "black";
    c.strokeStyle = "rgb(102, 102, 102)";
    c.fillRect(152+i*225,640,196,60);
    c.strokeRect(152+i*225,640,196,60);
    c.save();
    c.fillStyle = "rgb(84, 84, 84)";
    c.font = "italic 900 45px Arial";
    c.scale(14/8,1);
    var text = "P"+(i+1);
    if (playerType[i] == 1){
      text = "CP";
    }
    c.fillText(text,87+i*225/(14/8),690)
    c.restore();
    c.fillRect(160+i*225,620,180,40);
    c.strokeRect(160+i*225,620,180,40);
    c.font = "900 24px Arial";
    if (playerType[i] == 0){
    c.fillStyle = "rgb(42, 42, 42)";
      c.fillRect(162+i*225,622,22,37);
      c.fillRect(316+i*225,622,22,37);
      c.fillStyle = "rgb(83, 83, 83)";
      c.fillText("?",166+i*225,648);
      c.fillText("x",319+i*225,647);
    }
    c.font = "500 28px Arial";
    c.fillStyle = "white";
    switch(chosenChar[i]){
      case 0:
        var text = "Marth";
        break;
      case 1:
        var text = "Jigglypuff";
        break;
      default:
        var text = "Unknown";
        break;
    }
    if (hasTag[i]){
      var text = tagText[i];
    }
    c.textAlign = "center";
    c.fillText(text,250+i*225,650);
    c.textAlign = "start";
  }
  }
  c.fillStyle = "rgb(82, 81, 81)";
  for (var i=0;i<4;i++){
    c.fillStyle = "rgb(82, 81, 81)";
      switch (playerType[i]){
        case 0:
          c.fillStyle = "rgb(201, 178, 20)";
          break;
        case 1:
          c.fillStyle = "rgb(161, 161, 161)";
          break;
        default:
          c.fillStyle = "rgb(82, 81, 81)";
          break;
      }
    c.beginPath();
    c.moveTo(139+i*225,420);
    c.lineTo(220+i*225,420);
    c.lineTo(237+i*225,432);
    c.lineTo(215+i*225,455);
    c.lineTo(142+i*225,455);
    c.lineTo(139+i*225,452);
    c.closePath();
    c.fill();
  }
  c.fillStyle = "rgba(0, 0, 0,0.7)";
  c.strokeStyle = "rgba(0, 0, 0,0.7)";
  c.lineWidth = 4;
  for (var i=0;i<4;i++){
    c.beginPath();
    c.moveTo(160+i*225,424);
    c.lineTo(215+i*225,424);
    c.lineTo(228+i*225,432);
    c.lineTo(210+i*225,451);
    c.lineTo(160+i*225,451);
    c.closePath();
    c.fill();
    c.beginPath();
    c.moveTo(139+i*225,420);
    c.lineTo(151+i*225,424);
    c.lineTo(151+i*225,451);
    c.lineTo(140+i*225,451);
    c.stroke();
  }
  c.fillStyle = "rgb(82, 81, 81)";
  c.font = "700 22px Arial";
  for (var i=0;i<4;i++){
    c.fillStyle = "rgb(82, 81, 81)";
    var text = "N/A";
      switch (playerType[i]){
        case 0:
          text = "HMN";
          c.fillStyle = "rgb(201, 178, 20)";
          break;
        case 1:
          text = "CPU";
          c.fillStyle = "rgb(161, 161, 161)";
          break;
        default:
          break;
      }

    c.fillText(text,163+i*225,445);
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
        c.globalAlpha = 0.6;
      }
      else {
        c.globalAlpha = 1;
      }
      if (cS[i]){
        drawArrayPathNew(col,face,(player[i].phys.pos.x*4.5*1.5) + 600,(player[i].phys.pos.y*-4.5) +480,model,player[i].charAttributes.charScale*1.5,player[i].charAttributes.charScale*1.5,0,0,0);
      }
      else {
        drawArrayPath(col,face,(player[i].phys.pos.x*4.5*1.5) + 600,(player[i].phys.pos.y*-4.5) +480,model,player[i].charAttributes.charScale*1.5,player[i].charAttributes.charScale*1.5);
      }
      //drawArrayPath(col,face,245+i*225,610,model,0.3,0.3);
      if (player[i].phys.shielding){
        var sCol = palettes[pPal[i]][2];
        c.fillStyle = sCol+(0.6*player[i].phys.shieldAnalog)+")";
        c.beginPath();
        c.arc((player[i].phys.shieldPositionReal.x*4.5*1.5) + 600,(player[i].phys.shieldPositionReal.y*-4.5) +460,player[i].phys.shieldSize*4.5*1.5,twoPi,0);
        c.fill();
      }
      c.globalAlpha = 1;
    }
  }
  c.font = "900 31px Arial";
  c.lineWidth = 2;
  for (var i=0;i<4;i++){
    if (playerType[i] > -1){
    var bgGrad =c.createLinearGradient(tokenPos[i].x-100,tokenPos[i].y,tokenPos[i].x+50,tokenPos[i].y);
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
    c.fillStyle = "rgba(0,0,0,0.4)";
    c.beginPath();
    c.arc(tokenPos[i].x,tokenPos[i].y,34,0,twoPi);
    c.closePath();
    c.fill();
    c.fillStyle = bgGrad;
    c.beginPath();
    c.arc(tokenPos[i].x,tokenPos[i].y,30,0,twoPi);
    c.closePath();
    c.fill();
    c.fillStyle = "rgba(0,0,0,0.4)";
    c.beginPath(tokenPos[i].y);
    //c.moveTo(tokenPos[i].x,tokenPos[i].y+4);
    c.arc(tokenPos[i].x,tokenPos[i].y,26,1.2*Math.PI,0.4*Math.PI);
    c.arc(tokenPos[i].x-3,tokenPos[i].y,23,0.5*Math.PI,1.2*Math.PI,true);
    c.closePath();
    c.fill();
    c.strokeStyle = "rgb(57, 57, 57)";
    c.fillStyle = "rgb(207, 207, 207)";

    c.fillText(text,tokenPos[i].x-22,tokenPos[i].y+13);
    c.strokeText(text,tokenPos[i].x-22,tokenPos[i].y+13);
  }

  }
  // 72 95
  for (var i=0;i<ports;i++){

      switch (handType[i]){
        case 0:
          c.drawImage(handPoint, handPos[i].x-40, handPos[i].y-30,101,133);
          break;
        case 1:
          c.drawImage(handOpen, handPos[i].x-40, handPos[i].y-30,101,133);
          break;
        case 2:
          c.drawImage(handGrab, handPos[i].x-40, handPos[i].y-30,101,133);
          break;
        default:
          break;
      }
      switch (i){
        case 0:
          c.fillStyle = "rgb(233, 57, 57)";
          break;
        case 1:
          c.fillStyle = "rgb(62, 130, 233)";
          break;
        case 2:
          c.fillStyle = "rgb(255, 253, 47)";
          break;
        case 3:
          c.fillStyle = "rgb(36, 242, 45)";
          break;
        default:
          break;
      }
      c.fillText("P"+(i+1),handPos[i].x-15,handPos[i].y+60);
      c.strokeText("P"+(i+1),handPos[i].x-15,handPos[i].y+60);
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
      c.save();
      c.fillStyle = "rgba(223, 31, 31, 0.8)";
      c.beginPath();
      c.moveTo(50,300);
      c.bezierCurveTo(450,270,750,270,1150,300);
      c.bezierCurveTo(750,280,450,280,50,300);
      c.closePath();
      c.fill();
      c.beginPath();
      c.moveTo(50,370);
      c.bezierCurveTo(450,350,750,350,1150,370);
      //c.bezierCurveTo(750,360,450,360,50,370);
      c.bezierCurveTo(750,360,900,365,900,365);
      c.bezierCurveTo(850,365,830,380,800,380);
      c.lineTo(400,380);
      c.bezierCurveTo(370,380,350,365,300,365);
      c.bezierCurveTo(300,360,450,370,0,370);
      c.closePath();
      c.fill();
      c.fillStyle="rgba(0,0,0,0.5)";
      c.beginPath();
      c.moveTo(50,300);
      c.bezierCurveTo(450,280,750,280,1150,300);
      c.arc(1150,335,35,Math.PI*1.5,Math.PI*0.5,true);
      //c.lineTo(1150,370);
      c.bezierCurveTo(750,350,450,350,50,370);
      c.arc(50,335,35,Math.PI*0.5,Math.PI*1.5,true);
      c.closePath();
      c.fill();
      c.scale(1.4,1);
      rtfFlash+=0.5*rtfFlashD;
      if (rtfFlash < 25){
        rtfFlashD = 1;
      }
      if (rtfFlash > 50){
        rtfFlashD = -1;
      }
      c.fillStyle = "hsl(52, 85%, "+rtfFlash+"%)";
      c.font = "italic 600 65px Arial";
      c.rotate(-0.03);
      c.fillText("READY",120,353);
      c.rotate(0.03);
      c.fillText("TO",390,342);
      c.rotate(0.03);
      c.fillText("FIGHT",520,329);
      c.rotate(-0.03);
      c.fillStyle = "rgb(193, 193, 193)";
      c.font = "900 15px Arial";
      c.scale(2.3/1.4,1);
      c.fillText("PRESS START",205,373);
      c.restore();
    }

    if (choosingTag > -1){
      c.fillStyle = "rgba(0,0,0,0.8)";
      c.fillRect(0,0,canvas.width,canvas.height);
      c.fillStyle = "white";
      c.textAlign = "center";
      //c.fillText(text,250+i*225,650);
      c.fillText("Type tag now",250+choosingTag*225,570);
      c.fillText("Press A to finish",250+choosingTag*225,600);
      c.textAlign = "start";
    }
}
