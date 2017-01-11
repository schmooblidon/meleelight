// @flow
/*eslint indent:0*/
/*eslint prefer-arrow-callback:0*/
/*eslint prefer-const:0*/

import {Vec2D} from "../../main/util/Vec2D";
import {deepCopyObject} from "../../main/util/deepCopyObject";
import {setCustomGamepadInfo} from "./gamepads/custom";
import {setUsingCustomControls} from "../../main/main";
import {updateControllerMenu} from "../../menus/controllermenu.js";

import type {ButtonInfo, StickInfo, StickCardinals, TriggerInfo, DPadInfo, GamepadInfo} from "./gamepadInfo";
import type {Gamepad, Button} from "./gamepad";


const calibrationInProgress = [false, false, false, false];
function setCalibrationInProgress (i : number, bool : bool) : void {
  calibrationInProgress[i] = bool;
}

export function runCalibration ( i : number, gamepad : Gamepad ) : void {
  if (calibrationInProgress[i]) {
    return;
  }
  setCalibrationInProgress(i, true);
  let buttons0;
  let buttons1;
  let axes0;
  let axes1;

  let buttonsL;
  let buttonsR;
  let buttonsU;
  let axesL;
  let axesR;
  let axesU;

  // initialise gamepad info
  const gamepadInfo = { a : null
                      , b : null
                      , x : null
                      , y : null
                      , s : null
                      , l : null
                      , r : null
                      , z : null
                      , lA : null
                      , rA : null
                      , dpad : null
                      , ls : null
                      , cs : null
                      , isGC : false
                      , ids : [{name : "custom controller"}]
                      };
  
  const interval = 3000; // 3 second

  const startText = "Beginning calibration of controller "+(i+1)+". Do not press anything.";

  calibrateGamepad( i, gamepad
                  , buttons0, buttons1, buttonsL, buttonsR, buttonsU
                  , axes0, axes1, axesL, axesR, axesU
                  , gamepadInfo
                  , 0, interval
                  , startText, interval
                  );

}

