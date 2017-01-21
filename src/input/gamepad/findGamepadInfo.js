// @flow
/*eslint indent:0*/

import {gamepadInfoList} from "./gamepadInfoList";

import type {GamepadID, GamepadInfo, AllowedIDType} from "./gamepadInfo";

export function getGamepadNameAndInfo( identifier : string ) : null | [string, GamepadInfo] {

  let name = null;
  let info = null;
  for (let i = 0; i < gamepadInfoList.length; i++) {
    for (let j = 0; j < gamepadInfoList[i].ids.length; j++) {
      if (checkAgainstGamepadID(identifier, gamepadInfoList[i].ids[j])) {
        name = gamepadInfoList[i].ids[j].name;
        info = gamepadInfoList[i];
        break;
      }
    }
  }

  if (name === null || info === null) {
    return null;
  }
  else {
    return [name, info];
  }

}

function checkAgainstGamepadID( identifier : string, gamepadID : GamepadID ) : bool {
  let matchedVP = false;
  if (gamepadID.vendor !== undefined && gamepadID.product !== undefined) {
    const [gpdVendor, gpdProduct] = [gamepadID.vendor, gamepadID.product];
    const vendorAndProduct = getVendorAndProduct(identifier, gamepadID.allowedIDType);
    if (vendorAndProduct !== null) {
      const [vendor, product] = vendorAndProduct;
      matchedVP = match(vendor, gpdVendor) && match(product, gpdProduct);
    }
  }

  let matchedID = false;
  if (gamepadID.id !== null && gamepadID.id !== undefined) {
    const gpdID = gamepadID.id;
    const id = getID(identifier, gamepadID.allowedIDType);
    const l = gpdID.length;
    matchedID = gpdID.toLowerCase() === id.toLowerCase().substring(0,l);
  }

  return matchedVP || matchedID;
}

function removeZeroes (s : string) : string {
  if (s.length < 2) {
    return s;
  }
  else {
    const [head, tail] = [s[0], s.substring(1)];
    if (head === "0") {
      return removeZeroes(tail);
    }
    else {
      return s;
    }
  }
}

function match( s1 : string, s2 : string ) : bool {
  return removeZeroes(s1).toLowerCase() === removeZeroes(s2).toLowerCase();  
}


// hacky functions to get name, vendor and product by munging strings

function getVendorAndProduct( identifier : string, allowedIDType : ?AllowedIDType ) : null | [string, string] {
  const l = identifier.length;
  let [vendor, product] = [null, null];
  const allowFirefox = allowedIDType === undefined || allowedIDType === null || allowedIDType === "Firefox";
  const allowChrome  = allowedIDType === undefined || allowedIDType === null || allowedIDType === "Chrome" ;
  if (allowFirefox && l > 9 && identifier[4] === "-" && identifier[9] === "-") {
    [vendor, product] = [identifier.substring(0,4), identifier.substring(5,9)];
  }
  else if (allowChrome && l > 27 && identifier[l-1] === ")" && identifier[l-28] === "(") {
    [vendor, product] = [identifier.substring(l-19,l-15), identifier.substring(l-5,l-1)];
  }

  if (vendor === null || vendor === undefined || product === null || product === undefined) {
    return null;
  }
  else {
    return [vendor, product];
  }
}

function getID( identifier : string, allowedIDType : ?AllowedIDType ) : string {
  const l = identifier.length;
  let id = identifier;
  const allowFirefox = allowedIDType === undefined || allowedIDType === null || allowedIDType === "Firefox";
  const allowChrome  = allowedIDType === undefined || allowedIDType === null || allowedIDType === "Chrome" ;
  if (allowFirefox && l > 9 && identifier[4] === "-" && identifier[9] === "-") {
    id = identifier.substring(10);
  }
  else if (allowChrome && l > 28 && identifier[l-1] === ")" && identifier[l-28] === "(") {
    id = identifier.substring(0, l-29);
  }
  return id;
}