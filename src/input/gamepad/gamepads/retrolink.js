// @flow
/*eslint indent:0*/

import {gamecubeCardinals} from "../defaults";

import type {GamepadInfo} from "../gamepadInfo";

export const retrolink : GamepadInfo = 
  { a  : { kind : "pressed", index : 2 }
  , b  : { kind : "pressed", index : 3 }
  , x  : { kind : "pressed", index : 1 }
  , y  : { kind : "pressed", index : 0 }
  , z  : { kind : "pressed", index : 6 }
  , r  : { kind : "pressed", index : 5 }
  , l  : { kind : "pressed", index : 4 }
  , s  : { kind : "pressed", index : 9 }
  , lA : { kind : "axis"   , index : 5, min : -0.867, max : 0.867 }
  , rA : { kind : "axis"   , index : 6, min : -0.867, max : 0.867 }
  , dpad : { kind : "buttons", upIndex : 10, downIndex : 8, leftIndex : 7, rightIndex : 11 }
  , ls : { kind : "axes", xIndex : 0, yIndex : 1, cardinals : gamecubeCardinals }
  , cs : { kind : "axes", xIndex : 2, yIndex : 4, cardinals : gamecubeCardinals }
  , isGC : true
  , ids : [ { name : "Generic USB Joystick", vendor : "0079", product : "0006" } ]
  };