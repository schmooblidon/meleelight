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
  if (player[i].currentAction == "MASHING" && player[i].actionState == "WAIT" && player[i].timer > 2) {
	  player[i].currentAction = "NONE";
  }
  //if (player[i].currentSubaction.substr(0,2) == "TUMBLE" && !(player[i].actionState == "DAMAGEFALL") {
  //	  player[i].currentSubaction = "NONE";
  //}
  if (player[i].currentAction == "REVERSEUPTILT") {
	  if (!player[i].actionState in ["SMASHTURN","WAIT","UPTILT","LANDING"]) {
		  player[i].currentAction = "NONE";
		  player[i].currentSubaction = "NONE";
	  } else {
	  if (player[i].currentSubaction == "REVERSE") { //smash turn
		  player[i].inputs.lStickAxis[0].x = -1.0 * player[i].phys.face;
		  player[i].currentSubaction = "UPTILT";
		  return;
	  } else if (player[i].currentSubaction == "UPTILT" && player[i].timer > 1) {
		  player[i].inputs.lStickAxis[0].x = 0.0;
		  player[i].currentAction = "NONE";
		  player[i].currentSubaction = "NONE";
		  player[i].inputs.lStickAxis[0].y = .50;
		  player[i].inputs.a[0] = true;
		  return;
	  }
	  }
  }
  if (player[i].currentSubaction in ["LASER1","LASER2","REVERSE"]) {
	  if (player[i].hit.hitstun >= 0) {
		  player[i].currentSubaction = "NONE";
	  }
  }
  if (player[i].currentAction == "SMASHTURN") {
	  if (player[i].actionState == "WAIT" || player[i].timer > 0) {
		  player[i].currentAction = "NONE";
	  }
  }
  if (player[i].currentAction == "NONE") {
	  var distx = player[i].phys.pos.x - player[NearestEnemy(player[i],i)].phys.pos.x;
	  var disty = player[i].phys.pos.y - player[NearestEnemy(player[i],i)].phys.pos.y;
  if (player[i].phys.grounded && ((player[i].actionState == "WAIT" || (player[i].difficulty > 0 && player[i].phys.grounded && gameSettings.turbo && player[i].hasHit && (Math.floor((Math.random() * 10) + 1) >= 8 - (2 * player[i].difficulty)))) || Math.abs(distx) > 15) && ((player[i].difficulty > 0 && player[i].hasHit && gameSettings.turbo && player[i].phys.grounded) || player[i].actionState == "WAIT" || player[i].actionState == "DASH")  || (player[i].actionState == "LANDING" && player[i].timer > 3)) {//smash turn to face enemy
	  if (!(player[i].phys.face == -1.0 * (Math.sign(distx)))) {
		  player[i].currentAction = "SMASHTURN";
		  player[i].inputs.lStickAxis[0].x = -1.0 * player[i].phys.face;
		  return ;
	  } else {
		  if (cS[i] == 2 && Math.abs(distx) > 80 && Math.abs(disty) < 15) { //is fox
		      var randomSeed = Math.floor((Math.random() * 10) + 1);
			  if (randomSeed == 1) {
			  player[i].currentAction = "SHDL";
			  player[i].currentSubaction = "LASER1";
			  }
		  }
		  if (player[i].currentAction == "NONE") {

		  if (Math.abs(distx) < 23 && Math.abs(disty) < 15) {
			  var randomSeed = Math.floor((Math.random() * 100) + 1);
			  if (randomSeed <= 10) {//grab
			      player[i].inputs.z = true;
			      /*
				  player[i].inputs.l[0] = true;
				  player[i].inputs.lAnalog[0] = 1;
				  player[i].inputs.a = true;
				  */
			  } else if (randomSeed <= 25) {//tilt
			      var randomSeed1 = Math.floor((Math.random() * 100) + 1);
				  if (randomSeed1 <= 25) { //f-tilt
					  player[i].inputs.lStickAxis[0].x = 0.50;
				  } else if (randomSeed1 <= 50) { //d-tilt
					  player[i].inputs.lStickAxis[0].y = -0.50;
				  }  else if (randomSeed1 <= 75) { //up-tilt
				      if (cS[i] == 1 || cS[i] == 2) {
						  if (!(1.0 * Math.sign(distx) == player[i].phys.face)) {
						  player[i].currentAction = "REVERSEUPTILT";
						  player[i].currentSubaction = "REVERSE";
						  return;
						  } else {
						    player[i].inputs.lStickAxis[0].y = 0.50;
							player[i].inputs.a[0] = true;
						  }
					  } else {
					  //console.log(Math.sign(distx),":",player[i].phys.face)
					  player[i].inputs.lStickAxis[0].y = 0.50;
					  player[i].inputs.a[0] = true;
					  }
				  }
				  player[i].inputs.a[0] = true;
				  return;
			  } /* else if (randomSeed <= 20) {//shield
				  player[i].inputs.l[0] = true;
				  player[i].inputs.lAnalog[0] = 1;
			  } */
		  } }
	  }
    }
  }
  if (player[i].currentAction == "SHDL") {
	  var inputs = CPUSHDL(player[i],i);
	  player[i].inputs.x[0] = inputs.x;
	  player[i].inputs.b[0] = inputs.b;
  }
  if (player[i].currentAction == "TECH" || player[i].currentAction == "MISSEDTECH") {
	  if (player[i].actionState == "CLIFFWAIT" || player[i].actionState == "FALLN" || player[i].actionState == "WAIT") {
		  player[i].currentAction = "NONE";
	  }
  }
  if ((player[i].actionState == "DAMAGEFALL" || player[i].actionState == "DAMAGEFLYN") && (!isOffstage(player[i])) && player[i].difficulty != 0) {
	   if(player[i].hit.hitstun <= 0) {
		  var extra = 0;
		  if (!player[i].phys.doubleJumped || (player[i].phys.jumpsUsed < 5 && player[i].charAttributes.multiJump)) {
			  extra = 3
		  }
		  var randomSeed = Math.floor((Math.random() * (2 + extra)) + 1);
		  if (randomSeed == 1) {//left
			  player[i].inputs.lStickAxis[0].x = -1.0;
		  } else if (randomSeed == 2){ //right
			  player[i].inputs.lStickAxis[0].x = 1.0;
		  } else {//jump
			  player[i].inputs.x[0] = true;
		  }
		  player[i].currentAction = "NONE";
		  return ;
	  }
	  player[i].currentAction = "TECH";
	  var inputs = CPUTech(player[i],i);
	  player[i].inputs.lStickAxis[0].x = inputs.lstickX;
	  player[i].inputs.l[0] = inputs.l;
  }
    //if (player[i].actionState == "DAMAGEFALL") {
	//	var inputs = CPUTumble(player[i],i);
	//	player[i].inputs.lStickAxis[0].x = inputs.lstickX;
	//}
  if (player[i].actionState == "DOWNWAIT") { //missed tech options
      player[i].currentAction = "MISSEDTECH";
	  var inputs = CPUMissedTech(player[i],i);
	  player[i].inputs.lStickAxis[0].x = inputs.lstickX;
      player[i].inputs.lStickAxis[0].y = inputs.lstickY;
	  player[i].inputs.a[0] = inputs.a;
  }
  if (player[i].actionState != "DOWNWAIT") {

    if (player[i].actionState.substr(0,7) == "CAPTURE" && player[i].difficulty > 0 && player[i].actionState != "CAPTURECUT") { //break out of grabs
      player[i].currentAction = "MASHING";
  	  player[i].lastMash += 1;
  	  if (player[i].lastMash > (8 - (2 * (player[i].difficulty)))) {
  		  player[i].lastMash = 0;
  		  player[i].inputs.lStickAxis[0].y = 1.0;
  		  player[i].inputs.lAnalog[0] = 1;
		  if (!player[i].inputs.a[1]) {
  		  player[i].inputs.a[0] = true;
		  player[i].inputs.x[0] = true;
		  player[i].inputs.lStickAxis[0].x = -1.0;
		  player[i].inputs.cStickAxis[0].x = -1.0;
		  //player[i].inputs.r[0] = true;
		  } else {
		  player[i].inputs.y[0] = true;
		  player[i].inputs.lStickAxis[0].x = 1.0;
		  player[i].inputs.b[0] = true;
		  player[i].inputs.cStickAxis[0].x = 1.0;
		  //player[i].inputs.l[0] = true;
		  }
  	  }
    }
	if (player[i].currentAction == "WAVESHINEANY") {
		var inputs = CPUWaveshineAny(player[i],i);
		player[i].inputs.lStickAxis[0].x = inputs.lstickX;
		player[i].inputs.lStickAxis[0].y = inputs.lstickY;
		player[i].inputs.x[0] = inputs.x;
		player[i].inputs.b[0] = inputs.b;
		player[i].inputs.l[0] = inputs.l;
		if (player[i].inputs.l[0]){
        player[i].inputs.lAnalog[0] = 1;
        }
		return ;
	}
	if (player[i].currentAction != "WAVESHINEANY" && (player[i].actionState == "CAPTURECUT" || player[i].currentAction == "GRABRELEASE")) {
		currentAction = "GRABRELEASE";
		var inputs = CPUGrabRelease(player[i],i);
		player[i].inputs.lStickAxis[0].x = inputs.lstickX;
        player[i].inputs.lStickAxis[0].y = inputs.lstickY;
        player[i].inputs.x[0] = inputs.x;
        player[i].inputs.b[0] = inputs.b;
        player[i].inputs.l[0] = inputs.l;
    	player[i].inputs.cStickAxis[0].x = inputs.cstickX;
    	player[i].inputs.cStickAxis[0].y = inputs.cstickY;
    	player[i].inputs.a[0] = inputs.a;
		if (player[i].inputs.l[0]){
        player[i].inputs.lAnalog[0] = 1;
        }
		return ;
	}
    if (player[i].currentAction == "MASHING" && !(player[i].actionState.substr(0,7) == "CAPTURE")) {
  	  player[i].currentAction == "NONE";
  	  player[i].lastMash = 0;
    }
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
    	player[i].inputs.cStickAxis[0].x = inputs.cstickX;
    	player[i].inputs.cStickAxis[0].y = inputs.cstickY;
    	player[i].inputs.a[0] = inputs.a;
    }
  }
  if (player[i].inputs.l[0]){
    player[i].inputs.lAnalog[0] = 1;
  }
  //console.log(player[i].currentAction);
}

