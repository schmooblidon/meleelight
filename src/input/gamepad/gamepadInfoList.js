// @flow

/*eslint indent:0*/
/*eslint camelcase:0*/

import {mayflash} from "./gamepads/mayflash.js";
import {vjoy} from "./gamepads/vjoy.js";
import {raphnetV2_9, raphnetV3_2} from "./gamepads/raphnet.js";
import {xbox} from "./gamepads/xbox.js";
import {tigergame1, tigergame2} from "./gamepads/tigergame.js";
import {retrolink} from "./gamepads/retrolink.js";
import {brook} from "./gamepads/brook.js";
import {ps4} from "./gamepads/ps4.js";
import {rockx360} from "./gamepads/rockx360.js";
import {wiiU} from "./gamepads/wiiU.js";
import {betop} from "./gamepads/betop.js";
import {dualAction} from "./gamepads/dualAction.js";

export const gamepadInfoList = [ mayflash, vjoy, raphnetV2_9, raphnetV3_2, xbox, tigergame1, tigergame2
                               , retrolink, brook, ps4, rockx360, wiiU, betop, dualAction 
                               ];