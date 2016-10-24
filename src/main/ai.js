function runAI(i){
  if (isOffstage(player[i])){
    var inputs = CPUrecover(player[i],i);
    //do inputs
    player[i].inputs.lStickAxis[0].x = inputs[0];
    player[i].inputs.lStickAxis[0].y = inputs[1];
    player[i].inputs.x[0] = inputs[2];
    player[i].inputs.b[0] = inputs[3];
  }
}

function isOffstage(cpu){
  // if on a ledge
  if (cpu.phys.onLedge > -1){
    return false;
  }
  if (!cpu.phys.grounded){
    for (var i=0;i<stage.ground.length;i++){
      if (cpu.phys.pos.x >= stage.ground[i][0].x && cpu.phys.pos.x <= stage.ground[i][1].x && cpu.phys.ECBp[0].y >= stage.ground[i][0].y){
        return false;
      }
    }
    for (var i=0;i<stage.platform.length;i++){
      if (cpu.phys.pos.x >= stage.platform[i][0].x && cpu.phys.pos.x <= stage.platform[i][1].x && cpu.phys.ECBp[0].y >= stage.platform[i][0].y){
        return false;
      }
    }
  }
  return true;
}


//Recovering:
//cpu is a reference to the current cpu. Replace it if you want
//expect cases of jigglypuff's accidently battlefielding themselves sometimes.
//Fox angles should be perfectly imperfect.
function CPUrecover(cpu,p) {
//Where ledges is a list of the ledges on the current stage in the following format. [[ledge1XPos, ledge1YPos],[ledge2XPos,ledge3Ypos],[...]...]
//ledgepos is where a character can grab the ledge
  var closest = [0,10000]; //used to measure which ledge is closer
  for (i = 0;i < stage.ledgePos.length; i++) {
      var closeness = Math.abs(cpu.phys.pos.x -  stage.ledgePos[i].x) + Math.abs(cpu.phys.pos.y - stage.ledgePos[i].y); //distance from ledge
      if (closeness < closest[1]) { //if closer to that ledge than others, update closest.
        closest = [i,closeness];
      }
  }
  closestIndex = closest[0];
  closest = stage.ledgePos[closest[0]]; //updates closest to instead be the closest ledge.
  var returnInput = [0.0,0.0,false,false] //format is [x joystick float, y joystick float, x button, b button]
  if (cpu.actionState == "JUMPF" || cpu.actionState == "JUMPB" || cpu.actionState == "FALLAERIAL" || cpu.actionState == "JUMPAERIALB" || cpu.actionState == "JUMPAERIALF" || cpu.actionState == "DAMAGEFALL" || cpu.actionState == "FALL") {
    //not in up-b or some shit
    if (cpu.phys.pos.x < closest.x) {
      returnInput[0] = 1.0;
    } else if (cpu.phys.pos.x > closest.x) {
      returnInput[0] = -1.0;
    }

    if (cpu.phys.cVel.y <= 0) { //is falling
      if (!cpu.phys.doubleJumped || (cpu.phys.jumpsUsed < 5 && cpu.charAttributes.multiJump)) { //if jumps isn't .jumps thats unintuitive on your part. only tries to jump if it can jump
        var randomSeed = Math.floor((Math.random() * 1000) + 1);

        if (randomSeed < 0) { //will jump
          returnInput[2] = true;
        } else if (randomSeed > 0) { //will up-b
		        if (cS[p] != 1) { //not jigglypuff
              returnInput[1] = 1.0;
              returnInput[3] = true;
            }
			  }
      } else {
        if (cS[p] == 0) { //is marth
    		  if (Math.abs(closest.x - cpu.phys.pos.x) <= 52) {
    			  returnInput[1] = 1.0;
    		    returnInput[3] = true;
    		  } //else moves towards ledge
		    }
		  }
    }
  } else {
    // if charSelect of player num is 2 meaning Fox
    if (cS[p] == 2) {
      //perfect imperfect firefox angles
      if (cpu.actionState == "UPSPECIAL") {
        if (cpu.timer == 41) {
          var imperfection = Math.floor(((Math.random() * 20) + 1) - 10) / 500;
          var theta = Math.atan((closest.y - cpu.phys.ledgeSnapBoxF.max.y) / (closest.x - cpu.phys.pos.x)) + imperfection; //some trig to get angles
          var newX = Math.cos(theta);//* Math.sqrt(2);
          var newY = Math.sin(theta); //* Math.sqrt(2);
          if (closest.x < cpu.phys.pos.x){
            newX *= -1;
            newY *= -1;
          }
          // dont go past 1.0 or -1.0
          newX = Math.sign(newX)*Math.min(1.0,Math.abs(newX));
          newY = Math.sign(newY)*Math.min(1.0,Math.abs(newY));

          returnInput[0] = newX;
          returnInput[1] = newY;

        }
      }
    }
  }
  return returnInput;
}
