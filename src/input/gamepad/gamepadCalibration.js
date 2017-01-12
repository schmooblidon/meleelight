// @flow
/*eslint indent:0*/
/*eslint prefer-arrow-callback:0*/
/*eslint prefer-const:0*/

import {Vec2D} from "../../main/util/Vec2D";
import {deepCopyObject} from "../../main/util/deepCopyObject";
import {setCustomGamepadInfo} from "./gamepads/custom";
import {setUsingCustomControls, currentPlayers} from "../../main/main";
import {updateControllerMenu} from "../../menus/controllermenu.js";
import {nullGamepadInfo} from "./gamepadInfo";
import {nullGamepad} from "./gamepad";

// eslint-disable-next-line no-duplicate-imports
import type {ButtonInfo, StickInfo, StickCardinals, TriggerInfo, DPadInfo, GamepadInfo} from "./gamepadInfo";
// eslint-disable-next-line no-duplicate-imports
import type {Gamepad, Button} from "./gamepad";


const calibrationInProgress = [false, false, false, false];
function setCalibrationInProgress (i : number, bool : bool) : void {
  calibrationInProgress[i] = bool;
}

let buttonsSnapshot;
let buttonsSnapshotL;
let buttonsSnapshotR;
let buttonsSnapshotU;
let axesSnapshot;
let axesSnapshotL;
let axesSnapshotR;
let axesSnapshotU;

export function runCalibration ( i : number ) : void {
  if (calibrationInProgress[i]) {
    return;
  }
  setCalibrationInProgress(i, true);
  
  const interval = 3000; // 3 seconds

  const j = currentPlayers[i];

  const gamepad = navigator.getGamepads ? navigator.getGamepads()[j] : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads()[j] : null);
  const gamepadInfo : GamepadInfo = nullGamepadInfo;
  gamepadInfo.ids = [{id: "custom controller"}];
  if (gamepad !== null) {
    calibrateGamepad( i, gamepad, gamepadInfo
                    , 0, interval
                    );
  }

}

