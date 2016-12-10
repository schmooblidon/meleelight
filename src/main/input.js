/*eslint-disable*/

import {
  inverseMatrix,
  multMatVect
} from "main/linAlg";
import {Vec2D} from "./util/Vec2D";
import {keyMap} from "../settings";
import {playing} from "./main";

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
};

export const axis = {
  "lsX": 12, // left analog stick left/right
  "lsY": 13, // left analog stick up/down
  "csX": 14, // c-stick left/right
  "csY": 15, // c-stick up/down
  "lA" : 16, // L button analog sensor
  "rA" : 17  // R button analog sensor
};

export function inputData ( list = [false, false, false, false, false, false, false, false, false, false, false, false, 0, 0, 0, 0, 0, 0, 0, 0] ) {
 return {
    a : list[button["a"]],
        b : list[button["b"]],
        x : list[button["x"]],
        y : list[button["y"]],
        z : list[button["z"]],
        r : list[button["r"]],
        l : list[button["l"]],
        s : list[button["s"]],
        du : list[button["du"]],
        dr : list[button["dr"]],
        dd : list[button["dd"]],
        dl : list[button["dl"]],
        lsX : list[axis["lsX"]],
        lsY : list[axis["lsY"]],
        csX : list[axis["csX"]],
        csY : list[axis["csY"]],
        lA : list[axis["lA"]],
        rA : list[axis["rA"]],
        rawX : list[18],
        rawY : list[19]
  }
};

const nullInput = ()=>{return new inputData ()};

export const nullInputs = ()=>{return [ new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          ]};

export const aiPlayer1 = [ new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          ];
export const aiPlayer2 =  [ new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          ];
export const aiPlayer3 =  [ new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          , new inputData ( )
                          ];

export const aiPlayer4 = [ new inputData ( )
                         , new inputData ( )
                         , new inputData ( )
                         , new inputData ( )
                         , new inputData ( )
                         , new inputData ( )
                         , new inputData ( )
                         , new inputData ( )
                         ];

export const aiInputBank = [aiPlayer1,aiPlayer2,aiPlayer3,aiPlayer4];

// should be able to move out the "frameByFrame" aspect of the following function
// it is only used to make z button mean "left trigger value = 0.35" + "A = true".
export function pollInputs (gameMode, frameByFrame, controllerType, playerSlot, controllerIndex, keys,playertype) {
  // input is the input for player i in the current frame
  let input = nullInput(); // initialise with default values
  if(playertype !== 0 && gameMode === 3 ){
    return aiInputBank[playerSlot][0];
  }else if (controllerType == 10) { // keyboard controls
    input = pollKeyboardInputs(gameMode, frameByFrame, keys);
  }
    else if (playertype === 0) {
    input = pollGamepadInputs(gameMode, controllerType, playerSlot, controllerIndex, frameByFrame);
  }
  return input;
}

