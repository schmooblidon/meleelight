/* eslint-disable */

window.creditsPlayer = 0;

const twoPi = Math.PI * 2;
//scrolling top down
var shoot_cooldown = 0;
var initc = true; //whether or not credits should be initialized. Should be set to true every time credits is activated
var cXSize = 1200; //not real values. Please update with real values of the size of the canvas
var cYSize = 750; //To consider when setting the cYSize. make room for bar at bottom showing information of that person?
//Current bar at bottom of screen is 50 pixels tall. Fill that shit out yourself.
var cScore = 0;
var cBoundX = (cXSize * 1.2098); //credits stick bounding octagon roughly circumscribes canvas size square
var cBoundY = (cYSize * 1.2098);
var cXPos = cXSize / 2;
var cYPos = cYSize / 2;
var cPlayerXPos = cXSize / 2;
var cPlayerYPos = cYSize / 2;
var cScrollingPos = 0;
var cScrollingMax = 2800; // max scrolling distance in y coords. Can change this when you want more names or w/e
var cScrollingSpeed = -2; //y pos per frame?             SEE THIS: maybe mess around with this a little. make it faster / slower
var lastHit = [0, 0, false]; //[timer,index of creditNames] timer is set whenever you hit a credit and counts down every frame. if it reaches 0, information is no longer displayed.
//lasthit[2] is for whether or not bottom bar is cleared.
window.ScrollingText = function(text, yPos, position, information) {
  this.Text = text;
  this.xPos = Math.floor((Math.random() * Math.round(cXSize * 0.66)) + (cXSize * .12));
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
    var size = this.size();
    if (size[1][0] < cY && size[1][1] > 0) { //can render
      this.canRender = true;
    } else {
      this.canRender = false;
    }
  }
  this.checkIfShot = function(x, y) { //updates this.isShot respectively
    if (this.isShot == false) {
      var size = this.size();
      if (x >= size[0][0] && x <= size[0][1] && y >= size[1][0] && y <= size[1][1]) {
        this.isShot = true;
        return true;
      } else {
        return false;
      }
    } else {
      return false; //can't be shot twice
    }
  }
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
var creditNames = []; //list of scrollingText objects SEE PLEASE:                FILL THIS SHIT IN

