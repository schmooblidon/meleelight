import {Vec2D} from "./Vec2D";
export function Box2D(min, max) {
  this.min = new Vec2D(min[0], min[1]);
  this.max = new Vec2D(max[0], max[1]);
}

