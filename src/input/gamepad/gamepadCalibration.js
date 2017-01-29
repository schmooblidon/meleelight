// @flow
/*eslint indent:0*/

import {Vec2D} from "../../main/util/Vec2D";
import {deepCopyObject, deepCopyArray} from "../../main/util/deepCopy";
import {setUsingCustomControls, currentPlayers, setControllerReset, mType} from "../../main/main";
import {updateControllerMenu, setCustomInUse} from "../../menus/controllermenu.js";
import {nullGamepadInfo} from "./gamepadInfo";
import {getGamepad} from "./gamepad";
import {setCustomGamepadInfo, getCustomGamepadInfo, storeCustomGamepadInfo} from "./gamepads/custom";
import {getGamepadNameAndInfo} from "./findGamepadInfo";
import {sounds} from "../../main/sfx";

// eslint-disable-next-line no-duplicate-imports
import type {ButtonInfo, StickInfo, StickCardinals, TriggerInfo, DPadInfo, GamepadInfo} from "./gamepadInfo";
// eslint-disable-next-line no-duplicate-imports
import type {Gamepad, Button} from "./gamepad";


const calibrationInProgress = [false, false, false, false];
function setCalibrationInProgress (i : number, bool : bool) : void {
  calibrationInProgress[i] = bool;
}

type Snapshots = { b0 : Array<Button>, bL : Array<Button>, bR : Array<Button>, bU : Array<Button>
                 , a0 : Array<number>, aL : Array<number>, aR : Array<number>, aU : Array<number> };

const nullSnapshots : Snapshots = { b0 : [], bL : [], bR : [], bU : []
                                  , a0 : [], aL : [], aR : [], aU : [] };

type ClickObject = null | "a" | "b" | "x" | "y" | "ls" | "cs" | "s" | "r" | "l" | "z" | "dpad" 
                        | "icon" | "center" | "reset" | "exit" | "loadCustom" | "saveCustom";
let clickObject : ClickObject = null;

export function setClickObject ( click : ClickObject) : void {
  if (clickObject === null) {
    clickObject = click;
  }
}

let clickObjectNumber = 0;

export function setClickObjectNumber ( k : number ) : void {
  clickObjectNumber = k;
}

export const customGamepadInfoIsUsable : Array<null | bool> = [true, null, null, null, null, null, null, null];

let listening = false;

const ids = ["a", "b", "x", "y", "s", "r", "l" , "z", "dpad", "icon", "ls", "cs"];

// add listeners for click
// these turn off when the SVG is not displayed, so shouldn't impact performance
function listen () : void {
  // $FlowFixMe ignore the following type error
  const svgDoc = document.getElementById("gamepadSVGCalibration").contentDocument;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    // eslint-disable-next-line no-loop-func
    svgDoc.getElementById(id).addEventListener('click', () => { clickObject = id; });
  }
  listening = true;
}

const defaultTexts = ["Click button, trigger or analog stick to rebind."];

// figure out which custom gamepad infos are usable by the current controller
// sets the value for customGamepadInfoIsUsable
export function setCustomGamepadInfoIsUsable ( j : number ) : void {
  const currentGamepadId = getGamepad(j).id;
  if (getGamepadNameAndInfo(currentGamepadId) === null) {
    customGamepadInfoIsUsable[0] = null;
  }
  else {
    customGamepadInfoIsUsable[0] = true;
  }
  for (let k = 1; k < 8; k++) {
    const maybeCustomGamepadInfo = getCustomGamepadInfo(k);
    if (maybeCustomGamepadInfo === null) {
      customGamepadInfoIsUsable[k] = null;
    }
    else {
      if (currentGamepadId === maybeCustomGamepadInfo.fullID) {
        customGamepadInfoIsUsable[k] = true;
      }
      else {
        customGamepadInfoIsUsable[k] = false;
      }
    }
  }
}

export function runCalibration ( i : number ) : void {
  if (!calibrationInProgress[i]) {
    setCalibrationInProgress(i, true);
   
    const interval = 2000;
  
    const j = currentPlayers[i];
  
    const prevGamepadInfo : GamepadInfo = mType[i] === null || mType[i] === "keyboard" ? nullGamepadInfo : mType[i];
    const gamepadInfo = deepCopyObject(true, prevGamepadInfo);

    setCustomGamepadInfoIsUsable(j);
  
    clickObject = null;
    if (listening === false) {
      listen();
    }
    updateControllerMenu(false, ["Mouse-click the start button to begin calibration."], 0);
    preCalibrationLoop(i, j, gamepadInfo, interval);
  }
}