function calibrateGamepad ( i : number
                          , gamepad : Gamepad, gamepadInfo : GamepadInfo
                          , passNumber : number, interval : number ) : void {
  let text;

  switch(passNumber) { // fire events
    case 0:
      text = "Beginning calibration of controller "+(i+1)+". Do not press anything.";
      setTimeout(function(){
        buttonsSnapshot = deepCopyObject(true, gamepad.buttons);
        axesSnapshot = deepCopyObject(true, gamepad.axes);
      }, interval);
      break;
    case 1:
      text = "Press A.";
      setTimeout(function(){ 
        gamepadInfo.a = scanForButton(buttonsSnapshot, gamepad.buttons, axesSnapshot, gamepad.axes);
      }, interval);
      break;
    case 2:
      text = "Press B.";
      setTimeout(function(){ 
        gamepadInfo.b = scanForButton(buttonsSnapshot, gamepad.buttons, axesSnapshot, gamepad.axes);
      }, interval);
      break;
    case 3:
      text = "Press X.";
      setTimeout(function(){ 
        gamepadInfo.x = scanForButton(buttonsSnapshot, gamepad.buttons, axesSnapshot, gamepad.axes);
      }, interval);
      break;
    case 4:
      text = "Press Y.";
      setTimeout(function(){ 
        gamepadInfo.y = scanForButton(buttonsSnapshot, gamepad.buttons, axesSnapshot, gamepad.axes);
      }, interval);
      break;
    case 5:
      text = "Press start.";
      setTimeout(function(){ 
        gamepadInfo.s = scanForButton(buttonsSnapshot, gamepad.buttons, axesSnapshot, gamepad.axes);
      }, interval);
      break;
    case 6:
      text = "Push L trigger all the way.";
      setTimeout(function(){ 
        gamepadInfo.l  = scanForButton (buttonsSnapshot, gamepad.buttons, axesSnapshot, gamepad.axes, true);
        gamepadInfo.lA = scanForTrigger(buttonsSnapshot, gamepad.buttons, axesSnapshot, gamepad.axes);
      }, interval);
      break;
    case 7:
      text = "Push R trigger all the way.";
      setTimeout(function(){ 
        gamepadInfo.r  = scanForButton (buttonsSnapshot, gamepad.buttons, axesSnapshot, gamepad.axes, true);
        gamepadInfo.rA = scanForTrigger(buttonsSnapshot, gamepad.buttons, axesSnapshot, gamepad.axes);
      }, interval);
      break;
    case 8:
      text = "Press Z.";
      setTimeout(function(){ 
        gamepadInfo.z = scanForButton(buttonsSnapshot, gamepad.buttons, axesSnapshot, gamepad.axes);
      }, interval);
      break;
    case 9:
      text = "Move the left analog stick all the way to the left.";
      setTimeout(function(){ 
        buttonsSnapshotL = deepCopyObject(true, gamepad.buttons);
        axesSnapshotL = deepCopyObject(true, gamepad.axes);
      }, interval);
      break;
    case 10:
      text = "Move the left analog stick all the way to the right.";
      setTimeout(function(){ 
        buttonsSnapshotR = deepCopyObject(true, gamepad.buttons);
        axesSnapshotR = deepCopyObject(true, gamepad.axes);
      }, interval);
      break;
    case 11:
      text = "Move the left analog stick all the way to the top.";
      setTimeout(function(){ 
        buttonsSnapshotU = deepCopyObject(true, gamepad.buttons);
        axesSnapshotU = deepCopyObject(true, gamepad.axes);
      }, interval);
      break;
    case 12:
      text = "Move the left analog stick all the way to the bottom.";
      setTimeout(function(){ 
        gamepadInfo.ls = scanForStick( buttonsSnapshot, buttonsSnapshotL, buttonsSnapshotR, buttonsSnapshotU, gamepad.buttons
                                     , axesSnapshot, axesSnapshotL, axesSnapshotR, axesSnapshotU, gamepad.axes);
      }, interval);
      break;
    case 13:
      text = "Move the c-stick all the way to the left.";
      setTimeout(function(){ 
        buttonsSnapshotL = deepCopyObject(true, gamepad.buttons);
        axesSnapshotL = deepCopyObject(true, gamepad.axes);
      }, interval);
      break;
    case 14:
      text = "Move the c-stick all the way to the right.";
      setTimeout(function(){ 
        buttonsSnapshotR = deepCopyObject(true, gamepad.buttons);
        axesSnapshotR = deepCopyObject(true, gamepad.axes);
      }, interval);
      break;
    case 15:
      text = "Move the c-stick all the way to the top.";
      setTimeout(function(){ 
        buttonsSnapshotU = deepCopyObject(true, gamepad.buttons);
        axesSnapshotU = deepCopyObject(true, gamepad.axes);
      }, interval);
      break;
    case 16:
      text = "Move the c-stick all the way to the bottom.";
      setTimeout(function(){ 
        gamepadInfo.cs = scanForStick( buttonsSnapshot, buttonsSnapshotL, buttonsSnapshotR, buttonsSnapshotU, gamepad.buttons
                                     , axesSnapshot, axesSnapshotL, axesSnapshotR, axesSnapshotU, gamepad.axes);
      }, interval);
      break;
    case 17:
      text = "Press d-pad left.";
      setTimeout(function(){ 
        buttonsSnapshotL = deepCopyObject(true, gamepad.buttons);
        axesSnapshotL = deepCopyObject(true, gamepad.axes);
      }, interval);
      break;
    case 18:
      text = "Press d-pad right.";
      setTimeout(function(){ 
        buttonsSnapshotR = deepCopyObject(true, gamepad.buttons);
        axesSnapshotR = deepCopyObject(true, gamepad.axes);
      }, interval);
      break;
    case 19:
      text = "Press d-pad up.";
      setTimeout(function(){ 
        buttonsSnapshotU = deepCopyObject(true, gamepad.buttons);
        axesSnapshotU = deepCopyObject(true, gamepad.axes);
      }, interval);
      break;
    case 20:
      text = "Press d-pad down.";
      setTimeout(function(){ 
        gamepadInfo.dpad = scanForDPad( buttonsSnapshot, buttonsSnapshotL, buttonsSnapshotR, buttonsSnapshotU, gamepad.buttons
                                      , axesSnapshot, axesSnapshotL, axesSnapshotR, axesSnapshotU, gamepad.axes);
      }, interval);
      break;
    case 21:
      console.log("Controller "+(i+1)+" calibration complete.");
      if (gamepadInfo.lA !== null && (gamepadInfo.lA.kind === "value" || gamepadInfo.lA.kind === "axis")) {
        gamepadInfo.isGC = Math.abs(gamepadInfo.lA.min + 0.866) < 0.01 ? true : false; // hacky but hey
      }
      setCustomGamepadInfo(i, gamepadInfo);
      setUsingCustomControls(i);
      setCalibrationInProgress(i, false);
      updateControllerMenu(passNumber, "Calibration complete!", interval);
      return;
    default:
      break;
  }

  updateControllerMenu(passNumber, text, interval);

  setTimeout( function() {
    calibrateGamepad( i, gamepad, gamepadInfo, passNumber+1, interval);
  }, interval);
}


