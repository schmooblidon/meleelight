// @flow
/*eslint indent:0*/

import {Vec2D} from "../../main/util/Vec2D";

import type {GamepadInfo, ButtonInfo, TriggerInfo, DPadInfo, StickInfo, StickCardinals} from "./gamepadInfo";

type StringyGamepadInfo = { "a" : string
                          , "b" : string
                          , "x" : string
                          , "y" : string
                          , "s" : string
                          , "z" : string
                          , "l" : string
                          , "r" : string
                          , "lA" : string
                          , "rA" : string
                          , "dpad" : string
                          , "ls" : string
                          , "cs" : string
                          , "isGC" : string
                          , "fullId" : string
                          , "customName" : string }

export function stringifyGamepadInfo (gamepadInfo : GamepadInfo, fullID : string, customName : string) : StringyGamepadInfo {
  return { "a" : stringifyButtonInfo(gamepadInfo.a)
         , "b" : stringifyButtonInfo(gamepadInfo.b)
         , "x" : stringifyButtonInfo(gamepadInfo.x)
         , "y" : stringifyButtonInfo(gamepadInfo.y)
         , "s" : stringifyButtonInfo(gamepadInfo.s)
         , "z" : stringifyButtonInfo(gamepadInfo.z)
         , "l" : stringifyButtonInfo(gamepadInfo.l)
         , "r" : stringifyButtonInfo(gamepadInfo.r)
         , "lA" : stringifyTriggerInfo(gamepadInfo.lA)
         , "rA" : stringifyTriggerInfo(gamepadInfo.rA)
         , "dpad" : stringifyDPadInfo(gamepadInfo.dpad)
         , "ls" : stringifyStickInfo(gamepadInfo.ls)
         , "cs" : stringifyStickInfo(gamepadInfo.cs)
         , "isGC" : (gamepadInfo.isGC ? "true" : "false")
         , "fullId" : fullID
         , "customName" : customName
         };
}

function stringifyButtonInfo( buttonInfo : ButtonInfo ) : string {
  if (buttonInfo === null) {
    return "null";
  }
  else if (buttonInfo.kind === "pressed") {
    return "pressed "+buttonInfo.index;
  }
  else if (buttonInfo.kind === "value") {
    return "value "+buttonInfo.index+" "+buttonInfo.threshold.toFixed(2);
  }
  else if (buttonInfo.kind === "axis") {
    return "axis "+buttonInfo.index+" "+buttonInfo.threshold.toFixed(2);
  }
  else {
    console.log("error in 'stringifyButtonInfo': unrecognised button info");
    return "";
  }
}

function stringifyTriggerInfo( triggerInfo : TriggerInfo ) : string {
  if (triggerInfo === null) {
    return "null";
  }
  else if (triggerInfo.kind === "axis") {
    return "axis "+triggerInfo.index+" "+triggerInfo.min.toFixed(2)+" "+triggerInfo.max.toFixed(2);
  }
  else if (triggerInfo.kind === "value") {
    return "value "+triggerInfo.index+" "+triggerInfo.min.toFixed(2)+" "+triggerInfo.max.toFixed(2);
  }
  else if (triggerInfo.kind === "light") {
    return "light "+triggerInfo.index;
  }
  else {
    console.log("error in 'stringifyTriggerInfo': unrecognised trigger info");
    return "";
  }
}

function stringifyStickInfo ( stickInfo : StickInfo ) : string {
  if (stickInfo === null) {
    return "null";
  }
  else if (stickInfo.kind === "axes") {
    return "axes "+stickInfo.xIndex+" "+stickInfo.yIndex+" "+stringifyCardinals(stickInfo.cardinals);
  }
  else if (stickInfo.kind === "value") {
    return "value "+stickInfo.xIndex+" "+stickInfo.yIndex+" "+stringifyCardinals(stickInfo.cardinals);
  }
  else {
    console.log("error in 'stringifyStickInfo': unrecognised stick info");
    return "";
  }
}

