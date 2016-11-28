/* eslint-disable */

import {
  inverseMatrix,
  multMatVect
} from "main/linAlg";

export const button = {
  a: 0,
  b: 1,
  x: 2,
  y: 3,
  z: 4,
  r: 5,
  l: 6,
  s: 7, // start
  du: 8, // d-pad up
  dr: 9, // d-pad right
  dd: 10, // d-pad down
  dl: 11, // d-pad left
  lsX: 12, // left analog stick left/right
  lsY: 13, // left analog stick up/down
  csX: 14, // c-stick left/right
  csY: 15, // c-stick up/down
  lA: 16, // L button analog sensor
  rA: 17 // R button analog sensor
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

const mayflashMap  = [1, 2, 0, 3, 7, 5, 4, 9, 12, 13, 14, 15, 0, 1, 5, 2, 3, 4]; // ID 0, Mayflash Wii U 4-way adapter
const vJoyMap      = [0, 1, 2, 3, 4, 5, 6, 7, 8 , 11, 9 , 10, 0, 1, 3, 4, 2, 5]; // ID 1, vJoy
const raphnetMap   = [4, 3, 2, 1, 7, 6, 5, 0, 8 , 10, 9 , 11, 0, 1, 3, 4, 5, 6]; // ID 2, raphnet N64 adapter
const xbox360Map   = [0, 2, 1, 3, 5, 7, 6, 9, 12, 15, 13, 14, 0, 1, 2, 3, 6, 7]; // ID 3, XBOX 360 (XInput Standard Gamepad)
const tigergameMap = [0, 1, 2, 3, 6, 5, 4, 7, 11, 9 , 10, 8 , 0, 1, 2, 3, 5, 4]; // ID 4, TigerGame 3-in-1 adapter
const retrolinkMap = [2, 3, 1, 0, 6, 5, 4, 9, 10, 11, 8 , 7 , 0, 1, 2, 5, 3, 4]; // ID 5, Retrolink controller

export const controllerMaps = [mayflashMap, vJoyMap, raphnetMap, xbox360Map, tigergameMap, retrolinkMap];

const customDeadzone = function() {
  this.ls = new Vec2D(0, 0);
  this.cs = new Vec2D(0, 0);
  this.l = 0;
  this.r = 0;
};

export const cd = [new customDeadzone, new customDeadzone, new customDeadzone, new customDeadzone];

export function controllerNameFromIDnumber(number) {
  if (number == 0) {
    return "Mayflash Wii-U adapter";
  } else if (number == 1) {
    return "vJoy";
  } else if (number == 2) {
    return "raphnet N64 adapter";
  } else if (number == 3) {
    return "XBOX 360 compatible controller";
  } else if (number == 4) {
    return "TigerGame 3-in-1";
  } else if (number == 5) {
    return "Retrolink controller";
  } else {
    return "error: controller detected but not supported";
  }
};

export function controllerIDNumberFromGamepadID(gamepadID) {
  if (gamepadID[0] == "M" ||
      gamepadID.substring(0, 9) == "0079-1843" ||
      gamepadID.substring(0, 7) == "Wii U G" ||
      gamepadID.substring(0, 7) == "NEXILUX" ||
      gamepadID.substring(0, 9) == "0079-1845" ||
      gamepadID.substring(0, 3) == "USB" ||
      gamepadID.substring(0, 9) == "1a34-f705") {
    return 0;
  } // Mayflash Wii-U 4-way adapter
    // text ID on Chrome: MAYFLASH GameCube Controller Adapter (Vendor: 0079, Product:1843)
    // text ID on Firefox:
    // text ID on Linux: Wii U GameCube Adapter Port 4 (Vendor: 0000 Product: 0000)
    // OR
    // Nexilux adapter
    // text ID: NEXILUX GAMECUBE Controller Adapter (Vendor: 0079, Product: 1845)
    // OR
    // Mayflash 2 port
    // text ID: USB GamePad (Vendor: 1a34 Product: f705)
  else if (gamepadID.substring(0, 4) == "vJoy" ||
           gamepadID.substring(0, 9) == "1234-bead") {
    return 1;
  } // vJoy
    // text ID Firefox: 1234-bead-vJoy - Virtual Joystick
    // text ID Chrome: vJoy - Virtual Joystick (Vendor: 1234 Product: bead)
  else if (gamepadID.substring(0, 2) == "GC" ||
           gamepadID.substring(0, 9) == "289b-000c") {
    return 2;
  } // raphnet N64 adapter
    // text ID: GC/N64 to USB, v2.9 (Vendor: 289b Product: 000c)
  else if (gamepadID[0] == "X" ||
           gamepadID[0] == "x" ||
           gamepadID.substring(0, 8) == "Wireless" ||
           gamepadID.substring(0, 9) == "045e-02d1") {
    return 3;
  } // XBOX 360 controller, or general XInput standard gamepad
    // text ID: Xbox 360 Controller (XInput STANDARD GAMEPAD)
    // text ID on Mac: Wireless 360 Controller (STANDARD GAMEPAD Vendor: 045e Product: 028e)
    // XboxOne Controller (same mapping) text ID on Linux FireFox: 045e-02d1-Microsoft X-Box One pad Chromium: Microsoft Controller (Vendor: 045e Product: 02d1)
  else if (gamepadID.substring(0, 9) == "TigerGame" ||
           gamepadID.substring(0, 9) == "0926-2526") {
    return 4; // TigerGame 3-in-1 adapter
  }           // text ID: TigerGame XBOX+PS2+GC Game Controller Adapter (Vendor: 0926 Product:2526)
  else if (gamepadID.substring(0, 7) == "Generic" ||
           gamepadID.substring(0, 9) == "0079-0006") {
    return 5; // Retrolink adapter
  }           // text ID: Generic USB Joystick (Vendor: 0079 Product: 0006)

  else {
    return -1;
  }
};


// The following function renormalises axis input,
// so that corners (l = left, r = right, d=down, u=up) are mapped to the respective corners of the unit square.
// This function assumes that ALL coordinates have already been centered.
// Return type: [xnew,ynew]
export function renormaliseAxisInput([lx, ly], [rx, ry], [dx, dy], [ux, uy], [x, y]) {
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
      [dx, -rx],
      [dy, -ry]
    ]);
    return multMatVect(invMat, [x, y]);
  }
};

// The following functions renormalise input to mimic GC controllers.

// Analog sticks.
// x = axis input
export function scaleToGCAxis ( x, offset, bool ) {
    let xnew = (x+offset) / 0.75;
    if (xnew > 1) {
      return 1;
    }
    else if (xnew < -1) {
      return -1;
    }
    else if (bool && Math.abs(xnew) < 0.28){
      return 0;
    }
    else {
      return (Math.round (xnew*80)/80);
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
