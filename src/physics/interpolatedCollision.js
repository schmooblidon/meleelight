//@flow

import {Vec2D} from "../main/util/Vec2D";
import {euclideanDist} from "../main/linAlg";
import {solveQuadraticEquation} from "../main/util/solveQuadraticEquation";

// computes the first point of intersection between two sweeping circles
// circle 1 sweeps from p1 to p2 with radius going from r1 to r2
// circle 2 sweeps from q1 to q2 with radius going from s1 to s2
function sweepCircleVsSweepCircle ( p1 : Vec2D, p2 : Vec2D, q1 : Vec2D, q2 : Vec2D, r1 : number, r2 : number, s1 : number, s2 : number) : null | Vec2D {
  if (euclideanDist(p1,q1) < (r1 + s1)) {
    return new Vec2D (0.5 * p1.x + 0.5 * q1.x, 0.5 * p1.y + 0.5 * q1.y);
  }
  else {
    const u = p1.x + q2.x - p2.x - q1.x;
    const v = p1.y + q2.y - p2.y - q1.y;
    const w = r1   + s1   - r2   - s2  ;
    const a0 = Math.pow(p1.x - q1.x, 2) + Math.pow(p1.y - q1.y, 2) - Math.pow(r1 + s1, 2);
    const a1 = -2 * ((p1.x - q1.x) * u + (p1.y - q1.y) * v - (r1 + s1) * w);
    const a2 = Math.pow(u, 2) + Math.pow(v, 2) - Math.pow(w, 2);
    const t1 = solveQuadraticEquation(a0, a1, a2);

    let t = null;
    if (t1 !== null && !isNaN(t1)) {
      const t2 = a0 / (a2 * t1);
      if (t1 < 0 || t1 > 1) {
        if (t2 < 0 || t2 > 1 || isNaN(t2)) {
          t = null;
        }
        else {
          t = t2;
        }
      }
      else {
        if (t2 < 0 || t2 > 1 || isNaN(t2)) {
          t = t1;
        }
        else {
          t = Math.min(t1,t2);
        }
      }
    }

    if (t === null) {
      return null;
    }
    else {
      const r = (1 - t) * r1 + t * r2;
      const s = (1 - t) * s1 + t * s2;
      const p = new Vec2D ( (1-t) * p1.x + t * p2.x, (1-t) * p1.y + t * p2.y);
      const q = new Vec2D ( (1-t) * q1.x + t * q2.x, (1-t) * q1.y + t * q2.y);
      const wp = s/(r+s);
      const wq = r/(r+s);
      return new Vec2D ( wp * p.x + wq * q.x, wp * p.y + wq * q.y );
    }
  }
}



