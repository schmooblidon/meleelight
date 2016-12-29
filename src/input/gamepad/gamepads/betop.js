// @flow
/*eslint indent:0*/

import {gamecubeCardinals} from "../defaults";

import type {GamepadInfo} from "../gamepadInfo";

export const betop : GamepadInfo = 
  { a  : { kind : "pressed", index : 1 }
  , b  : { kind : "pressed", index : 2 }
  , x  : { kind : "pressed", index : 0 }
  , y  : { kind : "pressed", index : 3 }
  , z  : { kind : "pressed", index : 5 }
  , r  : { kind : "pressed", index : 7 }
  , l  : { kind : "pressed", index : 6 }
  , s  : { kind : "pressed", index : 9 }
  , lA : { kind : "axis"   , index : 7, min : -0.867, max : 0.867 }
  , rA : { kind : "axis"   , index : 6, min : -0.867, max : 0.867 }
  , dpad : { kind : "axis", index : 9}
  , ls : { kind : "axes", xIndex : 0, yIndex : 1, cardinals : gamecubeCardinals }
  , cs : { kind : "axes", xIndex : 2, yIndex : 5, cardinals : gamecubeCardinals }
  , isGC : true
  , ids : [ { name : "Betop controller", id : "Betop Controller", vendor : "20bc", product : "1264" } ]
  };