function resetGamepadInfo ( j : number ) : GamepadInfo {
  const gamepad = getGamepad(j);
  let baseGamepadInfo = nullGamepadInfo;
  if (gamepad !== undefined && gamepad !== null && gamepad.id !== undefined && gamepad.id !== null) {
    const maybeNameAndInfo = getGamepadNameAndInfo(gamepad.id);
    if (maybeNameAndInfo !== null) {
      baseGamepadInfo = deepCopyObject(true,maybeNameAndInfo[1]);
    }
  }
  return baseGamepadInfo;
}

function saveSound() {
  sounds.star.play();
}

function preCalibrationLoop( i : number, j : number
                           , gamepadInfo : GamepadInfo
                           , interval : number) : void {
  if (clickObject === "s") {
    sounds.blunthit.play(); 
    setCustomGamepadInfo(j, gamepadInfo);
    setUsingCustomControls(i, true);
    updateControllerMenu(false, ["Finding controller neutral point.", "Do not press anything."], interval);
    // take null snapshot
    setTimeout( () => {
      setControllerReset(i);
      saveSound();
      const gamepad = getGamepad(j);
      const snapshots = nullSnapshots;
      snapshots.b0 = deepCopyArray(true,gamepad.buttons);
      snapshots.a0 = deepCopyArray(true,gamepad.axes);
      calibrationLoop(i, j, gamepadInfo, snapshots, interval);
      updateControllerMenu(false, defaultTexts, 0);
    }, interval);
  }
  else if (clickObject === "exit") {
    sounds.menuBack.play(); 
    updateControllerMenu(true, ["Quitting calibration menu."], interval);
    setCalibrationInProgress(i, false);
  }
  else if (clickObject === "reset") {
    sounds.loudelectricfizz.play();
    setCustomInUse(0);
    const baseGamepadInfo = resetGamepadInfo(j);
    setUsingCustomControls(i, false, baseGamepadInfo);
    updateControllerMenu(false, ["Controller bindings have been reset.", "Click the start button to begin calibration."], 0);
    setTimeout ( () => preCalibrationLoop(i, j, baseGamepadInfo, interval), 16 );
  }
  else if (clickObject === "center") {
    saveSound();
    setControllerReset(i);
    updateControllerMenu(false, ["Controller has been re-centered.", "Click the start button to begin calibration."], 0);
    setTimeout ( () => preCalibrationLoop(i, j, gamepadInfo, interval), 16 );
  }
  else if (clickObject === "loadCustom") {
    if (clickObjectNumber === 0) {
      setCustomInUse(0);
      const baseGamepadInfo = resetGamepadInfo(j);
      setUsingCustomControls(i, false, baseGamepadInfo);
      updateControllerMenu(false, ["Now using default controller bindings.", "Click the start button to begin calibration."], 0);
      setTimeout ( () => preCalibrationLoop(i, j, baseGamepadInfo, interval), 16 );
    }
    else {
      const newCustomGamepadInfo = getCustomGamepadInfo(clickObjectNumber);
      if ( newCustomGamepadInfo === null || customGamepadInfoIsUsable[clickObjectNumber] !== true ) {
        sounds.deny.play();
        setTimeout ( () => preCalibrationLoop(i, j, gamepadInfo, interval), 16 );
      }
      else {
        const newGamepadInfo = newCustomGamepadInfo.gamepadInfo;
        setCustomInUse(clickObjectNumber);
        setCustomGamepadInfo(j, newGamepadInfo);
        setUsingCustomControls(i, true);
        updateControllerMenu(false, ["Now using custom bindings #"+clickObjectNumber+".", "Click the start button to begin calibration."], 0);
        setTimeout ( () => preCalibrationLoop(i, j, newGamepadInfo, interval), 16 );
      }
    }
  }
  else if (clickObject === "saveCustom") {
    if (clickObjectNumber < 1 ) {
      sounds.deny.play();
    }
    else {
      customGamepadInfoIsUsable[clickObjectNumber] = true;
      storeCustomGamepadInfo( gamepadInfo, getGamepad(j).id, ("custom"+clickObjectNumber), clickObjectNumber);
      setCustomInUse(clickObjectNumber);
    }
    setTimeout ( () => preCalibrationLoop(i, j, gamepadInfo, interval), 16 );
  }
  else {
    if (clickObject === "icon") {
      sounds.shout8.play();
      sounds.sword3.play();
    }
    setTimeout ( () => preCalibrationLoop(i, j, gamepadInfo, interval), 16 );
  }
  clickObject = null;
};

