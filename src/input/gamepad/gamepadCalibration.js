// @flow
/*eslint indent:0*/

import {Vec2D} from "../../main/util/Vec2D";

import type {ButtonInfo, StickInfo, StickCardinals, TriggerInfo, DPadInfo, GamepadInfo} from "./gamepadInfo";
import type {Gamepad, Button} from "./gamepad";

function scanForButton ( buttons0 : Array<Button>, buttons1 : Array<Button>
                       , axes0 : Array<number>, axes1 : Array<number>
                       ) : null | ButtonInfo {
  let buttonInfo = null;

  const bLg = buttons1.length;

  for (let i = 0; i < bLg; i++) {
    if (detectedButtonPressed(buttons0[i].pressed, buttons1[i].pressed)) {
      buttonInfo = { kind : "pressed", index : i };
      break;
    }
    else if (detectedButtonValue(buttons0[i].value, buttons1[i].value)) {
      buttonInfo = { kind : "value", index : i, threshold : 0.75 };
      break;
    }
  }
  if (buttonInfo === null) {
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


function scanForTrigger ( buttons0 : Array<Button>, buttons1 : Array<Button>
                        , axes0 : Array<number>, axes1 : Array<number>
                        ) : null | TriggerInfo {
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
