/*eslint-disable*/

import {
  inverseMatrix,
  multMatVect
} from "main/linAlg";
import {Vec2D} from "main/characters";

export const button = {
  "a" : 0, 
  "b" : 1,
  "x" : 2,
  "y" : 3,
  "z" : 4,
  "r" : 5,
  "l" : 6,
  "s" : 7,  // start
  "du": 8,  // d-pad up
  "dr": 9,  // d-pad right
  "dd": 10, // d-pad down
  "dl": 11  // d-pad left
}

export const axis = {
  "lsX": 12, // left analog stick left/right
  "lsY": 13, // left analog stick up/down
  "csX": 14, // c-stick left/right
  "csY": 15, // c-stick up/down
  "lA" : 16, // L button analog sensor
  "rA" : 17  // R button analog sensor
};

export const keyboardMap = [
  [102, 186],
  [101, 76],
  [100, 75],
  [104, 79],
  [103, 73],
  [105, 80],
  [107, 192, 222],
  [109, 219], 71, 78, 66, 86
];

                    //   a  b  x  y  z  r   l   s  du  dr  dd  dl  lsX  lsY  csX  csY  lA  rA
const mayflashMap    = [ 1, 2, 0, 3, 7, 5 , 4 , 9, 12, 13, 14, 15,  0,   1,   5,   2,  3,  4  ]; // ID 0, Mayflash Wii U 4-way adapter, NEXILUX adapter
const vJoyMap        = [ 0, 1, 2, 3, 4, 5 , 6 , 7, 8 , 11, 9 , 10,  0,   1,   3,   4,  2,  5  ]; // ID 1, vJoy
const raphnetV2_9Map = [ 4, 3, 2, 1, 7, 6 , 5 , 0, 8 , 10, 9 , 11,  0,   1,   3,   4,  5,  6  ]; // ID 2, raphnet v.2.9 N64 adapter
const xbox360Map     = [ 0, 1, 2, 3, 5, 7 , 6 , 9, 12, 15, 13, 14,  0,   1,   2,   3,  6,  7  ]; // ID 3, Xbox 360 (XInput Standard Gamepad)
const tigergameMap   = [ 0, 1, 2, 3, 6, 5 , 4 , 7, 11, 9 , 10, 8 ,  0,   1,   2,   3,  5,  4  ]; // ID 4, TigerGame 3-in-1 adapter
const retrolinkMap   = [ 2, 3, 1, 0, 6, 5 , 4 , 9, 10, 11, 8 , 7 ,  0,   1,   2,   5,  3,  4  ]; // ID 5, Retrolink adapter
const raphnetV3_2Map = [ 0, 1, 7, 8, 2, 5 , 4 , 3, 10, 13, 11, 12,  0,   1,   3,   4,  5,  2  ]; // ID 6, Raphnet v 3.2,3.3
const brookMap       = [ 0, 1, 2, 3, 4, 10, 11, 8, 12, 15, 13, 14,  0,   1,   2,   5,  3,  4  ]; // ID 7, Brook adapter (d-pad values might be wrong, user had broken d-pad)
const ps4Map         = [ 1, 0, 2, 3, 5, 7 , 6 , 9, 12, 15, 13, 14,  0,   1,   2,   5,  3,  4  ]; // ID 8, PS4 controller
const rockx360Map    = [ 0, 1, 2, 3, 5, 4 , 4 , 7, 12, 15, 13, 14,  0,   1,   3,   4,  2,  5  ]; // ID 9, Rock Candy Xbox 360 controller (d-pad are axes not buttons; axes to be confirmed)
                    //   a  b  x  y  z  r   l   s  du  dr  dd  dl  lsX  lsY  csX  csY  lA  rA
// ID number 10 reserved for keyboard


export const controllerMaps = [mayflashMap, vJoyMap, raphnetV2_9Map, xbox360Map, tigergameMap, retrolinkMap, raphnetV3_2Map, brookMap, ps4Map, rockx360Map];

