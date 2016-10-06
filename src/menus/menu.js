menuSelected = 0;
menuText = ["VS. Melee","Target Test","Target Builder"];
menuExplanation = ["Multiplayer Battles!","Smash ten targets!","Build target test stages!"];

menuColours = [238,358,117];
menuCurColour = 238;

menuCycle = 0;
menuTimer = 0;

menuGlobalTimer = 0;

stickHold = 0;
stickHoldEach = [];
function menuMove(i){
  var menuMove = false;
  var previousMenuS = menuSelected;
  if (player[i].inputs.a[0] && !player[i].inputs.a[1]){
    sounds.menuForward.play();
    if (menuSelected == 0){
      gameMode = 2;
      positionPlayersInCSS();
    }
    else if (menuSelected == 1){
      targetPlayer = i;
      targetPointerPos = [178.5,137];
      player[i].inputs.a[1] = true;
      gameMode = 7;
    }
    else if (menuSelected == 2){
      editingStage = -1;
      targetBuilder = i;
      player[i].inputs.a[1] = true;
      gameMode = 4;
    }
  }
  else if (player[i].inputs.b[0]){

  }
  else if (player[i].inputs.lStickAxis[0].y > 0.7){
    stickHoldEach[i] = true;
    if (stickHold == 0){
      menuSelected--;
      menuMove = true;
      stickHold++;
    }
    else {
      stickHold++;
      if (stickHold % 10 == 0){
        menuSelected--;
        menuMove = true;
      }
    }
  }
  else if (player[i].inputs.lStickAxis[0].y < -0.7){
    stickHoldEach[i] = true;
    if (stickHold == 0){
      menuSelected++;
      menuMove = true;
      stickHold++;
    }
    else {
      stickHold++;
      if (stickHold % 10 == 0){
        menuSelected++;
        menuMove = true;
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
    menuCycle = 0;
    menuTimer = 0;
    sounds.menuSelect.play();
    if (menuSelected == -1){
      menuSelected = 2;
    }
    if (menuSelected == 3){
      menuSelected = 0;
    }
    if (previousMenuS + menuSelected == 3){
      if (menuSelected == 1){
        menuColours[menuSelected] = 0;
      }
      else {
        menuCurColour = 0;
      }
    }
    else if (previousMenuS == 1){
      menuCurColour = 358;
      menuColours[1] = 358;
    }
    menuColourOffset = menuColours[menuSelected] - menuCurColour;
  }
}

menuColourOffset = 0;
menuAngle = 0;
menuRandomBox = [Math.random(),Math.random(),Math.random(),Math.random()];

function drawMainMenu(){
  menuGlobalTimer++;
  if (menuGlobalTimer > 600){
    menuGlobalTimer = 0;
  }
  var bgGrad =c.createLinearGradient(0,0,1200,750);
  bgGrad.addColorStop(0,"rgba(12, 11, 54, 1)");
  bgGrad.addColorStop(1,"rgba(1, 2, 15, 1)");
  c.fillStyle=bgGrad;
  c.fillRect(0,0,canvas.width,canvas.height);

  c.save();
  c.fillStyle = "rgba(18, 16, 85, 0.4)";
  c.translate(400,400);
  c.rotate(0.7);
  c.fillRect(-150,800-menuGlobalTimer*10,40,70);
  c.fillRect(-350,1200-menuGlobalTimer*9,30,170);
  c.fillRect(-320,1900-menuGlobalTimer*10,40,120);
  c.fillRect(-420,1000-menuGlobalTimer*5,90,210);
  c.fillRect(-100,1600-menuGlobalTimer*6,95,200);
  c.fillRect(-80,2100-menuGlobalTimer*6,65,260);
  c.fillRect(-170,2200-menuGlobalTimer*8,65,80);
  c.fillRect(-400,2700-menuGlobalTimer*10,30,130);
  c.fillRect(-300,3000-menuGlobalTimer*7,40,90);
  c.fillRect(-50,4400-menuGlobalTimer*10,80,90);
  c.fillRect(-220,4500-menuGlobalTimer*9,50,180);
  c.fillRect(-500,4900-menuGlobalTimer*10,20,220);
  c.fillRect(-480,5100-menuGlobalTimer*15,50,80);
  c.fillRect(-300,5500-menuGlobalTimer*10,30,90);
  c.fillRect(-50,5900-menuGlobalTimer*12,40,110);

  if (menuGlobalTimer % 130 == 0){
    menuRandomBox = [Math.random(),Math.random(),Math.random(),Math.random()];
  }
  if (menuGlobalTimer % 130 < 50){
    c.fillStyle = "rgba(118, 113, 255,"+Math.max(0.5-(menuGlobalTimer%130)*0.01,0)+")"
    c.fillRect(menuRandomBox[0]*-450,menuRandomBox[1]*800-400,menuRandomBox[2]*50+30,menuRandomBox[3]*60+30);
  }
  c.restore();
  c.lineWidth = 5;
  c.strokeStyle = "rgb(0, 0, 0)";
  for (var i=0;i<60;i++){
    c.beginPath();
    c.moveTo(0,900-(i*15));
    c.lineTo(1200,750-(i*15));
    c.stroke();
  }
  c.strokeStyle = "rgba(3, 31, 219,0.5)";
  c.fillStyle = "hsla("+menuCurColour+",100%,50%,0.5)";
  c.save();
  c.translate(800,400);
  c.rotate(0.7);
  menuAngle += 0.015;
  if (menuAngle >= twoPi){
    menuAngle = 0;
  }
  c.beginPath();
  c.arc(400*Math.cos(menuAngle)*0.4,400*Math.sin(menuAngle),15,0,twoPi);
  c.closePath();
  c.fill();
  c.scale(0.4,1);
  c.beginPath();
  c.arc(0,0,400,0,twoPi);
  c.closePath();
  c.stroke();
  c.restore();
  c.save();
  c.translate(800,400);
  c.rotate(0.8);
  c.scale(0.4,1);
  c.beginPath();
  c.arc(0,0,400,0,twoPi);
  c.closePath();
  c.stroke();
  c.restore();

  c.lineWidth = 3;
  c.strokeStyle = "rgba(255,255,255,0.13)";
  c.beginPath();
  for (var i=0;i<60;i++){
  //  c.beginPath();
    c.moveTo(0+(i*30),0);
    c.lineTo(0+(i*30),750);
    //c.stroke();
    //c.beginPath();
    c.moveTo(0,0+(i*30));
    c.lineTo(1200,0+(i*30));
    //c.stroke();
  }
  c.stroke();
  if (menuCurColour != menuColours[menuSelected]){
    menuCurColour += menuColourOffset*0.05;
    if (menuTimer == 19){
      menuCurColour = Math.round(menuCurColour);
    }
  }
  c.fillStyle = "hsla("+menuCurColour+", 60%, 41%,0.75)";
  c.strokeStyle = "hsl("+menuCurColour+", 60%, 41%)";
  c.beginPath();
  c.moveTo(300,620);
  c.lineTo(180,620);
  c.bezierCurveTo(130,620,130,620,130,570);
  c.lineTo(130,200);
  c.bezierCurveTo(130,150,130,150,180,150);
  c.lineTo(550,150);
  c.lineTo(600,80);
  c.lineTo(1020,80);
  c.bezierCurveTo(1070,80,1070,80,1070,130);
  c.lineTo(1070,570);
  c.bezierCurveTo(1070,620,1070,620,1020,620);
  c.lineTo(900,620);
  c.lineTo(900,680);
  c.lineTo(1050,680);
  c.bezierCurveTo(1100,680,1100,680,1100,630);
  c.lineTo(1100,110);
  c.bezierCurveTo(1100,60,1100,60,1050,60);
  c.lineTo(590,60);
  c.lineTo(540,130);
  c.lineTo(150,130);
  c.bezierCurveTo(100,130,100,130,100,180);
  c.lineTo(100,630);
  c.bezierCurveTo(100,680,100,680,150,680);
  c.lineTo(300,680);
  c.closePath();
  c.fill();
  c.stroke();
  c.beginPath();
  c.moveTo(590,60);
  c.lineTo(570,60);
  c.lineTo(520,130);
  c.lineTo(540,130);
  c.closePath();
  c.fill();
  c.stroke();
  c.beginPath();
  c.moveTo(570,60);
  c.lineTo(550,60);
  c.lineTo(500,130);
  c.lineTo(520,130);
  c.closePath();
  c.fill();
  c.stroke();
  c.beginPath();
  c.moveTo(550,60);
  c.lineTo(530,60);
  c.lineTo(480,130);
  c.lineTo(500,130);
  c.closePath();
  c.fill();
  c.stroke();
  c.fillStyle = "rgba(0,0,0,0.7)";
  c.strokeStyle = "white";
  c.beginPath();
  c.moveTo(330,610);
  c.lineTo(870,610);
  c.bezierCurveTo(890,610,890,610,890,630);
  c.lineTo(890,670);
  c.bezierCurveTo(890,690,890,690,870,690);
  c.lineTo(330,690);
  c.bezierCurveTo(310,690,310,690,310,670);
  c.lineTo(310,630);
  c.bezierCurveTo(310,610,310,610,330,610);
  c.closePath();
  c.fill();
  c.stroke();
  c.save();
  c.textAlign = "center";
  c.fillStyle = "rgba(255, 255, 255, 0.8)";
  c.font = "700 35px Arial";
  c.fillText(menuExplanation[menuSelected],600,660);
  c.fillStyle = "rgba(255, 255, 255, 0.5)";
  c.font = "italic 900 48px Arial";
  c.fillText("Main Menu",300,120);

  c.fillStyle = "rgba(0, 0, 0, 0.76)";
  c.lineWidth = 5;
  c.strokeStyle = "rgba(255, 214, 0, 0.95)";
  for (var i=0;i<3;i++){
    c.beginPath();
    c.moveTo(410-i*80,250+i*100);
    c.lineTo(960-i*80,250+i*100);
    c.arc(960-i*80,285+i*100,35,Math.PI*1.5,Math.PI*0.5);
    c.lineTo(960-i*80,312+i*100);
    c.arc(960-i*80,285+i*100,20,Math.PI*0.5,Math.PI*1.5,true);
    c.lineTo(960-i*80,275+i*100);
    c.arc(960-i*80,285+i*100,10,Math.PI*1.5,Math.PI*0.5);
    c.lineTo(960-i*80,320+i*100);
    c.lineTo(405-i*80,320+i*100);
    c.lineTo(395-i*80,300+i*100);
    c.closePath();
    c.fill();
    c.stroke();
  }
  c.fillStyle = "rgb(254, 238, 27)";
  for (var i=0;i<3;i++){
    var x = 1000;
    if (menuSelected == i){
      x = 0;
    }
    c.beginPath();
    c.moveTo(410-i*80+x,250+i*100);
    c.lineTo(960-i*80+x,250+i*100);
    c.arc(960-i*80+x,285+i*100,35,Math.PI*1.5,Math.PI*0.5);
    c.lineTo(960-i*80+x,312+i*100);
    c.arc(960-i*80+x,285+i*100,20,Math.PI*0.5,Math.PI*1.5,true);
    c.lineTo(960-i*80+x,275+i*100);
    c.arc(960-i*80+x,285+i*100,10,Math.PI*1.5,Math.PI*0.5);
    c.lineTo(960-i*80+x,320+i*100);
    c.lineTo(405-i*80+x,320+i*100);
    c.lineTo(395-i*80+x,300+i*100);
    c.closePath();
    c.fill();
    c.stroke();
    if (menuSelected == i){
      c.save();
      c.fillStyle = "black";
      c.textAlign = "center";
      c.fillText(menuText[i],670-i*80,300+i*100);
      c.globalAlpha = 0.7;
      c.strokeStyle = "rgb(255, 247, 144)";
      c.lineWidth = 8;
      c.beginPath();
      c.arc(960-i*80,285+i*100,35,0,twoPi);
      c.closePath();
      c.stroke();
      c.lineWidth = 15;
      c.beginPath();
      c.arc(960-i*80,285+i*100,13,0,twoPi);
      c.closePath();
      c.stroke();
      menuTimer++;
      if (menuTimer > 60){
        menuTimer = 0;
        menuCycle = 1-menuCycle;
      }
      c.fillStyle = "rgb(255, 247, 144)";
      c.globalAlpha = Math.abs(1-menuTimer*0.033);
      c.beginPath();
      c.arc(960-i*80,285+i*100,25,0,twoPi);
      c.closePath();
      c.fill();
      c.lineWidth = 3;
      c.globalAlpha = 0.5;
      c.beginPath();
      c.arc(960-i*80,285+i*100,Math.max(13,100-menuTimer*2),0,twoPi);
      c.closePath();
      c.stroke();
      if (menuCycle == 1 && menuTimer > 10){
        c.beginPath();
        c.arc(960-i*80,285+i*100,Math.max(13,130-menuTimer*2),0,twoPi);
        c.closePath();
        c.stroke();
      }
      c.restore();
      c.fillStyle = "rgb(254, 238, 27)";

    }
    else {
      c.fillText(menuText[i],670-i*80,300+i*100);
    }
  }
  c.restore();
}
