// @flow

import type {PointSweepResult} from "../../physics/environmentalCollision";

// finds the smallest value t of the list with t > min, t <= max
export function findSmallestWithin(list : Array<number | null>, min : number, max : number, smallestSoFar : null | number = null) : null | number {
  if (list.length < 1) {
    return smallestSoFar;
  }
  else {
    const [head, ...tail] = list;
    if (head === null) {
      return findSmallestWithin(tail, min, max, smallestSoFar);
    }
    else if (head >= min && head <= max) {
      if (smallestSoFar === null) {
        return findSmallestWithin(tail, min, max, head);
      }
      else if (head > smallestSoFar) {
        return findSmallestWithin(tail, min, max, smallestSoFar);
      }
      else {
        return findSmallestWithin(tail, min, max, head);
      }
    }
    else {
      return findSmallestWithin(tail, min, max, smallestSoFar);
    }
  }
};

// finds the object with smallest sweeping parameter
export function pickSmallestSweep<T : {sweep : number}>( list: Array<null | T>, smallestSoFar : null | T = null) : null | T {
  if (list.length < 1) {
    return smallestSoFar;
  }
  else {
    const [head, ...tail] = list;
    if (head === null) {
      return pickSmallestSweep(tail, smallestSoFar);
    }
    else {
      if (smallestSoFar === null || head.sweep < smallestSoFar.sweep) {
        return pickSmallestSweep(tail, head);
      }
      else {
        return pickSmallestSweep(tail, smallestSoFar);
      }
    }
  }
}
