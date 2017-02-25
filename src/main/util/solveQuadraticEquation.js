// solves the quadratic equation a0 + a1 x + a2 x^2 = 0
// uses the sign to choose the solution
// returns null if there are no solutions, or if the solutions are non-real
export function solveQuadraticEquation (a0 : number, a1 : number, a2 : number, sign : number = 1) : number | null {
  if (a1 === 0 && a2 === 0) {
    if (a0 === 0) {
      return -1; // convention
    }
    else {
      return null;
    }
  }
  else if ( Math.abs( a0*a0*a2/(a1*a1) ) < 1e-20 ) {
    return (- a0 / a1);
  }
  else {
    const disc = a1*a1 - 4*a0*a2;
    if (disc < 0) {
      return null; // non-real solutions
    }
    else if (Math.sign(a1) === sign) {
      // avoid catastrophic cancellation
      return 2 * a0 / (-a1 - sign * Math.sqrt(disc)); 
    }
    else {
      return ((-a1 + sign * Math.sqrt(disc)) / (2 * a2) );
    }
  }
}
