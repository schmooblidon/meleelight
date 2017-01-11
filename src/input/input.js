/*eslint indent:0*/
// @flow

import {Vec2D} from "../main/util/Vec2D";
import {keyMap} from "../settings";
import {playing} from "../main/main";
import {buttonState, triggerValue, stickValue, dPadState } from "./gamepad/retrieveGamepadInputs";
import {gamepadInfoList} from "./gamepad/gamepadInfoList";
import {scaleToGCTrigger, scaleToMeleeAxes, scaleToUnitAxes} from "./meleeInputs";
import {runCalibration} from "./gamepad/gamepadCalibration";
import $ from 'jquery';

import type {GamepadInfo, StickCardinals} from "./gamepad/gamepadInfo";

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

type InputList = [bool, bool, bool, bool, bool, bool, bool, bool, bool, bool, bool, bool, number, number, number, number, number, number, number, number];

export function inputData ( list : InputList = [false, false, false, false, false, false, false, false, false, false, false, false, 0, 0, 0, 0, 0, 0, 0, 0] ) : any {
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
  };
};

const nullInput = () => new inputData ();

export const nullInputs = () => [ new inputData ( )
                                , new inputData ( )
                                , new inputData ( )
                                , new inputData ( )
                                , new inputData ( )
                                , new inputData ( )
                                , new inputData ( )
                                , new inputData ( )
                                ];
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
export function pollInputs ( gameMode : number, frameByFrame : bool, controllerInfo : "keyboard" | GamepadInfo
                           , playerSlot : number, controllerIndex : number, keys : any, playertype : number ) : any {
  // input is the input for player i in the current frame
  let input = nullInput(); // initialise with default values
  if(playertype !== 0 && gameMode === 3 ){
    return aiInputBank[playerSlot][0];
  }
  else if (controllerInfo === "keyboard") {
    input = pollKeyboardInputs(gameMode, frameByFrame, keys);
  }
  else if (playertype === 0) {
    input = pollGamepadInputs(gameMode, controllerInfo, playerSlot, controllerIndex, frameByFrame);
  }
  return input;
}

