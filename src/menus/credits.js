import {player,ui,fg1,bg2, changeGamemode,fg2} from "main/main";
import {sounds} from "main/sfx";
import {Vec2D} from "../main/util/Vec2D";
/* eslint-disable */



const twoPi = Math.PI * 2;
//scrolling top down
let shoot_cooldown = 0;
let initc = true; //whether or not credits should be initialized. Should be set to true every time credits is activated
const cXSize = 1200; //not real values. Please update with real values of the size of the canvas
const cYSize = 750; //To consider when setting the cYSize. make room for bar at bottom showing information of that person?
//Current bar at bottom of screen is 50 pixels tall. Fill that shit out yourself.
let cScore = 0;
const cBoundX = (cXSize * 1.2098); //credits stick bounding octagon roughly circumscribes canvas size square
const cBoundY = (cYSize * 1.2098);
const cRectLength = 25;
const cRectSpace = 10;
const cDefaultAngles = [0,.5 * Math.PI, Math.PI, 1.5 * Math.PI];
let cCursorAngle = 0;
let cXPos = cXSize / 2;
let cYPos = cYSize / 2;
let cPlayerXPos = cXSize / 2;
let cPlayerYPos = cYSize / 2;
let cScrollingPos = 0;
let cScrollingMax = 2100;// max scrolling distance in y coords. Can change this when you want more names or w/e
const cScrollingSpeed = -2; //y pos per frame?             SEE THIS: maybe mess around with this a little. make it faster / slower
let lastHit = [0, 0, false]; //[timer,index of creditNames] timer is set whenever you hit a credit and counts down every frame. if it reaches 0, information is no longer displayed.
//lasthit[2] is for whether or not bottom bar is cleared.
let currentLaserColor = 0;//laser color vars
const laserColors = [
  "rgb(255, 15, 5)",
  "rgb(15, 5, 255)",
  "rgb(5, 255, 15)",
  "rgb(255, 85, 3)"
];
let laserColor = laserColors[currentLaserColor];

export function ScrollingText (text,yPos,position,information) {
  this.Text = text;
  this.xPos = Math.floor((Math.random() * Math.round(cXSize * 0.5)) + (cXSize * .25));
  this.yPos = yPos;
  this.fontSize = 36;
  //this.fontSize = fontSize; //font should always be Consolas. Font size IS 36px
  this.position = position; //position in development
  this.information = information; //more information?
  this.isShot = false; //whether or not it has been shot
  this.xMax = Math.floor((Math.random() * 150) + 50);
  this.xVal = 0;
  this.xDirection = Math.floor(Math.random() + 1);
  this.canRender = false;
  this.size = function() {
    return ([
      [this.xPos, this.xPos + (20 * this.Text.length)],
      [this.yPos - 23, this.yPos]
    ]); //returns [[xMin,xMax],[yMin,yMax]]
  }
  this.checkIfShouldRender = function(cY) { //                      SEE PLEASE?:  takes cYPos. if it can actually access that variable inside this scope, remove arguments.
    const size = this.size();
	  if (size[1][0] < cY && size[1][1] > 0) { //can render
		  this.canRender = true;
	  } else {
		  this.canRender = false;
	  }
  };
    this.isHovering = function(x, y) {
	  const size = this.size();
	  if (x >= size[0][0] && x <= size[0][1] && y >= size[1][0] && y <= size[1][1]) {
		  return true;
	  }
	  return false;
  }
  this.checkIfShot = function(x, y) {//updates this.isShot respectively
      if (this.isShot == false) {
	  if (this.isHovering(x,y)) {
		  this.isShot = true;
		  return true;
	  } else {
		  return false;
	  }
	  } else {
		  return false; //can't be shot twice
	  }
  };
  this.scrollY = function(y) {
	if ((this.xVal == this.xMax) && this.xDirection == 1) {
		this.xDirection = 0;
	} else if ((this.xVal == -1 * this.xMax) && this.xDirection == 0) {
		this.xDirection = 1;
	}
	this.xPos += -1 + (2 * this.xDirection);
	this.xVal += -1 + (2 * this.xDirection);
    this.yPos += y;
  }
}

let creditNames = []; //list of scrollingText objects SEE PLEASE:                FILL THIS SHIT IN

