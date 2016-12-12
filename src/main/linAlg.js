import {Vec2D} from "main/characters";

/* eslint-disable */

export function dotProd(vec1,vec2) {
  return (vec1.x * vec2.x + vec1.y * vec2.y);
};

export function scalarProd( lambda, vec) {
  return ( new Vec2D ( lambda * vec.x, lambda * vec.y ));
};

export function norm(vec) {
  return ( Math.sqrt( dotProd(vec,vec) ));
}


export function squaredDist (center1, center2) {
  return ( (center2.x - center1.x)*(center2.x - center1.x) + (center2.y - center1.y)*(center2.y - center1.y) );
};

export function manhattanDist (center1, center2) {
  return ( Math.abs(center2.x - center1.x) + Math.abs(center2.y - center1.y) );
};


// orthogonally projects a point onto a line
// line is given by two points it passes through
export function orthogonalProjection(point, line) {
  const line0 = line[0];
  const [line0x,line0y] = [line0.x, line0.y];
  // turn everything into relative coordinates with respect to the point line[0]
  const pointVec = new Vec2D ( point.x - line0x, point.y - line0y);
  const lineVec  = new Vec2D ( line[1].x - line0x, line[1].y - line0y);
  // renormalise line vector
  const lineNorm = norm(lineVec);
  const lineElem = scalarProd( 1/lineNorm, lineVec);
  // vector projection calculation
  const factor = dotProd(pointVec, lineElem);
  const projVec = scalarProd(factor, lineElem);
  // back to absolute coordinates by adding the coordinates of line[0]
  return (new Vec2D(projVec.x + line0x,projVec.y + line0y));
};


// Computes the inverse of a 2x2 matrix.
export function inverseMatrix([
  [x1, x2],
  [y1, y2]
]) {
  let det = x1 * y2 - x2 * y1;
  if (Math.abs(det) < 0.00001) {
    return "error in inverseMatrix: determinant too small";
  } else {
    return [
      [y2 / det, -x2 / det],
      [-y1 / det, x1 / det]
    ];
  }
};

// Multiplication Av (A a 2x2 matrix, v a 2x1 column vector)
// Return type: [xnew,ynew]
export function multMatVect([
  [x1, x2],
  [y1, y2]
], [x, y]) {
  return [x1 * x + x2 * y, y1 * x + y2 * y];
};