function calibrateGamepad ( i : number, gamepad : Gamepad
                          , buttons0 : ?Array<Button>, buttons1 : ?Array<Button>
                          , buttonsL : ?Array<Button>, buttonsR : ?Array<Button>, buttonsU : ?Array<Button>
                          , axes0 : ?Array<number>, axes1 : ?Array<number>
                          , axesL : ?Array<number>, axesR : ?Array<number>, axesU : ?Array<number>
                          , gamepadInfo : GamepadInfo
                          , passNumber : number, interval : number
                          , text : string, textTimer : number ) : void {

  let newText;
  let newTextTimer;
  let newButtons0;
  let newButtons1;
  let newAxes0;
  let newAxes1;
  let newButtonsL;
  let newButtonsR;
  let newButtonsU;
  let newAxesL;
  let newAxesR;
  let newAxesU;

  switch(passNumber) { // fire events
    case 0:
      newText = text;
      setTimeout(function(){
        deepCopyObject(true, gamepad.buttons, newButtons0);
        deepCopyObject(true, gamepad.axes, newAxes0);
      }, interval);      
      break;
    case 1:
      newText = "Press A.";
      setTimeout(function(){ 
        gamepadInfo.a = scanForButton(buttons0, gamepad.buttons, axes0, gamepad.axes);
      }, interval);
      break;
    case 2:
      newText = "Press B.";
      setTimeout(function(){ 
        gamepadInfo.b = scanForButton(buttons0, gamepad.buttons, axes0, gamepad.axes);
      }, interval);
      break;
    case 3:
      newText = "Press X.";
      setTimeout(function(){ 
        gamepadInfo.x = scanForButton(buttons0, gamepad.buttons, axes0, gamepad.axes);
      }, interval);
      break;
    case 4:
      newText = "Press Y.";
      setTimeout(function(){ 
        gamepadInfo.y = scanForButton(buttons0, gamepad.buttons, axes0, gamepad.axes);
      }, interval);
      break;
    case 5:
      newText = "Press start.";
      setTimeout(function(){ 
        gamepadInfo.s = scanForButton(buttons0, gamepad.buttons, axes0, gamepad.axes);
      }, interval);
      break;
    case 6:
      newText = "Press L trigger.";
      setTimeout(function(){ 
        gamepadInfo.l = scanForButton(buttons0, gamepad.buttons, axes0, gamepad.axes, true);
      }, interval);
      break;
    case 7:
      newText = "Press R trigger.";
      setTimeout(function(){ 
        gamepadInfo.r = scanForButton(buttons0, gamepad.buttons, axes0, gamepad.axes, true);
      }, interval);
      break;
    case 8:
      newText = "Press Z.";
      setTimeout(function(){ 
        gamepadInfo.z = scanForButton(buttons0, gamepad.buttons, axes0, gamepad.axes);
      }, interval);
      break;
    case 9:
      newText = "Push L trigger all the way.";
      setTimeout(function(){ 
        gamepadInfo.lA = scanForTrigger(buttons0, gamepad.buttons, axes0, gamepad.axes);
      }, interval);
      break;
    case 10:
      newText = "Push R trigger all the way.";
      setTimeout(function(){ 
        gamepadInfo.rA = scanForTrigger(buttons0, gamepad.buttons, axes0, gamepad.axes);
      }, interval);
      break;
    case 11:
      newText = "Move the left analog stick all the way to the left.";
      setTimeout(function(){ 
        deepCopyObject(true, gamepad.buttons, newButtonsL);
        deepCopyObject(true, gamepad.axes, newAxesL);
      }, interval);
      break;
    case 12:
      newText = "Move the left analog stick all the way to the right.";
      setTimeout(function(){ 
        deepCopyObject(true, gamepad.buttons, newButtonsR);
        deepCopyObject(true, gamepad.axes, newAxesR);
      }, interval);
      break;
    case 13:
      newText = "Move the left analog stick all the way to the top.";
      setTimeout(function(){ 
        deepCopyObject(true, gamepad.buttons, newButtonsU);
        deepCopyObject(true, gamepad.axes, newAxesU);
      }, interval);
      break;
    case 14:
      newText = "Move the left analog stick all the way to the bottom.";
      setTimeout(function(){ 
        gamepadInfo.ls = scanForStick( buttons0, buttonsL, buttonsR, buttonsU, gamepad.buttons
                                     , axes0, axesL, axesR, axesU, gamepad.axes);
      }, interval);
      break;
    case 15:
      newText = "Move the c-stick all the way to the left.";
      setTimeout(function(){ 
        deepCopyObject(true, gamepad.buttons, newButtonsL);
        deepCopyObject(true, gamepad.axes, newAxesL);
      }, interval);
      break;
    case 16:
      newText = "Move the c-stick all the way to the right.";
      setTimeout(function(){ 
        deepCopyObject(true, gamepad.buttons, newButtonsR);
        deepCopyObject(true, gamepad.axes, newAxesR);
      }, interval);
      break;
    case 17:
      newText = "Move the c-stick all the way to the top.";
      setTimeout(function(){ 
        deepCopyObject(true, gamepad.buttons, newButtonsU);
        deepCopyObject(true, gamepad.axes, newAxesU);
      }, interval);
      break;
    case 18:
      newText = "Move the c-stick all the way to the bottom.";
      setTimeout(function(){ 
        gamepadInfo.cs = scanForStick( buttons0, buttonsL, buttonsR, buttonsU, gamepad.buttons
                                     , axes0, axesL, axesR, axesU, gamepad.axes);
      }, interval);
      break;
    case 19:
      newText = "Press d-pad left.";
      setTimeout(function(){ 
        deepCopyObject(true, gamepad.buttons, newButtonsL);
        deepCopyObject(true, gamepad.axes, newAxesL);
      }, interval);
      break;
    case 20:
      newText = "Press d-pad right.";
      setTimeout(function(){ 
        deepCopyObject(true, gamepad.buttons, newButtonsR);
        deepCopyObject(true, gamepad.axes, newAxesR);
      }, interval);
      break;
    case 21:
      newText = "Press d-pad up.";
      setTimeout(function(){ 
        deepCopyObject(true, gamepad.buttons, newButtonsU);
        deepCopyObject(true, gamepad.axes, newAxesU);
      }, interval);
      break;
    case 22:
      newText = "Press d-pad down.";
      setTimeout(function(){ 
        gamepadInfo.dpad = scanForDPad( buttons0, buttonsL, buttonsR, buttonsU, gamepad.buttons
                                      , axes0, axesL, axesR, axesU, gamepad.axes);
      }, interval);
      break;
    case 23:
      console.log("Controller "+(i+1)+" calibration complete.");
      if (gamepadInfo.lA !== null && (gamepadInfo.lA.kind === "value" || gamepadInfo.lA.kind === "axis")) {
        gamepadInfo.isGC = Math.abs(gamepadInfo.lA.min + 0.866) < 0.01 ? true : false; // hacky but hey
      }
      setCustomGamepadInfo(i, gamepadInfo);
      setUsingCustomControls(i);
      setCalibrationInProgress(i, false);
      updateControllerMenu(passNumber, "Calibration complete!");
      return;
    default:
      break;
  }

  updateControllerMenu(passNumber, newText);

  if (newText === undefined) {
    newTextTimer = textTimer-1;
  }
  else {
    newTextTimer = interval;
    console.log(text+" Timer: "+interval+" ms.");
  }
  if (textTimer === 0) {
    console.log(text+" Timer: 0 ms.");
  }

  newButtons0 = newButtons0 === undefined ? buttons0 : newButtons0;
  newButtons1 = newButtons1 === undefined ? buttons1 : newButtons1;
  newAxes0 = newAxes0 === undefined ? axes0 : newAxes0;
  newAxes1 = newAxes1 === undefined ? axes1 : newAxes1;
  newButtonsL = newButtonsL === undefined ? buttonsL : newButtonsL;
  newButtonsR = newButtonsR === undefined ? buttonsR : newButtonsR;
  newButtonsU = newButtonsU === undefined ? buttonsU : newButtonsU;
  newAxesL = newAxesL === undefined ? axesL : newAxesL;
  newAxesR = newAxesR === undefined ? axesR : newAxesR;
  newAxesU = newAxesU === undefined ? axesU : newAxesU;

  setTimeout( function() {
    calibrateGamepad( i, gamepad
                    , newButtons0, newButtons1, newButtonsL, newButtonsR, newButtonsU
                    , newAxes0, newAxes1, newAxesL, newAxesR, newAxesU
                    , gamepadInfo
                    , passNumber+1, interval
                    , newText === undefined ? text : newText, newTextTimer);
  }, interval);
}