function stringifyCardinals ( cardinals : null | StickCardinals ) : string {
  if (cardinals === null) {
    return "null";
  }
  else {
    return cardinals.center.x.toFixed(2)+" "+cardinals.left.toFixed(2)+" "+cardinals.right.toFixed(2)+" "+cardinals.up.toFixed(2)+" "+cardinals.down.toFixed(2);
  }
}

function stringifyDPadInfo( dpadInfo : DPadInfo ) : string {
  if (dpadInfo === null) {
    return "null";
  }
  else if (dpadInfo.kind === "buttons") {
    return "buttons "+dpadInfo.upIndex+" "+dpadInfo.downIndex+" "+dpadInfo.leftIndex+" "+dpadInfo.rightIndex;
  }
  else if (dpadInfo.kind === "axis") {
    return "axis "+dpadInfo.index;
  }
  else if (dpadInfo.kind === "2axes") {
    return "2axes "+dpadInfo.xIndex+" "+dpadInfo.yIndex+" "+(dpadInfo.xFlip?"true":"false")+" "+(dpadInfo.yFlip?"true":"false");
  }
  else {
    console.log("error in 'stringifyDPadInfo': unrecognised d-pad info");
    return "";
  }
}

type DestringifyReturnType = { gamepadInfo : GamepadInfo, fullId : string, customName : string}

export function destringifyGamepadInfo (stringyGamepadInfo : StringyGamepadInfo) : DestringifyReturnType {
  const gamepadInfo = { a  : destringifyButtonInfo(stringyGamepadInfo["a"])
                      , b  : destringifyButtonInfo(stringyGamepadInfo["b"])
                      , x  : destringifyButtonInfo(stringyGamepadInfo["x"])
                      , y  : destringifyButtonInfo(stringyGamepadInfo["y"])
                      , s  : destringifyButtonInfo(stringyGamepadInfo["s"])
                      , l  : destringifyButtonInfo(stringyGamepadInfo["l"])
                      , r  : destringifyButtonInfo(stringyGamepadInfo["r"])
                      , z  : destringifyButtonInfo(stringyGamepadInfo["z"])
                      , lA : destringifyTriggerInfo(stringyGamepadInfo["lA"])
                      , rA : destringifyTriggerInfo(stringyGamepadInfo["rA"])
                      , dpad : destringifyDPadInfo(stringyGamepadInfo["dpad"])
                      , ls : destringifyStickInfo(stringyGamepadInfo["ls"])
                      , cs : destringifyStickInfo(stringyGamepadInfo["cs"])
                      , isGC : (stringyGamepadInfo.isGC === "true" ? true : false)
                      , ids : []
                      }
  return { gamepadInfo : gamepadInfo, fullId : stringyGamepadInfo.fullId, customName : stringyGamepadInfo.customName };
}

function destringifyButtonInfo ( s : string ) : ButtonInfo {
  if (s === "null") {
    return null;
  }
  else {
    const l = s.split(" ");
    if (l[0] === undefined || l[1] === undefined || (l[2] === undefined && l[0] !== "pressed")) {
      console.log("error in 'destringifyButtonInfo': missing button info");
      return null;
    }
    else if (l[0] === "pressed") {
      return { kind : "pressed", index : eval(l[1].replace(/[^0-9]+/g, '')) };
    }
    else if (l[0] === "value") {
      return { kind : "value", index : eval(l[1].replace(/[^0-9]+/g, '')), threshold : eval(l[2].replace(/[^0-9\.]+/g, '')) };
    }
    else if (l[0] === "axis") {
      return { kind : "axis", index : eval(l[1].replace(/[^0-9]+/g, '')), threshold : eval(l[2].replace(/[^0-9\.]+/g, '')) };
    }
    else {
      console.log("error in 'destringifyButtonInfo': unrecognised button info string");
      return null;
    }
  }
}

