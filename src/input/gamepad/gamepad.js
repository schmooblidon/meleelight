// @flow

export type Button = { value : number, pressed : bool };

export type Gamepad = { buttons : Array<Button>, axes : Array<number>, id : string }

export const nullGamepad = { buttons : [], axes : [], id : "null gamepad"};

export function getGamepad(j : number) : Gamepad {
  return navigator.getGamepads ? navigator.getGamepads()[j] : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads()[j] : nullGamepad);
}