twoPi = Math.PI*2;

function drawArrayPathNew(col,face,tX,tY,path,scaleX,scaleY,rotate,rpX,rpY){
  // scaleX = 0.24*(stage.scale/4.5);
  // scaleY = 0.24*(stage.scale/4.5);
  //c.globalCompositeOperation="xor";
  c.save();
  c.translate(tX-rpX,tY-rpY);
  c.rotate(rotate);
  for (var j=0;j<path.length;j++){
    var x = (path[j][0]*scaleX*face)+rpX;
    var y = (path[j][1]*scaleY)+rpY;
    if (j == 0){
      c.fillStyle = col;
      c.beginPath();
      c.moveTo(x,y);
    }
    else {
      if (path[j].length == 2){
        //c.closePath();
        c.moveTo(x,y);
      }
      else {
        c.bezierCurveTo(x,y,(path[j][2]*scaleX*face)+rpX,(path[j][3]*scaleY)+rpY,(path[j][4]*scaleX*face)+rpX,(path[j][5]*scaleY)+rpY);
      }
    }
  }
  c.closePath();
  c.fill();
  c.restore();
  //c.globalCompositeOperation="source-over";
}

function drawArrayPath(col,face,tX,tY,path,scaleX,scaleY){
  for (var j=0;j<path.length;j++){
    var x = (path[j][0]*scaleX*face)+tX;
    var y = (path[j][1]*scaleY)+tY;
    if (j == 0){
      c.fillStyle = col;
      c.beginPath();
      c.moveTo(x,y);
    }
    else {
      c.lineTo(x,y);
    }
  }
  c.closePath();
  c.fill();
}

