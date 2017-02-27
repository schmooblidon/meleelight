
import {Vec2D} from "main/util/Vec2D";

export class Vec3D { x : number; y : number; z : number;
  constructor( x : number, y : number, z : number ) {
    this.x = x;
    this.y = y;
    this.z = z;
  };
};

export function dot (v1, v2) {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

export function add (v1, v2) {
  return new Vec3D (v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
}

// this function computes the projected coordinates on a 2D-screen of a point in 3D,
// as seen from the point O, with direction vector D, and screen with center at C = O + D
// on this screen, "right" corresponds to the vector R, and "up" to U
// note that U and R should be orthogonal to D and to each-other
export function splatCoordinates ( o, d, r, u, p) {
  const op = new Vec3D ( p.x - o.x, p.y - o.y, p.z - o.z);
  const t = dot (d, d) / dot (op, d);
  if (t < 0) {
    return null;
  }
  const s = new Vec3D ( (1-t) * o.x + t * p.x
                      , (1-t) * o.y + t * p.y
                      , (1-t) * o.z + t * p.z );
  const c = new Vec3D ( o.x + d.x, o.y + d.y, o.z + d.z);
  const x = r.x * (s.x - c.x) + r.y * (s.y - c.y) + r.z * (s.z - c.z);
  const y = u.x * (s.x - c.x) + u.y * (s.y - c.y) + u.z * (s.z - c.z);
  return new Vec2D( x, y );
}