function scanForButton ( buttons0 : ?Array<Button>, buttons1 : ?Array<Button>
                       , axes0 : ?Array<number>, axes1 : ?Array<number>
                       , onlyPressed : bool = false
                       ) : null | ButtonInfo {
  if (   buttons0 === null || buttons0 === undefined
      || buttons1 === null || buttons1 === undefined
      || axes0 === null || axes0 === undefined
      || axes1 === null || axes1 === undefined ) { 
    return null;
  }
  let buttonInfo = null;

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
  if (!onlyPressed && buttonInfo === null) {
    const aLg = axes1.length;
    for (let j = 0; j < aLg; j++) {
      if (detectedButtonValue(axes0[j], axes1[j])) {
        buttonInfo = { kind : "axis", index : j, threshold : 0.75 };
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
  if (   buttons0 === null || buttons0 === undefined
      || buttons1 === null || buttons1 === undefined
      || axes0 === null || axes0 === undefined
      || axes1 === null || axes1 === undefined ) { 
    return null;
  }
  const aLg = axes1.length;
  let minMax;
  let triggerInfo = null;
  for (let i = 0; i < aLg && triggerInfo === null; i++) {
    minMax = detectedTrigger( axes0[i], axes1[i]);
    if (minMax !== null) {
      triggerInfo = { kind : "axis", index : i, min : minMax[0], max : minMax[1] };
    }
  }
  if (triggerInfo === null) {
    const bLg = buttons1.length;
    for (let j = 0; j < bLg && triggerInfo === null; j++) {
      minMax = detectedTrigger(buttons0[j].value, buttons1[j].value);
      if (minMax !== null) {
        triggerInfo = { kind : "value", index : j, min : minMax[0], max : minMax[1] };
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
  if (   buttons0 === null || buttons0 === undefined
      || buttonsL === null || buttonsL === undefined
      || buttonsR === null || buttonsR === undefined
      || buttonsU === null || buttonsU === undefined
      || buttonsD === null || buttonsD === undefined
      || axes0 === null || axes0 === undefined
      || axesL === null || axesL === undefined
      || axesR === null || axesR === undefined
      || axesU === null || axesU === undefined
      || axesD === null || axesD === undefined ) { 
    return null;
  }
  let stickInfo = null;

  let xDiff = 0;
  let yDiff = 0;
  let newXDiff = 0;
  let newYDiff = 0;
  let xIndex;
  let yIndex;
  let kind = "axes";

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
  }

  if (xIndex !== undefined && yIndex !== undefined && Math.abs(xDiff) > 0.5 && Math.abs(yDiff) > 0.5) {
    let cardinals : null | StickCardinals = null;
    if (kind === "axes") {
      cardinals = { center : new Vec2D ( axes0[xIndex], axes0[yIndex])
                  , left   : axesL[xIndex]
                  , right  : axesR[xIndex]
                  , up     : axesU[yIndex]
                  , down   : axesD[yIndex]
                  };
      stickInfo = { kind : "axes", xIndex : xIndex, yIndex : yIndex, cardinals : cardinals };
    }
    else {
      cardinals = { center : new Vec2D ( buttons0[xIndex].value, buttons0[yIndex].value)
                  , left   : buttonsL[xIndex].value
                  , right  : buttonsR[xIndex].value
                  , up     : buttonsU[yIndex].value
                  , down   : buttonsD[yIndex].value
                  };
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
  if (   buttons0 === null || buttons0 === undefined
      || buttonsL === null || buttonsL === undefined
      || buttonsR === null || buttonsR === undefined
      || buttonsU === null || buttonsU === undefined
      || buttonsD === null || buttonsD === undefined
      || axes0 === null || axes0 === undefined
      || axesL === null || axesL === undefined
      || axesR === null || axesR === undefined
      || axesU === null || axesU === undefined
      || axesD === null || axesD === undefined ) { 
    return null;
  }
  let dPadInfo = null;

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
  else {
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
