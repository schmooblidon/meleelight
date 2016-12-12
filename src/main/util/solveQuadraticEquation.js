// solves the quadratic equation a0 + a1 x + a2 x^2 = 0
// uses the sign to choose the solution
// returns false if there are no solutions, or if the solutions are non-real
export function solveQuadraticEquation (a0, a1, a2, sign = 1) {
  if (a1 === 0 && a2 === 0) {
    if (a0 === 0) {
      return -1; // convention
    }
    else {
      return false;
    }
  }
  else if ( Math.abs( a0*a0*a2/(a1*a1) ) < 0.000001 ) {
    return (- a0 / a1);
  }
  else {
    const disc = a1*a1 - 4*a0*a2;
    if (disc < 0) {
      return false; // non-real solutions
    }
    else {
      return ((-a1 + sign* Math.sqrt(disc)) / (2 * a2) );
    }
  }
}
