// @flow
/*eslint indent:0*/

import {gamecubeCardinals} from "../defaults";

import type {GamepadInfo} from "../gamepadInfo";

export const vjoy : GamepadInfo = 
  { a  : { kind : "pressed", index : 0 }
  , b  : { kind : "pressed", index : 1 }
  , x  : { kind : "pressed", index : 2 }
  , y  : { kind : "pressed", index : 3 }
  , z  : { kind : "pressed", index : 4 }
  , r  : { kind : "pressed", index : 5 }
  , l  : { kind : "pressed", index : 6 }
  , s  : { kind : "pressed", index : 7 }
  , lA : { kind : "axis"   , index : 2, min : -0.867, max : 0.867 }
  , rA : { kind : "axis"   , index : 5, min : -0.867, max : 0.867 }
  , dpad : { kind : "buttons", upIndex : 8, downIndex : 9, leftIndex : 10, rightIndex : 11 }
  , ls : { kind : "axes", xIndex : 0, yIndex : 1, cardinals : gamecubeCardinals }
  , cs : { kind : "axes", xIndex : 3, yIndex : 4, cardinals : gamecubeCardinals }
  , isGC : true
  , ids : [ { name : "vJoy controller", id : "vJoy", vendor : "1234", product : "bead" } ]
  };