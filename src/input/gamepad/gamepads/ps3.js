// @flow
/*eslint indent:0*/

import {defaultCardinals} from "../defaults";

import type {GamepadInfo} from "../gamepadInfo";

export const ps3 : GamepadInfo = 
  { a  : { kind : "pressed", index : 1 }
  , b  : { kind : "pressed", index : 0 }
  , x  : { kind : "pressed", index : 2 }
  , y  : { kind : "pressed", index : 3 }
  , z  : { kind : "pressed", index : 5 }
  , r  : { kind : "pressed", index : 7 }
  , l  : { kind : "pressed", index : 6 }
  , s  : { kind : "pressed", index : 9 }
  , lA : null
  , rA : null
  , dpad : { kind : "axis", index : 9 }
  , ls : { kind : "axes", xIndex : 0, yIndex : 1, cardinals : defaultCardinals }
  , cs : { kind : "axes", xIndex : 2, yIndex : 5, cardinals : defaultCardinals }
  , isGC : false
  , ids : [ { name : "PS3 controller", id : "USB GAME PAD", vendor : "11c0", product : "5503" } ]
  };