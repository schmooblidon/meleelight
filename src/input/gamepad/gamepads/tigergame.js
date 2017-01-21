// @flow
/*eslint indent:0*/

import {gamecubeCardinals} from "../defaults";

import type {GamepadInfo} from "../gamepadInfo";

export const tigergame1 : GamepadInfo = 
  { a  : { kind : "pressed", index : 0 }
  , b  : { kind : "pressed", index : 1 }
  , x  : { kind : "pressed", index : 2 }
  , y  : { kind : "pressed", index : 3 }
  , z  : { kind : "pressed", index : 6 }
  , r  : { kind : "pressed", index : 5 }
  , l  : { kind : "pressed", index : 4 }
  , s  : { kind : "pressed", index : 7 }
  , lA : { kind : "axis"   , index : 5, min : -0.867, max : 0.867 }
  , rA : { kind : "axis"   , index : 4, min : -0.867, max : 0.867 }
  , dpad : { kind : "buttons", upIndex : 11, downIndex : 10, leftIndex : 8, rightIndex : 9 }
  , ls : { kind : "axes", xIndex : 0, yIndex : 1, cardinals : gamecubeCardinals }
  , cs : { kind : "axes", xIndex : 2, yIndex : 3, cardinals : gamecubeCardinals }
  , isGC : true
  , ids : [ { name : "TigerGame 3-in-1 adapter", id : "TigerGame XBOX+PS2+GC Game Controller Adapter", vendor : "0926", product : "2526", allowedIDType : "Firefox" } ]
  };

  export const tigergame2 : GamepadInfo = 
  { a  : { kind : "pressed", index : 0 }
  , b  : { kind : "pressed", index : 1 }
  , x  : { kind : "pressed", index : 2 }
  , y  : { kind : "pressed", index : 3 }
  , z  : { kind : "pressed", index : 6 }
  , r  : { kind : "pressed", index : 5 }
  , l  : { kind : "pressed", index : 4 }
  , s  : { kind : "pressed", index : 7 }
  , lA : { kind : "axis"   , index : 7, min : -0.867, max : 0.867 }
  , rA : { kind : "axis"   , index : 6, min : -0.867, max : 0.867 }
  , dpad : { kind : "buttons", upIndex : 11, downIndex : 10, leftIndex : 8, rightIndex : 9 }
  , ls : { kind : "axes", xIndex : 0, yIndex : 1, cardinals : gamecubeCardinals }
  , cs : { kind : "axes", xIndex : 2, yIndex : 5, cardinals : gamecubeCardinals }
  , isGC : true
  , ids : [ { name : "TigerGame 3-in-1 adapter", id : "TigerGame XBOX+PS2+GC Game Controller Adapter", vendor : "0926", product : "2526", allowedIDType : "Chrome" } ]
  };