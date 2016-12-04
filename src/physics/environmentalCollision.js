import {Vec2D} from "main/characters";
import {dotProd, scalarProd} from "main/linAlg";

const magicAngle = Math.PI/6;
const maximumCollisionDetectionPasses = 5;

// returns true if the vector is moving into the wall, false otherwise
function movingInto (vec, wallTop, wallBottom, wallType) {
  let s = 1;
  if (wallType[0].toLowerCase() === "l") {
    s = -1;
  }
  const outwardsWallNormal = new Vec2D ( s * (wallTop.y - wallBottom.y), s*( wallBottom.x-wallTop.x )  );
  return ( dotProd ( vec, outwardsWallNormal ) < 0 );
};

// returns true if point is to the right of a "left" wall, or to the left of a "right" wall,
// and false otherwise
function isOutside (point, wallTop, wallBottom, wallType) {
  const mov = new Vec2D ( point.x - wallBottom.x, point.y - wallBottom.y );
  return ( !movingInto(mov, wallTop, wallBottom, wallType ) );
};

function extremePoint(wall, extreme) {
  const  v1 = wall[0];
  const  v2 = wall[1];
  if (extreme[0].toLowerCase() === "u" || extreme[0].toLowerCase() === "t" ) {
    if (v2.y < v1.y) {
      return v1;
    }
    else {
      return v2;
    }
  }
  else if (extreme[0].toLowerCase() === "d" || extreme[0].toLowerCase() === "b" ) {
    if (v2.y > v1.y) {
      return v1;
    }
    else {
      return v2;
    }
  }
  else if (extreme[0].toLowerCase() === "l" ) {
    if (v2.x > v1.x) {
      return v1;
    }
    else {
      return v2;
    }
  }
  else if (extreme[0].toLowerCase() === "r" ) {
    if (v2.x < v1.x) {
      return v1;
    }
    else {
      return v2;
    }
  }
  else {
    return ("error in 'extremePoint': invalid parameter "+extreme+", not up/top/down/bottom/left/right");
  }
};


function lineAngle( line ) { // returns angle of line from the positive x axis, in radians, from 0 to pi
  const v1 = line[0];
  const v2 = line[1];
  const theta = Math.atan2( v2.y - v1.y, v2.x - v1.x  );
  if (theta < 0) {
    return (theta + Math.PI);
  }
  else {
    return theta;
  }
};

// finds the intercept of two lines,
// both given as pairs of points
// please be careful to not call this function on lines that are parallel
function coordinateInterceptParameter (line1, line2) {
  const x1 = line1[0].x;
  const x2 = line1[1].x;
  const x3 = line2[0].x;
  const x4 = line2[1].x;
  const y1 = line1[0].y;
  const y2 = line1[1].y;
  const y3 = line2[0].y;
  const y4 = line2[1].y;
  const t = ( (x3-x1)*(y2-y1) + (x2-x1)*(y1-y3) ) / ( (x4-x3)*(y2-y1) + (x2-x1)*(y3-y4) );
  return ( t );
};

// orthogonally projects a point onto a line
// line is given by two points it passes through
function orthogonalProjection(point, line) {
  // turn everything into relative coordinates with respect to the point line[0]
  const pointVec = new Vec2D ( point.x - line[0].x, point.y - line[0].y);
  const lineVec  = new Vec2D ( line[1].x - line[0].x, line[1].y - line[0].y);
  // vector projection calculation
  const factor = dotProd(pointVec, lineVec) / dotProd(lineVec, lineVec);
  const projVec = scalarProd(factor, lineVec);
  // back to absolute coordinates by adding the coordinates of line[0]
  return (new Vec2D(projVec.x + line[0].x,projVec.y + line[0].y));
};


