// @flow
/*eslint indent:0*/

import {gamecubeCardinals} from "../defaults";

import type {GamepadInfo} from "../gamepadInfo";

const mayflashIDs = [ { name : "Mayflash Wii U 4-way adapter", id : "Mayflash", vendor : "0079", product : "1843" } 
                    , { name : "Nexilux adapter", id : "NEXILUX", vendor : "0079", product : "1845" }
                    , { name : "Generic GC controller adapter", id : "GameCube Controller Adapter", vendor : "0079", product : "1846" }
                    , { name : "Mayflash Wii U 4-way adapter", id : "Wii U Gamecube Adapter" }
                    , { name : "Mayflash 2-port adapter", id : "USB GamePad", vendor : "1a34", product : "f705" }
                    ];

export const mayflash : GamepadInfo = 
  { a  : { kind : "pressed", index : 1 }
  , b  : { kind : "pressed", index : 2 }
  , x  : { kind : "pressed", index : 0 }
  , y  : { kind : "pressed", index : 3 }
  , z  : { kind : "pressed", index : 7 }
  , r  : { kind : "pressed", index : 5 }
  , l  : { kind : "pressed", index : 4 }
  , s  : { kind : "pressed", index : 9 }
  , lA : { kind : "axis"   , index : 3, min : -0.867, max : 0.867 }
  , rA : { kind : "axis"   , index : 4, min : -0.867, max : 0.867 }
  , dpad : { kind : "buttons", upIndex : 12, downIndex : 14, leftIndex : 15, rightIndex : 13 }
  , ls : { kind : "axes", xIndex : 0, yIndex : 1, cardinals : gamecubeCardinals }
  , cs : { kind : "axes", xIndex : 5, yIndex : 2, cardinals : gamecubeCardinals }
  , isGC : true
  , ids : mayflashIDs
  };
