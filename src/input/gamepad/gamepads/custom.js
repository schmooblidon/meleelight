// @flow

import {getCookie, setCookie} from "../../../main/main";

import type {GamepadInfo} from "../gamepadInfo";

type CustomGamepadInfo = { gamepadInfo : GamepadInfo, fullID : string, name : string };

export const customGamepadInfo : Array<null | GamepadInfo> = [null, null, null, null];

export function setCustomGamepadInfo(i : number, gamepadInfo : GamepadInfo) : void {
  customGamepadInfo[i] = gamepadInfo;
}

export function storeCustomGamepadInfo ( gamepadInfo : GamepadInfo, fullID : string, name : string, slot : number ) : void {
  const customGamepadInfo = { gamepadInfo : gamepadInfo, fullID : fullID, name : name };
  setCookie("customGamepad"+slot,JSON.stringify(customGamepadInfo), 365);
}

export function getCustomGamepadInfo ( slot : number ) : null | CustomGamepadInfo {
  const cookie = getCookie("customGamepad"+slot);
  if (cookie === null || cookie === undefined || cookie === '') {
    return null;
  }
  else {
    const customGamepadInfo = JSON.parse(cookie);
    if (customGamepadInfo === undefined ) {
      return null;
    }
    else {
      return customGamepadInfo;
    }
  }
}

