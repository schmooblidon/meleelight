function getKeyboardCookie(){
  var keys = Object.keys(keymapItems);
  for (var i=0;i<keys.length;i++){
    var keymapData = getCookie(keys[i]);
    if (keymapData != undefined && keymapData != null){
      if (keymapItems[keys[i]].type == 1){
        // if modifier
        var modVal = keymapData.split("-");
        keymapItems[keys[i]].binding[keymapItems[keys[i]].index][0] = parseInt(modVal[0]);
        keymapItems[keys[i]].binding[keymapItems[keys[i]].index][1] = parseFloat(modVal[1]);
        keymapItems[keys[i]].binding[keymapItems[keys[i]].index][2] = parseFloat(modVal[2]);
      }
      else if (keymapItems[keys[i]].type == 2){
        // if range
        keymapItems[keys[i]].binding[keymapItems[keys[i]].index] = parseFloat(getCookie(keys[i]));
      }
      else {
        // if button
        keymapItems[keys[i]].binding[keymapItems[keys[i]].index] = parseInt(getCookie(keys[i]));
      }
    }
  }
}

function setKeyboardCookie(){
  var keys = Object.keys(keymapItems);
  for (var i=0;i<keys.length;i++){
    if (keymapItems[keys[i]].type == 1){
      var modVal = keymapItems[keys[i]].binding[keymapItems[keys[i]].index];
      setCookie(keys[i],""+modVal[0]+"-"+modVal[1]+"-"+modVal[2],36500);
    }
    else {
      setCookie(keys[i],keymapItems[keys[i]].binding[keymapItems[keys[i]].index],36500);
    }
  }
  console.log(document.cookie);
  console.log(localStorage);
}