//font MUST be Courier because its a monospaced font and every letter in it is the same width. Wouldn't be able to calculate size without it
export function credits (p){ //called once every frame
   
  if (player[p].inputs.x[0] && !player[p].inputs.x[1]) {
    currentLaserColor = (currentLaserColor === laserColors.length - 1) ? 0 : currentLaserColor + 1;
    laserColor = laserColors[currentLaserColor];
  }
  if (player[p].inputs.y[0] && !player[p].inputs.y[1]) {
    currentLaserColor = (currentLaserColor === 0) ? (laserColors.length - 1) : currentLaserColor - 1;
    laserColor = laserColors[currentLaserColor];
  }
  if (initc) {
	cScrollingPos = 0;
    lastHit = [0, 0, false]; //see notes above
    creditNames = [
      new ScrollingText("Schmoo", 800, "Creator, Main Developer", "Made the game."),
      new ScrollingText("Tatatat0", 950, "Programmer", "Created the AI and credits."),
      new ScrollingText("bites", 1100, "Animation Assistant, Level Design",
        "Helped develop animation process & designed target stages."),
      new ScrollingText("WwwWario", 1250, "Support", "Helping users troubleshoot and being a homie!"),
      new ScrollingText("zircon", 1400, "Musician", "Smash Superstars (Menu Theme)"),
      new ScrollingText("Buoy", 1550, "Musician",
        "Rush of the Rainforest (YStory Theme) & Target Blitz (Target Theme)"),
      new ScrollingText("Tom Mauritzon", 1700, "Musician", "Mega Helix (PStadium Theme)"),
      new ScrollingText("Rozen", 1850, "Musician", "Kumite (Battlefield Theme)"),
      new ScrollingText("Zack Parrish", 2000, "Musician", "Sunny Side Up (Dreamland Theme)")
    ];
    cScore = 0;
	cCursorAngle = 0;
    initc = false;
  }
  //cScore = 9;

  if (cCursorAngle >= 360) {
	  cCursorAngle = 0;
  }
  cScrollingPos -= cScrollingSpeed;
  let yDif = 0;
  if (player[p].inputs.s[0] === true || player[p].inputs.l[0] === true || player[p].inputs.r[0] === true) {
    //is holding down start. Should increase speed
	cCursorAngle += 4.5;
    yDif = Math.round(cScrollingSpeed * 1.5);
  } else {
	cCursorAngle += 3;
    yDif = Math.round(cScrollingSpeed);
  }
  // iterate through creditNames and change y pos based on y dif
  for (var i = 0; i < creditNames.length; i++) {
    creditNames[i].scrollY(yDif); //scrolls credit names
    creditNames[i].checkIfShouldRender(cYSize); //updates render state
  }
  //draw credit information
  if (lastHit[0] > 0) {
    lastHit[0] -= 1;
  } else { //credit information timer is up
    if (lastHit[2] == false) {
      //CLEAR BOTTOM BAR. Do this yourself.
      lastHit[2] = true;
    }
  }

  //l stick to pos
  cPlayerXPos = Math.round(((cBoundX / 2) + ((player[p].inputs.rawlStickAxis[0].x) * (cBoundX / 2))) - ((cBoundX -
    cXSize) / 2));
  cPlayerYPos = Math.round(((cBoundY / 2) + ((-1 * player[p].inputs.rawlStickAxis[0].y) * (cBoundY / 2))) - ((cBoundY -
    cYSize) / 2));
  //cast positions to canvas size
  if (cPlayerXPos < 0) {
    cPlayerXPos = 0;
  }
  if (cPlayerXPos > cXSize) {
    cPlayerXPos = cXSize;
  }
  if (cPlayerYPos < 0) {
    cPlayerYPos = 0;
  }
  if (cPlayerYPos > cYSize) {
    cPlayerYPos = cYSize;
  }

  if (shoot_cooldown == 0) {

    if (player[p].inputs.a[0] && !(player[p].inputs.a[1])) {
      //is shooting
      sounds.foxlaserfire.play();
      cShots.push(new cShot(new Vec2D(cPlayerXPos, cPlayerYPos), new Vec2D(0, 0), 0));
      cShots.push(new cShot(new Vec2D(cPlayerXPos, cPlayerYPos), new Vec2D(1200, 0), 1));
      shoot_cooldown = 8;
    }
  } else {
    shoot_cooldown -= 1;
  }

  for (let n=0; n<cShots.length; n++){
    if (cShots[n].life == 15){
      let madeShot = [false, 0];
      for (let i = 0; i < creditNames.length; i++) {
        if (!(creditNames[i].isShot)) {
          if (creditNames[i].checkIfShot(cShots[n].target.x, 750 - cShots[n].target.y)) {
            madeShot = [true, i];
          }
        }
      }
      if (madeShot[0]) {
        sounds.targetBreak.play();
        lastHit[2] = false;
        lastHit[0] = 600;
        lastHit[1] = madeShot[1];
        cScore += 1;
        drawCreditsInfo();
      }
    }
  }

  if (cScrollingPos >= cScrollingMax) {
	if (cScore === creditNames.length) {
	  sounds.complete.play();
	} else {
	  sounds.failure.play();
    }
	initc = true;
    player[p].inputs.b[1] = true;
    cShots = [];
    lastHit = [0, 0, false];
    creditNames = [];
    changeGamemode(1);
  } else if (player[p].inputs.b[0] && !player[p].inputs.b[1]) {
    sounds.menuBack.play();		
    initc = true;
    player[p].inputs.b[1] = true;
    cShots = [];
    lastHit = [0, 0, false];
    creditNames = [];
    changeGamemode(1);
  }
}

