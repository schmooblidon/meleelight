// @flow
/*eslint indent:0*/

import {Vec2D} from "../../main/util/Vec2D";
import {deepCopyObject} from "../../main/util/deepCopyObject";
import {setCustomGamepadInfo} from "./gamepads/custom";
import {setUsingCustomControls, currentPlayers} from "../../main/main";
import {updateControllerMenu} from "../../menus/controllermenu.js";
import {nullGamepadInfo} from "./gamepadInfo";
import {getGamepad} from "./gamepad";

// eslint-disable-next-line no-duplicate-imports
import type {ButtonInfo, StickInfo, StickCardinals, TriggerInfo, DPadInfo, GamepadInfo} from "./gamepadInfo";
// eslint-disable-next-line no-duplicate-imports
import type {Gamepad, Button} from "./gamepad";


const calibrationInProgress = [false, false, false, false];
function setCalibrationInProgress (i : number, bool : bool) : void {
  calibrationInProgress[i] = bool;
}

function deepCopyButtons( gpd : Gamepad ) : Array<Button> {
  const lgB = gpd.buttons.length;
  const buttons = [];
  for (let i = 0; i < lgB; i++) {
    const button = gpd.buttons[i];
    buttons.push({value : button.value, pressed : button.pressed});
  } 
  return buttons;
}

function deepCopyAxes( gpd : Gamepad ) : Array<number> {
  const lgA = gpd.axes.length;
  const axes = [];
  for (let j = 0; j < lgA; j++) {
    axes.push(gpd.axes[j]);
  }
  return axes;
}

type Snapshots = { b0 : Array<Button>, bL : Array<Button>, bR : Array<Button>, bU : Array<Button>
                 , a0 : Array<number>, aL : Array<number>, aR : Array<number>, aU : Array<number> };

const nullSnapshots : Snapshots = { b0 : [], bL : [], bR : [], bU : []
                                  , a0 : [], aL : [], aR : [], aU : [] };


export function runCalibration ( i : number ) : void {
  if (calibrationInProgress[i]) {
    return;
  }
  setCalibrationInProgress(i, true);
  
  const interval = 3000; // 3 seconds

  const j = currentPlayers[i];

  const gamepadInfo : GamepadInfo = nullGamepadInfo;
  gamepadInfo.ids = [ { name : "custom controller" } ];
  calibrateGamepad( i, j, gamepadInfo
                  , nullSnapshots
                  , 0, interval
                  );

}

