// @flow

/*eslint indent:0*/
/*eslint camelcase:0*/

import {defaultCardinals} from "../defaults";

import type {GamepadInfo} from "../gamepadInfo";

const raphnetV2_9IDs = [ { name : "Raphnet N64 adapter, v2.9", id : "GC/N64 to USB, v2.", vendor : "289b", product : "000c"} 
                       , { name : "Raphnet N64 adapter, v2.9", id : "GC/N64 to USB v2."} 
                       ];

const raphnetV3_2IDs = [ { name : "Raphnet N64 adapter, v3", id : "GC/N64 to USB, v3.", vendor : "289b", product : "001d"} 
                       , { name : "Raphnet N64 adapter, v3", id : "GC/N64 to USB v3."}
                       ];

export const raphnetV2_9 : GamepadInfo = 
  { a  : { kind : "pressed", index : 4 }
  , b  : { kind : "pressed", index : 3 }
  , x  : { kind : "pressed", index : 2 }
  , y  : { kind : "pressed", index : 1 }
  , z  : { kind : "pressed", index : 7 }
  , r  : { kind : "pressed", index : 6 }
  , l  : { kind : "pressed", index : 5 }
  , s  : { kind : "pressed", index : 0 }
  , lA : null
  , rA : null
  , dpad : { kind : "buttons", upIndex : 8, downIndex : 9, leftIndex : 11, rightIndex : 10 }
  , ls : { kind : "axes", xIndex : 0, yIndex : 1, cardinals : defaultCardinals }
  , cs : { kind : "axes", xIndex : 3, yIndex : 4, cardinals : defaultCardinals }
  , isGC : false
  , ids : raphnetV2_9IDs
  };

export const raphnetV3_2 : GamepadInfo = 
  { a  : { kind : "pressed", index : 0 }
  , b  : { kind : "pressed", index : 1 }
  , x  : { kind : "pressed", index : 7 }
  , y  : { kind : "pressed", index : 8 }
  , z  : { kind : "pressed", index : 2 }
  , r  : { kind : "pressed", index : 5 }
  , l  : { kind : "pressed", index : 4 }
  , s  : { kind : "pressed", index : 3 }
  , lA : null
  , rA : null
  , dpad : { kind : "buttons", upIndex : 10, downIndex : 11, leftIndex : 12, rightIndex : 13 }
  , ls : { kind : "axes", xIndex : 0, yIndex : 1, cardinals : defaultCardinals }
  , cs : { kind : "axes", xIndex : 3, yIndex : 4, cardinals : defaultCardinals }
  , isGC : false
  , ids : raphnetV3_2IDs
  };