//font MUST be Courier because its a monospaced font and every letter in it is the same width. Wouldn't be able to calculate size without it
window.credits = function(p) { //called once every frame
  if (initc) {
    lastHit = [0, 0, false]; //see notes above
    creditNames = [
      new ScrollingText("Schmoo", 800, "Creator, Main Developer", "Made the game."),
      new ScrollingText("Tatatat0", 900, "Programmer", "Created the AI and credits."),
      new ScrollingText("bites", 1000, "Animation Assistant, Level Design",
        "Helped develop animation process & designed target stages."),
      new ScrollingText("WwwWario", 1100, "Support", "Helping users troubleshoot and being a homie!"),
      new ScrollingText("zircon", 1200, "Musician", "Smash Superstars (Menu Theme)"),
      new ScrollingText("Buoy", 1300, "Musician",
        "Rush of the Rainforest (YStory Theme) & Target Blitz (Target Theme)"),
      new ScrollingText("Tom Mauritzon", 1400, "Musician", "Mega Helix (PStadium Theme)"),
      new ScrollingText("Rozen", 1500, "Musician", "Kumite (Battlefield Theme)"),
      new ScrollingText("Zack Parrish", 1600, "Musician", "Sunny Side Up (Dreamland Theme)")
    ];
    cScore = 0;
    initc = false;
  }
  var yDif = 0;
  if (player[p].inputs.s[0]) {
    //is holding down start. Should increase speed
    yDif = Math.round(cScrollingSpeed * 1.5);
  } else {
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
      shoot_cooldown = 5;
    }
  } else {
    shoot_cooldown -= 1;
  }

  for (var n = 0; n < cShots.length; n++) {
    if (cShots[n].life == 15) {
      var madeShot = [false, 0];
      for (var i = 0; i < creditNames.length; i++) {
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

  if (player[p].inputs.b[0] && !player[p].inputs.b[1]) {
    initc = true;
    sounds.menuBack.play();
    player[p].inputs.b[1] = true;
    cShots = [];
    lastHit = [0, 0, false];
    creditNames = [];
    changeGamemode(1);
  }
}

window.drawCreditsInit = function() {
  bg2.clearRect(0, 0, 1200, 750);
  fg1.clearRect(0, 0, 1200, 750);
  fg2.clearRect(0, 0, 1200, 750);
  ui.clearRect(0, 0, 1200, 750);
  drawCreditsInfo();
}

window.cStar = function() {
  this.vel = 4 + Math.random() * 4;
  this.life = Math.round(Math.random() * 100 + 10 * (this.vel - 4));
  this.angle = twoPi * Math.random();
  this.pos = new Vec2D(600 + this.vel * Math.cos(this.angle) * this.life, 375 + this.vel * Math.sin(this.angle) *
    this.life);

}
var cStars = [];
for (var n = 0; n < 100; n++) {
  cStars.push(new cStar());
}

var cShots = [];
window.cShot = function(target, position, type) {
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

window.drawCreditsInfo = function() {
  ui.clearRect(0, 0, 1200, 750);
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

window.drawCredits = function() {
  fg1.clearRect(0, 0, 1200, 750);
  bg2.fillStyle = "rgba(0,0,0,0.4)";
  bg2.fillRect(0, 0, 1200, 750);
  for (var n = 0; n < 100; n++) {
    cStars[n].life++;
    if (cStars[n].life == 200) {
      cStars[n].vel = 4 + Math.random() * 4;
      cStars[n].life = Math.round(10 * (cStars[n].vel - 4));
      cStars[n].angle = twoPi * Math.random();
      cStars[n].pos = new Vec2D(600 + cStars[n].vel * Math.cos(cStars[n].angle) * cStars[n].life, 375 + cStars[n].vel *
        Math.sin(cStars[n].angle) * cStars[n].life);
    }
    cStars[n].pos.x += cStars[n].vel * Math.cos(cStars[n].angle);
    cStars[n].pos.y += cStars[n].vel * Math.sin(cStars[n].angle);
    var col = Math.min(255, cStars[n].life * 3)
    bg2.fillStyle = "rgb(" + col + "," + col + "," + col + ")";
    bg2.fillRect(cStars[n].pos.x, cStars[n].pos.y, 3, 3);
  }
  var cShotDestroyQueue = [];
  for (var m = 0; m < cShots.length; m++) {
    cShots[m].life++;
    cShots[m].vel *= 0.77;
    cShots[m].lastPosition2 = new Vec2D(cShots[m].lastPosition.x, cShots[m].lastPosition.y)
    cShots[m].lastPosition = new Vec2D(cShots[m].position.x, cShots[m].position.y);
    cShots[m].position.x += cShots[m].vel * cShots[m].distance * Math.cos(cShots[m].angle);
    cShots[m].position.y += cShots[m].vel * cShots[m].distance * Math.sin(cShots[m].angle);
    if (cShots[m].life == 25) {
      cShotDestroyQueue.push(m);
    } else {
      bg2.lineWidth = Math.max(1, (20 - cShots[m].life));
      bg2.strokeStyle = "rgb(5, 255, 15)";
      bg2.beginPath();
      bg2.moveTo(cShots[m].lastPosition2.x, 750 - cShots[m].lastPosition2.y);
      bg2.lineTo(cShots[m].position.x, 750 - cShots[m].position.y);
      bg2.closePath();
      bg2.stroke();
    }
  }
  var del = 0;
  for (var k = 0; k < cShotDestroyQueue.length; k++) {
    cShots.splice(cShotDestroyQueue[k] - del, 1);
    del++;
  }

  fg1.font = "500 36px Consolas";
  fg1.fillStyle = "white";
  fg1.textAlign = "start";
  for (var i = 0; i < creditNames.length; i++) {
    if (creditNames[i].canRender) {
      if (creditNames[i].isShot) {
        fg1.fillStyle = "rgb(227, 89, 89)";
      } else {
        fg1.fillStyle = "white";
      }
      fg1.fillText(creditNames[i].Text, creditNames[i].xPos, creditNames[i].yPos);
    }
  }
  fg1.strokeStyle = "rgba(255, 255, 255, 0.7)";
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
}