function pollKeyboardInputs(gameMode, frameByFrame, keys) {
  let input = nullInput(); // initialise with default values

  let stickR = 1;
  let stickL = 1;
  let stickU = 1;
  let stickD = 1;
  if (gameMode == 3 || gameMode == 5) {
    stickR = keyMap.lstick.ranges[1];
    stickL = keyMap.lstick.ranges[2];
    stickU = keyMap.lstick.ranges[0];
    stickD = keyMap.lstick.ranges[3];
  }
  let lstickX = (keys[keyMap.lstick.right[0]] || keys[keyMap.lstick.right[1]]) ? ((keys[keyMap.lstick.left[0]] ||
    keys[keyMap.lstick.left[1]]) ? 0 : stickR) : ((keys[keyMap.lstick.left[0]] || keys[keyMap.lstick.left[1]]) ?
    -stickL : 0);
  let lstickY = (keys[keyMap.lstick.up[0]] || keys[keyMap.lstick.up[1]]) ? ((keys[keyMap.lstick.down[0]] || keys[
    keyMap.lstick.down[1]]) ? 0 : stickU) : ((keys[keyMap.lstick.down[0]] || keys[keyMap.lstick.down[1]]) ? -
    stickD : 0);

  let lAnalog = (keys[keyMap.shoulders.lAnalog[0]] || keys[keyMap.shoulders.lAnalog[1]]) ? keyMap.shoulders.ranges[
    0] : 0;
  let rAnalog = (keys[keyMap.shoulders.rAnalog[0]] || keys[keyMap.shoulders.rAnalog[1]]) ? keyMap.shoulders.ranges[
    1] : 0;
  if (gameMode == 3 || gameMode == 5) {
    for (var j = 0; j < 5; j++) {
      if (keys[keyMap.lstick.modifiers[j][0]]) {
        lstickX *= keyMap.lstick.modifiers[j][1];
        lstickY *= keyMap.lstick.modifiers[j][2];
      }
      if (keys[keyMap.shoulders.modifiers[j][0]]) {
        lAnalog *= keyMap.shoulders.modifiers[j][1];
        rAnalog *= keyMap.shoulders.modifiers[j][2];
      }
    }
  }
  lstickX = Math.sign(lstickX) * Math.min(1, Math.abs(lstickX));
  lstickY = Math.sign(lstickY) * Math.min(1, Math.abs(lstickY));
  lAnalog = Math.min(1, Math.abs(lAnalog));
  rAnalog = Math.min(1, Math.abs(rAnalog));

  let cstickX = (keys[keyMap.cstick.right[0]] || keys[keyMap.cstick.right[1]]) ? ((keys[keyMap.cstick.left[0]] ||
    keys[keyMap.cstick.left[1]]) ? 0 : 1) : ((keys[keyMap.cstick.left[0]] || keys[keyMap.cstick.left[1]]) ? -1 :
    0);
  let cstickY = (keys[keyMap.cstick.up[0]] || keys[keyMap.cstick.up[1]]) ? ((keys[keyMap.cstick.down[0]] || keys[
    keyMap.cstick.down[1]]) ? 0 : 1) : ((keys[keyMap.cstick.down[0]] || keys[keyMap.cstick.down[1]]) ? -1 : 0);

  input.lsX = lstickX;
  input.lsY = lstickY;
  input.rawX = lstickX;
  input.rawY = lstickY;
  input.csX = cstickX;
  input.csY = cstickY;
  input.lA  = lAnalog;
  input.rA  = rAnalog;
  input.s   = keys[keyMap.s[0]] || keys[keyMap.s[1]];
  input.x   = keys[keyMap.x[0]] || keys[keyMap.x[1]];
  input.a   = keys[keyMap.a[0]] || keys[keyMap.a[1]];
  input.b   = keys[keyMap.b[0]] || keys[keyMap.b[1]];
  input.y   = keys[keyMap.y[0]] || keys[keyMap.y[1]];
  input.r   = keys[keyMap.r[0]] || keys[keyMap.r[1]];
  input.l   = keys[keyMap.l[0]] || keys[keyMap.l[1]];
  input.z   = keys[keyMap.z[0]] || keys[keyMap.z[1]];
  input.dl  = keys[keyMap.dl[0]];
  input.dd  = keys[keyMap.dd[0]];
  input.dr  = keys[keyMap.dr[0]];
  input.du  = keys[keyMap.du[0]];

  if (input.l) {
    input.lA = 1;
  }
  if (input.r) {
    input.rA = 1;
  }

  if (!frameByFrame && gameMode != 4) { // not in target builder or frame by frame mode
    if (input.z) {
      input.lA = 0.35;
      input.a = true;
    }
  }

  return input;
}

