targetSelected = 0;
targetSelectTimer = 0;
promptTimer = 0;

targetPointerPos = [600,635];

function tssControls(i){
  if (!showingCode){
    targetPointerPos[0] += player[i].inputs.lStickAxis[0].x*15;
    targetPointerPos[1] += player[i].inputs.lStickAxis[0].y*-15;
    ui.fillRect(50+Math.floor(i/5)*260+Math.floor(i/10)*65,110+(i%5)*60,250,50);
    if (targetPointerPos[1] >= 45 && targetPointerPos[1] <= 420){
      for (var j=0;j<Math.min(20,11+customTargetStages.length);j++){
        if (targetPointerPos[0] >= 50+Math.floor(j/5)*260+Math.floor(j/10)*65 && targetPointerPos[0] <= 300+Math.floor(j/5)*260+Math.floor(j/10)*65 && targetPointerPos[1] >= 110+(j%5)*60 && targetPointerPos[1] <= 160+(j%5)*60){
          if (targetSelected != j){
            sounds.menuSelect.play();
          }
          targetSelected = j;
          break;
        }
      }
    }
    if ((player[i].inputs.dpadup[0] && !player[i].inputs.dpadup[1]) || (player[i].inputs.l[0] && !player[i].inputs.l[1])){
      cS[i]--;
      if (cS[i] < 0){
        cS[i] = 2;
      }
      sounds.menuSelect.play();
    }
    else if ((player[i].inputs.dpaddown[0] && !player[i].inputs.dpaddown[1]) || (player[i].inputs.r[0] && !player[i].inputs.r[1])){
      cS[i]++;
      if (cS[i] > 2){
        cS[i] = 0;
      }
      sounds.menuSelect.play();
    }
    if (player[i].inputs.b[0] && !player[i].inputs.b[1]){
      sounds.menuBack.play();
      gameMode = 1;
      return;
    }
    else {
      if (targetSelected > 9 && targetSelected != 10+customTargetStages.length){
        if (player[i].inputs.z[0] && !player[i].inputs.z[1]){
          //delete
          customTargetStages.splice(targetSelected-10,1);
          targetRecords[cS[i]].splice(targetSelected,1);
          targetRecords[cS[i]].push(-1);
          return;
        }
        else if (player[i].inputs.x[0] && !player[i].inputs.x[1]){
          //dupe
          if (customTargetStages.length < 10){
            customTargetStages.push({});
            $.extend(true,customTargetStages[customTargetStages.length-1],customTargetStages[targetSelected-10]);
          }
          else {
            promptTimer = 60;
            promptType = 1;
          }
          return;
        }
        else if (player[i].inputs.y[0] && !player[i].inputs.y[1]){
          //edit
          stageTemp = {};
          $.extend(true,stageTemp,customTargetStages[targetSelected-10]);
          targetBuilder = i;
          editingStage = targetSelected-10;
          player[i].inputs.a[1] = true;
          gameMode = 4;
          return;
        }
      }
      if ((player[i].inputs.s[0] && !player[i].inputs.s[1]) || (player[i].inputs.a[0] && !player[i].inputs.a[1])){
        sounds.menuForward.play();
        if (targetSelected == 10+customTargetStages.length){
          // ADD CODE
          showingCode = true;
          $("#customStageContainer").show();
          $("#cStageEdit").select().val("");
          $("#cStageTitleEdit").empty().append("Paste in your code");
          $("#cStageInfoEdit").empty();
        }
        else {
          if (targetSelected > 9){
            stage = customTargetStages[targetSelected-10];
          }
          else {
            stage = targetStages[targetSelected];
          }
          targetStagePlaying = targetSelected;
          startTargetGame(i,false);
        }
      }
    }
  }
  else {
    if (player[i].inputs.a[0] && !player[i].inputs.a[1]){
      showingCode = false;
      var code = $("#cStageEdit").val();
      var newStage = parseStage(code);
      if (newStage == 0){
        // invalid code
        promptTimer = 60;
        promptType = 0;
      }
      else {
        customTargetStages[customTargetStages.length] = {};
        $.extend(true,customTargetStages[customTargetStages.length-1],newStage);
      }
      $("#customStageContainer").hide();
      sounds.menuForward.play();
    }
  }
}

