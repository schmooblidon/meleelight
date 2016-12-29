// @flow

import {Vec2D} from "../../main/util/Vec2D";

import type {GamepadInfo} from "./gamepadInfo";

export function buttonState(gamepad : any, gamepadInfo : GamepadInfo, but : string) : bool {
  const info = gamepadInfo[but];
  let state = false;
  if (info !== null && info !== undefined) {
    if (info.kind === "pressed" && info.index <= gamepad.buttons.length) {
      state = gamepad.buttons[info.index].pressed;
    }
    else if (info.kind === "value" && info.index <= gamepad.buttons.length) {
      state = gamepad.buttons[info.index].value > info.threshold ;
    }
    else if (info.kind === "axis" && info.index <= gamepad.axes.length) {
      state = gamepad.axes[info.index] > info.threshold;
    }
  }

  if (state === null || state === undefined) {
    state = false;
  }
  return state;
};

export function triggerValue(gamepad : any, gamepadInfo : GamepadInfo, trig : string) : number {
  const info = gamepadInfo[trig];
  let val = 0;
  if (info !== null && info !== undefined) {
    if (info.kind === "axis" && info.index <= gamepad.axes.length) {
      val = gamepad.axes[info.index];
    }
    else if (info.kind === "value" && info.index <= gamepad.buttons.length ) {
      val = gamepad.buttons[info.index].value;
    }
    else if (info.kind === "light" && info.index <= gamepad.buttons.length ) {
      val = gamepad.buttons[info.index].pressed ? 0.35 : 0;
    }
  }

  if (val === null || val === undefined) {
    val = 0;
  }
  return val;
}

export function stickValue(gamepad : any, gamepadInfo : GamepadInfo, stick : string) : Vec2D {
  const info = gamepadInfo[stick];
  let x = 0;
  let y = 0;
  if (info !== null && info !== undefined) {
    const isGC = gamepadInfo.isGC;
    if (info.kind === "axes") {
      if (info.xIndex <= gamepad.axes.length) {
        x = gamepad.axes[info.xIndex];
      }
      if (info.yIndex <= gamepad.axes.length) {
        y = gamepad.axes[info.yIndex];
      }
    }
    else {
      if (info.xIndex <= gamepad.buttons.length) {
        x = gamepad.buttons[info.xIndex].value;
      }
      if (info.yIndex <= gamepad.buttons.length) {
        y = gamepad.buttons[info.yIndex].value;
      }
    }
  }

  if (x === null || x === undefined) {
    x = 0;
  }
  if (y === null || y === undefined) {
    y = 0;
  }
  return new Vec2D(x,y);
}

type DPad = { up : bool, down : bool, left : bool, right : bool }

export function dPadState(gamepad : any, gamepadInfo : GamepadInfo) : DPad {
  const info = gamepadInfo.dpad;
  let up = false;
  let down = false;
  let left = false;
  let right = false;
  if (info !== null && info !== undefined) {
    if (info.kind === "buttons") {
      const butts = gamepad.buttons;
      const l = gamepad.buttons.length;
      if (info.upIndex <= l) {
        up = butts[info.upIndex].pressed;
      }
      if (info.downIndex <= l) {
        down = butts[info.downIndex].pressed;
      }
      if (info.leftIndex <= l) {
        left = butts[info.leftIndex].pressed;
      }
      if (info.rightIndex <= l) {
        right = butts[info.rightIndex].pressed;
      }
    }
    else if (info.kind === "2axes") {
      if (info.xIndex <= gamepad.axes.length) {
        const x = gamepad.axes[info.xIndex];
        if (  (info.xFlip && x < -0.3) || (!info.xFlip && x > 0.3 ) ) {
          right = true;
        }
        if (  (info.xFlip && x > 0.3) || (!info.xFlip && x < -0.3 ) ) {
          left = true;
        }
      }
      if (info.yIndex <= gamepad.axes.length) {
        const y = gamepad.axes[info.yIndex];
        if (  (info.yFlip && y < -0.3) || (!info.yFlip && y > 0.3 ) ) {
          up = true;
        }
        if (  (info.yFlip && y > 0.3) || (!info.yFlip && y < -0.3 ) ) {
          down = true;
        }
      }
    }
    else if (info.kind === "axis") { // oh boy
      if (info.index <= gamepad.axes.length) {
        const val = gamepad.axes[info.index];
        left  = val >  0.3 && val < 1.1;
        right = val > -0.8 && val < 0;
        down  = val > -0.2 && val < 0.5;
        up    = val < -0.5 || (val > 0.9 && val < 1.1);
      }
    }
  }

  if (up === null || up === undefined) {
    up = false;
  }
  if (down === null || down === undefined) {
    down = false;
  }
  if (left === null || left === undefined) {
    left = false;
  }
  if (right === null || right === undefined) {
    right = false;
  }
  return { up : up, down : down, left : left, right : right };
}