export function drawCreditsInit (){
  bg2.clearRect(0,0,1200,750);
  fg1.clearRect(0,0,1200,750);
  fg2.clearRect(0,0,1200,750);
  ui.clearRect(0,0,1200,750);
  drawCreditsInfo();
}

export function cStar (){
  this.vel = 4+Math.random()*4;
  this.life = Math.round(Math.random()*100+10*(this.vel-4));
  this.angle = twoPi*Math.random();
  this.pos = new Vec2D(600+this.vel*Math.cos(this.angle)*this.life,375+this.vel*Math.sin(this.angle)*this.life);

}
const cStars = [];
for (let n=0; n<100; n++){
  cStars.push(new cStar());
}

var cShots = [];
export function cShot (target,position,type){
  this.vel = 0.3;
  this.life = 0;
  this.target = new Vec2D(target.x, 750 - target.y);
  this.position = position;
  this.lastPosition = position;
  this.lastPosition2 = position;
  this.angle = Math.atan((this.target.y - this.position.y) / (this.target.x - this.position.x));
  if (type) {
    this.angle = Math.PI + this.angle;
  }
  this.distance = Math.sqrt(Math.pow(this.target.y - this.position.y, 2) + Math.pow(this.target.x - this.position.x,
    2));
}

export function drawCreditsInfo (){
  ui.clearRect(0,0,1200,750);
  ui.font = "900 40px Consolas";
  ui.strokeStyle = "rgba(255, 255, 255, 0.7)";
  ui.lineWidth = 2;
  ui.fillStyle = "rgba(0,0,0,0.7)";
  ui.fillRect(100, 640, 1000, 60);
  ui.strokeRect(100, 640, 1000, 60);
  ui.fillRect(100, 560, 330, 70);
  ui.fillRect(430, 560, 670, 70);
  ui.strokeRect(100, 560, 330, 70);
  ui.strokeRect(430, 560, 670, 70);
  ui.fillRect(1000, 50, 150, 50);
  ui.strokeRect(1000, 50, 150, 50);
  ui.fillStyle = "white";
  ui.textAlign = "center";
  if (!lastHit[2]) {
    if (typeof creditNames[lastHit[1]] != "undefined") {
      ui.fillText(creditNames[lastHit[1]].Text, 265, 610);
      ui.font = "900 35px Consolas";
      ui.fillText(creditNames[lastHit[1]].position, 765, 610);
      ui.font = "900 25px Consolas";
      ui.fillText(creditNames[lastHit[1]].information, 600, 680);
    }
  }
  ui.font = "900 35px Consolas";
  ui.fillText(cScore + " Hit", 1075, 85);
}