function scanForButton ( buttons0 : ?Array<Button>, buttons1 : ?Array<Button>
                       , axes0 : ?Array<number>, axes1 : ?Array<number>
                       , onlyPressed : bool = false
                       ) : null | ButtonInfo {

  let buttonInfo = null;  

  if (!(   buttons0 === null || buttons0 === undefined
        || buttons1 === null || buttons1 === undefined)) {
    const bLg = buttons1.length;
    for (let i = 0; i < bLg; i++) {
      if (detectedButtonPressed(buttons0[i].pressed, buttons1[i].pressed)) {
        buttonInfo = { kind : "pressed", index : i };
        break;
      }
      else if (!onlyPressed && detectedButtonValue(buttons0[i].value, buttons1[i].value)) {
        buttonInfo = { kind : "value", index : i, threshold : 0.75 };
        break;
      }
    }
  }
  if (!(    axes0 === null || axes0 === undefined
         || axes1 === null || axes1 === undefined)) {
    if (!onlyPressed && buttonInfo === null) {
      const aLg = axes1.length;
      for (let j = 0; j < aLg; j++) {
        if (detectedButtonValue(axes0[j], axes1[j])) {
          buttonInfo = { kind : "axis", index : j, threshold : 0.75 };
          break;
        }
      }
    }
  }
  return buttonInfo;
};

function detectedButtonPressed ( pressed0 : bool, pressed1 : bool ) : bool {
  return pressed1 && !pressed0;
};

function detectedButtonValue ( value0 : number, value1 : number ) : bool {
  return (value0 < 0.25 && value1 > 0.75);
};


function scanForTrigger ( buttons0 : ?Array<Button>, buttons1 : ?Array<Button>
                        , axes0 : ?Array<number>, axes1 : ?Array<number>
                        ) : null | TriggerInfo {  
  let minMax;
  let triggerInfo = null;

  if (! (    axes0 === null || axes0 === undefined
          || axes1 === null || axes1 === undefined)) {
    const aLg = axes1.length;
    for (let i = 0; i < aLg && triggerInfo === null; i++) {
      minMax = detectedTrigger( axes0[i], axes1[i]);
      if (minMax !== null) {
        triggerInfo = { kind : "axis", index : i, min : minMax[0], max : minMax[1] };
        break;
      }
    }
  }
  if (!(   buttons0 === null || buttons0 === undefined
        || buttons1 === null || buttons1 === undefined)) {
    if (triggerInfo === null) {
      const bLg = buttons1.length;
      for (let j = 0; j < bLg && triggerInfo === null; j++) {
        minMax = detectedTrigger(buttons0[j].value, buttons1[j].value);
        if (minMax !== null) {
          triggerInfo = { kind : "value", index : j, min : minMax[0], max : minMax[1] };
          break;
        }
      }
    }
  }
  return triggerInfo;
}

