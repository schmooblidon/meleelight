import {Vec2D} from "./Vec2D";
export function Segment2D(x, y, vecx, vecy) {
  this.x = x;
  this.y = y;
  this.vecx = vecx;
  this.vecy = vecy;
  this.segLength = function () {
    const dx = this.vecx;
    const dy = this.vecy;
    return Math.sqrt(dx * dx + dy * dy);
  };
  this.project = function (segOnto) {
    const vec = new Vec2D(this.vecx, this.vecy);
    const onto = new Vec2D(segOnto.vecx, segOnto.vecy);
    const d = onto.dot(onto);
    if (0 < d) {
      const dp = vec.dot(onto);
      const multiplier = dp / d;
      const rx = onto.x * multiplier;
      const ry = onto.y * multiplier;
      return new Vec2D(rx, ry);
    }
    return new Vec2D(0, 0);
  };
}