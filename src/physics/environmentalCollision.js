import {Vec2D} from "main/characters";
import {dotProd, scalarProd} from "main/linAlg";

const magicAngle = Math.PI/6;

// returns true if the vector is moving into the wall, false otherwise
function movingInto (vec, wallTop, wallBottom, wallType) {
  let s = 1;
  if (wallType[0].toLowerCase() == "r") {
    s = -1;
  }
  let outwardsWallNormal = new Vec2d ( s * (wallTop.y - wallBottom.y), s*( wallBottom.x-wallTop.x )  );
  return ( dotProd ( mov, outwardsWallNormal ) < 0 );
};

// returns true if point is to the right of a "left" wall, or to the left of a "right" wall,
// and false otherwise
function isOutside (point, wallTop, wallBottom, wallType) {
  let mov = new Vec2D ( point.x - wallBottom.x, point.y - wallBottom.y )
  return ( !movingInto(mov, wallTop, wallBottom, wallType ) );
};

function extremePoint(wall, extreme) {
  let v1 = wall[0];
  let v2 = wall[1];
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
  let v1 = line[0];
  let v2 = line[1];
  let theta = Math.atan2( v2.y - v1.y, v2.x - v1.x  );
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
function coordinateIntercept (line1, line2) {
  let x1 = line1[0].x;
  let x2 = line1[1].x;
  let x3 = line2[0].x;
  let x4 = line2[1].x;
  let y1 = line1[0].y;
  let y2 = line1[1].y;
  let y3 = line2[0].y;
  let y4 = line2[1].y;
  let t = ( (x3-x1)*(y2-y1) + (x2-x1)*(y1-y3) ) / ( (x4-x3)*(y2-y1) + (x2-x1)*(y3-y4) );
  return ( new Vec2D ( x3 + t*(x4-x3), y3 + t*(y4-y3) ) );
};

// orthogonally projects a point onto a line
// line is given by two points it passes through
function orthogonalProjection(point, line) {
  // turn everything into relative coordinates with respect to the point line[0]
  let pointVec = new Vec2D ( point.x - line[0].x, point.y - line[0].y);
  let lineVec  = new Vec2D ( line[1].x - line[0].x, line[1].y - line[0].y);
  // vector projection calculation
  let factor = dotProd(pointVec, lineVec) / dotProd(lineVec, lineVec);
  let projVec = scalarProd(factor, lineVec);
  // back to absolute coordinates by adding the coordinates of line[0]
  return (new Vec2D(projVec.x + line[0].x,projVec.y + line[0].y));
};


// ecbp : projected ECB
// ecb1 : old ECB
// function return type: either false (no collision) or a pair (bool, proposed new player center position (Vec2D))
// the bool is the value of 'touchingWall' for that particular wall 
// this indicates whether the player is still touching that wall after the transformation
function findCollision (ecbp, ecb1, wall, wallType) {

  let wallTop    = extremePoint(wall, "top");
  let wallBottom = extremePoint(wall, "bottom");
  let wallLeft   = extremePoint(wall, "left");
  let wallRight  = extremePoint(wall, "right");

  let same = 3;
  let opposite = 1;
  if (wallType[0].toLowerCase() === "r" ) {
    same = 1;
    opposite = 3;
  }

  let sameECBMov = new Vec2D ( ecbp[same].x-ecb1[same].x, ecbp[same].y-ecb1[same].y);

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

    // case 1: player stayed above the wall
    // no collision
    else if ( ebcp[0].y > wallTop.y && ecb1[0].y > wallTop.y) {
      return false; 
    }

    // case 2: player stayed below the wall
    // no collision
    else if (ecbp[2].y < wallBottom.y && ecb1[2].y < wallBottom.y){
      return false;
    }
    
    // case 3: everything else
    // only need to work with same-side ECB point,
    // and no need to do corner checking,
    // because of wall and airborne ECB angle restrictions
    else {
      let intersect = coordinateIntercept ([ecb1[same],ecbp[same]], wall);
      if (intersect.y > wallTop.y || intersect.y < wallBottom.y) {
        return false; // no collision
      }
      else {
        let newSameECB = orthogonalProjection(ecbp[same], wall);
        let newCenter = new Vec2D( newSameECB.x + (ecbp[opposite].x-ecbp[same].x)/2, newSameECB.y);
        let touchingWall = true;
        if (newCenter.y < wallBottom.y || newCenter.y > wallTop.y ) {
          touchingWall = false
        }
        return ( [touchingWall, newCenter] );
      }
    }

  }
};

function squaredDist (center1, center2) {
  return (center1.x * center2.x + center1.y * center2.y);
};

function closestTouchingAndCenter(oldCenter, newTouchingAndCenters) {
  let newTouchingAndCenter = newTouchingAndCenters[0];
  for (var i = 1; i < newTouchingAndCenters.length; i++) {
    if (squaredDist (oldCenter,newTouchingAndCenter[1]) > squaredDist(oldCenter, newTouchingAndCenters[i][1])) {
      newTouchingAndCenter = newTouchingAndCenters[i];
    }
  }
  return newTouchingAndCenter;
};


function moveECB (ecb, vec) {
  let newECB = [
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
function loopOverWalls( ecbp, ecb1, oldCenter, wallWallTypes, oldTouchingAndCenter ) {
  function collisionFunction(wallWallType) {
    return findCollision (ecbp, ecb1, wallWallType[0], wallWallType[1]);
  let collisionData = wallWallTypes.map(collisionFunction);
  let newCollisionHappened = false;
  let suggestedTouchingAndCenters = [oldTouchingAndCenter];
  for (var i = 0; i < collisionData.length; i++) {
    if (collisionData[i] === false); { 
      // do nothing
    }
    else {
      newCollisionHappened = true;
      suggestedTouchingAndCenters.push(collisionData[i]);
    }
  }
  if (newCollisionHappened === true) {
    let newTouchingAndCenter = closestTouchingAndCenter( oldCenter, suggestedTouchingAndCenters);
    let vec = new Vec2D( newTouchingAndCenter[1].x - oldCenter.x, newTouchingAndCenter[1].y - oldCenter.y);
    let newecbp = moveECB (ecbp, vec);
    return (loopOverWalls (newecbp, ecb1, oldCenter, wallWallTypes, newTouchingAndCenter));
  }
  else {
    return oldTouchingAndCenter;
  }  
};

function getNewTouchingAndCenter(ecbp, ecb1, wallWallTypes) {
  let touchingAndCenter = [false, new Vec2D( ecbp[0].x, ecbp[1].y)];
  let oldCenter = new Vec2D( ecb1[0].x, ecb1[1].y);
  touchingAndCenter = loopOverWalls(ecbp, ecb1, oldCenter, wallWallTypes, touchingAndCenter );
};