function renderPlayer(i){
  var temX = (player[i].phys.pos.x*stage.scale) + stage.offset[0];
  var temY = (player[i].phys.pos.y*-stage.scale) +stage.offset[1];
  var face = player[i].phys.face;
  var frame = Math.floor(player[i].timer);
  if (frame == 0){
    frame = 1;
  }

  var model = animations[cS[i]][player[i].actionState][frame-1];

  if (aS[cS[i]][player[i].actionState].reverseModel){
    face *= -1;
  }
  else if (player[i].actionState == "TILTTURN"){
    if (frame > 5){
      face *= -1;
    }
  }
  else if (player[i].actionState == "RUNTURN"){
    if (frame > aS[cS[i]].RUNTURN.reverseModelFrame){
      face *= -1;
    }
  }
  // JiGGS MULTIJUMP TURN
  else if (player[i].actionState.substring(0, player[i].actionState.length-1) == "AERIALTURN" && player[i].timer > 5){
    face *= -1;
  }
  // MARTH BAIR
  else if (player[i].actionState == "ATTACKAIRB" && cS[i] == 0){
    if (frame > 29){
      face *= -1;
    }
  }

  if (!aS[cS[i]][player[i].actionState].dead){
    var col;
    if (player[i].phys.shielding && player[i].phys.powerShielded && player[i].hit.hitlag > 0){
      col = "rgb(255,255,255)";
    }
    else if (player[i].phys.intangibleTimer % 9 > 3 || player[i].phys.invincibleTimer % 9 > 3 || player[i].hit.hitlag > 0){
      col = palettes[pPal[i]][1];
    }
    else if (player[i].phys.charging && player[i].phys.chargeFrames % 9 > 3){
      col = "rgba(252, 255, 91, 0.7)";
    }
    else if (player[i].actionState == "FURAFURA" && player[i].timer % 30 < 6){
      col = palettes[pPal[i]][3];
    }
    else {
      col = palettes[pPal[i]][0];
    }
    if (player[i].phys.chargeFrames % 4 == 3){
      temX += 2;
    }
    else if (player[i].phys.chargeFrames % 4 == 1){
      temX -= 2;
    }
    if (temX > 1220 || temX < -20 || temY > 880 || temY < -30){
      var pA = new Vec2D(temX-600,temY-375);
      var pB = new Vec2D(0,0);
      var s = (pA.y-pB.y)/(pA.x-pB.x);
      if (-375 <= s * 600 && s*600<= 375){
        if (pA.x > pB.x){
          player[i].miniViewPoint = new Vec2D(1150,s*600+375);
          player[i].miniViewSide = 0;
        }
        else {
          player[i].miniViewPoint = new Vec2D(50,-s*600+375);
          player[i].miniViewSide = 1;
        }
        player[i].miniView = true;
      }
      else if (-600 <= 375/s && 375/s<= 600){
        if (pA.y > pB.y){
          if (temX < 50){
            player[i].miniViewPoint = new Vec2D(50,700);
          }
          else if (temX > 1150){
            player[i].miniViewPoint = new Vec2D(1150,700);
          }
          else {
            //player[i].miniViewPoint = new Vec2D(375/s+stage.offset[0],700);
            player[i].miniViewPoint = new Vec2D(temX,700);
          }
          player[i].miniViewSide = 2;
        }
        else {
          player[i].miniViewPoint = new Vec2D(-375/s+stage.offset[0],50);
          player[i].miniViewSide = 2;
        }
        player[i].miniView = true;
      }
      else {
        player[i].miniView = false;
      }
    }
    else {
      player[i].miniView = false;
    }
    if (player[i].miniView && player[i].actionState != "SLEEP"){
      c.fillStyle = "black";
      c.strokeStyle = palettes[pPal[i]][0];
      c.beginPath();
      c.arc(player[i].miniViewPoint.x,player[i].miniViewPoint.y,35,twoPi,0);
      c.fill();
      c.lineWidth = 6;
      c.stroke();
      c.lineWidth = 1;

      drawArrayPathNew(col,face,player[i].miniViewPoint.x,player[i].miniViewPoint.y+30,model,player[i].charAttributes.miniScale,player[i].charAttributes.miniScale,player[i].rotation,player[i].rotationPoint.x,player[i].rotationPoint.y);
    }
    else {
      if (player[i].actionState == "ENTRANCE"){
        drawArrayPathNew(col,face,temX,temY,model,player[i].charAttributes.charScale*(stage.scale/4.5),Math.min(player[i].charAttributes.charScale,player[i].charAttributes.charScale*(1.5-startTimer))*(stage.scale/4.5),player[i].rotation,player[i].rotationPoint.x,player[i].rotationPoint.y);
      }
      else {
        drawArrayPathNew(col,face,temX,temY,model,player[i].charAttributes.charScale*(stage.scale/4.5),player[i].charAttributes.charScale*(stage.scale/4.5),player[i].rotation,player[i].rotationPoint.x,player[i].rotationPoint.y);
      }
    }
  }
  if (player[i].phys.shielding){
    if (!(player[i].phys.powerShielded && player[i].hit.hitlag > 0)){
      var sX = ((player[i].phys.shieldPositionReal.x)*stage.scale) + stage.offset[0];
      var sY = ((player[i].phys.shieldPositionReal.y)*-stage.scale) +stage.offset[1];
      var sCol = palettes[pPal[i]][2];
      if (Math.floor(player[i].hit.shieldstun) > 0){
        sCol = palettes[pPal[i]][4];
      }
      c.fillStyle = sCol+(0.6*player[i].phys.shieldAnalog)+")";
      c.beginPath();
      c.arc(sX,sY,player[i].phys.shieldSize*stage.scale,twoPi,0);
      c.fill();
    }
  }
  if (hasTag[i]){
    c.fillStyle = "rgba(0,0,0,0.5)";
    c.strokeStyle = palettes[pPal[i]][0];
    var size = 10*tagText[i].length
    c.fillRect(temX-size/2,temY-130*(stage.scale/4.5),size,20);
    c.strokeRect(temX-size/2,temY-130*(stage.scale/4.5),size,20);
    c.font = "13px Lucida Console, monaco, monospace";
    c.textAlign = "center";
    c.fillStyle = "white";
    c.fillText(tagText[i],temX,temY+15-130*(stage.scale/4.5));
    c.fillStyle = palettes[pPal[i]][0];
    c.beginPath();
    c.moveTo(temX-8,temY+20-130*(stage.scale/4.5));
    c.lineTo(temX+8,temY+20-130*(stage.scale/4.5));
    c.lineTo(temX,temY+28-130*(stage.scale/4.5));
    c.closePath();
    c.fill();
    c.textAlign = "start";
  }
  if (player[i].actionState == "REBIRTH" || player[i].actionState == "REBIRTHWAIT"){
    c.fillStyle = palettes[pPal[i]][1];
    c.strokeStyle = palettes[pPal[i]][0];
    c.beginPath();
    c.moveTo(temX+18*(stage.scale/4.5),temY+13.5*(stage.scale/4.5));
    c.lineTo(temX+31.5*(stage.scale/4.5),temY);
    c.lineTo(temX-31.5*(stage.scale/4.5),temY);
    c.lineTo(temX-18*(stage.scale/4.5),temY+13.5*(stage.scale/4.5));
    c.closePath();
    c.fill();
    c.stroke();
  }
  if (player[i].showLedgeGrabBox){
    c.strokeStyle = "#4478ff";
    c.strokeRect(player[i].phys.ledgeSnapBoxF.min.x*stage.scale+stage.offset[0],player[i].phys.ledgeSnapBoxF.min.y*-stage.scale+stage.offset[1],14*stage.scale,10*stage.scale);
    c.strokeStyle = "#ff4444";
    c.strokeRect(player[i].phys.ledgeSnapBoxB.min.x*stage.scale+stage.offset[0],player[i].phys.ledgeSnapBoxB.min.y*-stage.scale+stage.offset[1],14*stage.scale,10*stage.scale);
  }
  if (player[i].showECB){
    c.fillStyle = "#ff8d2f";
    c.beginPath();
    c.moveTo((player[i].phys.ECB1[0].x*stage.scale)+stage.offset[0],(player[i].phys.ECB1[0].y*-stage.scale)+stage.offset[1]);
    c.lineTo((player[i].phys.ECB1[1].x*stage.scale)+stage.offset[0],(player[i].phys.ECB1[1].y*-stage.scale)+stage.offset[1]);
    c.lineTo((player[i].phys.ECB1[2].x*stage.scale)+stage.offset[0],(player[i].phys.ECB1[2].y*-stage.scale)+stage.offset[1]);
    c.lineTo((player[i].phys.ECB1[3].x*stage.scale)+stage.offset[0],(player[i].phys.ECB1[3].y*-stage.scale)+stage.offset[1]);
    c.closePath();
    c.fill();
    c.strokeStyle = "white";
    c.beginPath();
    c.moveTo((player[i].phys.ECBp[0].x*stage.scale)+stage.offset[0],(player[i].phys.ECBp[0].y*-stage.scale)+stage.offset[1]);
    c.lineTo((player[i].phys.ECBp[1].x*stage.scale)+stage.offset[0],(player[i].phys.ECBp[1].y*-stage.scale)+stage.offset[1]);
    c.lineTo((player[i].phys.ECBp[2].x*stage.scale)+stage.offset[0],(player[i].phys.ECBp[2].y*-stage.scale)+stage.offset[1]);
    c.lineTo((player[i].phys.ECBp[3].x*stage.scale)+stage.offset[0],(player[i].phys.ECBp[3].y*-stage.scale)+stage.offset[1]);
    c.closePath();
    c.stroke();
    c.beginPath();
    c.moveTo(temX,temY-6);
    c.lineTo(temX,temY+6);
    c.closePath();
    c.stroke();
    c.beginPath();
    c.moveTo(temX+6,temY);
    c.lineTo(temX-6,temY);
    c.closePath();
    c.stroke();
  }
  if (player[i].showHitbox){
    c.fillStyle = hurtboxColours[player[i].phys.hurtBoxState];
    c.fillRect(player[i].phys.hurtbox.min.x*stage.scale+stage.offset[0],player[i].phys.hurtbox.min.y*-stage.scale+stage.offset[1],player[i].charAttributes.hurtboxOffset[0]*2*stage.scale,player[i].charAttributes.hurtboxOffset[1]*stage.scale);
    c.fillStyle = "rgba(255, 29, 29, 0.69)";
    for (var j=0;j<4;j++){
      switch (j){
        case 0:
          c.fillStyle = "rgba(255, 29, 29, 0.69)";
          c.strokeStyle = "rgba(255, 126, 126, 0.69)";
          break;
        case 1:
          c.fillStyle = "rgba(47, 255, 29, 0.69)";
          c.strokeStyle = "rgba(126, 252, 115, 0.69)";
          break;
        case 2:
          c.fillStyle = "rgba(29, 208, 255, 0.69)";
          c.strokeStyle = "rgba(117, 226, 255, 0.69)";
          break;
        case 3:
          c.fillStyle = "rgba(203, 29, 255, 0.69)";
          c.strokeStyle = "rgba(216, 116, 246, 0.69)";
          break;
        default:
          break;
      }
      if (player[i].hitboxes.active[j]){
        var offset = player[i].hitboxes.id[j].offset[player[i].hitboxes.frame];
        if (player[i].actionState == "DAMAGEFLYN"){
          offset = player[i].hitboxes.id[j].offset[0];
        }
        c.beginPath();
        c.arc(((offset.x*player[i].phys.face+player[i].phys.pos.x)*stage.scale)+stage.offset[0],((offset.y+player[i].phys.pos.y)*-stage.scale)+stage.offset[1],player[i].hitboxes.id[j].size*stage.scale,Math.PI*2,0);
        c.fill();
        if (player[i].phys.prevFrameHitboxes.active[j]){
          var offset = player[i].phys.prevFrameHitboxes.id[j].offset[player[i].phys.prevFrameHitboxes.frame];
          if (player[i].actionState == "DAMAGEFLYN"){
            offset = player[i].phys.prevFrameHitboxes.id[j].offset[0];
          }
          c.beginPath();
          c.arc(((offset.x*player[i].phys.facePrev+player[i].phys.posPrev.x)*stage.scale)+stage.offset[0],((offset.y+player[i].phys.posPrev.y)*-stage.scale)+stage.offset[1],player[i].phys.prevFrameHitboxes.id[j].size*stage.scale,Math.PI*2,0);
          c.fill();

          //console.log(player[i].phys.interPolatedHitbox[j]);
          c.beginPath();
          c.moveTo((player[i].phys.interPolatedHitbox[j][0].x*stage.scale)+stage.offset[0],(player[i].phys.interPolatedHitbox[j][0].y*-stage.scale)+stage.offset[1]);
          c.lineTo((player[i].phys.interPolatedHitbox[j][1].x*stage.scale)+stage.offset[0],(player[i].phys.interPolatedHitbox[j][1].y*-stage.scale)+stage.offset[1]);
          c.lineTo((player[i].phys.interPolatedHitbox[j][2].x*stage.scale)+stage.offset[0],(player[i].phys.interPolatedHitbox[j][2].y*-stage.scale)+stage.offset[1]);
          c.lineTo((player[i].phys.interPolatedHitbox[j][3].x*stage.scale)+stage.offset[0],(player[i].phys.interPolatedHitbox[j][3].y*-stage.scale)+stage.offset[1]);
          c.closePath();
          c.fill();
          c.stroke();
        }
      }

    }
  }
  $("#actState"+i).empty().append(player[i].actionState);
  $("#stateNum"+i).empty().append(frame);
  $("#face"+i).empty().append(player[i].phys.face);
  $("#percent"+i).empty().append(player[i].percent);
}
lostStockQueue = [];
function renderOverlay(showStock){

  // stocks, percent, timer
  c.strokeStyle = "black";
  if (!versusMode){
    c.fillStyle = "white";
    c.lineWidth = 2;
    c.font = "900 40px Arial";
    c.textAlign = "center";
    var min = (Math.floor(matchTimer/60)).toString();
    var sec = (matchTimer % 60).toFixed(2);
    c.fillText(((min.length<2)?"0"+min:min)+":"+((sec.length<5)?"0"+sec[0]:sec[0]+sec[1]),590,70);
    c.strokeText(((min.length<2)?"0"+min:min)+":"+((sec.length<5)?"0"+sec[0]:sec[0]+sec[1]),590,70);
    c.font = "900 25px Arial";
    c.fillText(((sec.length<5)?sec[2]+sec[3]:sec[3]+sec[4]),670,70);
    c.strokeText(((sec.length<5)?sec[2]+sec[3]:sec[3]+sec[4]),670,70);
  }
  if (showStock){
    c.font = "900 53px Arial";
    c.lineWidth = 2;
    c.textAlign = "end";
    c.save();
    c.scale(0.8,1);
    for (var i=0;i<4;i++){
      if (playerType[i] > -1){
        c.fillStyle = "rgb(255,"+Math.max(255-player[i].percent,0)+", "+Math.max(255-player[i].percent,0)+")";
        c.fillText(Math.floor(player[i].percent)+"%",(450+i*145+player[i].percentShake.x)*1.25,670+player[i].percentShake.y);
        c.strokeText(Math.floor(player[i].percent)+"%",(450+i*145+player[i].percentShake.x)*1.25,670+player[i].percentShake.y);
      }
    }
    c.restore();
    for (var i=0;i<4;i++){
      if (playerType[i] > -1){
        c.fillStyle = palettes[pPal[i]][0];
        for (var j=0;j<player[i].stocks;j++){
          c.beginPath();
          c.arc(337+i*145+j*30,600,12,0,twoPi);
          c.closePath();
          c.fill();
          c.stroke();
        }
      }
    }
    lostStockPopQueue = [];
    c.fillStyle = "white";
    c.strokeStyle = "white";
    for (var i=0;i<lostStockQueue.length;i++){
      lostStockQueue[i][2]++;
      if (lostStockQueue[i][2] > 20){
        lostStockPopQueue.push(i);
      }
      else {
        c.save();
        c.translate(337+lostStockQueue[i][0]*145+lostStockQueue[i][1]*30-2,600-2);
        c.fillRect(lostStockQueue[i][2],0,4,4);
        c.fillRect(lostStockQueue[i][2],lostStockQueue[i][2],4,4);
        c.fillRect(-lostStockQueue[i][2],lostStockQueue[i][2],4,4);
        c.fillRect(lostStockQueue[i][2],-lostStockQueue[i][2],4,4);
        c.fillRect(-lostStockQueue[i][2],-lostStockQueue[i][2],4,4);
        c.fillRect(-lostStockQueue[i][2],0,4,4);
        c.fillRect(0,lostStockQueue[i][2],4,4);
        c.fillRect(0,-lostStockQueue[i][2],4,4);
        c.beginPath();
        c.arc(2,2,lostStockQueue[i][2]/2,0,twoPi);
        c.closePath();
        c.stroke();
        c.restore();
      }
    }
    for (var k=0;k<lostStockPopQueue.length;k++){
      lostStockQueue.splice(lostStockPopQueue[k]-k, 1);
    }
    c.textAlign = "start";
  }
}

