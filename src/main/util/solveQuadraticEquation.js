// solves the quadratic equation a0 + a1 x + a2 x^2 = 0
// uses the sign to choose the solution
// do not call this function with parameter a2 = 0
export function solveQuadraticEquation (a0, a1, a2, sign = 1) {
  const disc = a1*a1 - 4*a0*a2;
  if (disc < 0) {
    //console.log("error in function 'solveQuadraticEquation': negative discriminant");
    return false;
  }
  else {
    return ((-a1 + sign* Math.sqrt(disc)) / (2 * a2) );
  }
}