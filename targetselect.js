targetSelected = 0;
targetSelectTimer = 0;
promptTimer = 0;

targetPointerPos = [600,635];

function tssControls(i){
  if (!showingCode){
    targetPointerPos[0] += player[i].inputs.lStickAxis[0].x*15;
    targetPointerPos[1] += player[i].inputs.lStickAxis[0].y*-15;
    c.fillRect(50+Math.floor(i/5)*260+Math.floor(i/10)*65,110+(i%5)*60,250,50);
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
      cS[i] = 1-cS[i];
      sounds.menuSelect.play();
    }
    else if ((player[i].inputs.dpaddown[0] && !player[i].inputs.dpaddown[1]) || (player[i].inputs.r[0] && !player[i].inputs.r[1])){
      cS[i] = 1-cS[i];
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
  var bgGrad =c.createLinearGradient(0,0,1200,750);
  bgGrad.addColorStop(0,"rgb(66, 42, 6)");
  bgGrad.addColorStop(1,"rgb(26, 2, 2)");
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
  c.fillStyle = "rgba(255,255,255,0.7)";
  c.textAlign = "start";
  c.font = "800 35px Arial";
  c.fillText("Select Target Stage",50,85);
  c.fillText("Custom Stages",640,85);
  c.fillStyle = "black";
  c.lineWidth = 3;
  targetSelectTimer++;
  // swap 3 for Math.max(10+customTargetStages.length+1,20)
  for (var i=0;i<Math.min(11+customTargetStages.length,20);i++){
    if (targetSelected == i){
      if (targetSelectTimer%8 > 4){
        c.strokeStyle = "rgb(251, 116, 155)";
      }
      else {
        c.strokeStyle = "rgb(255, 182, 204)";
      }
    }
    else {
      c.strokeStyle = "rgb(166, 166, 166)";
    }
    c.fillRect(50+Math.floor(i/5)*260+Math.floor(i/10)*65,110+(i%5)*60,250,50);
    c.strokeRect(50+Math.floor(i/5)*260+Math.floor(i/10)*65,110+(i%5)*60,250,50);
  }
  c.font = "700 25px Arial";
  c.fillStyle = "rgba(255,255,255,0.6)";
  for (var i=0;i<10;i++){
    c.fillText("Target "+(i+1),60+Math.floor(i/5)*260,143+(i%5)*60);
  }

  for (var i=0;i<Math.min(customTargetStages.length+1,10);i++){
    if (i == customTargetStages.length){
      //c.textAlign = "center";
      c.fillText("+ Add Code",645+Math.floor(i/5)*260,143+(i%5)*60);
    }
    else {
      c.fillText("Custom "+(i+1),645+Math.floor(i/5)*260,143+(i%5)*60);
    }
  }
  c.save();
  c.setLineDash([5, 5]);
  c.strokeStyle = "rgb(157, 157, 157)";
  c.lineWidth = 2;
  for (var i=0;i<10;i++){
    c.beginPath();
    c.arc(220+Math.floor(i/5)*260,135+(i%5)*60,10,0,twoPi);
    c.closePath();

    if (medalsEarned[cS[targetPlayer]][i][0]){
      var medalGrad =c.createLinearGradient(210+Math.floor(i/5)*260,125+(i%5)*60,230+Math.floor(i/5)*260,145+(i%5)*60);
      medalGrad.addColorStop(0,"rgb(180, 123, 65)");
      medalGrad.addColorStop(1,"rgb(236, 179, 120)");
      c.fillStyle = medalGrad;
      c.fill();
    }
    else {
      c.stroke();
    }
    c.beginPath();
    c.arc(250+Math.floor(i/5)*260,135+(i%5)*60,10,0,twoPi);
    c.closePath();
    if (medalsEarned[cS[targetPlayer]][i][1]){
      var medalGrad =c.createLinearGradient(240+Math.floor(i/5)*260,125+(i%5)*60,260+Math.floor(i/5)*260,145+(i%5)*60);
      medalGrad.addColorStop(0,"rgb(161, 161, 161)");
      medalGrad.addColorStop(1,"rgb(246, 246, 246)");
      c.fillStyle = medalGrad;
      c.fill();
    }
    else {
      c.stroke();
    }
    c.beginPath();
    c.arc(280+Math.floor(i/5)*260,135+(i%5)*60,10,0,twoPi);
    c.closePath();
    if (medalsEarned[cS[targetPlayer]][i][2]){
      var medalGrad =c.createLinearGradient(270+Math.floor(i/5)*260,125+(i%5)*60,290+Math.floor(i/5)*260,145+(i%5)*60);
      medalGrad.addColorStop(0,"rgb(255, 221, 42)");
      medalGrad.addColorStop(1,"rgb(255, 237, 140)");
      c.fillStyle = medalGrad;
      c.fill();
    }
    else {
      c.stroke();
    }

  }
  c.restore();
  c.strokeStyle = "rgba(255, 255, 255, 0.5)";
  c.fillStyle = "rgba(0, 0, 0, 0.5)";
  c.fillRect(200,450,800,200);
  c.strokeRect(200,450,800,200);
  if (targetSelected < 10){
    var medalGrad =c.createLinearGradient(270,470,330,530);
    medalGrad.addColorStop(0,"rgb(180, 123, 65)");
    medalGrad.addColorStop(1,"rgb(236, 179, 120)");
    c.fillStyle = medalGrad;
    c.beginPath();
    c.arc(300,500,30,0,twoPi);
    c.closePath();
    c.fill();
    medalGrad =c.createLinearGradient(510,470,570,530);
    medalGrad.addColorStop(0,"rgb(161, 161, 161)");
    medalGrad.addColorStop(1,"rgb(246, 246, 246)");
    c.fillStyle = medalGrad;
    c.beginPath();
    c.arc(540,500,30,0,twoPi);
    c.closePath();
    c.fill();
    medalGrad =c.createLinearGradient(750,470,810,530);
    medalGrad.addColorStop(0,"rgb(255, 221, 42)");
    medalGrad.addColorStop(1,"rgb(255, 237, 140)");
    c.fillStyle = medalGrad;
    c.beginPath();
    c.arc(780,500,30,0,twoPi);
    c.closePath();
    c.fill();
    c.fillStyle = "rgba(255,255,255,0.7)";
    c.font = "700 30px Arial";
    for (var i=0;i<3;i++){
      var text = "0"+Math.floor(medalTimes[cS[targetPlayer]][targetSelected][i]/60)+":";
      var sec = (medalTimes[cS[targetPlayer]][targetSelected][i] % 60).toFixed(2);
      text += ((sec.length<5)?"0"+sec:sec);
      c.fillText(text,345+i*240,513);
    }
    c.font = "italic 900 38px Arial";
    c.fillText("World Record",250,625);
    c.font = "700 38px Arial";
    c.textAlign = "center";
    var text = "0"+Math.floor(worldRecords[cS[targetPlayer]][targetSelected]/60)+":";
    var sec = (worldRecords[cS[targetPlayer]][targetSelected] % 60).toFixed(2);
    text += ((sec.length<5)?"0"+sec:sec);
    c.fillText(text,750,625);
    c.font = "500 20px Arial";
    c.textAlign = "start";
    c.fillText("by "+worldRecordNames[cS[targetPlayer]][targetSelected],850,625);
  }
  c.fillStyle = "rgba(255,255,255,0.7)";
  c.textAlign = "start";
  c.font = "italic 900 38px Arial";
  if (targetSelected == 10+customTargetStages.length){
    c.fillText("Add custom stage",400,560);
  }
  else {
    c.fillText("Personal Best",250,575-(targetSelected>9?45:0));
    c.font = "700 38px Arial";
    c.textAlign = "center";
    if (targetRecords[cS[targetPlayer]][targetSelected] == -1){
      text = "--:--:--";
    }
    else {
      var text = "0"+Math.floor(targetRecords[cS[targetPlayer]][targetSelected]/60)+":";
      var sec = (targetRecords[cS[targetPlayer]][targetSelected] % 60).toFixed(2);
      text += ((sec.length<5)?"0"+sec:sec);
    }
    c.fillText(text,750,575-(targetSelected>9?45:0));
    c.font = "900 35px Arial";
    if (targetSelected > 9 && targetSelected != customTargetStages.length-1){
      c.fillText("Play",260,610);
      c.fillText("Edit",460,610);
      c.fillText("Dupe",660,610);
      c.fillText("Delete",860,610);
      c.fillStyle = "rgb(84, 187, 58)";
      c.beginPath();
      c.arc(335,600,25,0,twoPi);
      c.closePath();
      c.fill();
      c.save();
      c.lineCap = "round";
      c.lineWidth = 27;
      c.strokeStyle = "rgb(79, 57, 185)";
      c.beginPath();
      c.moveTo(941,600);
      c.lineTo(971,600);
      c.stroke();
      c.closePath();
      c.strokeStyle = "rgb(116, 116, 116)";
      c.beginPath();
      c.arc(548,629,40,Math.PI*1.3,Math.PI*1.55);
      c.stroke();
      c.closePath();
      c.beginPath();
      c.arc(700,602,40,Math.PI*1.8,Math.PI*0.05);
      c.stroke();
      c.closePath();
      c.fillStyle = "rgba(0, 0, 0,0.6)";
      c.font = "900 35px Arial";
      c.fillText("A",335,611);
      c.font = "900 26px Arial";
      c.fillText("Y",538,601);
      c.fillText("X",738,604);
      c.fillText("Z",956,610);
      c.save();
    }
  }
  var bgGrad =c.createLinearGradient(0,250,0,350);
  bgGrad.addColorStop(0,"rgb(41, 47, 68)");
  bgGrad.addColorStop(1,"rgb(85, 95, 128)");
  c.lineWidth = 2;
  c.fillStyle=bgGrad;
  c.beginPath();
  c.moveTo(100,530);
  c.bezierCurveTo(100,510,100,510,120,510);
  c.lineTo(165,510);
  c.bezierCurveTo(185,510,185,510,185,530);
  c.lineTo(185,575);
  c.bezierCurveTo(185,595,185,595,165,595);
  c.lineTo(120,595);
  c.bezierCurveTo(100,595,100,595,100,575);
  c.closePath();
  c.fill();
  c.stroke();
  switch (cS[targetPlayer]){
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
  c.moveTo(183,570-add);
  c.lineTo(183,575-add);
  c.bezierCurveTo(183,593,183,593,165,593);
  c.lineTo(120,593);
  c.bezierCurveTo(102,593,102,593,102,575-add);
  c.lineTo(102,570-add);
  c.closePath();
  c.fill();
  c.fillStyle = "rgb(180, 180, 180)";
  c.font = "700 18px Arial";
  c.textAlign = "left";
  switch (cS[targetPlayer]){
    case 0:
      c.fillText("MARTH",110,588);
      c.drawImage(marthPic, 102, 512, 81, 58);
      break;
    case 1:
      c.fillText("JIGGLY-",107,578);
      c.fillText("PUFF",120,591);
      c.drawImage(puffPic, 102, 512, 81, 51);
      break;
    default:
      break;
  }
  c.textAlign = "center";
  // x 100 - 185
  // y 510 - 595
  c.beginPath();
  c.moveTo(143,480);
  c.lineTo(168,500);
  c.lineTo(118,500);
  c.closePath();
  c.fill();
  c.stroke();
  c.beginPath();
  c.moveTo(143,625);
  c.lineTo(168,605);
  c.lineTo(118,605);
  c.closePath();
  c.fill();
  c.stroke();
  c.lineWidth = 8;
  c.strokeStyle = "rgba(255,255,255,0.8)";
  c.beginPath();
  c.arc(targetPointerPos[0],targetPointerPos[1],40,0,twoPi);
  c.closePath();
  c.stroke();
  if (promptTimer > 0){
    promptTimer --;
    c.fillStyle = "rgba(0,0,0,"+Math.max(0,(promptTimer>30)?1:1-(30-promptTimer)/30)+")";
    c.fillRect(400,325,400,100);
    c.fillStyle = "rgba(255,255,255,"+Math.max(0,(promptTimer>30)?1:1-(30-promptTimer)/30)+")";
    c.font = "700 38px Arial";
    c.textAlign = "center";
    if (promptType == 0){
      var text = "Invalid code";
    }
    else {
      var text = "Limit reached";
    }
    c.fillText(text,600,385);
  }
}
