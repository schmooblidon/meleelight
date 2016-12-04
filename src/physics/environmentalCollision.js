import {Vec2D} from "main/characters";
import {dotProd, scalarProd, norm} from "main/linAlg";
/* eslint-disable */

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
  const vec = new Vec2D ( point.x - wallBottom.x, point.y - wallBottom.y );
  return ( !movingInto(vec, wallTop, wallBottom, wallType ) );
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
  // renormalise line vector
  const lineNorm = norm(lineVec);
  const lineElem = scalarProd( 1/lineNorm, lineVec);
  // vector projection calculation
  const factor = dotProd(pointVec, lineElem);
  const projVec = scalarProd(factor, lineElem);
  // back to absolute coordinates by adding the coordinates of line[0]
  return (new Vec2D(projVec.x + line[0].x,projVec.y + line[0].y));
};


// ecbp : projected ECB
// ecb1 : old ECB
// function return type: either false (no collision) or a pair (touchingWall, proposed new player center position (Vec2D))
// touchingWall is either false, left or right, indicating whether the player is still touching that wall after the transformation
// terminology in the comments: a wall is a segment with an inside and an outside,
// which is contained in an infinite line, extending both ways, which also has an inside and an outside
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
    //console.log("'findCollision': no collision, not moving towards "+wallType+" wall.");
    return false; // no collision: player not moving towards the line spanned by the wall
    // this clause makes sure that in later calls of 'coordinateIntercept', the relevant lines aren't going to be parallel
  }
  else if ( !isOutside ( ecb1[opposite], wallTop, wallBottom, wallType ) ) {
    //console.log("'findCollision': no collision, already on other side of "+wallType+" wall.");
    return false; // no collision: player was already on the other side of the line spanned by the wall
  }
  else if ( isOutside ( ecbp[same], wallTop, wallBottom, wallType ) ) {
    //console.log("'findCollision': no collision, same-side projected ECB on the outside of "+wallType+" wall.");
    return false; // no collision: same-side projected ECB point on the outside of the line spanned by the wall
  }
  else {
    // from now on, we know that the projected same-side ECB point is on the inside of the line spanned by the wall

    // first check if player was even near the wall
    if (    (ecbp[0].y > wallTop.y    && ecb1[0].y > wallTop.y   ) // player stayed above the wall
         || (ecbp[2].y < wallBottom.y && ecb1[2].y < wallBottom.y) // played stayed below the wall
         || (ecbp[3].x > wallRight.x  && ecb1[3].x > wallRight.x ) // player stayed to the right of the wall
         || (ecbp[1].x < wallLeft.x   && ecb1[1].x < wallLeft.x  ) // player stayed to the left of the wall
       ) {
      //console.log("'findCollision': no collision, not even near "+wallType+" wall.");
      return false;
    }

    // now cover the case where the same-side ECB point was in fact already on the inside of the line spanned by the wall
    else if ( !isOutside ( ecb1[same], wallTop, wallBottom, wallType )) {
      // this first part is a bit dubious
      if ( ecbp[same].y > wallTop.y || ecbp[same].y < wallBottom.y) {
        // projected same-side ECB point is above the top (respectively, below the bottom) of the wall
        //console.log("'findCollision': no collision, noncrossing same-side ECB point above/below "+wallType+" wall.");
        return false;
      }
      else {
        const newSameECB = orthogonalProjection(ecbp[same], wall);
        const newCenter = new Vec2D( newSameECB.x + (ecbp[opposite].x-ecbp[same].x)/2, newSameECB.y);
        let touchingWall = wallType;
        if (newCenter.y < wallBottom.y || newCenter.y > wallTop.y ) {
          touchingWall = false;
        }
        //console.log("'findCollision': collision, noncrossing same-side ECB point, "+wallType+" wall.");
        return ( [touchingWall, newCenter] );
      }
    }

    // now the real collision checking
    // only need to work with same-side ECB point,
    // and no need to do corner checking,
    // because of wall and airborne ECB angle restrictions
    // we know that the same-side ECB point went from the outside to the inside of the line spanned by the wall
    else {
      let t = coordinateInterceptParameter (wall, [ecb1[same],ecbp[same]]); // need to put wall first
      if ( t > 1 ) { // I should also check check whether t < 0, but that seems to cause glitches with Fox's Illusion at the moment?
        //console.log("'findCollision': no collision, intersection parameter outside of allowable range, with "+wallType+" wall.");
        return false; // no collision
      }
      else {
        const intersection = new Vec2D (ecb1[same].x + t*(ecbp[same].x-ecb1[same].x), ecb1[same].y + t*(ecbp[same].y-ecb1[same].y));
        if (intersection.y > wallTop.y || intersection.y < wallBottom.y) {
          //console.log("'findCollision': no collision, intersection point outside of "+wallType+" wall.");
          return false; // no collision
        }
        else {
          const newSameECB = orthogonalProjection(ecbp[same], wall);
          const newCenter = new Vec2D( newSameECB.x + (ecbp[opposite].x-ecbp[same].x)/2, newSameECB.y);
          let touchingWall = wallType;
          if (newCenter.y < wallBottom.y || newCenter.y > wallTop.y ) {
            touchingWall = false;
          }
          //console.log("'findCollision': collision, crossing same-side ECB point, "+wallType+" wall.");
          return ( [touchingWall, newCenter] );
        }
      }
    }
  }
};