function parseStage(code){
  if (code[0] != "s"){
    return 0;
  }
  else {
    var newStage = {startingPoint:0,box:[],ground:[],ceiling:[],wallL:[],wallR:[],platform:[],ledge:[],target:[],scale:3,blastzone:new Box2D([-250,-250],[250,250]),offset:[600,375],draw:{startingPoint:0,box:[],ground:[],ceiling:[],wallL:[],wallR:[],platform:[],target:[]}};
    var sEnd = code.indexOf("&",0);
    if (sEnd == -1){
      return 0;
    }
    var sArray = code.substr(1,sEnd-1).split(",");
    if (sArray.length != 2){
      return 0;
    }
    newStage.startingPoint = new Vec2D(parseFloat(sArray[0]),parseFloat(sArray[1]));
    newStage.draw.startingPoint = new Vec2D(parseFloat(sArray[0])*3+600,parseFloat(sArray[1])*-3+375);
    var bEnd = code.indexOf("&",sEnd+1);
    if (bEnd == -1){
      return 0;
    }
    var bArray = code.substr(sEnd+2,(bEnd-1)-(sEnd+1)).split(",");
    if (bArray.length % 4 != 0){
      return 0;
    }
    for (var i=0;i<bArray.length;i+=4){
      var bT = [parseFloat(bArray[i]),parseFloat(bArray[i+1]),parseFloat(bArray[i+2]),parseFloat(bArray[i+3])];
      newStage.box.push(new Box2D([bT[0],bT[1]],[bT[2],bT[3]]));
      newStage.draw.box.push(new Box2D([bT[0]*3+600,bT[1]*-3+375],[bT[2]*3+600,bT[3]*-3+375]));
      newStage.ground.push([new Vec2D(bT[0],bT[3]),new Vec2D(bT[2],bT[3])]);
      newStage.draw.ground.push([new Vec2D(bT[0]*3+600,bT[3]*-3+375),new Vec2D(bT[2]*3+600,bT[3]*-3+375)]);
      newStage.ceiling.push([new Vec2D(bT[0],bT[1]),new Vec2D(bT[2],bT[1])]);
      newStage.draw.ceiling.push([new Vec2D(bT[0]*3+600,bT[1]*-3+375),new Vec2D(bT[2]*3+600,bT[1]*-3+375)]);
      newStage.wallL.push([new Vec2D(bT[0],bT[3]),new Vec2D(bT[0],bT[1])]);
      newStage.draw.wallL.push([new Vec2D(bT[0]*3+600,bT[3]*-3+375),new Vec2D(bT[0]*3+600,bT[1]*-3+375)]);
      newStage.wallR.push([new Vec2D(bT[2],bT[3]),new Vec2D(bT[2],bT[1])]);
      newStage.draw.wallR.push([new Vec2D(bT[2]*3+600,bT[3]*-3+375),new Vec2D(bT[2]*3+600,bT[1]*-3+375)]);
    }
    var pEnd = code.indexOf("&",bEnd+1);
    if (pEnd == -1){
      return 0;
    }
    var pArray = code.substr(bEnd+2,(pEnd-1)-(bEnd+1)).split(",");
    if (pArray.length % 4 != 0){
      return 0;
    }
    for (var i=0;i<pArray.length;i+=4){
      newStage.platform.push([new Vec2D(parseFloat(pArray[i]),parseFloat(pArray[i+1])),new Vec2D(parseFloat(pArray[i+2]),parseFloat(pArray[i+3]))]);
      newStage.draw.platform.push([new Vec2D(parseFloat(pArray[i])*3+600,parseFloat(pArray[i+1])*-3+375),new Vec2D(parseFloat(pArray[i+2])*3+600,parseFloat(pArray[i+3])*-3+375)]);
    }
    var lEnd = code.indexOf("&",pEnd+1);
    if (lEnd == -1){
      return 0;
    }
    var lArray = code.substr(pEnd+2,(lEnd-1)-(pEnd+1)).split(",");
    console.log(lArray);
    if (lArray.length % 2 != 0){
      return 0;
    }
    for (var i=0;i<lArray.length;i+=2){
      newStage.ledge.push([parseInt(lArray[i]),parseInt(lArray[i+1])]);
    }
    var tEnd = code.indexOf("&",lEnd+1);
    if (tEnd != -1){
      return 0;
    }
    else {
      tEnd = code.length;
    }
    var tArray = code.substr(lEnd+2,(tEnd-1)-(lEnd+1)).split(",");
    if (tArray.length % 2 != 0){
      return 0;
    }
    for (var i=0;i<tArray.length;i+=2){
      newStage.target.push(new Vec2D(parseFloat(tArray[i]),parseFloat(tArray[i+1])));
      newStage.draw.target.push(new Vec2D(parseFloat(tArray[i])*3+600,parseFloat(tArray[i+1])*-3+375));
    }
    return newStage;
  }
}

