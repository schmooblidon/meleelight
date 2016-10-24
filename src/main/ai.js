

//pls remove marth walljump?
//cpu[i].currentAction = "NONE"; //used for memory in the CPU besides checking action states. You figure out how this shit should be handled.
function runAI(i){
  player[i].inputs.lStickAxis[0].x = 0;
  player[i].inputs.lStickAxis[0].y = 0;
  player[i].inputs.x[0] = false;
  player[i].inputs.b[0] = false;
  player[i].inputs.l[0] = 0;
  player[i].inputs.lAnalog[0] = 0;
  player[i].inputs.cStickAxis[0].x = 0;
  player[i].inputs.cStickAxis[0].y = 0;
  player[i].inputs.a[0] = false;
  if (player[i].hit.hitstun > 0) { //stops action if they get interrupt. pretty simple? could also expand for DI
    player[i].currentAction = "NONE";
  }
  if (player[i].actionState == "REBIRTHWAIT") {
     player[i].inputs.lStickAxis[0].y = -1.0;
  }
  if (isOffstage(player[i]) && player[i].currentAction == "NONE"){
    var inputs = CPUrecover(player[i],i);
    //do inputs
    player[i].inputs.lStickAxis[0].x = inputs.lstickX;
    player[i].inputs.lStickAxis[0].y = inputs.lstickY;
    player[i].inputs.x[0] = inputs.x;
    player[i].inputs.b[0] = inputs.b;
  }
  if (player[i].actionState == "CLIFFWAIT" || player[i].currentAction == "LEDGEDASH"|| player[i].currentAction == "LEDGEAIRATTACK2" || player[i].currentAction == "LEDGEAIRATTACK" || player[i].currentAction == "LEDGESTALL" || player[i].currentAction == "LEDGEGETUP" || player[i].currentAction == "LEDGEATTACK" || player[i].currentAction == "LEDGESTALL" || player[i].currentAction == "LEDGEROLL" || player[i].currentAction == "LEDGEJUMP" || player[i].currentAction == "TOURNAMENTWINNER") {
    var inputs = CPULedge(player[i],i);
    //do inputs
    player[i].inputs.lStickAxis[0].x = inputs.lstickX;
    player[i].inputs.lStickAxis[0].y = inputs.lstickY;
    player[i].inputs.x[0] = inputs.x;
    player[i].inputs.b[0] = inputs.b;
    player[i].inputs.l[0] = inputs.l;
    if (player[i].inputs.l[0]){
      player[i].inputs.lAnalog[0] = 1;
    }
  	player[i].inputs.cStickAxis[0].x = inputs.cstickX;
  	player[i].inputs.cStickAxis[0].y = inputs.cstickY;
  	player[i].inputs.a[0] = inputs.a;
  }
  console.log(player[i].currentAction);
}

