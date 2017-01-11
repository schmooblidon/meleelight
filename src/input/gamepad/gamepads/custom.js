// @flow

import type {GamepadInfo} from "../gamepadInfo";

export const customGamepadInfo : Array<null | GamepadInfo> = [null, null, null, null];

export function setCustomGamepadInfo(i : number, gamepadInfo : GamepadInfo) : void {
  customGamepadInfo[i] = gamepadInfo;
}