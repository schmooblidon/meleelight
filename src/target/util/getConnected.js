// @flow

import type {Stage, Connected} from "../../stages/stage";
import {extremePoint} from "../../stages/util/extremePoint";
import {manhattanDist as d} from "../../main/linAlg";

export function getConnected(stage : Stage) : Connected {
  const lg = stage.ground.length;
  const lp = stage.platform.length;
  const connected = [[],[]];
  for (let i = 0; i < lg; i++) {
    connected[0].push([null,null]);
    const broke = [false, false];
    if (broke[0] && broke[1]) {
      break;
    }
    for (let j = 0; j < lg; j++) {
      if (!broke[0] && d (extremePoint(stage.ground[i], "l"), extremePoint(stage.ground[j], "r")) < 0.001) {
        connected[0][i][0] = ["g",j];
        broke[0] = true;
      }
      if (!broke[1] && d (extremePoint(stage.ground[i], "r"), extremePoint(stage.ground[j], "l")) < 0.001) {
        connected[0][i][1] = ["g",j];
        broke[1] = true;
      }
    }
    for (let j = 0; j < lp; j++) {
      if (!broke[0] && d (extremePoint(stage.ground[i], "l"), extremePoint(stage.platform[j], "r")) < 0.001) {
        connected[0][i][0] = ["p",j];
        broke[0] = true;
      }
      if (!broke[1] && d (extremePoint(stage.ground[i], "r"), extremePoint(stage.platform[j], "l")) < 0.001) {
        connected[0][i][1] = ["p",j];
        broke[1] = true;
      }
    }
    for (let j = 0; j < stage.wallR.length; j++) {
      if (!broke[0] && d (extremePoint(stage.ground[i], "l"), extremePoint(stage.wallR[j], "r")) < 0.001) {
        connected[0][i][0] = ["r",j];
        broke[0] = true;
      }
    }
    for (let j = 0; j < stage.wallL.length; j++) {
      if (!broke[1] && d (extremePoint(stage.ground[i], "r"), extremePoint(stage.wallL[j], "l")) < 0.001) {
        connected[0][i][1] = ["l",j];
        broke[1] = true;
      }
    }
  }
  for (let i = 0; i < lp; i++) {
    connected[1].push([null,null]);
    const broke = [false, false];
    if (broke[0] && broke[1]) {
      break;
    }
    for (let j = 0; j < lg; j++) {
      if (!broke[0] && d (extremePoint(stage.platform[i], "l"), extremePoint(stage.ground[j], "r")) < 0.001) {
        connected[1][i][0] = ["g",j];
        broke[0] = true;
      }
      if (!broke[1] && d (extremePoint(stage.platform[i], "r"), extremePoint(stage.ground[j], "l")) < 0.001) {
        connected[1][i][1] = ["g",j];
        broke[1] = true;
      }
    }
    for (let j = 0; j < lp; j++) {
      if (!broke[0] && d (extremePoint(stage.platform[i], "l"), extremePoint(stage.platform[j], "r")) < 0.001) {
        connected[1][i][0] = ["p",j];
        broke[0] = true;
      }
      if (!broke[1] && d (extremePoint(stage.platform[i], "r"), extremePoint(stage.platform[j], "l")) < 0.001) {
        connected[1][i][1] = ["p",j];
        broke[1] = true;
      }
    }
    for (let j = 0; j < stage.wallR.length; j++) {
      if (!broke[0] && d (extremePoint(stage.platform[i], "l"), extremePoint(stage.wallR[j], "r")) < 0.001) {
        connected[1][i][0] = ["r",j];
        broke[0] = true;
      }
    }
    for (let j = 0; j < stage.wallL.length; j++) {
      if (!broke[1] && d (extremePoint(stage.platform[i], "r"), extremePoint(stage.wallL[j], "l")) < 0.001) {
        connected[1][i][1] = ["l",j];
        broke[1] = true;
      }
    }
  }
  return connected;
}