function destringifyTriggerInfo ( s : string ) : TriggerInfo {
  if (s === "null") {
    return null;
  }
  else {
    const l = s.split(" ");
    if (l[0] === undefined || l[1] === undefined || (l[0] !== "light" && (l[2] === undefined || l[3] === undefined))) {
      console.log("error in 'destringifyTriggerInfo': missing trigger info");
      return null;
    }
    else if (l[0] === "axis") {
      return { kind : "axis" , index : eval(l[1].replace(/[^0-9]+/g, '')), min: eval(l[2].replace(/[^0-9\.]+/g, '')), max: eval(l[3].replace(/[^0-9\.]+/g, '')) };
    }
    else if (l[0] === "value") {
      return { kind : "value", index : eval(l[1].replace(/[^0-9]+/g, '')), min: eval(l[2].replace(/[^0-9\.]+/g, '')), max: eval(l[3].replace(/[^0-9\.]+/g, '')) };
    }
    else if (l[0] === "light") {
      return { kind : "light", index : eval(l[1].replace(/[^0-9]+/g, ''))};
    }
    else {
      console.log("error in 'destringifyTriggerInfo': unrecognised trigger info string");
      return null;
    }
  }
}

function destringifyStickInfo ( s : string ) : StickInfo {
  if (s === "null") {
    return null;
  }
  else {
    const l = s.split(" ");
    if (l[0] === undefined || l[1] === undefined || l[2] === undefined || l[3] === undefined) {
      console.log("error in 'destringifyStickInfo': missing stick info");
      return null;
    }
    else if (l[0] === "axes") {
      return { kind : "axes" , xIndex : eval(l[1].replace(/[^0-9]+/g, '')), yIndex : eval(l[1].replace(/[^0-9]+/g, '')), cardinals : destringifyCardinals(l.slice(3)) };
    }
    else if (l[0] === "value") {
      return { kind : "value", xIndex : eval(l[1].replace(/[^0-9]+/g, '')), yIndex : eval(l[1].replace(/[^0-9]+/g, '')), cardinals : destringifyCardinals(l.slice(3)) };
    }
    else {
      console.log("error in 'destringifyStickInfo': unrecognised stick info string");
      return null;
    }
  }
}

function destringifyCardinals ( l : Array<string> ) : null | StickCardinals {
  if (  l[0] === "null" || l[0] === undefined || l[1] === undefined
     || l[2] === undefined || l[3] === undefined || l[4] === undefined || l[5] === undefined) {
    return null;
  }
  else {
    return { center : new Vec2D(eval(l[0].replace(/[^0-9]+/g, '')),eval(l[1].replace(/[^0-9]+/g, '')))
           , left  : eval(l[2].replace(/[^0-9]+/g, ''))
           , right : eval(l[3].replace(/[^0-9]+/g, ''))
           , up    : eval(l[4].replace(/[^0-9]+/g, ''))
           , down  : eval(l[5].replace(/[^0-9]+/g, ''))
           }
  }
}

function destringifyDPadInfo ( s : string ) : DPadInfo {
  if (s === "null") {
    return null;
  }
  else {
    const l = s.split(" ");
    if (l[0] === undefined || (l[0] !== "axis" && (l[1] === undefined || l[2] === undefined || l[3] === undefined || l[4] === undefined))) {
      console.log("error in 'destringifyDPadInfo': missing d-pad info");
      return null;
    }
    else if (l[0] === "buttons") {
      return { kind : "buttons", upIndex    : eval(l[1].replace(/[^0-9]+/g, ''))
                               , downIndex  : eval(l[2].replace(/[^0-9]+/g, ''))
                               , leftIndex  : eval(l[3].replace(/[^0-9]+/g, ''))
                               , rightIndex : eval(l[4].replace(/[^0-9]+/g, '')) };
    }
    else if (l[0] === "axis") {
      return { kind : "axis", index : eval(l[1].replace(/[^0-9]+/g, '')) };
    }
    else if (l[0] === "2axes") {
      return { kind : "2axes", xIndex : eval(l[1].replace(/[^0-9]+/g, ''))
                             , yIndex : eval(l[2].replace(/[^0-9]+/g, ''))
                             , xFlip  : (l[3] === "true" ? true : false)
                             , yFlip  : (l[4] === "true" ? true : false) };
    }
    else {
      console.log("error in 'destringifyDPadInfo': unrecognised d-pad info string");
      return null;
    }
  }
}