// Checking gamepad inputs are well defined
export function gpdaxis ( gpd, gpdID, ax ) { // gpd.axes[n] but checking axis index is in range
  let number = controllerMaps[gpdID][axis[ax]];
  if (number > gpd.axes.length) {
   return 0;
  }
  else {
    const output = gpd.axes[number];
    if ( output === null || output == undefined) {
      return 0;
    }
    else {
      return output;
    }
  }
};
export function gpdbutton ( gpd, gpdID, but ) { // gpd.buttons[n] but checking button index is in range
  let number = controllerMaps[gpdID][button[but]];
  if (number > gpd.buttons.length) {
    return false;
  }
  else {
    const output = gpd.buttons[number];
    if ( output == null || output === undefined) {
      return false;
    }
    else {
      return output;
    }
  }
};


const customCenters = function() {
  this.ls = new Vec2D(0, 0);
  this.cs = new Vec2D(0, 0);
  this.l = 0;
  this.r = 0;
};

export const custcent = [new customCenters, new customCenters, new customCenters, new customCenters];


//--CONTROLLER IDs-------------------------------------
var controllerIDMap = new Map();


// ID 0, Mayflash Wii-U adapter & variants
controllerIDMap.set("Mayflash", 0); // Mayflash 4 port, ID: MAYFLASH GameCube Controller Adapter
controllerIDMap.set("0079-1843", 0);

controllerIDMap.set("NEXILUX", 0); // NEXILUX GAMECUBE Controller Adapter
controllerIDMap.set("0079-1845", 0);

controllerIDMap.set("Wii U GameCube Adapter", 0); // Mayflash 4 port on Linux, no vendor/product ID?

controllerIDMap.set("USB GamePad", 0); // Mayflash 2 port, ID: USB GamePad, TODO: should check vendor & product
controllerIDMap.set("1a34-f705", 0);

// ID 1, vJoy
controllerIDMap.set("vJoy", 1);
controllerIDMap.set("1234-bead", 1);

// ID 2, raphnet n64 adapter, version 2.9 (and below?)
controllerIDMap.set("GC/N64 to USB, v2.", 2);
controllerIDMap.set("GC/N64 to USB v2.", 2);
controllerIDMap.set("289b-000c", 2);

// ID 3, XBOX 360 or XInput standard gamepad
controllerIDMap.set("Microsoft Controller", 3); // XBOX 360 & XBOX One controllers
controllerIDMap.set("XBOX 360", 3); // ID: Xbox 360 Controller 
controllerIDMap.set("Microsoft X-Box One", 3); // ID: Microsoft X-Box One pad
controllerIDMap.set("XInput", 3);
controllerIDMap.set("Standard Gamepad", 3);
controllerIDMap.set("045e-02d1", 3);

controllerIDMap.set("Wireless 360 Controller", 3); // XBOX 360 controller on Mac
controllerIDMap.set("045e-028e", 3);

// ID 4, TigerGame 3-in-1 adapter
controllerIDMap.set("TigerGame", 4); // ID: TigerGame XBOX+PS2+GC Game Controller Adapter
controllerIDMap.set("0926-2526", 4);

// ID 5, Retrolink adapter
controllerIDMap.set("Generic USB Joystick", 5); // ID: Generic USB Joystick, TODO: should check ID and vendor...
controllerIDMap.set("0079-0006", 5);

// ID 6, raphnet n64 adapter, version 3.0 and above
controllerIDMap.set("GC/N64 to USB v3.", 6); // "v3.2" and "v3.3"
controllerIDMap.set("GC/N64 to USB, v3.", 6);
controllerIDMap.set("289b-001d", 6);

// ID 7, Brook adapter
controllerIDMap.set("Wii U GameCube Controller Adapter", 7);
controllerIDMap.set("0e8f-0003", 7);

// ID 8, PS4 controller
controllerIDMap.set("Wireless Controller", 8); // should check ID and vendor...
controllerIDMap.set("054c-05c4", 8);

// ID 9, Rock Candy Xbox 360 controller
controllerIDMap.set("Performance Designed Products Rock Candy Gamepad for Xbox 360", 8);
controllerIDMap.set("0e6f-011f", 8);

//--END OF CONTROLLER IDs-------------------------------------
    