function NearestFloor(cpu) {
  // for each platform
  var nearestDist = 1000;
  var nearestY = -1000;
  for (var i=0;i<stage.platform.length;i++){
    // if cpu is above platform
    if (cpu.phys.pos.y > stage.platform[i][0].y && cpu.phys.pos.x >= stage.platform[i][0].x && cpu.phys.pos.x <= stage.platform[i][1].x){
      if (cpu.phys.pos.y - stage.platform[i][0].y < nearestDist){
        nearestDist = cpu.phys.pos.y - stage.platform[i][0].y;
        nearestY = stage.platform[i][0].y;
      }
    }
  }
  for (var i=0;i<stage.ground.length;i++){
    // if cpu is above platform
    if (cpu.phys.pos.y > stage.ground[i][0].y && cpu.phys.pos.x >= stage.ground[i][0].x && cpu.phys.pos.x <= stage.ground[i][1].x){
      if (cpu.phys.pos.y - stage.ground[i][0].y < nearestDist){
        nearestDist = cpu.phys.pos.y - stage.ground[i][0].y;
        nearestY = stage.ground[i][0].y;
      }
    }
  }
  return nearestY;
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

function CPULedge(cpu,p) {
  //var returnInput = [0.0,0.0,false,false,0.0,0.0,0.0,false];
  var returnInput = {
    lstickX : 0.0,
    lstickY : 0.0,
    x : false,
    b : false,
    l : false,
    cstickX : 0.0,
    cstickY : 0.0,
    a : false
  }; //lStickX,lstickY,x,b,Lanalog,cStickX,cStickY,A
	if (cpu.actionState == "LANDINGFALLSPECIAL" && cpu.currentAction == "LEDGEDASH") {
		cpu.currentAction = "NONE";
		return returnInput;
	} else if (cpu.currentAction == "TOURNAMENTWINNER") {
    if (cpu.actionState == "FALLAERIAL") {
      cpu.curentAction = "NONE";
    }
	}
	if (cpu.currentAction == "NONE") {
		var randomSeed = Math.floor((Math.random() * 25) + 1); //highest number of randomSeed can be increased or decrease to add artificial "difficulty level". Higher seeds = less difficulty
    var randomSeed = 20;
		if (randomSeed <= 3) {//normal getup
			cpu.currentAction = "LEDGEGETUP";
			returnInput.lstickX = cpu.phys.face;
		} else if (randomSeed <= 5) {//getup roll
			cpu.currentAction = "LEDGEROLL";
			returnInput.l = true;
		} else if (randomSeed <= 8) {//getup attack
			cpu.currentAction = "LEDGEATTACK";
			returnInput.a = true;
		} else if (randomSeed <= 9) {//tournament winner
			cpu.currentAction = "TOURNAMENTWINNER";
			returnInput.lstickY = 1.0;
		} else if (randomSeed <= 12) {//ledge jump
			cpu.currentAction = "LEDGEJUMP";
			returnInput.lstickY = -1.0;
			returnInput.x = true;
		} else if (randomSeed <= 15) {//ledgedash
			cpu.currentAction = "LEDGEDASH";
			returnInput.lstickY = -1.0;
			returnInput.x = true;
		} else if (randomSeed <= 17) {//ledgestall
		  cpu.currentAction = "LEDGESTALL";
			returnInput.lstickY = -1.0;
		} else if (randomSeed <= 20) {//ledgeairattack
			cpu.currentAction = "LEDGEAIRATTACK";
			returnInput.lstickY = -1.0;
		} //else does nothing
	} else if (cpu.currentAction == "LEDGEDASH") {
		//fox waits 4 frames
		//jiggs waits 5 frames
		//marth waits 17 frames...
	  if (cS[p] == 0) { //is marth
		    //might be one frame too late or early on timing on my end. pls fix?
			if (cpu.timer == 18) {//ledgedash?
				returnInput.lstickX = cpu.phys.face;
				returnInput.lstickY = -1.0;
				returnInput.l = true;
			} else {
				returnInput.lstickX = cpu.phys.face;
			}
		} else if (cS[p] == 1) {//is jiggs
		    if (cpu.timer == 6) {
				returnInput.lstickX = cpu.phys.face;
				returnInput.lstickY = -1.0;
				returnInput.l = true;
			} else {
				returnInput.lstickX = cpu.phys.face;
			}
		} else if (cS[p] == 2) {//is fox
		    if (cpu.timer == 5) {
				returnInput.lstickX = cpu.phys.face;
				returnInput.lstickY = -1.0;
				returnInput.l = true;
			} else {
				returnInput.lstickX = cpu.phys.face;
			}
		}
	} else if (cpu.currentAction == "LEDGEJUMP") {
    if (cpu.phys.grounded){
      returnInput.lstickX = 0;
      cpu.currentAction = "NONE";
    }
    else {
      returnInput.lstickX = cpu.phys.face; //moves forward?
    }
	} else if (cpu.currentAction == "LEDGEAIRATTACK") {
		if (cS[p] == 0) {//marth
			if(cpu.timer == 1) {
        returnInput.x = true; // jump
      }
      else if (cpu.timer == 3){
				var randomSeed = Math.floor((Math.random() * 4) + 1);//aerial to chose
				returnInput.lstickX = cpu.phys.face;
				if (randomSeed <= 2) { //fair
					returnInput.cstickX = cpu.phys.face;
				} else if (randomSeed == 3) { //nair
					returnInput.a = true;
				} else { //uair
					returnInput.cstickY = 1.0;
				}
				cpu.currentAction = "LEDGEAIRATTACK2";
			}
      else {
        returnInput.lstickX = cpu.phys.face;
      }
		} else if (cS[p] == 1) {//puff
      if (cpu.timer == 1){
        returnInput.x = true; //jump
      }
			else if(cpu.timer == 3) {
				var randomSeed = Math.floor((Math.random() * 4) + 1);//aerial to chose
				returnInput.lstickX = cpu.phys.face;
				if (randomSeed <= 2) { //fair
					returnInput.cstickX = cpu.phys.face;
				} else if (randomSeed == 3) { //nair
					returnInput.a = true;
				} else { //uair
					returnInput.cstickY = 1.0;
				}
				cpu.currentAction = "LEDGEAIRATTACK2";
			}
      else {
        returnInput.lstickX = cpu.phys.face;
      }
		} else if (cS[p] == 2) {//fox
      if (cpu.timer == 3){
        returnInput.x = true; //jump
      }
			else if(cpu.timer == 6) {
				var randomSeed = Math.floor((Math.random() * 4) + 1);//aerial to chose
        returnInput.lstickX = cpu.phys.face;
				if (randomSeed <= 2) { //dair
				    returnInput.a = true;
				} else if (randomSeed == 3) { //nair
					returnInput.cstickY = -1.0;
				} else { //uair
					returnInput.cstickY = 1.0;
				}
				cpu.currentAction = "LEDGEAIRATTACK2";
			}
      else {
        returnInput.lstickX = cpu.phys.face;
      }
		}
  } else if (cpu.currentAction == "LEDGEAIRATTACK2") {
    returnInput.lstickX = cpu.phys.face;
    //l cancel
    if (cpu.actionState == "ATTACKAIRN" || cpu.actionState == "ATTACKAIRF" || cpu.actionState == "ATTACKAIRB" || cpu.actionState == "ATTACKAIRU" || cpu.actionState == "ATTACKAIRD") {
      if (!isOffstage(cpu)){
        if (cpu.phys.pos.y - NearestFloor(cpu) <= 5) {
            //press the fucking l button
            returnInput.l = true;
        }
        if (cpu.phys.cVel.y <= 0) {
            if (!(cpu.phys.fastfalled)) {
                if (cpu.phys.pos.y - NearestFloor(cpu) >= 0) {
                  returnInput.lstickY = -1.0;
                }
            }
        }
        //other shit
      }
    }
		//l cancel
		//fast fall
		//other shit
    if (cpu.phys.grounded || cpu.phys.onLedge > -1){
      cpu.currentAction = "NONE";
    }
	}
	return returnInput;
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
  var returnInput = [0.0,0.0,false,false];
  var returnInput = {
    lstickX : 0.0,
    lstickY : 0.0,
    x : false,
    b : false
  }; //format is [x joystick float, y joystick float, x button, b button]
  if (cpu.actionState == "JUMPF" || cpu.actionState == "JUMPB" || cpu.actionState == "FALLAERIAL" || cpu.actionState == "JUMPAERIALB" || cpu.actionState == "JUMPAERIALF" || cpu.actionState == "DAMAGEFALL" || cpu.actionState == "FALL" || cpu.actionState == "FALLSPECIAL") {
    //not in up-b or some shit
    if (cpu.phys.pos.x < closest.x) {
      returnInput.lstickX = 1.0;
    } else if (cpu.phys.pos.x > closest.x) {
      returnInput.lstickX = -1.0;
    }

    if (cpu.phys.cVel.y <= 0) { //is falling
      if (!cpu.phys.doubleJumped || (cpu.phys.jumpsUsed < 5 && cpu.charAttributes.multiJump)) { //if jumps isn't .jumps thats unintuitive on your part. only tries to jump if it can jump
        var randomSeed = Math.floor((Math.random() * 1000) + 1);

        if (randomSeed <= 300) { //will jump
          returnInput.x = true;
        } else if (randomSeed <= 310) { //will up-b
		        if (cS[p] != 1) { //not jigglypuff
              returnInput.lstickY = 1.0;
              returnInput.b = true;
            }
			  }
      } else {
        if (cS[p] == 0) { //is marth
    		  if (Math.abs(closest.x - cpu.phys.pos.x) <= 52) {
    			  returnInput.lstickY = 1.0;
    		    returnInput.b = true;
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
          var imperfection = Math.floor(((Math.random() * 20) + 1) - 10) / 2000;
          var theta = Math.atan((closest.y - (cpu.phys.ledgeSnapBoxF.max.y-cpu.phys.ledgeSnapBoxF.min.y)/2) / (closest.x - cpu.phys.pos.x)) + imperfection; //some trig to get angles
          var newX = Math.cos(theta);//* Math.sqrt(2);
          var newY = Math.sin(theta); //* Math.sqrt(2);
          if (closest.x < cpu.phys.pos.x){
            newX *= -1;
            newY *= -1;
          }
          // dont go past 1.0 or -1.0
          newX = Math.sign(newX)*Math.min(1.0,Math.abs(newX));
          newY = Math.sign(newY)*Math.min(1.0,Math.abs(newY));

          returnInput.lstickX = newX;
          returnInput.lstickY = newY;

        }
      }
    }
  }
  return returnInput;
}
