// @flow

import {Vec2D} from "./Vec2D";

export class Box2D { min : Vec2D; max : Vec2D ;
  constructor( min : [number,number], max : [number,number]) {
    this.min = new Vec2D(min[0], min[1]);
    this.max = new Vec2D(max[0], max[1]);
  }
}

