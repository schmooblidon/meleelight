/* eslint-disable */

// Computes the inverse of a 2x2 matrix.
export function inverseMatrix ( [[x1,x2],[y1,y2]] ) {
    let det = x1*y2-x2*y1;
    if (Math.abs(det) < 0.00001)
         { return "error in inverseMatrix: determinant too small"; }
    else { return [[y2/det,-x2/det],[-y1/det,x1/det]]; }
};

// Multiplication Av (A a 2x2 matrix, v a 2x1 column vector)
// Return type: [xnew,ynew]
export function multMatVect ( [[x1,x2],[y1,y2]], [x,y] ) {
    return [x1*x+x2*y, y1*x+y2*y];
};