function calibrationLoop ( i : number, j : number
                         , gamepadInfo : GamepadInfo
                         , snapshots : Snapshots
                         , interval : number ) : void {
  if (clickObject === null) {
    setTimeout ( () => { calibrationLoop(i, j, gamepadInfo, snapshots, interval); }, 16);
  }
  else {
    calibrateObject(i, j, gamepadInfo, snapshots, interval);
  }
};

function calibrateObject ( i : number, j : number
                          , gamepadInfo : GamepadInfo
                          , snapshots : Snapshots
                          , interval : number ) : void {
  let texts;
  let gamepad;
  let totalInterval = interval+16;

  if (clickObject === null) {
    console.log("error in function 'calibrateObject': calibration called on null object");
  }
  else if (clickObject === "icon") {
    sounds.shout8.play();
    sounds.sword3.play();
  }
  else if (clickObject === "exit") {
    sounds.menuBack.play(); 
    setCalibrationInProgress(i, false);
    updateControllerMenu(true, ["Quitting calibration menu."], interval);
  }
  else if (clickObject === "reset") {
    sounds.loudelectricfizz.play();
    setCustomInUse(0);
    const baseGamepadInfo = resetGamepadInfo(j);
    setCustomGamepadInfo(j, baseGamepadInfo);
    setUsingCustomControls(i, false, baseGamepadInfo);
    updateControllerMenu(false, ["Controller bindings have been reset.", "Click the start button to begin calibration."], 0);
    setTimeout ( () => preCalibrationLoop(i, j, baseGamepadInfo, interval), 16 );
  }
  else if (clickObject === "center") {
    saveSound();
    setControllerReset(i);
    updateControllerMenu(false, ["Controller has been re-centered.", "Click the start button to continue calibration."], 0);
    setTimeout ( () => preCalibrationLoop(i, j, gamepadInfo, interval), 16 );
    totalInterval = 16;
  }
  else if (clickObject === "loadCustom") {
    if (clickObjectNumber === 0) {
      setCustomInUse(0);
      const baseGamepadInfo = resetGamepadInfo(j);
      setUsingCustomControls(i, false, baseGamepadInfo);
      updateControllerMenu(false, ["Now using default controller bindings.", "Click the start button to begin calibration."], 0);
      setTimeout ( () => preCalibrationLoop(i, j, baseGamepadInfo, interval), 16 );
    }
    else {
      const newCustomGamepadInfo = getCustomGamepadInfo(clickObjectNumber);
      if ( newCustomGamepadInfo === null || customGamepadInfoIsUsable[clickObjectNumber] !== true ) {
        sounds.deny.play();
        setTimeout ( () => preCalibrationLoop(i, j, gamepadInfo, interval), 16 );
      }
      else {
        const newGamepadInfo = newCustomGamepadInfo.gamepadInfo;
        setCustomInUse(clickObjectNumber);
        setCustomGamepadInfo(j, newGamepadInfo);
        setUsingCustomControls(i, true);
        updateControllerMenu(false, ["Now using custom bindings #"+clickObjectNumber+".", "Click the start button to begin calibration."], 0);
        setTimeout ( () => preCalibrationLoop(i, j, newGamepadInfo, interval), 16 );
      }
    }
  }
  else if (clickObject === "saveCustom") {
    if (clickObjectNumber < 1 ) {
      sounds.deny.play();
    }
    else {
      customGamepadInfoIsUsable[clickObjectNumber] = true;
      storeCustomGamepadInfo( gamepadInfo, getGamepad(j).id, ("custom"+clickObjectNumber), clickObjectNumber);
      setCustomInUse(clickObjectNumber);
    }
  }
  else if (clickObject === "l" || clickObject === "r") {
    texts = ["Fully depress "+clickObject.toUpperCase()+" trigger.", "Keep holding down the trigger."];
    const t = clickObject; // passed as-is in the closure
    const tA = clickObject+"A";
    updateControllerMenu(false, texts, interval);
    setTimeout( () => {
      saveSound();
      gamepad = getGamepad(j);
      gamepadInfo[t]  = scanForButton (snapshots.b0, gamepad.buttons, snapshots.a0, gamepad.axes, true);
      gamepadInfo[tA] = scanForTrigger(snapshots.b0, gamepad.buttons, snapshots.a0, gamepad.axes);
      updateControllerMenu(false, defaultTexts, 0);
      if ( t==="l" && gamepadInfo.lA !== null && (gamepadInfo.lA.kind === "value" || gamepadInfo.lA.kind === "axis")) {
        gamepadInfo.isGC = Math.abs(gamepadInfo.lA.min + 0.866) < 0.01 ? true : false; // hacky but hey
      }   
    }, interval);
  }
  else if (clickObject === "ls" || clickObject === "cs" || clickObject === "dpad") {
    let sep = ",";
    if (clickObject === "ls") {
      texts = ["Move left analog stick all the way ", "and keep it there."];
    }
    else if (clickObject === "cs") {
      texts = ["Move c-stick all the way ", "and keep it there."];
    }
    else {
      sep = ".";
      texts = ["Press and hold d-pad "];
    }
    totalInterval += 5*interval;
    updateControllerMenu(false, [texts[0]+"left"+sep, texts[1]], 1.5*interval);
    setTimeout( () => {
      saveSound();
      gamepad = getGamepad(j);
      snapshots.bL = deepCopyArray(true,gamepad.buttons);
      snapshots.aL = deepCopyArray(true,gamepad.axes);
      updateControllerMenu(false, [texts[0]+"right"+sep, texts[1]], 1.5*interval);
    }, 1.5*interval);
    setTimeout( () => {
      saveSound();
      gamepad = getGamepad(j);
      snapshots.bR = deepCopyArray(true,gamepad.buttons);
      snapshots.aR = deepCopyArray(true,gamepad.axes);
      updateControllerMenu(false, [texts[0]+"up"+sep, texts[1]], 1.5*interval);
    }, 3*interval);
    setTimeout( () => {
      saveSound();
      gamepad = getGamepad(j);
      snapshots.bU = deepCopyArray(true,gamepad.buttons);
      snapshots.aU = deepCopyArray(true,gamepad.axes);
      updateControllerMenu(false, [texts[0]+"down"+sep, texts[1]], 1.5*interval);
    }, 4.5*interval);
    if (clickObject === "dpad") {
      setTimeout( () => {
        saveSound();
        gamepad = getGamepad(j);
        gamepadInfo.dpad = scanForDPad( snapshots.b0, snapshots.bL, snapshots.bR, snapshots.bU, gamepad.buttons
                                      , snapshots.a0, snapshots.aL, snapshots.aR, snapshots.aU, gamepad.axes);
        updateControllerMenu(false, defaultTexts, 0);
      }, 6*interval);
    }
    else {      
      const clickNow = clickObject; // passed as-is in the closure
      setTimeout( () => {
        saveSound();
        gamepad = getGamepad(j);
        gamepadInfo[clickNow] = scanForStick( snapshots.b0, snapshots.bL, snapshots.bR, snapshots.bU, gamepad.buttons
                                            , snapshots.a0, snapshots.aL, snapshots.aR, snapshots.aU, gamepad.axes);
        updateControllerMenu(false, defaultTexts, 0);
      }, 6*interval);
    }
  }
  else { // only plain buttons left now
    const buttonName = clickObject === "s" ? "start" : clickObject.toUpperCase();
    texts = ["Press and hold "+buttonName+"."];
    const clickNow = clickObject;
    updateControllerMenu(false, texts, interval);
    setTimeout( () => {
      saveSound();
      gamepad = getGamepad(j);
      gamepadInfo[clickNow] = scanForButton(snapshots.b0, gamepad.buttons, snapshots.a0, gamepad.axes);
      updateControllerMenu(false, defaultTexts, 0);
    }, interval);
  }

  if (clickObject !== "exit" && clickObject !== "reset" && clickObject !== "center" && clickObject !== "loadCustom") {
    if (clickObject !== null) {
      sounds.blunthit.play();
      setTimeout( () => { setCustomGamepadInfo(j, gamepadInfo);
                          calibrationLoop(i, j, gamepadInfo, snapshots, interval); }, totalInterval);
    }
    else {
      setTimeout( () => { calibrationLoop(i, j, gamepadInfo, snapshots, interval); }, totalInterval);
    }     
  }

  if (   clickObject !== null && clickObject !== "saveCustom" && clickObject !== "loadCustom"
      && clickObject !== "center" && clickObject !== "icon" && clickObject !== "exit" && clickObject !== "reset") {
    setCustomInUse(null);
  }

  if (clickObject !== null) {
    clickObject = null;
  }
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