function pollGamepadInputs(gameMode, controllerType, playerSlot, controllerIndex, frameByFrame) {
  let input = nullInput();

  let gamepad = navigator.getGamepads()[controllerIndex];



  function axisData (ax) {
    return gpdaxis (gamepad, controllerType, ax );
  };
  function buttonData (but) {
    return gpdbutton (gamepad, controllerType, but);
  };

  let lsXData = axisData("lsX");
  let lsYData = axisData("lsY");

  let lsticks = scaleToMeleeAxes ( lsXData, // x-axis data
                                   lsYData, // y-axis data
                                   controllerType,
                                   true, // true: deadzones
                                   custcent[playerSlot].ls.x,  // x-axis "custom center" offset
                                   custcent[playerSlot].ls.y); // y-axis "custom center" offset
  let csticks = scaleToMeleeAxes ( axisData("csX"),
                                   axisData("csY"),
                                   controllerType,
                                   true,
                                   custcent[playerSlot].cs.x,
                                   custcent[playerSlot].cs.y);
   let rawlsticks =
                scaleToUnitAxes ( lsXData,
                                  lsYData,
                                  controllerType,
                                  custcent[playerSlot].ls.x,
                                  custcent[playerSlot].ls.y);
  let lstickX = lsticks[0];
  let lstickY = lsticks[1];
  let cstickX = csticks[0];
  let cstickY = csticks[1];
  let rawstickX = rawlsticks[0];
  let rawstickY = rawlsticks[1];

  let lAnalog = 0;
  let rAnalog = 0;


  if (controllerType == 3){
    lAnalog = scaleToGCTrigger(buttonData("l").value, 0.2-custcent[playerSlot].l, 1); // shifted by +0.2
    rAnalog = scaleToGCTrigger(buttonData("r").value, 0.2-custcent[playerSlot].r, 1); // shifted by +0.2
  }
  else if (controllerType == 2){
    lAnalog = scaleToGCTrigger(axisData("lA"),0.867-custcent[playerSlot].l, -0.6); // shifted by +0.867, flipped
    rAnalog = scaleToGCTrigger(axisData("rA"),0.867-custcent[playerSlot].r, -0.6); // shifted by +0.867, flipped
  }
  else if (controllerType == 7) { //Brook adapter has no L/R analog information, just light presses
    lAnalog = gamepad.buttons[6].pressed ? 0.3 : 0;
    rAnalog = gamepad.buttons[7].pressed ? 0.3 : 0;
  }
  else {
    lAnalog = scaleToGCTrigger(axisData("lA"),0.867-custcent[playerSlot].l, 0.6); // shifted by +0.867
    rAnalog = scaleToGCTrigger(axisData("rA"),0.867-custcent[playerSlot].r, 0.6); // shifted by +0.867
  }

  if (controllerType == 3) {
    // FOR XBOX CONTROLLERS
    input.r = buttonData("r").value > 0.95 ? true : false;
    input.l = buttonData("l").value > 0.95 ? true : false;

    // 4 is lB, 5 is RB
    if (gamepad.buttons[4].pressed) {
      input.l = true;
    }
  } else if (controllerType == 9) { // Rock Candy controller
    input.r = axisData("rA").value > 0.95 ? true : false;
    input.l = axisData("lA").value > 0.95 ? true : buttonData("l").pressed;
  } else {
    input.r = buttonData("r").pressed;
    input.l = buttonData("l").pressed;
  }


  input.lsX = lstickX;
  input.lsY = lstickY;
  input.rawX = rawstickX;
  input.rawY = rawstickY;
  input.csX = cstickX;
  input.csY = cstickY;
  input.lA = lAnalog;
  input.rA = rAnalog;
  input.s = buttonData("s").pressed;
  input.x = buttonData("x").pressed;
  input.a = buttonData("a").pressed;
  input.b = buttonData("b").pressed;
  input.y = buttonData("y").pressed;
  input.z = buttonData("z").pressed;


  if (controllerType == 9) { // Rock Candy controller, parameters to be confirmed
    input.dl = gamepad.axes[6] < -0.5 ? true : false;
    input.dr = gamepad.axes[6] >  0.5 ? true : false;
    input.dd = gamepad.axes[7] >  0.5 ? true : false;
    input.du = gamepad.axes[7] < -0.5 ? true : false;
  }
  else {
    input.dl = buttonData("dl").pressed;
    input.dd = buttonData("dd").pressed;
    input.dr = buttonData("dr").pressed;
    input.du = buttonData("du").pressed;
  }

  if (input.l) {
    input.lA = 1;
  }
  if (input.r) {
    input.rA = 1;
  }
  if (!frameByFrame && gameMode != 4) { // not in target builder
    if (input.z) {
      input.lA = 0.35;
      input.a = true;
    }
  }

  return input;
};