function keymapItem(type,pos,value,binding,index,above,toRight,below,toLeft,modType){
  this.type = type;
  // 0 = keys, 1 = modifier
  this.pos = pos;
  this.value = value;
  this.binding = binding;
  this.index = index;
  this.above = above;
  this.toRight = toRight;
  this.below = below;
  this.toLeft = toLeft;
  this.modType = modType || 0;
}
keymapItems = {
  "lstickUp1" : new keymapItem(0,new Vec2D(150,120),87,keyMap.lstick.up,0,"shoulderMod3","lstickUp2","lstickRight1","cstickUp2"),
  "lstickUp2" : new keymapItem(0,new Vec2D(230,120),0,keyMap.lstick.up,1,"shoulderMod5","lstickRangeUp","lstickRight2","lstickUp1"),
  "lstickRight1" : new keymapItem(0,new Vec2D(150,190),68,keyMap.lstick.right,0,"lstickUp1","lstickRight2","lstickLeft1","cstickRight2"),
  "lstickRight2" : new keymapItem(0,new Vec2D(230,190),0,keyMap.lstick.right,1,"lstickUp2","lstickRangeRight","lstickLeft2","lstickRight1"),
  "lstickLeft1" : new keymapItem(0,new Vec2D(150,260),65,keyMap.lstick.left,0,"lstickRight1","lstickLeft2","lstickDown1","cstickLeft2"),
  "lstickLeft2" : new keymapItem(0,new Vec2D(230,260),0,keyMap.lstick.left,1,"lstickRight2","lstickRangeLeft","lstickDown2","lstickLeft1"),
  "lstickDown1" : new keymapItem(0,new Vec2D(150,330),83,keyMap.lstick.down,0,"lstickLeft1","lstickDown2","lstickMod3","cstickDown2"),
  "lstickDown2" : new keymapItem(0,new Vec2D(230,330),0,keyMap.lstick.down,1,"lstickLeft2","lstickRangeDown","lstickMod5","lstickDown1"),
  "lstickRangeUp" : new keymapItem(2,new Vec2D(310,120),1.00,keyMap.lstick.ranges,0,"shoulderMod5","a1","lstickRangeRight","lstickUp2"),
  "lstickRangeRight" : new keymapItem(2,new Vec2D(310,190),1.00,keyMap.lstick.ranges,1,"lstickRangeUp","b1","lstickRangeLeft","lstickRight2"),
  "lstickRangeLeft" : new keymapItem(2,new Vec2D(310,260),1.00,keyMap.lstick.ranges,2,"lstickRangeRight","x1","lstickRangeDown","lstickLeft2"),
  "lstickRangeDown" : new keymapItem(2,new Vec2D(310,330),1.00,keyMap.lstick.ranges,3,"lstickRangeLeft","y1","lstickMod5","lstickDown2"),
  "lstickMod1" : new keymapItem(1,new Vec2D(100,430),32,keyMap.lstick.modifiers,0,"lstickDown1","lstickMod2","lAnalog1","cstickDown2",0),
  "lstickMod2" : new keymapItem(1,new Vec2D(150,430),0,keyMap.lstick.modifiers,1,"lstickDown1","lstickMod3","lAnalog1","lstickMod1",0),
  "lstickMod3" : new keymapItem(1,new Vec2D(200,430),0,keyMap.lstick.modifiers,2,"lstickDown1","lstickMod4","lAnalog1","lstickMod2",0),
  "lstickMod4" : new keymapItem(1,new Vec2D(250,430),0,keyMap.lstick.modifiers,3,"lstickDown2","lstickMod5","lAnalog2","lstickMod3",0),
  "lstickMod5" : new keymapItem(1,new Vec2D(300,430),0,keyMap.lstick.modifiers,4,"lstickRangeDown","y1","shoulderRangeL","lstickMod4",0),
  "lAnalog1" : new keymapItem(0,new Vec2D(150,520),111,keyMap.shoulders.lAnalog,0,"lstickMod3","lAnalog2","rAnalog1","dpadRight"),
  "lAnalog2" : new keymapItem(0,new Vec2D(230,520),0,keyMap.shoulders.lAnalog,1,"lstickMod5","shoulderRangeL","rAnalog2","lAnalog1"),
  "rAnalog1" : new keymapItem(0,new Vec2D(150,590),106,keyMap.shoulders.rAnalog,0,"lAnalog1","rAnalog2","shoulderMod3","dpadLeft"),
  "rAnalog2" : new keymapItem(0,new Vec2D(230,590),0,keyMap.shoulders.rAnalog,1,"lAnalog2","shoulderRangeR","shoulderMod5","rAnalog1"),
  "shoulderRangeL" : new keymapItem(2,new Vec2D(310,520),1.00,keyMap.shoulders.ranges,0,"lstickMod5","l1","shoulderRangeR","lAnalog2"),
  "shoulderRangeR" : new keymapItem(2,new Vec2D(310,590),1.00,keyMap.shoulders.ranges,1,"shoulderRangeL","r1","shoulderMod5","rAnalog2"),
  "shoulderMod1" : new keymapItem(1,new Vec2D(100,690),0,keyMap.shoulders.modifiers,0,"rAnalog1","shoulderMod2","lstickUp1","dpadDown",1),
  "shoulderMod2" : new keymapItem(1,new Vec2D(150,690),0,keyMap.shoulders.modifiers,1,"rAnalog1","shoulderMod3","lstickUp1","shoulderMod1",1),
  "shoulderMod3" : new keymapItem(1,new Vec2D(200,690),0,keyMap.shoulders.modifiers,2,"rAnalog2","shoulderMod4","lstickUp2","shoulderMod2",1),
  "shoulderMod4" : new keymapItem(1,new Vec2D(250,690),0,keyMap.shoulders.modifiers,3,"rAnalog2","shoulderMod5","lstickUp2","shoulderMod3",1),
  "shoulderMod5" : new keymapItem(1,new Vec2D(300,690),0,keyMap.shoulders.modifiers,4,"shoulderRangeR","s1","lstickUp2","shoulderMod4",1),
  "a1" : new keymapItem(0,new Vec2D(550,145),76,keyMap.a,0,"s1","a2","b1","lstickRangeRight"),
  "a2" : new keymapItem(0,new Vec2D(630,145),101,keyMap.a,1,"s2","cstickRight1","b2","a1"),
  "b1" : new keymapItem(0,new Vec2D(550,215),75,keyMap.b,0,"a1","b2","x1","lstickRangeLeft"),
  "b2" : new keymapItem(0,new Vec2D(630,215),100,keyMap.b,1,"a2","cstickLeft1","x2","b1"),
  "x1" : new keymapItem(0,new Vec2D(550,285),186,keyMap.x,0,"b1","x2","y1","lstickRangeDown"),
  "x2" : new keymapItem(0,new Vec2D(630,285),102,keyMap.x,1,"b2","cstickDown1","y2","x1"),
  "y1" : new keymapItem(0,new Vec2D(550,355),79,keyMap.y,0,"x1","y2","z1","lstickMod5"),
  "y2" : new keymapItem(0,new Vec2D(630,355),104,keyMap.y,1,"x2","cstickDown1","z2","y1"),
  "z1" : new keymapItem(0,new Vec2D(550,425),192,keyMap.z,0,"y1","z2","l1","lstickMod5"),
  "z2" : new keymapItem(0,new Vec2D(630,425),107,keyMap.z,1,"y2","dpadUp","l2","z1"),
  "l1" : new keymapItem(0,new Vec2D(550,495),73,keyMap.l,0,"z1","l2","r1","shoulderRangeL"),
  "l2" : new keymapItem(0,new Vec2D(630,495),103,keyMap.l,1,"z2","dpadRight","r2","l1"),
  "r1" : new keymapItem(0,new Vec2D(550,565),80,keyMap.r,0,"l1","r2","s1","shoulderRangeR"),
  "r2" : new keymapItem(0,new Vec2D(630,565),105,keyMap.r,1,"l2","dpadLeft","s2","r1"),
  "s1" : new keymapItem(0,new Vec2D(550,635),219,keyMap.s,0,"r1","s2","a1","shoulderMod5"),
  "s2" : new keymapItem(0,new Vec2D(630,635),109,keyMap.s,1,"r2","dpadDown","a2","s1"),
  "cstickUp1" : new keymapItem(0,new Vec2D(950,120),38,keyMap.cstick.up,0,"dpadDown","cstickUp2","cstickRight1","a2"),
  "cstickUp2" : new keymapItem(0,new Vec2D(1030,120),0,keyMap.cstick.up,1,"dpadDown","lstickUp1","cstickRight2","cstickUp1"),
  "cstickRight1" : new keymapItem(0,new Vec2D(950,190),39,keyMap.cstick.right,0,"cstickUp1","cstickRight2","cstickLeft1","b2"),
  "cstickRight2" : new keymapItem(0,new Vec2D(1030,190),0,keyMap.cstick.right,1,"cstickUp2","lstickRight1","cstickLeft2","cstickRight1"),
  "cstickLeft1" : new keymapItem(0,new Vec2D(950,260),37,keyMap.cstick.left,0,"cstickRight1","cstickLeft2","cstickDown1","x2"),
  "cstickLeft2" : new keymapItem(0,new Vec2D(1030,260),0,keyMap.cstick.left,1,"cstickRight2","lstickLeft1","cstickDown2","cstickLeft1"),
  "cstickDown1" : new keymapItem(0,new Vec2D(950,330),40,keyMap.cstick.down,0,"cstickLeft1","cstickDown2","dpadUp","y2"),
  "cstickDown2" : new keymapItem(0,new Vec2D(1030,330),0,keyMap.cstick.down,1,"cstickLeft2","lstickDown1","dpadUp","cstickDown1"),
  "dpadUp" : new keymapItem(0,new Vec2D(950,440),71,keyMap.du,0,"cstickDown1","lAnalog1","dpadRight","z2"),
  "dpadRight" : new keymapItem(0,new Vec2D(950,510),78,keyMap.dr,0,"dpadUp","lAnalog1","dpadLeft","l2"),
  "dpadLeft" : new keymapItem(0,new Vec2D(950,580),86,keyMap.dl,0,"dpadRight","rAnalog1","dpadDown","r2"),
  "dpadDown" : new keymapItem(0,new Vec2D(950,650),66,keyMap.dd,0,"dpadLeft","shoulderMod1","cstickUp1","s2")
}