function pollKeyboardInputs(gameMode : number, frameByFrame : bool, keys : any) : any {
  const input = nullInput(); // initialise with default values

  let stickR = 1;
  let stickL = 1;
  let stickU = 1;
  let stickD = 1;
  if (gameMode === 3 || gameMode === 5) {
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
  if (gameMode === 3 || gameMode === 5) {
    for (let j = 0; j < 5; j++) {
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

  const cstickX = (keys[keyMap.cstick.right[0]] || keys[keyMap.cstick.right[1]]) ? ((keys[keyMap.cstick.left[0]] ||
    keys[keyMap.cstick.left[1]]) ? 0 : 1) : ((keys[keyMap.cstick.left[0]] || keys[keyMap.cstick.left[1]]) ? -1 :
    0);
  const cstickY = (keys[keyMap.cstick.up[0]] || keys[keyMap.cstick.up[1]]) ? ((keys[keyMap.cstick.down[0]] || keys[
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

  if (!frameByFrame && gameMode !== 4) { // not in target builder or frame by frame mode
    if (input.z) {
      input.lA = 0.35;
      input.a = true;
    }
  }

  return input;
}

function pollGamepadInputs( gameMode : number, gamepadInfo : GamepadInfo
                          , playerSlot : number, controllerIndex : number, frameByFrame : bool ) : any {

  const input = nullInput();

  if (navigator.getGamepads === undefined) {
    return input;
  }
  const gamepads = navigator.getGamepads();
  const gamepad = gamepads[controllerIndex];
  if (gamepad === null || gamepad === undefined) {
    return input;
  }

  // -------------------------------------------------------
  // analog sticks

  const lsVec = stickValue(gamepad, gamepadInfo, "ls");
  const csVec = stickValue(gamepad, gamepadInfo, "cs");
  const isGC = gamepadInfo.isGC;

  let lsCardinals = null;
  if (gamepadInfo.ls !== null) {
    lsCardinals = gamepadInfo.ls.cardinals;
  }
  let csCardinals = null;
  if (gamepadInfo.cs !== null) {
    csCardinals = gamepadInfo.cs.cardinals;
  }

  const lsticks = scaleToMeleeAxes ( lsVec.x // x-axis data
                                   , lsVec.y // y-axis data
                                   , isGC
                                   , lsCardinals
                                   , true // true: deadzones
                                   , custcent[playerSlot].ls.x // x-axis "custom center" offset
                                   , custcent[playerSlot].ls.y // y-axis "custom center" offset
                                   ); 
  const csticks = scaleToMeleeAxes ( csVec.x
                                   , csVec.y
                                   , isGC
                                   , csCardinals
                                   , true
                                   , custcent[playerSlot].cs.x
                                   , custcent[playerSlot].cs.y 
                                   );
  const rawlsticks = scaleToUnitAxes ( lsVec.x
                                     , lsVec.y
                                     , lsCardinals
                                     , custcent[playerSlot].ls.x
                                     , custcent[playerSlot].ls.y 
                                     );

  input.lsX  = lsticks[0];
  input.lsY  = lsticks[1];
  input.csX  = csticks[0];
  input.csY  = csticks[1];
  input.rawX = rawlsticks[0];
  input.rawY = rawlsticks[1];

  // -------------------------------------------------------
  // buttons

  input.s = buttonState(gamepad, gamepadInfo, "s");
  input.x = buttonState(gamepad, gamepadInfo, "x");
  input.a = buttonState(gamepad, gamepadInfo, "a");
  input.b = buttonState(gamepad, gamepadInfo, "b");
  input.y = buttonState(gamepad, gamepadInfo, "y");
  input.z = buttonState(gamepad, gamepadInfo, "z");

  // -------------------------------------------------------
  // triggers

  input.l = buttonState(gamepad, gamepadInfo, "y");
  input.r = buttonState(gamepad, gamepadInfo, "z");

  if (gamepadInfo.lA !== null) {
    const lA = gamepadInfo.lA;
    if ( lA.kind === "light") {
      input.lA = triggerValue(gamepad, gamepadInfo, "lA");
    }
    else {
      input.lA = scaleToGCTrigger( triggerValue(gamepad, gamepadInfo, "lA")   // raw trigger value
                                 , -lA.min-custcent[playerSlot].l // offset
                                 , lA.max-lA.min      // scaling
                                 );
    }
  }

  if (gamepadInfo.rA !== null) {
    const rA = gamepadInfo.rA;
    if ( rA.kind === "light") {
      input.rA = triggerValue(gamepad, gamepadInfo, "rA");
    }
    else {
      input.rA = scaleToGCTrigger( triggerValue(gamepad, gamepadInfo, "rA")   // raw trigger value
                                 , -rA.min-custcent[playerSlot].r // offset
                                 , rA.max-rA.min      // scaling
                                 );
    }
  }

  if (!frameByFrame && gameMode !== 4) { // not in target builder
    if (input.z) {
      input.lA = 0.35;
      input.a = true;
    }
  }

  if (input.l) {
    input.lA = 1;
  }
  if (input.r) {
    input.rA = 1;
  }

  if (input.lA > 0.95) {
    input.l = true;
  }
  if (input.rA > 0.95) {
    input.r = true;
  }

  // -------------------------------------------------------
  // d-pad

  const dPadData = dPadState(gamepad, gamepadInfo);
  input.dl = dPadData.left;
  input.dd = dPadData.down;
  input.dr = dPadData.right;
  input.du = dPadData.up;

  // -------------------------------------------------------
  // temporary calibration trigger

  if (input.z && input.x && input.b && input.dd) {
    runCalibration(controllerIndex, gamepad);
  }


  return input;
};

export function showButton(i : number, but : number, bool : bool) : void {
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

const customCenters = function() {
  this.ls = new Vec2D(0, 0);
  this.cs = new Vec2D(0, 0);
  this.l = 0;
  this.r = 0;
};

const custcent = [new customCenters, new customCenters, new customCenters, new customCenters];

export function setCustomCenters( i : number, ls0 : Vec2D, cs0 : Vec2D, l0 : number, r0 : number) : void {
  custcent[i].ls = ls0;
  custcent[i].cs = cs0;
  custcent[i].l = l0;
  custcent[i].r = r0;
}