function calibrateGamepad ( i : number, j : number
                          , gamepadInfo : GamepadInfo
                          , snapshots : Snapshots
                          , passNumber : number, interval : number ) : void {
  let text;
  let gamepad;

  switch(passNumber) { // fire events
    case 0:
      text = "Beginning calibration of controller "+(j+1)+" (player "+(i+1)+"). Do not press anything.";
      setTimeout( () => {
        gamepad = getGamepad(j);
        snapshots.b0 = deepCopyButtons(gamepad);
        snapshots.a0 = deepCopyAxes(gamepad);
      }, interval);
      break;
    case 1:
      text = "Press A.";
      setTimeout( () => {
        gamepad = getGamepad(j);
        gamepadInfo.a = scanForButton(snapshots.b0, gamepad.buttons, snapshots.a0, gamepad.axes);
      }, interval);
      break;
    case 2:
      text = "Press B.";
      setTimeout( () => {
        gamepad = getGamepad(j);
        gamepadInfo.b = scanForButton(snapshots.b0, gamepad.buttons, snapshots.a0, gamepad.axes);
      }, interval);
      break;
    case 3:
      text = "Press X.";
      setTimeout( () => {
        gamepad = getGamepad(j);
        gamepadInfo.x = scanForButton(snapshots.b0, gamepad.buttons, snapshots.a0, gamepad.axes);
      }, interval);
      break;
    case 4:
      text = "Press Y.";
      setTimeout( () => {
        gamepad = getGamepad(j);
        gamepadInfo.y = scanForButton(snapshots.b0, gamepad.buttons, snapshots.a0, gamepad.axes);
      }, interval);
      break;
    case 5:
      text = "Press start.";
      setTimeout( () => {
        gamepad = getGamepad(j);
        gamepadInfo.s = scanForButton(snapshots.b0, gamepad.buttons, snapshots.a0, gamepad.axes);
      }, interval);
      break;
    case 6:
      text = "Push L trigger all the way.";
      setTimeout( () => {
        gamepad = getGamepad(j);
        gamepadInfo.l  = scanForButton (snapshots.b0, gamepad.buttons, snapshots.a0, gamepad.axes, true);
        gamepadInfo.lA = scanForTrigger(snapshots.b0, gamepad.buttons, snapshots.a0, gamepad.axes);
      }, interval);
      break;
    case 7:
      text = "Push R trigger all the way.";
      setTimeout( () => {
        gamepad = getGamepad(j);
        gamepadInfo.r  = scanForButton (snapshots.b0, gamepad.buttons, snapshots.a0, gamepad.axes, true);
        gamepadInfo.rA = scanForTrigger(snapshots.b0, gamepad.buttons, snapshots.a0, gamepad.axes);
      }, interval);
      break;
    case 8:
      text = "Press Z.";
      setTimeout( () => {
        gamepad = getGamepad(j);
        gamepadInfo.z = scanForButton(snapshots.b0, gamepad.buttons, snapshots.a0, gamepad.axes);
      }, interval);
      break;
    case 9:
      text = "Move the left analog stick all the way to the left.";
      setTimeout( () => {
        gamepad = getGamepad(j);
        snapshots.bL = deepCopyButtons(gamepad);
        snapshots.aL = deepCopyAxes(gamepad);
      }, interval);
      break;
    case 10:
      text = "Move the left analog stick all the way to the right.";
      setTimeout( () => {
        gamepad = getGamepad(j);
        snapshots.bR = deepCopyButtons(gamepad);
        snapshots.aR = deepCopyAxes(gamepad);
      }, interval);
      break;
    case 11:
      text = "Move the left analog stick all the way to the top.";
      setTimeout( () => {
        gamepad = getGamepad(j);
        snapshots.bU = deepCopyButtons(gamepad);
        snapshots.aU = deepCopyAxes(gamepad);
      }, interval);
      break;
    case 12:
      text = "Move the left analog stick all the way to the bottom.";
      setTimeout( () => {
        gamepad = getGamepad(j);
        gamepadInfo.ls = scanForStick( snapshots.b0, snapshots.bL, snapshots.bR, snapshots.bU, gamepad.buttons
                                     , snapshots.a0, snapshots.aL, snapshots.aR, snapshots.aU, gamepad.axes);
      }, interval);
      break;
    case 13:
      text = "Move the c-stick all the way to the left.";
      setTimeout( () => {
        gamepad = getGamepad(j);
        snapshots.bL = deepCopyButtons(gamepad);
        snapshots.aL = deepCopyAxes(gamepad);
      }, interval);
      break;
    case 14:
      text = "Move the c-stick all the way to the right.";
      setTimeout( () => {
        gamepad = getGamepad(j);
        snapshots.bR = deepCopyButtons(gamepad);
        snapshots.aR = deepCopyAxes(gamepad);
      }, interval);
      break;
    case 15:
      text = "Move the c-stick all the way to the top.";
      setTimeout( () => {
        gamepad = getGamepad(j);
        snapshots.bU = deepCopyButtons(gamepad);
        snapshots.aU = deepCopyAxes(gamepad);
      }, interval);
      break;
    case 16:
      text = "Move the c-stick all the way to the bottom.";
      setTimeout( () => {
        gamepad = getGamepad(j);
        gamepadInfo.cs = scanForStick( snapshots.b0, snapshots.bL, snapshots.bR, snapshots.bU, gamepad.buttons
                                     , snapshots.a0, snapshots.aL, snapshots.aR, snapshots.aU, gamepad.axes);
      }, interval);
      break;
    case 17:
      text = "Press d-pad left.";
      setTimeout( () => {
        gamepad = getGamepad(j);
        snapshots.bL = deepCopyButtons(gamepad);
        snapshots.aL = deepCopyAxes(gamepad);
      }, interval);
      break;
    case 18:
      text = "Press d-pad right.";
      setTimeout( () => {
        gamepad = getGamepad(j);
        snapshots.bR = deepCopyButtons(gamepad);
        snapshots.aR = deepCopyAxes(gamepad);
      }, interval);
      break;
    case 19:
      text = "Press d-pad up.";
      setTimeout( () => {
        gamepad = getGamepad(j);
        snapshots.bU = deepCopyButtons(gamepad);
        snapshots.aU = deepCopyAxes(gamepad);
      }, interval);
      break;
    case 20:
      text = "Press d-pad down.";
      setTimeout( () => {
        gamepad = getGamepad(j);
        gamepadInfo.dpad = scanForDPad( snapshots.b0, snapshots.bL, snapshots.bR, snapshots.bU, gamepad.buttons
                                      , snapshots.a0, snapshots.aL, snapshots.aR, snapshots.aU, gamepad.axes);
      }, interval);
      break;
    case 21:
      console.log("Controller "+(j+1)+" (player "+(i+1)+") calibration complete.");
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

  setTimeout( () => {
    calibrateGamepad( i, j, gamepadInfo, snapshots, passNumber+1, interval);
  }, interval);
}


function scanForButton ( buttons0 : Array<Button>, buttons1 : Array<Button>
                       , axes0 : Array<number>, axes1 : Array<number>
                       , onlyPressed : bool = false
                       ) : null | ButtonInfo {

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
        break;
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


function scanForTrigger ( buttons0 : Array<Button>, buttons1 : Array<Button>
                        , axes0 : Array<number>, axes1 : Array<number>
                        ) : null | TriggerInfo {  
  let minMax;
  let triggerInfo = null;

  const aLg = axes1.length;
  for (let i = 0; i < aLg && triggerInfo === null; i++) {
    minMax = detectedTrigger( axes0[i], axes1[i]);
    if (minMax !== null) {
      triggerInfo = { kind : "axis", index : i, min : minMax[0], max : minMax[1] };
      break;
    }
  }

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

function scanForStick ( buttons0 : Array<Button>
                      , buttonsL : Array<Button>, buttonsR : Array<Button>
                      , buttonsU : Array<Button>, buttonsD : Array<Button>
                      , axes0 : Array<number>
                      , axesL : Array<number>, axesR : Array<number>
                      , axesU : Array<number>, axesD : Array<number> ) : null | StickInfo {
  let stickInfo = null;

  let xDiff = 0;
  let yDiff = 0;
  let newXDiff = 0;
  let newYDiff = 0;
  let xIndex;
  let yIndex;
  let kind;
  let cardinals : null | StickCardinals = null;


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
 
function scanForDPad ( buttons0 : Array<Button>
                     , buttonsL : Array<Button>, buttonsR : Array<Button>
                     , buttonsU : Array<Button>, buttonsD : Array<Button>
                     , axes0 : Array<number>
                     , axesL : Array<number>, axesR : Array<number>
                     , axesU : Array<number>, axesD : Array<number> ) : null | DPadInfo {
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
