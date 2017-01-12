// @flow

export type Button = { value : number, pressed : bool };

export type Gamepad = { buttons : Array<Button>, axes : Array<number>, id : string }

export const nullGamepad = { buttons : [], axes : [], id : "null gamepad"};