var shine = 0.5;
function drawTSS(){
  clearScreen();
  var bgGrad =bg1.createLinearGradient(0,0,1200,750);
  bgGrad.addColorStop(0,"rgb(66, 42, 6)");
  bgGrad.addColorStop(1,"rgb(26, 2, 2)");
  bg1.fillStyle=bgGrad;
  bg1.fillRect(0,0,layers.BG1.width,layers.BG1.height);
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
  ui.lineWidth = 4;
  ui.fillStyle = "rgba(255,255,255,0.7)";
  ui.textAlign = "start";
  ui.font = "800 35px Arial";
  ui.fillText("Select Target Stage",50,85);
  ui.fillText("Custom Stages",640,85);
  ui.fillStyle = "black";
  ui.lineWidth = 3;
  targetSelectTimer++;
  // swap 3 for Math.max(10+customTargetStages.length+1,20)
  for (var i=0;i<Math.min(11+customTargetStages.length,20);i++){
    if (targetSelected == i){
      if (targetSelectTimer%8 > 4){
        ui.strokeStyle = "rgb(251, 116, 155)";
      }
      else {
        ui.strokeStyle = "rgb(255, 182, 204)";
      }
    }
    else {
      ui.strokeStyle = "rgb(166, 166, 166)";
    }
    ui.fillRect(50+Math.floor(i/5)*260+Math.floor(i/10)*65,110+(i%5)*60,250,50);
    ui.strokeRect(50+Math.floor(i/5)*260+Math.floor(i/10)*65,110+(i%5)*60,250,50);
  }
  ui.font = "700 25px Arial";
  ui.fillStyle = "rgba(255,255,255,0.6)";
  for (var i=0;i<10;i++){
    ui.fillText("Target "+(i+1),60+Math.floor(i/5)*260,143+(i%5)*60);
  }

  for (var i=0;i<Math.min(customTargetStages.length+1,10);i++){
    if (i == customTargetStages.length){
      //ui.textAlign = "center";
      ui.fillText("+ Add Code",645+Math.floor(i/5)*260,143+(i%5)*60);
    }
    else {
      ui.fillText("Custom "+(i+1),645+Math.floor(i/5)*260,143+(i%5)*60);
    }
  }
  ui.save();
  ui.setLineDash([5, 5]);
  ui.strokeStyle = "rgb(157, 157, 157)";
  ui.lineWidth = 2;
  for (var i=0;i<10;i++){
    ui.beginPath();
    ui.arc(220+Math.floor(i/5)*260,135+(i%5)*60,10,0,twoPi);
    ui.closePath();

    if (medalsEarned[cS[targetPlayer]][i][0]){
      var medalGrad =ui.createLinearGradient(210+Math.floor(i/5)*260,125+(i%5)*60,230+Math.floor(i/5)*260,145+(i%5)*60);
      medalGrad.addColorStop(0,"rgb(180, 123, 65)");
      medalGrad.addColorStop(1,"rgb(236, 179, 120)");
      ui.fillStyle = medalGrad;
      ui.fill();
    }
    else {
      ui.stroke();
    }
    ui.beginPath();
    ui.arc(250+Math.floor(i/5)*260,135+(i%5)*60,10,0,twoPi);
    ui.closePath();
    if (medalsEarned[cS[targetPlayer]][i][1]){
      var medalGrad =ui.createLinearGradient(240+Math.floor(i/5)*260,125+(i%5)*60,260+Math.floor(i/5)*260,145+(i%5)*60);
      medalGrad.addColorStop(0,"rgb(161, 161, 161)");
      medalGrad.addColorStop(1,"rgb(246, 246, 246)");
      ui.fillStyle = medalGrad;
      ui.fill();
    }
    else {
      ui.stroke();
    }
    ui.beginPath();
    ui.arc(280+Math.floor(i/5)*260,135+(i%5)*60,10,0,twoPi);
    ui.closePath();
    if (medalsEarned[cS[targetPlayer]][i][2]){
      var medalGrad =ui.createLinearGradient(270+Math.floor(i/5)*260,125+(i%5)*60,290+Math.floor(i/5)*260,145+(i%5)*60);
      medalGrad.addColorStop(0,"rgb(255, 221, 42)");
      medalGrad.addColorStop(1,"rgb(255, 237, 140)");
      ui.fillStyle = medalGrad;
      ui.fill();
    }
    else {
      ui.stroke();
    }

  }
  ui.restore();
  ui.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ui.fillStyle = "rgba(0, 0, 0, 0.5)";
  ui.fillRect(200,450,800,200);
  ui.strokeRect(200,450,800,200);
  if (targetSelected < 10){
    var medalGrad =ui.createLinearGradient(270,470,330,530);
    medalGrad.addColorStop(0,"rgb(180, 123, 65)");
    medalGrad.addColorStop(1,"rgb(236, 179, 120)");
    ui.fillStyle = medalGrad;
    ui.beginPath();
    ui.arc(300,500,30,0,twoPi);
    ui.closePath();
    ui.fill();
    medalGrad =ui.createLinearGradient(510,470,570,530);
    medalGrad.addColorStop(0,"rgb(161, 161, 161)");
    medalGrad.addColorStop(1,"rgb(246, 246, 246)");
    ui.fillStyle = medalGrad;
    ui.beginPath();
    ui.arc(540,500,30,0,twoPi);
    ui.closePath();
    ui.fill();
    medalGrad =ui.createLinearGradient(750,470,810,530);
    medalGrad.addColorStop(0,"rgb(255, 221, 42)");
    medalGrad.addColorStop(1,"rgb(255, 237, 140)");
    ui.fillStyle = medalGrad;
    ui.beginPath();
    ui.arc(780,500,30,0,twoPi);
    ui.closePath();
    ui.fill();
    ui.fillStyle = "rgba(255,255,255,0.7)";
    ui.font = "700 30px Arial";
    for (var i=0;i<3;i++){
      var text = "0"+Math.floor(medalTimes[cS[targetPlayer]][targetSelected][i]/60)+":";
      var sec = (medalTimes[cS[targetPlayer]][targetSelected][i] % 60).toFixed(2);
      text += ((sec.length<5)?"0"+sec:sec);
      ui.fillText(text,345+i*240,513);
    }
    ui.font = "italic 900 38px Arial";
    ui.fillText("World Record",250,625);
    ui.font = "700 38px Arial";
    ui.textAlign = "center";
    var text = "0"+Math.floor(worldRecords[cS[targetPlayer]][targetSelected]/60)+":";
    var sec = (worldRecords[cS[targetPlayer]][targetSelected] % 60).toFixed(2);
    text += ((sec.length<5)?"0"+sec:sec);
    ui.fillText(text,750,625);
    ui.font = "500 20px Arial";
    ui.textAlign = "start";
    ui.fillText("by "+worldRecordNames[cS[targetPlayer]][targetSelected],850,625);
  }
  ui.fillStyle = "rgba(255,255,255,0.7)";
  ui.textAlign = "start";
  ui.font = "italic 900 38px Arial";
  if (targetSelected == 10+customTargetStages.length){
    ui.fillText("Add custom stage",400,560);
  }
  else {
    ui.fillText("Personal Best",250,575-(targetSelected>9?45:0));
    ui.font = "700 38px Arial";
    ui.textAlign = "center";
    if (targetRecords[cS[targetPlayer]][targetSelected] == -1){
      text = "--:--:--";
    }
    else {
      var text = "0"+Math.floor(targetRecords[cS[targetPlayer]][targetSelected]/60)+":";
      var sec = (targetRecords[cS[targetPlayer]][targetSelected] % 60).toFixed(2);
      text += ((sec.length<5)?"0"+sec:sec);
    }
    ui.fillText(text,750,575-(targetSelected>9?45:0));
    ui.font = "900 35px Arial";
    if (targetSelected > 9 && targetSelected != customTargetStages.length-1){
      ui.fillText("Play",260,610);
      ui.fillText("Edit",460,610);
      ui.fillText("Dupe",660,610);
      ui.fillText("Delete",860,610);
      ui.fillStyle = "rgb(84, 187, 58)";
      ui.beginPath();
      ui.arc(335,600,25,0,twoPi);
      ui.closePath();
      ui.fill();
      ui.save();
      ui.lineCap = "round";
      ui.lineWidth = 27;
      ui.strokeStyle = "rgb(79, 57, 185)";
      ui.beginPath();
      ui.moveTo(941,600);
      ui.lineTo(971,600);
      ui.stroke();
      ui.closePath();
      ui.strokeStyle = "rgb(116, 116, 116)";
      ui.beginPath();
      ui.arc(548,629,40,Math.PI*1.3,Math.PI*1.55);
      ui.stroke();
      ui.closePath();
      ui.beginPath();
      ui.arc(700,602,40,Math.PI*1.8,Math.PI*0.05);
      ui.stroke();
      ui.closePath();
      ui.fillStyle = "rgba(0, 0, 0,0.6)";
      ui.font = "900 35px Arial";
      ui.fillText("A",335,611);
      ui.font = "900 26px Arial";
      ui.fillText("Y",538,601);
      ui.fillText("X",738,604);
      ui.fillText("Z",956,610);
      ui.save();
    }
  }
  var bgGrad =ui.createLinearGradient(0,250,0,350);
  bgGrad.addColorStop(0,"rgb(41, 47, 68)");
  bgGrad.addColorStop(1,"rgb(85, 95, 128)");
  ui.lineWidth = 2;
  ui.fillStyle=bgGrad;
  ui.beginPath();
  ui.moveTo(100,530);
  ui.bezierCurveTo(100,510,100,510,120,510);
  ui.lineTo(165,510);
  ui.bezierCurveTo(185,510,185,510,185,530);
  ui.lineTo(185,575);
  ui.bezierCurveTo(185,595,185,595,165,595);
  ui.lineTo(120,595);
  ui.bezierCurveTo(100,595,100,595,100,575);
  ui.closePath();
  ui.fill();
  ui.stroke();
  switch (cS[targetPlayer]){
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
  ui.moveTo(183,570-add);
  ui.lineTo(183,575-add);
  ui.bezierCurveTo(183,593,183,593,165,593);
  ui.lineTo(120,593);
  ui.bezierCurveTo(102,593,102,593,102,575-add);
  ui.lineTo(102,570-add);
  ui.closePath();
  ui.fill();
  ui.fillStyle = "rgb(180, 180, 180)";
  ui.font = "700 18px Arial";
  ui.textAlign = "left";
  switch (cS[targetPlayer]){
    case 0:
      ui.fillText("MARTH",110,588);
      ui.drawImage(marthPic, 102, 512, 81, 58);
      break;
    case 1:
      ui.fillText("JIGGLY-",107,578);
      ui.fillText("PUFF",120,591);
      ui.drawImage(puffPic, 102, 512, 81, 51);
      break;
    case 2:
      ui.fillText("  F O X ",110,588);
      ui.drawImage(foxPic, 102, 512, 81, 58);
      break;
    default:
      break;
  }
  ui.textAlign = "center";
  // x 100 - 185
  // y 510 - 595
  ui.beginPath();
  ui.moveTo(143,480);
  ui.lineTo(168,500);
  ui.lineTo(118,500);
  ui.closePath();
  ui.fill();
  ui.stroke();
  ui.beginPath();
  ui.moveTo(143,625);
  ui.lineTo(168,605);
  ui.lineTo(118,605);
  ui.closePath();
  ui.fill();
  ui.stroke();
  ui.lineWidth = 8;
  ui.strokeStyle = "rgba(255,255,255,0.8)";
  ui.beginPath();
  ui.arc(targetPointerPos[0],targetPointerPos[1],40,0,twoPi);
  ui.closePath();
  ui.stroke();
  if (promptTimer > 0){
    promptTimer --;
    ui.fillStyle = "rgba(0,0,0,"+Math.max(0,(promptTimer>30)?1:1-(30-promptTimer)/30)+")";
    ui.fillRect(400,325,400,100);
    ui.fillStyle = "rgba(255,255,255,"+Math.max(0,(promptTimer>30)?1:1-(30-promptTimer)/30)+")";
    ui.font = "700 38px Arial";
    ui.textAlign = "center";
    if (promptType == 0){
      var text = "Invalid code";
    }
    else {
      var text = "Limit reached";
    }
    ui.fillText(text,600,385);
  }
}
