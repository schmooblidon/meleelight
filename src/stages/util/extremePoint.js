// @flow

import {Vec2D} from "../../main/util/Vec2D";
import type Vec2DType from "../../main/util/Vec2D";

export function extremePoint(wall : [Vec2DType, Vec2DType], extreme : string) : Vec2DType | null {
  const  v1 = wall[0];
  const  v2 = wall[1];
  switch (extreme) {
    case "u":
    case "t":
      if (v2.y < v1.y) {
        return v1;
      }
      else {
        return v2;
      }
    case "d":
    case "b":
      if (v2.y > v1.y) {
        return v1;
      }
      else {
        return v2;
      }
    case "l":
      if (v2.x > v1.x) {
        return v1;
      }
      else {
        return v2;
      }
    case "r":
      if (v2.x < v1.x) {
        return v1;
      }
      else {
        return v2;
      }
    default:
      console.log( "error in 'extremePoint': invalid parameter "+extreme+", not up/top/down/bottom/left/right");
      return null;
  }
};