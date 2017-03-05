import {Vec2D} from "../main/util/Vec2D";

export function regularPolygonPoints( n, r = 1, z = 0) {
  const points = [];
  for (let i = 0; i < n; i++) {
    const theta = 2*i*Math.PI/n;
    points.push( new Vec2D (r*Math.cos(theta), r*Math.sin(theta) ));
  }
  return points;
}