export function controllerNameFromIDnumber(number) {
  switch (number) {
    case 0:
      return "Mayflash Wii-U adapter";
      break;
    case 1:
      return "vJoy";
      break;
    case 2:
      return "raphnet v2.9 N64 adapter";
      break;
    case 3:
      return "Xbox 360 compatible controller";
      break;
    case 4:
      return "TigerGame 3-in-1";
      break;
    case 5:
      return "Retrolink adapter";
      break;
    case 6:
      return "raphnet v3.2+ N64 adapter";
      break;
    case 7:
      return "Brook adapter";
      break;
    case 8:
      return "PS4 controller";
      break;
    case 9:
      return "Xbox 360 (Rock Candy) controller";
      break;
    default:
      return "error: controller detected but not supported";
  }
};


function fromCardinals([origx, origy], l, r, d,u) {
    return [[origx, origy], [l,origy], [r,origy], [origx,d], [origx, u]];
};

// parameters for GC controller simulation
// the following function gives an approximation to the extreme raw axis data for a given controller
// of course, this varies between controllers, but this serves as a useful first approximation
// function output: [[origx, origy], [lx, ly], [rx, ry], [dx, dy], [ux, uy]]
function axisDataFromIDNumber(number) {
  switch (number) {
    case 4 : // TigerGame 3-in-1
      return ( fromCardinals ( [0.05, -0.05], -0.7, 0.85, 0.7, -0.85) );
      break;
    case 3: // XInput controllers
    case 8: // PS4 controller    
    case 9: // Rock Candy Xbox 360 controller
      return ( fromCardinals ( [0, 0], -1, 1, 1, -1) );
      break;
    default:
      return ( fromCardinals ( [0, 0], -0.75, 0.75, 0.75, -0.75) );
  }
};

export function controllerIDNumberFromGamepadID(gamepadID) {
  var output = -1;
  for (var [possibleID, val] of controllerIDMap.entries()) {
    let l = possibleID.length;
    if (gamepadID.toLowerCase().substring(0,l) === possibleID.toLowerCase()) {
      output = val;
      break;
    }
  }
  return output;
};


// The following function renormalises axis input,
// so that corners (l = left, r = right, d=down, u=up) are mapped to the respective corners of the unit square.
// This function assumes that ALL coordinates have already been centered.
// Return type: [xnew,ynew]
function renormaliseAxisInput([lx, ly], [rx, ry], [dx, dy], [ux, uy], [x, y]) {
  if ((x * ry - y * rx <= 0) && (x * uy - y * ux >= 0)) // quadrant 1
  {
    let invMat = inverseMatrix([
      [rx, ux],
      [ry, uy]
    ]);
    return multMatVect(invMat, [x, y]);
  } else if ((x * uy - y * ux <= 0) && (x * ly - y * lx >= 0)) // quadrant 2
  {
    let invMat = inverseMatrix([
      [-lx, ux],
      [-ly, uy]
    ]);
    return multMatVect(invMat, [x, y]);
  } else if ((x * ly - y * lx <= 0) && (x * dy - y * dx >= 0)) // quadrant 3
  {
    let invMat = inverseMatrix([
      [-lx, -dx],
      [-ly, -dy]
    ]);
    return multMatVect(invMat, [x, y]);
  } else // quadrant 4
  {
    let invMat = inverseMatrix([
      [rx, -dx],
      [ry, -dy]
    ]);
    return multMatVect(invMat, [x, y]);
  }
};



// clamps a value between -1 and 1
function toInterval (x) {
  if (x < -1) {
    return -1;
  }
  else if (x > 1) {
    return 1;
  }
  else {
    return x;
  }
};




// Analog triggers.

// t = trigger input
export function scaleToGCTrigger ( t, offset, scale ) {
    let tnew = (t+offset) * scale;
    if (tnew > 1){
      return 1;
    }
    else if (tnew < 0.3){
      return 0;
    }
    else {
      return tnew;
    }
};



// ---------------------------
// GC controller simulation

const steps = 80;
const deadzoneConst = 0.28;
const leniency = 10;

const meleeOrig = 128;
const meleeMin  = meleeOrig - (steps+leniency) ; // lowest  0 -- 255 input the controller will give
const meleeMax  = meleeOrig + (steps+leniency) ; // highest 0 -- 255 input the controller will give

