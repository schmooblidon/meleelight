// @flow
/*eslint indent:0*/

import {gamecubeCardinals} from "../defaults";

import type {GamepadInfo} from "../gamepadInfo";

export const brook : GamepadInfo = 
  { a  : { kind : "pressed", index : 0 }
  , b  : { kind : "pressed", index : 1 }
  , x  : { kind : "pressed", index : 2 }
  , y  : { kind : "pressed", index : 3 }
  , z  : { kind : "pressed", index : 4 }
  , r  : { kind : "pressed", index : 10 }
  , l  : { kind : "pressed", index : 11 }
  , s  : { kind : "pressed", index : 8 }
  , lA : { kind : "axis"   , index : 3, min : -0.867, max : 0.867 }
  , rA : { kind : "axis"   , index : 4, min : -0.867, max : 0.867 }
  , dpad : { kind : "buttons", upIndex : 10, downIndex : 11, leftIndex : 12, rightIndex : 13 }
  , ls : { kind : "axes", xIndex : 0, yIndex : 1, cardinals : gamecubeCardinals }
  , cs : { kind : "axes", xIndex : 2, yIndex : 5, cardinals : gamecubeCardinals }
  , isGC : true
  , ids : [{ name : "Brook adapter", id : "Wii U GameCube Controller Adapter", vendor : "0e8f", product : "0003" }]
  };