kMenuSelected = "lstickUp1";
kMenuKeyFlash = 0;
keyListen = false;
settingModifier = false;
settingModifierPart = 0;
settingRange = false;
enterHeld = false;
enterHeldTimer = 0;
menuScrollSpeed = 10;
keyboardPromptTimer = 0;
keyboardPrompt = "";
disableStick = [false,false,false,false];
function keyboardMenuControls(i){
  var menuMove = false;
  var moveD = "";
  if (player[i].inputs.lStickAxis[0].x == 0 && player[i].inputs.lStickAxis[0].y == 0){
    disableStick[i] = false;
  }
  if (keyboardPromptTimer > 0){
    keyboardPromptTimer--;
  }
  kMenuKeyFlash++;
  if (kMenuKeyFlash > 120){
    kMenuKeyFlash = 0;
  }
  if (settingModifier){
    if (enterHeldTimer > 60){
      enterHeldTimer = 0;
      settingModifier = false;
      settingModifierPart = 0;
      keymapItems[kMenuSelected].value = 0;
      keymapItems[kMenuSelected].binding[keymapItems[kMenuSelected].index][0] = 0;
      keymapItems[kMenuSelected].binding[keymapItems[kMenuSelected].index][1] = 0.5;
      keymapItems[kMenuSelected].binding[keymapItems[kMenuSelected].index][2] = 0.5;
      sounds.menuBack.play();
      menuScrollSpeed = 10;
      keyListen = false;
    }
  }
  else {
    if (enterHeldTimer > 60){
      if (keymapItems[kMenuSelected].type == 1){
        // mod
        keymapItems[kMenuSelected].value = 0;
        keymapItems[kMenuSelected].binding[keymapItems[kMenuSelected].index][0] = 0;
        sounds.menuBack.play();
      }
      else if (keymapItems[kMenuSelected].type == 2){
        sounds.deny.play();
      }
      else {
        // button
        switch (kMenuSelected){
          case "lstickUp1":
          case "lstickDown1":
          case "lstickLeft1":
          case "lstickRight1":
          case "a1":
          case "b1":
          case "x1":
          case "y1":
          case "z1":
          case "l1":
          case "r1":
          case "s1":
            sounds.deny.play();
            keyboardPromptTimer = 100;
            keyboardPrompt = "Cannot clear";
            break;
          default:
            keymapItems[kMenuSelected].value = 0;
            keymapItems[kMenuSelected].binding[keymapItems[kMenuSelected].index] = 0;
            sounds.menuBack.play();
            break;
        }
      }
      enterHeldTimer = 0;
      keyListen = false;
    }
  }
  if (keyListen){
    if (keyBinding){
      if (keymapItems[kMenuSelected].type){
        // modifier
        sounds.menuForward.play();
        keymapItems[kMenuSelected].value = keyBind;
        keymapItems[kMenuSelected].binding[keymapItems[kMenuSelected].index][0] = keyBind;
        settingModifierPart++;
      }
      else {
        //key
        if (keyBind == 13){
          switch (kMenuSelected){
            case "lstickUp1":
            case "lstickUp2":
            case "lstickDown1":
            case "lstickDown2":
            case "lstickLeft1":
            case "lstickLeft2":
            case "lstickRight1":
            case "lstickRight2":
            case "b1":
            case "b2":
            case "a1":
            case "a2":
              sounds.deny.play();
              keyboardPromptTimer = 120;
              keyboardPrompt = "Not a good idea";
              break;
            default:
              sounds.menuForward.play();
              keymapItems[kMenuSelected].value = keyBind;
              keymapItems[kMenuSelected].binding[keymapItems[kMenuSelected].index] = keyBind;
              break;
          }
        }
        else {
          sounds.menuForward.play();
          keymapItems[kMenuSelected].value = keyBind;
          keymapItems[kMenuSelected].binding[keymapItems[kMenuSelected].index] = keyBind;
        }
      }
      player[i].inputs.b[0] = true;
      player[i].inputs.b[1] = true;
      disableStick[i] = true;
      keyListen = false;
    }
  }
  else {
    keyBinding = false;
    if (keys[13] && !keyListen && !enterHeld){
      if (settingModifierPart > 0){
        settingModifierPart++;
        if (settingModifierPart > 2){
          settingModifierPart = 0;
          settingModifier = false;
          menuScrollSpeed = 10;
        }
      }
      else if (settingRange){
        settingRange = false;
        menuScrollSpeed = 10;
      }
      else {
        if (keymapItems[kMenuSelected].type == 2){
          settingRange = true;
          menuScrollSpeed = 5;
        }
        else {
          if (keymapItems[kMenuSelected].type == 1){
            settingModifier = true;
            menuScrollSpeed = 5;
          }
          keyListen = true;
        }
      }
      sounds.menuForward.play();
    }
    else if (player[i].inputs.b[0] && !player[i].inputs.b[1]){
      if (!settingModifier && !settingRange){
        sounds.menuBack.play();
        player[i].inputs.b[1] = true;
        gameMode = 1;
        setKeyboardCookie();
      }
    }
    else if (player[i].inputs.lStickAxis[0].y > 0.7 && !disableStick[i]){
      stickHoldEach[i] = true;
      if (stickHold == 0){
        moveD = "u";
        menuMove = true;
        stickHold++;
      }
      else {
        stickHold++;
        if (stickHold % menuScrollSpeed == 0){
          moveD = "u";
          menuMove = true;
        }
      }
    }
    else if (player[i].inputs.lStickAxis[0].y < -0.7 && !disableStick[i]){
      stickHoldEach[i] = true;
      if (stickHold == 0){
        moveD = "d";
        menuMove = true;
        stickHold++;
      }
      else {
        stickHold++;
        if (stickHold % menuScrollSpeed == 0){
          moveD = "d";
          menuMove = true;
        }
      }
    }
    else if (player[i].inputs.lStickAxis[0].x > 0.7 && !disableStick[i]){
      stickHoldEach[i] = true;
      if (stickHold == 0){
        moveD = "r";
        menuMove = true;
        stickHold++;
      }
      else {
        stickHold++;
        if (stickHold % menuScrollSpeed == 0){
          moveD = "r";
          menuMove = true;
        }
      }
    }
    else if (player[i].inputs.lStickAxis[0].x < -0.7 && !disableStick[i]){
      stickHoldEach[i] = true;
      if (stickHold == 0){
        menuMove = true;
        moveD = "l";
        stickHold++;
      }
      else {
        stickHold++;
        if (stickHold % menuScrollSpeed == 0){
          moveD = "l";
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
      sounds.menuSelect.play();
      if (settingRange){
        var rangeValue = keymapItems[kMenuSelected].binding;
        var index = keymapItems[kMenuSelected].index;
        switch (moveD){
          case "l":
            rangeValue[index] -= 0.01;
            if (rangeValue[index] < 0){
              rangeValue[index] = 0;
            }
            break;
          case "r":
            rangeValue[index] += 0.01;
            if (rangeValue[index] > 2){
              rangeValue[index] = 2;
            }
            break;
          default:
            break;
        }
      }
      else if (settingModifier){
        var modifierValue = keymapItems[kMenuSelected].binding[keymapItems[kMenuSelected].index];
        switch (moveD){
          case "l":
            modifierValue[settingModifierPart] -= 0.01;
            if (modifierValue[settingModifierPart] < 0){
              modifierValue[settingModifierPart] = 0;
            }
            break;
          case "r":
            modifierValue[settingModifierPart] += 0.01;
            if (modifierValue[settingModifierPart] > 2){
              modifierValue[settingModifierPart] = 2;
            }
            break;
          default:
            break;
        }
      }
      else {
        kMenuKeyFlash = 0;
        switch (moveD){
          case "u":
            kMenuSelected = keymapItems[kMenuSelected].above;
            break;
          case "d":
            kMenuSelected = keymapItems[kMenuSelected].below;
            break;
          case "l":
            kMenuSelected = keymapItems[kMenuSelected].toLeft;
            break;
          case "r":
            kMenuSelected = keymapItems[kMenuSelected].toRight;
            break;
          default:
            break;
        }
      }
    }
  }
  if (keys[13]){
    enterHeld = true;
    enterHeldTimer++;
  }
  else {
    enterHeld = false;
    enterHeldTimer = 0;
  }
}

function drawKeyboardMenu(){
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
  c.textAlign = "center";
  c.fillStyle = "rgba(255, 255, 255, 0.65)";
  c.font = "italic 900 60px Arial";
  c.fillText("Keyboard Controls",600,75);
  c.font = "italic 900 30px Arial";
  c.fillText("L-stick",150,100);
  c.fillText("Shoulder Analog",200,495);
  c.fillText("C-stick",950,100);
  c.fillText("Dpad",950,420);
  var buttonLetters = ["A","B","X","Y","Z","L","R","S"];
  for (var i=0;i<buttonLetters.length;i++){
    c.fillText(buttonLetters[i],510,186+i*70);
  }
  c.fillText("L",95,556);
  c.fillText("R",95,626);
  c.font = "italic 900 16px Arial";
  c.fillText("Press Enter to listen for key bind    Hold Enter to clear",600,115);
  c.font = "italic 900 20px Arial";
  c.fillText("Modifiers",200,405);
  c.fillText("Modifiers",200,665);
  c.textAlign = "left";
  var directionPlacements = [new Vec2D(75,153),new Vec2D(875,153),new Vec2D(875,475)];
  for (var i=0;i<3;i++){
    c.fillText("Up",directionPlacements[i].x,directionPlacements[i].y);
    c.fillText("Right",directionPlacements[i].x,directionPlacements[i].y+70);
    c.fillText("Left",directionPlacements[i].x,directionPlacements[i].y+140);
    c.fillText("Down",directionPlacements[i].x,directionPlacements[i].y+210);
  }
  c.textAlign = "center";
  var keys = Object.keys(keymapItems);
  for (var i=0;i<keys.length;i++){
    if (keymapItems[keys[i]].type == 1){
      if (keys[i] == kMenuSelected){
        c.fillStyle = "black";
        c.fillRect(keymapItems[keys[i]].pos.x-80,keymapItems[keys[i]].pos.y+20,160,40);
        c.fillStyle = "white";
        var text = keyText[keymapItems[keys[i]].binding[keymapItems[keys[i]].index][0]];
        c.font = "italic 900 "+Math.round(Math.max(8,23-(2*text.length)))+"px Arial";
        if (keymapItems[keys[i]].binding[keymapItems[keys[i]].index][0] == 0){
          c.fillText("empty",keymapItems[keys[i]].pos.x,keymapItems[keys[i]].pos.y+45);
        }
        else {
          var modText = (keymapItems[kMenuSelected].modType) ? ["L","R"] : ["X","Y"];
          c.fillText(text+" "+modText[0]+":"+(keymapItems[keys[i]].binding[keymapItems[keys[i]].index][1]).toFixed(2)+" "+modText[1]+":"+(keymapItems[keys[i]].binding[keymapItems[keys[i]].index][2]).toFixed(2),keymapItems[keys[i]].pos.x,keymapItems[keys[i]].pos.y+45);
        }
        c.fillStyle = "rgba(200,200,200, "+Math.abs(1-kMenuKeyFlash/60)+")";
        c.strokeStyle = "rgba(255, 255, 255, 0.9)";
      }
      else if (keymapItems[keys[i]].binding[keymapItems[keys[i]].index][0] == 0){
        c.fillStyle = "rgba(0, 0, 0, 0.5)";
        c.strokeStyle = "rgba(255, 255, 255, 0.2)";
      }
      else {
        c.fillStyle = "rgb(0, 0, 0)";
        c.strokeStyle = "rgba(255, 255, 255, 0.8)";
      }
      c.beginPath();
      c.arc(keymapItems[keys[i]].pos.x,keymapItems[keys[i]].pos.y,15,0,twoPi);
      c.closePath();
      c.fill();
      c.stroke();
    }
    else if (keymapItems[keys[i]].type == 2){
      if (keys[i] == kMenuSelected){
        c.fillStyle = "rgba(200,200,200, "+Math.abs(1-kMenuKeyFlash/60)+")";
        c.strokeStyle = "rgba(255, 255, 255, 0.9)";
      }
      else {
        c.fillStyle = "rgba(0, 0, 0, 0.65)";
        c.strokeStyle = "rgba(255, 255, 255, 0.6)";
      }
      var x = keymapItems[keys[i]].pos.x;
      var y = keymapItems[keys[i]].pos.y;
      c.beginPath();
      c.moveTo(x+15,y+10);
      c.lineTo(x+65,y+10);
      c.arc(x+65,y+25,15,1.5*Math.PI,0.5*Math.PI);
      c.lineTo(x+15,y+40);
      c.arc(x+15,y+25,15,0.5*Math.PI,1.5*Math.PI);
      c.closePath();
      c.fill();
      c.stroke();
      c.strokeStyle = "black";
      c.fillStyle = "white";
      c.font = "italic 900 20px Arial";
      c.strokeText((keymapItems[keys[i]].binding[keymapItems[keys[i]].index]).toFixed(2),x+37,y+32);
      c.fillText((keymapItems[keys[i]].binding[keymapItems[keys[i]].index]).toFixed(2),x+37,y+32);
      if (settingRange && keys[i] == kMenuSelected){
        c.strokeText("<",x-15,y+32);
        c.fillText("<",x-15,y+32);
        c.strokeText(">",x+90,y+32);
        c.fillText(">",x+90,y+32);
        c.strokeText("Enter to Confirm",x+37,y+60);
        c.fillText("Enter to Confirm",x+37,y+60);
      }
    }
    else {
      if (keys[i] == kMenuSelected){
        c.fillStyle = "rgba(255, 255, 255, "+Math.abs(1-kMenuKeyFlash/60)+")";
        c.strokeStyle = "rgba(255, 255, 255, 0.9)";
      }
      else if (keymapItems[keys[i]].binding[keymapItems[keys[i]].index] == 0){
        c.fillStyle = "rgba(31, 31, 31, 0.69)";
        c.strokeStyle = "rgba(182, 182, 182, 0.66)";
      }
      else {
        c.fillStyle = "rgba(255, 255, 255, 0.2)";
        c.strokeStyle = "rgba(255, 255, 255, 0.8)";
      }
      c.fillRect(keymapItems[keys[i]].pos.x,keymapItems[keys[i]].pos.y,50,50);
      c.strokeRect(keymapItems[keys[i]].pos.x,keymapItems[keys[i]].pos.y,50,50);
      c.fillStyle = "white";
      c.strokeStyle = "black";
      var text = keyText[keymapItems[keys[i]].binding[keymapItems[keys[i]].index]];
      c.font = "italic 900 "+Math.round(Math.max(8,25-(2*text.length)))+"px Arial";
      c.strokeText(text,keymapItems[keys[i]].pos.x+22,keymapItems[keys[i]].pos.y+32);
      c.fillText(text,keymapItems[keys[i]].pos.x+22,keymapItems[keys[i]].pos.y+32);
    }
  }
  if (settingModifier){
    c.fillStyle = "black";
    c.fillRect(400,200,400,420);
    c.font = "italic 900 40px Arial";
    c.fillStyle = "white";
    c.fillText("Setting Modifier",600,245);
    c.font = "italic 900 30px Arial";
    c.fillText("Key:",460,320);
    if (keymapItems[kMenuSelected].modType){
      c.fillText("L:",460,400);
      c.fillText("R:",460,480);
    }
    else {
      c.fillText("X:",460,400);
      c.fillText("Y:",460,480);
    }
    if (keyListen){
      c.fillText("Listening...",660,320);
    }
    else {
      c.fillText(keyText[keymapItems[kMenuSelected].binding[keymapItems[kMenuSelected].index][0]],660,320);
      c.fillText("Enter to confirm",600,560);
    }
    for (var i=0;i<2;i++){
      c.fillText("<",580,400+i*80);
      c.fillText(">",740,400+i*80);
      c.fillText((keymapItems[kMenuSelected].binding[keymapItems[kMenuSelected].index][i+1]).toFixed(2),660,400+i*80);
    }
    c.font = "italic 900 20px Arial";
    c.fillText("Hold Enter to remove settings",600,600);
    c.strokeStyle = "rgba(255, 255, 255, "+Math.abs(1-kMenuKeyFlash/60)+")";
    c.strokeRect(550,285+80*settingModifierPart,220,50);
  }
  else if (keyListen){
    c.fillStyle = "black";
    c.fillRect(keymapItems[kMenuSelected].pos.x-75,keymapItems[kMenuSelected].pos.y+55,200,45);
    c.fillStyle = "white";
    var text = keyText[keymapItems[kMenuSelected].binding[keymapItems[kMenuSelected].index]];
    c.font = "italic 900 30px Arial";
    c.fillText("Listening...",keymapItems[kMenuSelected].pos.x+25,keymapItems[kMenuSelected].pos.y+90);
  }
  if (keyboardPromptTimer > 0){
    c.fillStyle = "black";
    c.fillRect(400,300,400,100);
    c.fillStyle = "white";
    c.font = "italic 900 40px Arial";
    c.fillText(keyboardPrompt,600,360);
  }
}
