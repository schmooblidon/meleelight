//@flow

import {Vec2D} from "../main/util/Vec2D";
import {euclideanDist, add} from "../main/linAlg";
import {solveQuadraticEquation} from "../main/util/solveQuadraticEquation";
import {distanceToPolygon} from "../stages/util/detectIntersections";
import {pickSmallestSweep} from "../main/util/findSmallestWithin";
import {vLineThrough, hLineThrough, coordinateInterceptParameter} from "./environmentalCollision";

// computes the first point of intersection between two sweeping circles
// circle 1 sweeps from p1 to p2 with radius going from r1 to r2
// circle 2 sweeps from q1 to q2 with radius going from s1 to s2
function sweepCircleVsSweepCircle ( p1 : Vec2D, r1 : number, p2 : Vec2D, r2 : number, q1 : Vec2D, s1 : number, q2 : Vec2D, s2 : number ) : null | Vec2D {
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

// computes the first point of collision between:
//  - sweeping circle, going from p1 with radius r1 to p2 with radius r2
//  - fixed AABB with bottom left point bl and top right point tr
function sweepCircleVsAABB ( p1 : Vec2D, p2 : Vec2D, r1 : number, r2 : number, bl : Vec2D, tr : Vec2D ) : null | Vec2D {
  let br = new Vec2D( tr.x, bl.y );
  let tl = new Vec2D( bl.x, tr.y );
  if (distanceToPolygon(p1,[bl,br,tr,tl]) <= r1) {
    return p1;
  }
  else {
    let checks;
    if (p1.x <= bl.x) {
      if (p1.y <= bl.y) { // bottom left corner
        checks = [ { kind : "corner", corner : bl, p1 : p1, p2 : p2, r1 : r1, r2 : r2 }
                 , { kind : "corner", corner : tl, p1 : p1, p2 : p2, r1 : r1, r2 : r2 }
                 , { kind : "corner", corner : br, p1 : p1, p2 : p2, r1 : r1, r2 : r2 }
                 , { kind : "line"  , line1 : vLineThrough(bl), line2 : [add(p1, new Vec2D(r1,0)), add(p2, new Vec2D(r2,0))] }
                 , { kind : "line"  , line1 : hLineThrough(bl), line2 : [add(p1, new Vec2D(0,r1)), add(p2, new Vec2D(0,r2))] }
                 ]
      }
      else if (p1.y >= tr.y) { // top left corner
        checks = [ { kind : "corner", corner : tl, p1 : p1, p2 : p2, r1 : r1, r2 : r2 }
                 , { kind : "corner", corner : bl, p1 : p1, p2 : p2, r1 : r1, r2 : r2 }
                 , { kind : "corner", corner : tr, p1 : p1, p2 : p2, r1 : r1, r2 : r2 }
                 , { kind : "line"  , line1 : vLineThrough(bl), line2 : [add(p1, new Vec2D(r1,0)), add(p2, new Vec2D(r2,0))] }
                 , { kind : "line"  , line1 : hLineThrough(tr), line2 : [add(p1, new Vec2D(0,-r1)), add(p2, new Vec2D(0,-r2))] }
                 ]
      }
      else { // left side
        checks = [ { kind : "corner", corner : bl, p1 : p1, p2 : p2, r1 : r1, r2 : r2 }
                 , { kind : "corner", corner : tl, p1 : p1, p2 : p2, r1 : r1, r2 : r2 }
                 , { kind : "line"  , line1 : vLineThrough(bl), line2 : [add(p1, new Vec2D(r1,0)), add(p2, new Vec2D(r2,0))] }
                 ]
      }
    }
    else if (p1.x >= tr.x) {
      if (p1.y <= bl.y) { // bottom right corner
        checks = [ { kind : "corner", corner : br, p1 : p1, p2 : p2, r1 : r1, r2 : r2 }
                 , { kind : "corner", corner : bl, p1 : p1, p2 : p2, r1 : r1, r2 : r2 }
                 , { kind : "corner", corner : tr, p1 : p1, p2 : p2, r1 : r1, r2 : r2 }
                 , { kind : "line"  , line1 : vLineThrough(tr), line2 : [add(p1, new Vec2D(-r1,0)), add(p2, new Vec2D(-r2,0))] }
                 , { kind : "line"  , line1 : hLineThrough(bl), line2 : [add(p1, new Vec2D(0,r1)), add(p2, new Vec2D(0,r2))] }
                 ]
      }
      else if (p1.y >= tr.y) { // top right corner
        checks = [ { kind : "corner", corner : tr, p1 : p1, p2 : p2, r1 : r1, r2 : r2 }
                 , { kind : "corner", corner : tl, p1 : p1, p2 : p2, r1 : r1, r2 : r2 }
                 , { kind : "corner", corner : br, p1 : p1, p2 : p2, r1 : r1, r2 : r2 }
                 , { kind : "line"  , line1 : vLineThrough(tr), line2 : [add(p1, new Vec2D(-r1,0)), add(p2, new Vec2D(-r2,0))] }
                 , { kind : "line"  , line1 : hLineThrough(tr), line2 : [add(p1, new Vec2D(0,-r1)), add(p2, new Vec2D(0,-r2))] }
                 ]
      }
      else { // right side
        checks = [ { kind : "corner", corner : tr, p1 : p1, p2 : p2, r1 : r1, r2 : r2 }
                 , { kind : "corner", corner : br, p1 : p1, p2 : p2, r1 : r1, r2 : r2 }
                 , { kind : "line"  , line1 : vLineThrough(tr), line2 : [add(p1, new Vec2D(-r1,0)), add(p2, new Vec2D(-r2,0))] }
                 ]
      }
    }
    else { 
      if (p1.y <= bl.y) { // bottom side
        checks = [ { kind : "corner", corner : bl, p1 : p1, p2 : p2, r1 : r1, r2 : r2 }
                 , { kind : "corner", corner : br, p1 : p1, p2 : p2, r1 : r1, r2 : r2 }
                 , { kind : "line"  , line1 : hLineThrough(bl), line2 : [add(p1, new Vec2D(0,r1)), add(p2, new Vec2D(0,r2))] }
                 ]
      }
      else { // top side, all other cases have been ruled out
        checks = [ { kind : "corner", corner : tl, p1 : p1, p2 : p2, r1 : r1, r2 : r2 }
                 , { kind : "corner", corner : tr, p1 : p1, p2 : p2, r1 : r1, r2 : r2 }
                 , { kind : "line"  , line1 : hLineThrough(tr), line2 : [add(p1, new Vec2D(0,-r1)), add(p2, new Vec2D(0,-r2))] }
                 ]
      }
    }

    const first = pickSmallestSweep(checks.map(aabbChecker));
    if (first === null) {
      return null;
    }
    else {
      return first.point;
    }

  }
  
}

type AABBDatum = { kind : "corner", corner : Vec2D, p1 : Vec2D, p2 : Vec2D, r1 : number, r2 : number }
               | { kind : "line"  , line1 : [Vec2D, Vec2D], line2 : [Vec2D, Vec2D] }
function aabbChecker ( aabbDatum : AABBDatum ) : null | { sweep : number, point : Vec2D } {
  if (aabbDatum.kind === "corner") {
    const c = aabbDatum.corner;
    const p1 = aabbDatum.p1;
    const p2 = aabbDatum.p2;
    const r1 = aabbDatum.r1;
    const r2 = aabbDatum.r2;
    if (euclideanDist(c, p1) < r1) {
      return { sweep : 0, point : c };
    }
    else {
      const a0 = Math.pow(p1.x - c.x, 2) + Math.pow(p1.y - c.y, 2) - Math.pow(r1, 2);
      const a1 = -2 * ((p1.x - c.x) * (p1.x + p2.x) + (p1.y - c.y) * (p1.y + p2.y) - r1 * (r1 - r2));
      const a2 = Math.pow(p1.x + p2.x, 2) + Math.pow(p1.y + p2.y, 2) + Math.pow(r1 - r2, 2);
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
        return { sweep : t, point : c };
      }

    }
  }
  else {
    const p = aabbDatum.line1[0];
    const q = aabbDatum.line1[1];
    const s = coordinateInterceptParameter(aabbDatum.line2, aabbDatum.line1);
    if (s < 0 || s > 1 || isNaN(s) || s === Infinity) {
      return null;
    }
    else {
      return { sweep : s, point : new Vec2D ( (1-s) * p.x + s * q.x, (1-s) * p.y + s * q.y ) }
    }
  }
}