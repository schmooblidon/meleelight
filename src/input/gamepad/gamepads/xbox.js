// @flow
/*eslint indent:0*/

import {defaultCardinals} from "../defaults";

import type {GamepadInfo} from "../gamepadInfo";

const xboxIDs = [ { name : "Xbox controller", id : "Microsoft Controller", vendor : "045e", product : "02d1" } 
                , { name : "Xbox 360 controller", id : "XBOX 360" }
                , { name : "Xbox One controller", id : "XMicrosoft X-Box One"}
                , { name : "XInput controller", id : "XInput"}
                , { name : "standard gamepad", id : "Standard Gamepad"}
                , { name : "Xbox 360 wireless controller", id : "Wireless 360 Controller", vendor : "045e", product : "028e" } 
                ];

export const xbox : GamepadInfo = 
  { a  : { kind : "pressed", index : 0 }
  , b  : { kind : "pressed", index : 2 }
  , x  : { kind : "pressed", index : 1 }
  , y  : { kind : "pressed", index : 3 }
  , z  : { kind : "pressed", index : 5 }
  , r  : null
  , l  : null
  , s  : { kind : "pressed", index : 9 }
  , lA : { kind : "value"  , index : 6, min : 0, max : 1 }
  , rA : { kind : "value"  , index : 7, min : 0, max : 1 }
  , dpad : { kind : "buttons", upIndex : 12, downIndex : 13, leftIndex : 14, rightIndex : 15 }
  , ls : { kind : "axes", xIndex : 0, yIndex : 1, cardinals : defaultCardinals }
  , cs : { kind : "axes", xIndex : 2, yIndex : 3, cardinals : defaultCardinals }
  , isGC : false
  , ids : xboxIDs
  };