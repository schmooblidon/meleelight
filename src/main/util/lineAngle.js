// @flow

import {Vec2D} from "./Vec2D";

export function lineAngle( line : [Vec2D, Vec2D] ) : number { // returns angle of line from the positive x axis, in radians, from 0 to pi
  const v1 = line[0];
  const v2 = line[1];
  const theta = Math.atan2( v2.y - v1.y, v2.x - v1.x  );
  if (theta < 0) {
    return (theta + Math.PI);
  }
  else {
    return theta;
  }
};