function NearestEnemy(cpu,p){
  var nearestEnemy = -1;
  var enemyDistance = 100000;
  for (var i=0;i<4;i++){
    if (playerType[i] > -1){
		if (playerType[i] > -1 && i != p && player[i].actionState != "SLEEP"){
      if (i != p){
        var dist = Math.pow(cpu.phys.pos.x-player[i].phys.pos.x,2)+Math.pow(cpu.phys.pos.y-player[i].phys.pos.y,2);
        if (dist < enemyDistance){
          enemyDistance = dist;
          nearestEnemy = i;
        }
      }
    }
	}
  }
  if (nearestEnemy == -1){
    nearestEnemy = 0;
    console.log("cant find nearest enemy");
    // fail safe so it doesnt crash at least
  }
  return nearestEnemy;
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

function isAboveGround(x,y) {
  var returnValue = [false,"none",0];
  var closest = 1000;
  var dist;
  for (var i=0;i<stage.ground.length;i++){
    if (x >= stage.ground[i][0].x && x <= stage.ground[i][1].x && y >= stage.ground[i][0].y){
      dist = y - stage.ground[i][0].y;
      if (dist < closest){
        closest = dist;
        returnValue = [true,"ground",stage.ground[i][0].y];
      }
    }
  }
  for (var i=0;i<stage.platform.length;i++){
    if (x >= stage.platform[i][0].x && x <= stage.platform[i][1].x && y >= stage.platform[i][0].y){
      dist = y - stage.platform[i][0].y;
      if (dist < closest){
        closest = dist;
        returnValue = [true,"platform",stage.platform[i][0].y];
      }
    }
  }
  return returnValue;
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
function CPUSHDL(cpu, p) {
	var returnInput = {
	x: false,
	b: false
	}
	if (cpu.actionState == "WAIT" || cpu.actionState == "DASH" || (cpu.actionState == "LANDING" && cpu.timer > 3)) {//jump
		returnInput.x = true;
	} else if (cpu.actionState == "KNEEBEND" && cpu.timer >= 3) {
		returnInput.b = true;
		cpu.currentSubaction = "LASER2";
	} else {
		if (cpu.timer == 10) {
			returnInput.b = true;
			cpu.currentSubaction = "NONE";
			cpu.currentAction = "NONE";
		}
	}
	return returnInput;
}
function CPUTech(cpu, p) {
	var returnInput = {
    lstickX : 0.0,
  	l : false,
  	lAnalog: 0.0
	};
    //console.log("1");
	//console.log("pos" , cpu.phys.pos.y);
	//console.log("nearest" , NearestFloor(cpu));
	if (cpu.phys.pos.y - NearestFloor(cpu) <= 3 && cpu.phys.kVel.y + cpu.phys.cVel.y <= 0) {
	   //console.log("trying to tech");
  	var MissedTechPercent = 85 - (cpu.difficulty * 20);//how often the CPU miss techs. difficulty: {1: 65%,2: 45%,3: 25%,4: 5%}
  	var randomSeed = Math.floor((Math.random() * 100 + MissedTechPercent) + 1);
  	//console.log("3");
  	if (randomSeed <= 34) {//inplace
  		returnInput.l = true;
  		returnInput.lAnalog = 1.0;
      //console.log("techinplace");
  	} else if (randomSeed <= 67) {//roll left
  	    returnInput.l = true;
  		returnInput.lstickX = -1.0;
  		returnInput.lAnalog = 1.0;
      //console.log("techrollleft");
  	} else if (randomSeed <= 100) { //roll right
  	    returnInput.l = true;
  		returnInput.lstickX = 1.0;
  		returnInput.lAnalog = 1.0;
      //console.log("techrollright");
  	} //otherwise miss tech
  	//console.log("4");
	}
	return returnInput;

}
function CPUMissedTech(cpu,p) {
	var returnInput = {
    lstickX : 0.0,
    lstickY : 0.0,
	   a : false
	};
	//console.log(randomSeed);
	var randomSeed = Math.floor((Math.random() * 10) + 1);
	//console.log(randomSeed);
	//console.log("2");
	if (randomSeed <= 2) {//getup attack
		returnInput.a = true;
		//returnInput.lstickX = -1.0;
	} else if (randomSeed <= 4) {//roll
		var randomSeeds = Math.floor((Math.random() * 2) + 1);
		if (randomSeeds == 1) { //left
			returnInput.lstickX = -1.0;
		} else { //right
			returnInput.lstickX = 1.0;
		}
	} else if (randomSeed <= 6) {//getup
		returnInput.lstickY = 1.0;
	} //else do nothing
	//console.log("3");
	return returnInput;
}
function CPUWaveshineAny(cpu,p) {
	var returnInput = {
	lstickX : 0.0,
    lstickY : 0.0,
    x : false,
	b : false,
	l : false,
	}

	if (cpu.actionState == "WAIT") {
		returnInput.lstickY = -1.0;
		returnInput.b = true;
	}
	if (cpu.actionState == "DOWNSPECIALGROUND") {
	  if (cpu.timer == 4) {
		  returnInput.x = true;
	  }
    } else if (cpu.actionState == "KNEEBEND" && (cpu.timer == 3)) {
	  var randomSeed = Math.floor((Math.random() * 3) + 1);
	  if (randomSeed == 1) {//foward
	      returnInput.lstickX = cpu.phys.face * 0.75;
	      returnInput.lstickY = -1.0;
		  returnInput.l = true;
		  cpu.currentAction = "NONE";
	  } else if (randomSeed == 2) {//in place
		  returnInput.lstickX = 0;
	      returnInput.lstickY = -1.0;
		  returnInput.l = true;
		  cpu.currentAction = "NONE";
	  } else { //backwards
		  returnInput.lstickX = cpu.phys.face * -0.75;
	      returnInput.lstickY = -1.0;
		  returnInput.l = true;
		  cpu.currentAction = "NONE";
	  }
    }
	return returnInput;
}
function CPUGrabRelease(cpu,p) {
  var returnInput = {
    lstickX : 0.0,
    lstickY : 0.0,
    x : false,
    b : false,
    l : false,
    cstickX : 0.0,
    cstickY : 0.0,
    a : false
  };
  if (cpu.actionState == "WAIT" || cpu.actionState == "CAPTURECUT") {
    if (cS[p] == 2) {//is fox
  	  var randomSeed = Math.floor((Math.random() * 125) + 1);
	  if (randomSeed < 4) { //waveshine
		  returnInput.b = true;
		  returnInput.lstickY = -1.0;
		  cpu.currentAction = "WAVESHINEANY";
		  return returnInput;
	  } else if (randomSeed < 45) {//jab
		  returnInput.a = true;
		  //cpu.currentAction = "NONE";
	  } else if (randomSeed == 85) {//roll
		  returnInput.l = true;
		  var randomSeed1 = Math.floor((Math.random() * 3) + 1);
		  if (randomSeed1 == 1) {
			  returnInput.cstickX = 1.0;
		  } else if (randomSeed1 == 2) {
			  returnInput.cstickY = -1.0;
		  } else {
			  returnInput.cstickX = -1.0;
		  }
		  //cpu.currentAction = "NONE";
	  } else if (randomSeed <= 125) {//jump
		  returnInput.x = true;
		  //cpu.currentAction = "NONE";
	  }
    } else { //all other characters
	  var randomSeed = Math.floor((Math.random() * 5) + 1);
	  if (randomSeed == 1) { //f-smash
		  returnInput.cstickX = cpu.phys.face;
		  //cpu.currentAction = "NONE";
	  } else if (randomSeed == 2) {//jab
		  returnInput.a = true;
		  //cpu.currentAction = "NONE";
	  } else if (randomSeed == 3) {//roll
		  returnInput.l = true;
		  var randomSeed1 = Math.floor((Math.random() * 3) + 1);
		  if (randomSeed1 == 1) {
			  returnInput.cstickX = 1.0;
		  } else if (randomSeed1 == 2) {
			  returnInput.cstickY = -1.0;
		  } else {
			  returnInput.cstickX = -1.0;
		  }
		  //cpu.currentAction = "NONE";
	  } else if (randomSeed == 4) {//jump
		  returnInput.x = true;
		  //cpu.currentAction = "NONE";
	  }
	}
  }
  return returnInput;
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
		var randomSeed = Math.floor((Math.random() * 30) + 1); //highest number of randomSeed can be increased or decrease to add artificial "difficulty level". Higher seeds = less difficulty
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
		} else if (randomSeed <= 16) {//ledgedash
			cpu.currentAction = "LEDGEDASH";
			returnInput.lstickY = -1.0;
			returnInput.x = true;
		} else if (randomSeed <= 20) {//ledgeairattack
			cpu.currentAction = "LEDGEAIRATTACK";
			returnInput.lstickY = -1.0;
		} else if (randomSeed <= 22) {//ledgestall
		  cpu.currentAction = "LEDGESTALL";
			returnInput.lstickY = -1.0;
		}//else does nothing
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
					returnInput.lstickX = 0;
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
					returnInput.lstickX = 0;
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
				returnInput.cstickX = 0.0;
				returnInput.a = false;
                returnInput.lstickX = cpu.phys.face;
				if (randomSeed <= 2) { //nair
				    returnInput.lstickX = 0;
				    returnInput.a = true;
				} else if (randomSeed == 3) { //dair
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
  if (cpu.actionState.substr(0,4) == "JUMP" || cpu.actionState == "FALLAERIAL" || cpu.actionState == "DAMAGEFALL" || cpu.actionState == "FALL" || cpu.actionState == "FALLSPECIAL") {
    //not in up-b or some shit
    if (cpu.phys.pos.x < closest.x) {
      returnInput.lstickX = 1.0;
    } else if (cpu.phys.pos.x > closest.x) {
      returnInput.lstickX = -1.0;
    }

    if (cpu.phys.cVel.y <= 0 && closest.y - cpu.phys.pos.y > -5) { //is falling
      if (!cpu.phys.doubleJumped || (cpu.phys.jumpsUsed < 5 && cpu.charAttributes.multiJump)) { //if jumps isn't .jumps thats unintuitive on your part. only tries to jump if it can jump
        var randomSeed = Math.floor((Math.random() * 1000) + 1);

        if (randomSeed <= 300) { //will jump
          returnInput.x = true;
        } else if (randomSeed <= 301) { //will up-b
		        if (cS[p] != 1) { //not jigglypuff
			  returnInput.lstickX = 0.0;
              returnInput.lstickY = 1.0;
              returnInput.b = true;
            }
			  }
      } else {
        if (cS[p] == 0) { //is marth
    		  if ((Math.abs(closest.x - cpu.phys.pos.x) <= 20 && closest.y - cpu.phys.pos.y > 30) || closest.y - cpu.phys.pos.y > 60) {
    			  returnInput.lstickY = 1.0;
    		    returnInput.b = true;
    		  } //else moves towards ledge
		    }
		if (cS[p] == 2) { //is fox
		    if ((Math.abs(closest.y - cpu.phys.pos.y) <= -20) && Math.abs(closest.x - cpu.phys.pos.x) >= 77) {//can side-b?
				randomSeed = Math.floor((Math.random() * 10) + 1);
				if (randomSeed <= 1) {
					returnInput.lstickX = 1 * Math.sign(closest.x - cpu.phys.pos.x);
					returnInput.b = true;
				} else if (randomSeed <= 4) {
					returnInput.lstickX = 0.0;
					returnInput.lstickY = 1.0;
					returnInput.b = true;
				}
			}
			if (closest.y - cpu.phys.pos.y >= 40 || Math.abs(closest.x - cpu.phys.pos.x) >= 50) {
				returnInput.lstickX = 0.0;
				returnInput.lstickY = 1.0;
				returnInput.b = true;
			}
		  }
		  }
    }
	if (cS[p] == 2 && returnInput.lStickY == 1.0) {
		returnInput.lStickX = 0.0;
	}
  } else {
    // if charSelect of player num is 2 meaning Fox
    if (cS[p] == 2) {
      //perfect imperfect firefox angles
      if (cpu.actionState == "UPSPECIAL") {
        if (cpu.timer == 41) {
          //var imperfection = Math.floor(((Math.random() * 20) + 1) - 10) / 2000;
		  var imperfection = 0;
          var theta = Math.atan((closest.y - cpu.phys.pos.y) / (closest.x - cpu.phys.pos.x)) + imperfection; //some trig to get angles //(cpu.phys.ledgeSnapBoxF.max.y-cpu.phys.ledgeSnapBoxF.min.y)/2
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
//player[i].phys.grounded
//this.phys.pos.y
//this.actionState
//player[p].inputs.x[0] = true
//player[p].inputs.b[0] = true
//player[p].inputs.lStickAxis[0].y =
//player[p].inputs.lStickAxis[0].x =
//player[p].phys.face