// ecbp : projected ECB
// ecb1 : old ECB
// function return type: either false (no collision) or a pair (touchingWall, proposed new player center position (Vec2D))
// touchingWall is either false, left or right, indicating whether the player is still touching that wall after the transformation
function findCollision (ecbp, ecb1, wall, wallType) {

  const wallTop    = extremePoint(wall, "top");
  const wallBottom = extremePoint(wall, "bottom");
  const wallLeft   = extremePoint(wall, "left");
  const wallRight  = extremePoint(wall, "right");

  let same = 3;
  let opposite = 1;
  if (wallType[0].toLowerCase() === "l" ) {
    same = 1;
    opposite = 3;
  }

  const sameECBMov = new Vec2D ( ecbp[same].x-ecb1[same].x, ecbp[same].y-ecb1[same].y);

  if ( !movingInto( sameECBMov, wallTop, wallBottom, wallType)) {
    return false; // no collision: player not moving towards wall
    // this clause makes sure that in later calls of 'coordinateIntercept',
    // the relevant lines aren't going to be parallel
  }
  else if ( !isOutside ( ecb1[opposite], wall, wallType ) ) {
    return false; // no collision: player was already on the other side of the wall
  }
  else if ( !isOutside ( ecbp[same], wall, wallType ) ) {
    // from now on, we know that the projected same-side ECB point is on the inside half-plane of the wall

    // first check if player was even near the wall
    if (    (ecbp[0].y > wallTop.y    && ecb1[0].y > wallTop.y   ) // player stayed above the wall
         || (ecbp[2].y < wallBottom.y && ecb1[2].y < wallBottom.y) // played stayed below the wall
         || (ecbp[3].x > wallRight.x  && ecb1[3].x > wallRight.x ) // player stayed to the right of the wall
         || (ecbp[1].x < wallLeft.x   && ecb1[1].x < wallLeft.x  ) // player stayed to the left of the wall
       ) {
      return false;
    }
    
    // now the real collision checking
    // only need to work with same-side ECB point,
    // and no need to do corner checking,
    // because of wall and airborne ECB angle restrictions
    else {
      const t = coordinateInterceptParameter (wall, [ecb1[same],ecbp[same]]); // need to put wall first
      if (t < 0 || t > 1) {
        return false; // no collision
      }
      else {
        const intersection = new Vec2D (ecb1[same].x + t*(ecbp[same].x-ecb1[same].x), ecb1[same].y + t*(ecbp[same].y-ecb1[same].y));
        if (intersection.y > wallTop.y || intersection.y < wallBottom.y) {
          return false; // no collision
        }
        else {
          const newSameECB = orthogonalProjection(ecbp[same], wall);
          const newCenter = new Vec2D( newSameECB.x + (ecbp[opposite].x-ecbp[same].x)/2, newSameECB.y);
          let touchingWall = wallType;
          if (newCenter.y < wallBottom.y || newCenter.y > wallTop.y ) {
            touchingWall = false;
          }
          return ( [touchingWall, newCenter] );
        }
      }
    }
  }
};

function squaredDist (center1, center2) {
  return (center1.x * center2.x + center1.y * center2.y);
};

function closestTouchingAndCenter(oldCenter, newTouchingAndCenters) {
  let newTouchingAndCenter = newTouchingAndCenters[0];
  for (let i = 1; i < newTouchingAndCenters.length; i++) {
    if (squaredDist (oldCenter,newTouchingAndCenter[1]) > squaredDist(oldCenter, newTouchingAndCenters[i][1])) {
      newTouchingAndCenter = newTouchingAndCenters[i];
    }
  }
  return newTouchingAndCenter;
};


function moveECB (ecb, vec) {
  const newECB = [
    new Vec2D(ecb[0].x+vec.x,ecb[0].y+vec.y),
    new Vec2D(ecb[1].x+vec.x,ecb[1].y+vec.y),
    new Vec2D(ecb[2].x+vec.x,ecb[2].y+vec.y),
    new Vec2D(ecb[3].x+vec.x,ecb[3].y+vec.y)
  ];
  return newECB;
};

// assumes walls is a list of wallWallType elements,
// a wallWallType element is of the form [wall, wallType]
// where wall is a pair of Vec2D points, and wallType is either 'left' or 'right'
// returns a 'touchingAndCenter', i.e. whether player is touching a wall,
// together with the player's proposed new position center
function loopOverWalls( ecbp, ecb1, oldCenter, wallWallTypes, oldTouchingAndCenter, passNumber ) {
  let newCollisionHappened = false;
  const suggestedTouchingAndCenters = [oldTouchingAndCenter];
  if (passNumber > maximumCollisionDetectionPasses) {
    return oldTouchingAndCenter;
  }
  else {
    const collisionData = wallWallTypes.map( function(){ return findCollision (ecbp, ecb1, this[0], this[1]);}  );
    for (let i = 0; i < collisionData.length; i++) {
      if (collisionData[i] === false) { 
        // do nothing
      }
      else {
        newCollisionHappened = true;
        suggestedTouchingAndCenters.push(collisionData[i]);
      }
    }
    if (newCollisionHappened === true) {
      const newTouchingAndCenter = closestTouchingAndCenter( oldCenter, suggestedTouchingAndCenters);
      const vec = new Vec2D( newTouchingAndCenter[1].x - oldCenter.x, newTouchingAndCenter[1].y - oldCenter.y);
      const newecbp = moveECB (ecbp, vec);
      return (loopOverWalls (newecbp, ecb1, oldCenter, wallWallTypes, newTouchingAndCenter, passNumber+1));
    }
    else {
      return oldTouchingAndCenter;
    }
  }
};

export function getNewTouchingAndCenterFromWalls(ecbp, ecb1, wallWallTypes) {
  let touchingAndCenter = [false, new Vec2D( ecbp[0].x, ecbp[1].y)];
  const oldCenter = new Vec2D( ecb1[0].x, ecb1[1].y);
  touchingAndCenter = loopOverWalls(ecbp, ecb1, oldCenter, wallWallTypes, touchingAndCenter, 0 );
};