function detectedTrigger ( axis0 : number, axis1 : number ) : null | [number, number] {
  if (Math.abs(axis1 - axis0) < 0.5) {
    return null;
  }
  else {
    return getMinAndMax(axis0, axis1);
  }
}

function getMinAndMax(axis0 : number, axis1 : number) : [number, number] {
  const min = axis0 < -0.87 ? -1 : axis0 < -0.5 ? -0.866 : axis0 > 0.87 ? 1 : axis0 > 0.5 ? 0.8667 : 0;
  const max = min === 0 ? Math.sign(axis1) : -min;
  return [min, max];
}

function scanForStick ( buttons0 : ?Array<Button>
                      , buttonsL : ?Array<Button>, buttonsR : ?Array<Button>
                      , buttonsU : ?Array<Button>, buttonsD : ?Array<Button>
                      , axes0 : ?Array<number>
                      , axesL : ?Array<number>, axesR : ?Array<number>
                      , axesU : ?Array<number>, axesD : ?Array<number> ) : null | StickInfo {
  let stickInfo = null;

  let xDiff = 0;
  let yDiff = 0;
  let newXDiff = 0;
  let newYDiff = 0;
  let xIndex;
  let yIndex;
  let kind;
  let cardinals : null | StickCardinals = null;

  if (! (   axes0 === null || axes0 === undefined
         || axesL === null || axesL === undefined
         || axesR === null || axesR === undefined
         || axesU === null || axesU === undefined
         || axesD === null || axesD === undefined)) {
    const aLg = axes0.length;
    kind = "axes";

    for (let i = 0; i < aLg; i++) {
      newXDiff = axesR[i]-axesL[i];
      if (Math.abs(newXDiff) > Math.abs(xDiff)) {
        xDiff = newXDiff;
        xIndex = i;
      }
      newYDiff = axesU[i]-axesD[i];
      if (Math.abs(newYDiff) > Math.abs(yDiff)) {
        yDiff = newYDiff;
        yIndex = i;
      }
    }
    if (xIndex !== undefined && yIndex !== undefined && Math.abs(xDiff) > 0.5 && Math.abs(yDiff) > 0.5) {
      cardinals = { center : new Vec2D ( axes0[xIndex], axes0[yIndex])
                  , left   : axesL[xIndex]
                  , right  : axesR[xIndex]
                  , up     : axesU[yIndex]
                  , down   : axesD[yIndex]
                  };
    }
  }

  if (! (   buttons0 === null || buttons0 === undefined
         || buttonsL === null || buttonsL === undefined
         || buttonsR === null || buttonsR === undefined
         || buttonsU === null || buttonsU === undefined
         || buttonsD === null || buttonsD === undefined)) {
    if (Math.abs(xDiff) < 0.5 || Math.abs(yDiff) < 0.5) {
      const bLg = buttons0.length;
      kind = "value";
      for (let j = 0; j < bLg; j++) {
        newXDiff = buttonsR[j].value-buttonsL[j].value;
        if (Math.abs(newXDiff) > Math.abs(xDiff)) {
          xDiff = newXDiff;
          xIndex = j;
        }
        newYDiff = buttonsU[j].value-buttonsD[j].value;
        if (Math.abs(newYDiff) > Math.abs(yDiff)) {
          yDiff = newYDiff;
          yIndex = j;
        }
      }
      if (xIndex !== undefined && yIndex !== undefined && Math.abs(xDiff) > 0.5 && Math.abs(yDiff) > 0.5) {
        cardinals = { center : new Vec2D ( buttons0[xIndex].value, buttons0[yIndex].value)
                    , left   : buttonsL[xIndex].value
                    , right  : buttonsR[xIndex].value
                    , up     : buttonsU[yIndex].value
                    , down   : buttonsD[yIndex].value
                    };
    }
    }
  }

  if (xIndex !== undefined && yIndex !== undefined) {
    if (kind === "axes") {
      stickInfo = { kind : "axes", xIndex : xIndex, yIndex : yIndex, cardinals : cardinals };
    }
    else {
      stickInfo = { kind : "value", xIndex : xIndex, yIndex : yIndex, cardinals : cardinals };
    }
  }
  return stickInfo;

}