function squaredDist (center1, center2) {
  return (center1.x * center2.x + center1.y * center2.y);
};

function closestTouchingAndCenter(oldCenter, maybeTouchingAndCenters) {
  let newMaybeTouchingAndCenter = false;
  let start = -1;
  const l = maybeTouchingAndCenters.length;
  for (let i = 0; i < l; i++) {
    if (maybeTouchingAndCenters[i] === false ) {
      // do nothing
    }
    else {
      newMaybeTouchingAndCenter = maybeTouchingAndCenters[i];
      start = i+1;
      break;
    }
  }
  if ( newMaybeTouchingAndCenter === false || start > l) {
    return newMaybeTouchingAndCenter;
  }
  else {
    for (let j = start; j < l; j++) {
      if (maybeTouchingAndCenters[j] === false ) {
        // do nothing
      }
      else if (squaredDist (oldCenter,newMaybeTouchingAndCenter[1]) > squaredDist(oldCenter, maybeTouchingAndCenters[j][1])) {
        newMaybeTouchingAndCenter = maybeTouchingAndCenters[j];
      }
    }
    return newMaybeTouchingAndCenter;
  }
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
function loopOverWalls( ecbp, ecb1, oldCenter, wallWallTypes, oldMaybeTouchingAndCenter, passNumber ) {
  let newCollisionHappened = false;
  const suggestedMaybeTouchingAndCenters = [oldMaybeTouchingAndCenter];
  if (passNumber > maximumCollisionDetectionPasses) {
    return oldMaybeTouchingAndCenter;
  }
  else {
    const collisionData = wallWallTypes.map( function(wallWallType){  return findCollision (ecbp, ecb1, wallWallType[0], wallWallType[1]); } );
    for (let i = 0; i < collisionData.length; i++) {
      if (collisionData[i] === false) { 
        // do nothing
      }
      else {
        newCollisionHappened = true;
        suggestedMaybeTouchingAndCenters.push(collisionData[i]);
      }
    }
    if (newCollisionHappened === true) {
      const newMaybeTouchingAndCenter = closestTouchingAndCenter( oldCenter, suggestedMaybeTouchingAndCenters);
      const vec = new Vec2D( newMaybeTouchingAndCenter[1].x - ecbp[0].x, newMaybeTouchingAndCenter[1].y - ecbp[1].y);
      const newecbp = moveECB (ecbp, vec);
      return (loopOverWalls (newecbp, ecb1, oldCenter, wallWallTypes, newMaybeTouchingAndCenter, passNumber+1));
    }
    else {
      return oldMaybeTouchingAndCenter;
    }
  }
};

export function getNewMaybeTouchingAndCenterFromWalls(ecbp, ecb1, wallWallTypes) {
  let maybeTouchingAndCenter = false;
  const oldCenter = new Vec2D( ecb1[0].x, ecb1[1].y);
  maybeTouchingAndCenter = loopOverWalls(ecbp, ecb1, oldCenter, wallWallTypes, maybeTouchingAndCenter, 0 );
  return maybeTouchingAndCenter;
};