// rescales -1 -- 0 -- 1 to min -- orig -- max, and rounds to nearest integer
function discretise (x, min, orig, max) {
  if (x < 0) {
    return Math.round((x*(orig-min)+orig));
  }
  else if (x > 0) {
    return Math.round((x*(max-orig)+orig));
  }
  else {
    return orig;
  }
};


// Rescales controller input to -1 -- 0 -- 1 in both axes
export function scaleToUnitAxes ( x,y, number, customCenterX, customCenterY ) { // number = gamepad ID number
    let [[origx, origy], [lx, ly], [rx, ry], [dx, dy], [ux, uy]] = axisDataFromIDNumber(number);
    origx += customCenterX;
    origy += customCenterY;
    let [xnew, ynew] = renormaliseAxisInput([lx-origx, ly-origy], [rx-origx, ry-origy], [dx-origx, dy-origy], [ux-origx, uy-origy], [x-origx, y-origy]);
    return [toInterval(xnew), toInterval(ynew)];
};

// Rescales -1 -- 1 input to 0 -- 255 values to simulate a GC controller
function scaleUnitToGCAxes (x, y) {
  let xnew = discretise(x, meleeMin, meleeOrig, meleeMax);
  let ynew = discretise(y, meleeMin, meleeOrig, meleeMax);
  return ([xnew, ynew]);
};

// Rescales controller input to 0 -- 255 values to simulate a GC controller
function scaleToGCAxes (x, y, number, customCenterX, customCenterY) {
  let [xnew, ynew] = scaleToUnitAxes (x, y, number, customCenterX, customCenterY);
  return scaleUnitToGCAxes(xnew, ynew);
}


// ---------------------------------
// Melee input rescaling functions


// basic mapping from 0 -- 255 back to -1 -- 1 done by Melee
// boolean value: true = deadzones, false = no deadzones
function axisRescale ( x, orig = meleeOrig) {
  return (x-orig) / steps;
};

function unitRetract ( [x,y] ) {
  let norm = Math.sqrt(x*x + y*y);
  if (norm < 1) {
    return ([x,y]);
  }
  else {
    return ( [x/norm, y/norm]);
  }
};

function meleeAxesRescale ( [x,y], bool ) {
    let xnew = axisRescale (x, meleeOrig, bool);
    let ynew = axisRescale (y, meleeOrig, bool);
    let [xnew2, ynew2] = unitRetract( [xnew, ynew] );
    if (bool) {
      if (Math.abs(xnew2) < deadzoneConst) {
         xnew2 = 0;
      }
      if (Math.abs(ynew2) < deadzoneConst) {
        ynew2 = 0;
      }
    }
    return [xnew2, ynew2];
}

function meleeRound (x) {
  return Math.round(steps*x)/steps;
};


// this is the main input rescaling function
// it scales raw input data to the data Melee uses for the simulation
// number : controller ID, to rescale axes dependent on controller raw input
// bool == false means no deadzone, bool == true means deadzone
export function scaleToMeleeAxes ( x, y, number, bool, customCenterX, customCenterY ) {
    if (number === 0 || number == 4 || number === 5 || number === 7) { // gamecube controllers
         x = ( x-customCenterX+1)*255/2; // convert raw input to 0 -- 255 values in obvious way
         y = (-y+customCenterY+1)*255/2; // y incurs a sign flip
         //console.log("You are using raw GC controller data.");
    }
    else { // convert raw input to 0 -- 255 by GC controller simulation
      [x, y] = scaleToGCAxes(x,y,number, customCenterX, customCenterY);
      //console.log("You are using GC controller simulation.");
    }
    return (meleeAxesRescale ( [x,y], bool )).map(meleeRound);
};

// scales -1 -- 1 data to the data Melee uses for the simulation
// bool == false means no deadzone, bool == true means deadzone
export function meleeRescale ( x, y, bool = false) {
    let [xnew, ynew] = scaleUnitToGCAxes (x, y);
    return (meleeAxesRescale ( [xnew, ynew], bool)).map(meleeRound);
}