export function drawCredits (){
  fg1.clearRect(0,0,1200,750);
  bg2.fillStyle = "rgba(0,0,0,0.4)";
  bg2.fillRect(0,0,1200,750);
  for (let n=0; n<100; n++){
    cStars[n].life++;
    if (cStars[n].life == 200) {
      cStars[n].vel = 4 + Math.random() * 4;
      cStars[n].life = Math.round(10 * (cStars[n].vel - 4));
      cStars[n].angle = twoPi * Math.random();
      cStars[n].pos = new Vec2D(600 + cStars[n].vel * Math.cos(cStars[n].angle) * cStars[n].life, 375 + cStars[n].vel *
        Math.sin(cStars[n].angle) * cStars[n].life);
    }
    cStars[n].pos.x += cStars[n].vel*Math.cos(cStars[n].angle);
    cStars[n].pos.y += cStars[n].vel*Math.sin(cStars[n].angle);
    const col = Math.min(255, cStars[n].life * 3);
    bg2.fillStyle = "rgb("+col+","+col+","+col+")";
    bg2.fillRect(cStars[n].pos.x,cStars[n].pos.y,3,3);
  }
  const cShotDestroyQueue = [];
  for (let m=0; m<cShots.length; m++){
    cShots[m].life++;
    cShots[m].vel *= 0.77;
    cShots[m].lastPosition2 = new Vec2D(cShots[m].lastPosition.x,cShots[m].lastPosition.y);
    cShots[m].lastPosition = new Vec2D(cShots[m].position.x,cShots[m].position.y);
    cShots[m].position.x += cShots[m].vel*cShots[m].distance*Math.cos(cShots[m].angle);
    cShots[m].position.y += cShots[m].vel*cShots[m].distance*Math.sin(cShots[m].angle);
    if (cShots[m].life == 25){
      cShotDestroyQueue.push(m);
    } else {
      bg2.lineWidth = Math.max(1, (20 - cShots[m].life));
      bg2.strokeStyle = laserColor;
      bg2.beginPath();
      bg2.moveTo(cShots[m].lastPosition2.x, 750 - cShots[m].lastPosition2.y);
      bg2.lineTo(cShots[m].position.x, 750 - cShots[m].position.y);
      bg2.closePath();
      bg2.stroke();
    }
  }
  let del = 0;
  for (let k=0; k<cShotDestroyQueue.length; k++){
    cShots.splice(cShotDestroyQueue[k]-del,1);
    del++;
  }

  fg1.font = "500 36px Consolas";
  fg1.fillStyle = "white";
  fg1.textAlign = "start";
  for (let i=0; i<creditNames.length; i++){
    if (creditNames[i].canRender){
      if (creditNames[i].isShot){
        fg1.fillStyle = "rgb(227, 89, 89)";
      } else {
        fg1.fillStyle = "white";
      }
      fg1.fillText(creditNames[i].Text, creditNames[i].xPos, creditNames[i].yPos);
    }
  }
  fg1.strokeStyle = "rgba(255, 255, 255, 0.7)";
  if (initc === false) {
	 for (let i = 0; i < creditNames.length; i++) {
        if (!(creditNames[i].isShot)) {
          if (creditNames[i].isHovering(cPlayerXPos,cPlayerYPos)) {
             fg1.strokeStyle = "rgba(204, 0, 0, 0.7)";
          }
        }
      }
  }
  if (initc === true) {
	  fg1.lineWidth = 9;
	  fg1.beginPath();
	  fg1.arc(cPlayerXPos, cPlayerYPos, 35, 0, twoPi);
	  fg1.moveTo(cPlayerXPos, cPlayerYPos + 35);
	  fg1.lineTo(cPlayerXPos, cPlayerYPos + 10);
	  fg1.moveTo(cPlayerXPos, cPlayerYPos - 35);
	  fg1.lineTo(cPlayerXPos, cPlayerYPos - 10);
	  fg1.moveTo(cPlayerXPos + 35, cPlayerYPos);
	  fg1.lineTo(cPlayerXPos + 10, cPlayerYPos);
	  fg1.moveTo(cPlayerXPos - 35, cPlayerYPos);
	  fg1.lineTo(cPlayerXPos - 10, cPlayerYPos);
	  fg1.closePath();
	  fg1.stroke();
  } else {
	  fg1.lineWidth = 9;
	  fg1.beginPath();
	  fg1.arc(cPlayerXPos, cPlayerYPos, 35, 0, twoPi);
	  //const cRectLength = 25;
	  //const cRectSpace = 10;
	  //const cDefaultAngles = [0,.5 * Math.PI, Math.PI, 1.5 * Math.PI,twoPi];
	  let radiansAngle = ((cCursorAngle / 180) * Math.PI);
	  let cRectPos = [[[0,0],[0,0]],[[0,0],[0,0]],[[0,0],[0,0]],[[0,0],[0,0]]];
	  for (let i = 0; i < cDefaultAngles.length; i++) {
	  	  cRectPos[i][0][0] = Math.cos((cDefaultAngles[i] + radiansAngle)) * (cRectSpace);
	  	  cRectPos[i][0][1] = Math.sin((cDefaultAngles[i] + radiansAngle)) * (cRectSpace);
	  	  cRectPos[i][1][0] = Math.cos((cDefaultAngles[i] + radiansAngle)) * (cRectLength + cRectSpace);
	  	  cRectPos[i][1][1] = Math.sin((cDefaultAngles[i] + radiansAngle)) * (cRectLength + cRectSpace);
	  }
	  for (let i = 0; i < cRectPos.length; i++) {
	   fg1.moveTo(cPlayerXPos + cRectPos[i][0][0], cPlayerYPos + cRectPos[i][0][1]);
	   fg1.lineTo(cPlayerXPos + cRectPos[i][1][0], cPlayerYPos + cRectPos[i][1][1]);		  
	  }
	  //for (let ia = 0; ia < cDefaultAngles.length; i++) {
	  //	 fg1.moveTo(cPlayerXPos + (Math.cos((cDefaultAngles[ia] + radiansAngle)) * (cRectSpace)), cPlayerYPos + (Math.sin((cDefaultAngles[ia] + radiansAngle)) * (cRectSpace)));
	  //  fg1.lineTo(cPlayerXPos + (Math.cos((cDefaultAngles[ia] + radiansAngle)) * (cRectLength + cRectSpace)), cPlayerYPos + (Math.sin((cDefaultAngles[ia] + radiansAngle)) * (cRectLength + cRectSpace)));	
	  //}
	  fg1.closePath();
	  fg1.stroke();	  
  }
}