export function showButton(i, but, bool) {
  if (bool) {
    $("#" + i + "button" + but).show();
  }
  else {
    $("#" + i + "button" + but).hide();
  }
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
                    //   a  b  x  y  z  r   l   s  du  dr  dd  dl  lsX  lsY  csX  csY  lA  rA
const wiiULinuxMap   = [ 0, 3, 1, 2, 6, 5 , 4 , 7, 8 , 11, 9 , 10,  0,   1,   3,   4,  2,  5  ]; // ID 11, Official Wii U GC Adapter using wii-u-gc-adapter on Linux
                    //   a  b  x  y  z  r   l   s  du  dr  dd  dl  lsX  lsY  csX  csY  lA  rA

export const controllerMaps = [mayflashMap, vJoyMap, raphnetV2_9Map, xbox360Map, tigergameMap, retrolinkMap, raphnetV3_2Map, brookMap, ps4Map, rockx360Map
                              , null      , wiiULinuxMap];

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
controllerIDMap.set("79-1843", 0);

controllerIDMap.set("NEXILUX", 0); // NEXILUX GAMECUBE Controller Adapter
controllerIDMap.set("0079-1845", 0);
controllerIDMap.set("79-1845", 0);

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
controllerIDMap.set("289b-c", 2);

// ID 3, XBOX 360 or XInput standard gamepad
controllerIDMap.set("Microsoft Controller", 3); // XBOX 360 & XBOX One controllers
controllerIDMap.set("XBOX 360", 3); // ID: Xbox 360 Controller 
controllerIDMap.set("Microsoft X-Box One", 3); // ID: Microsoft X-Box One pad
controllerIDMap.set("XInput", 3);
controllerIDMap.set("Standard Gamepad", 3);
controllerIDMap.set("045e-02d1", 3);
controllerIDMap.set("45e-2d1", 3);

controllerIDMap.set("Wireless 360 Controller", 3); // XBOX 360 controller on Mac
controllerIDMap.set("045e-028e", 3);
controllerIDMap.set("45e-28e", 3);

// ID 4, TigerGame 3-in-1 adapter
controllerIDMap.set("TigerGame", 4); // ID: TigerGame XBOX+PS2+GC Game Controller Adapter
controllerIDMap.set("0926-2526", 4);
controllerIDMap.set("926-2526", 4);

// ID 5, Retrolink adapter
controllerIDMap.set("Generic USB Joystick", 5); // ID: Generic USB Joystick, TODO: should check ID and vendor...
controllerIDMap.set("0079-0006", 5);
controllerIDMap.set("79-6", 5);

// ID 6, raphnet n64 adapter, version 3.0 and above
controllerIDMap.set("GC/N64 to USB v3.", 6); // "v3.2" and "v3.3"
controllerIDMap.set("GC/N64 to USB, v3.", 6);
controllerIDMap.set("289b-001d", 6);
controllerIDMap.set("289b-1d", 6);

// ID 7, Brook adapter
controllerIDMap.set("Wii U GameCube Controller Adapter", 7);
controllerIDMap.set("0e8f-0003", 7);
controllerIDMap.set("e8f-3", 7);

// ID 8, PS4 controller
controllerIDMap.set("Wireless Controller", 8); // should check ID and vendor...
controllerIDMap.set("054c-05c4", 8);
controllerIDMap.set("54c-5c4", 8);

// ID 9, Rock Candy Xbox 360 controller
controllerIDMap.set("Performance Designed Products Rock Candy Gamepad for Xbox 360", 9);
controllerIDMap.set("0e6f-011f", 9);
controllerIDMap.set("e6f-11f", 9);

// ID 10: reserved for keyboard

// ID 11, Nintendo Wii U Adapter on Linux using wii-u-gc-adapter
controllerIDMap.set("0000-0000-Wii U GameCube Adapter", 11);

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
    case 11:
      return "Linux wii-u-gc-adapter";
      break;
    default:
      return "error: controller detected but not supported";
  }
};


// ----------------------------------------------------------------------------------------------------
// Melee input simulation


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

function meleeRound (x) {
  return Math.round(steps*x)/steps;
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
    return ([xnew2, ynew2].map(meleeRound));
}

// this is the main input rescaling function
// it scales raw input data to the data Melee uses for the simulation
// number : controller ID, to rescale axes dependent on controller raw input
// bool == false means no deadzone, bool == true means deadzone
export function scaleToMeleeAxes ( x, y, number = 0, bool = false, customCenterX = 0, customCenterY = 0 ) {
    if (number === 0 || number == 4 || number === 5 || number === 7) { // gamecube controllers
         x = ( x-customCenterX+1)*255/2; // convert raw input to 0 -- 255 values in obvious way
         y = (-y+customCenterY+1)*255/2; // y incurs a sign flip
         //console.log("You are using raw GC controller data.");
    }
    else { // convert raw input to 0 -- 255 by GC controller simulation
      [x, y] = scaleToGCAxes(x,y,number, customCenterX, customCenterY);
      //console.log("You are using GC controller simulation.");
    }
    return meleeAxesRescale ( [x,y], bool );
};

// scales -1 -- 1 data to the data Melee uses for the simulation
// bool == false means no deadzone, bool == true means deadzone
export function meleeRescale ( x, y, bool = false) {
    let [xnew, ynew] = scaleUnitToGCAxes (x, y);
    return meleeAxesRescale ( [xnew, ynew], bool );
};