function scanForDPad ( buttons0 : ?Array<Button>
                     , buttonsL : ?Array<Button>, buttonsR : ?Array<Button>
                     , buttonsU : ?Array<Button>, buttonsD : ?Array<Button>
                     , axes0 : ?Array<number>
                     , axesL : ?Array<number>, axesR : ?Array<number>
                     , axesU : ?Array<number>, axesD : ?Array<number> ) : null | DPadInfo {
  let dPadInfo = null;

  if (! (   buttons0 === null || buttons0 === undefined
         || buttonsL === null || buttonsL === undefined
         || buttonsR === null || buttonsR === undefined
         || buttonsU === null || buttonsU === undefined
         || buttonsD === null || buttonsD === undefined)) {
    const bLg = buttons0.length;
  
    let lIndex;
    let rIndex;
    let uIndex;
    let dIndex;
  
    for (let i = 0; i < bLg; i++) {
      if (lIndex === undefined && detectedButtonPressed(buttons0[i].pressed, buttonsL[i].pressed)) {
        lIndex = i;
      }
      if (rIndex === undefined && detectedButtonPressed(buttons0[i].pressed, buttonsR[i].pressed)) {
        rIndex = i;
      }
      if (uIndex === undefined && detectedButtonPressed(buttons0[i].pressed, buttonsU[i].pressed)) {
        uIndex = i;
      }
      if (dIndex === undefined && detectedButtonPressed(buttons0[i].pressed, buttonsD[i].pressed)) {
        dIndex = i;
      }
    }
  
    if (lIndex !== undefined && rIndex !== undefined && uIndex !== undefined && dIndex !== undefined) {
      dPadInfo = { kind : "buttons"
                 , upIndex : uIndex, downIndex : dIndex
                 , leftIndex : lIndex, rightIndex : rIndex 
                 };
    }
  }
  else if (! (   axes0 === null || axes0 === undefined
              || axesL === null || axesL === undefined
              || axesR === null || axesR === undefined
              || axesU === null || axesU === undefined
              || axesD === null || axesD === undefined)) {
    let xDiff = 0;
    let yDiff = 0;
    let newXDiff = 0;
    let newYDiff = 0;
    let xIndex;
    let yIndex;

    const aLg = axes0.length;
  
    for (let i = 0; i < aLg; i++) {
      newXDiff = axesR[i]-axesL[i];
      if (Math.abs(newXDiff) > Math.abs(xDiff)) {
        xDiff = newXDiff;
        xIndex = i;
      }
      newYDiff = axesU[i]-axesD[i];
      if (Math.abs(newYDiff) > Math.abs(yDiff)) {
        yDiff = newYDiff;
        yIndex = i;
      }
    }

    if (xIndex !== undefined && yIndex !== undefined) {

      if (Math.abs(xDiff) > 0.5 && Math.abs(yDiff) > 0.5 && xIndex !== yIndex) {
        dPadInfo = { kind : "2axes"
                   , xIndex : xIndex, yIndex : yIndex
                   , xFlip : (xDiff < 0), yFlip : (yDiff < 0) 
                   };
      }
      else { // lol
        dPadInfo = { kind : "axis", index : xIndex };
      }

    }
  }
  return dPadInfo;
}