function renderForeground(){
  // pause UI
  c.fillStyle = "#8e8e8e";
  c.save();
  c.fillRect(45,48,300,24);
  c.fillStyle = "#3724a6";
  c.fillRect(60,50,50,20);
  c.beginPath();
  c.arc(60,60,10,0,twoPi);
  c.closePath();
  c.fill();
  c.beginPath();
  c.arc(110,60,10,0,twoPi);
  c.closePath();
  c.fill();
  c.restore();
  c.save();
  c.translate(950,650);
  c.fillRect(0,0,8,45);
  c.fillRect(0,25,200,20);
  c.fillRect(192,0,8,45);
  c.fillRect(0,0,12,4);
  c.fillRect(188,0,12,4);
  var xPos = 54;
  for (var j=0;j<3;j++){
    c.fillRect(xPos-2,-6,4,12);
    c.fillRect(xPos-6,-2,12,4);
    xPos += 46;
  }
  c.beginPath();
  c.arc(169,2,12,0,twoPi);
  c.closePath();
  c.fill();
  c.fillStyle = "#21792f";
  c.beginPath();
  c.arc(123,2,15,0,twoPi);
  c.closePath();
  c.fill();
  c.fillStyle = "#9a2622";
  c.beginPath();
  c.arc(40,62,12,0,twoPi);
  c.closePath();
  c.fill();
  c.fillStyle = "#636363";
  c.beginPath();
  c.arc(31,2,15,0.8*Math.PI,twoPi);
  c.closePath();
  c.fill();
  c.beginPath();
  c.arc(77,2,15,twoPi/2,0.2*Math.PI);
  c.closePath();
  c.fill();
  //c.fillRect(20,59,4,12)
  c.fillRect(14,55,4,12);
  c.fillRect(10,59,12,4);
  c.fillRect(60,52,140,20);
  c.fillStyle = "black";
  c.font = "800 20px Arial";
  c.fillText("S",158,8);
  c.fillText("B",32,70);
  c.fillText("Z",-872,-583);
  c.font = "800 17px Arial";
  c.fillText("T",170,9);
  c.scale(1.2,1);
  c.font = "900 24px Arial";
  c.fillText("RESET",72,43);
  c.fillText("L",17,7);
  c.fillText("R",56,7);
  c.fillText("A",93,9);
  c.font = "900 20px Arial";
  c.fillText("RUNBACK",53,70);
  c.font = "900 18px Arial";
  c.fillText("FRAME ADVANCE",-685,-584);
  c.restore();
}
