// @flow

import {Vec2D} from "./util/Vec2D";

export function dotProd(vec1 : Vec2D, vec2 : Vec2D) : number {
  return (vec1.x * vec2.x + vec1.y * vec2.y);
};

export function scalarProd( lambda : number, vec : Vec2D) : Vec2D {
  return ( new Vec2D ( lambda * vec.x, lambda * vec.y ));
};

export function norm(vec : Vec2D) : number {
  return ( Math.sqrt( dotProd(vec,vec) ));
}

export function add(vec1 : Vec2D, vec2 : Vec2D) : Vec2D {
  return ( new Vec2D ( vec1.x + vec2.x, vec1.y + vec2.y) );
}

export function subtract(vec1 : Vec2D, vec2 : Vec2D) : Vec2D {
  return ( new Vec2D ( vec1.x - vec2.x , vec1.y - vec2.y ) );
}


function squaredDist (center1 : Vec2D, center2 : Vec2D) : number {
  return ( (center2.x - center1.x)*(center2.x - center1.x) + (center2.y - center1.y)*(center2.y - center1.y) );
};

export function euclideanDist(center1 : Vec2D, center2 : Vec2D) : number {
  const sqDist = squaredDist(center1, center2);
  return sqDist <= 0 ? 0 : Math.sqrt(sqDist);
}

export function manhattanDist (center1 : Vec2D, center2 : Vec2D) : number {
  return ( Math.abs(center2.x - center1.x) + Math.abs(center2.y - center1.y) );
};


// orthogonally projects a point onto a line
// line is given by two points it passes through
export function orthogonalProjection(point : Vec2D, line : [Vec2D, Vec2D]) : Vec2D {
  const line0 = line[0];
  const [line0x,line0y] = [line0.x, line0.y];
  if (line0x === line[1].x && line0y === line[1].y ) {
    console.log("error in function 'orthogonalProjection', line reduced to a point.");
    return line0;
  }
  else {
    // turn everything into relative coordinates with respect to the point line[0]
    const pointVec : Vec2D = new Vec2D ( point.x - line0x, point.y - line0y);
    const lineVec  : Vec2D = new Vec2D ( line[1].x - line0x, line[1].y - line0y);
    // renormalise line vector
    const lineNorm : number = norm(lineVec);
    const lineElem : Vec2D  = scalarProd( 1/lineNorm, lineVec);
    // vector projection calculation
    const factor  : number = dotProd(pointVec, lineElem);
    const projVec : Vec2D  = scalarProd(factor, lineElem);
    // back to absolute coordinates by adding the coordinates of line[0]
    return (new Vec2D(projVec.x + line0x,projVec.y + line0y));
  }
};


// Computes the inverse of a 2x2 matrix.
export function inverseMatrix( [[x1, x2 ],[y1, y2]] : [[number, number], [number,number]] ) : null | [[number, number], [number,number]] {
  const det = x1 * y2 - x2 * y1;
  if (Math.abs(det) < 0.00001) {
    console.log("error in inverseMatrix: determinant too small");
    return null;

  } else {
    return [
      [y2 / det, -x2 / det],
      [-y1 / det, x1 / det]
    ];
  }
};

// Multiplication Av (A a 2x2 matrix, v a 2x1 column vector)
// Return type: [xnew,ynew]
export function multMatVect( [[x1, x2],[y1, y2]] : [[number, number], [number,number]]
                           ,  [x , y ] : [number, number]) : [number, number] {
  return [x1 * x + x2 * y, y1 * x + y2 * y];
};

export function reflect( reflectee : Vec2D, reflector : Vec2D ) : Vec2D {
  const projVec = orthogonalProjection(reflectee, [new Vec2D(0,0), reflector]);
  const moveVec = subtract(projVec, reflectee);
  return add(reflectee, scalarProd(2, moveVec));
}
