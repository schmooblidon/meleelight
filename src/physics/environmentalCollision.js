import {Vec2D} from "main/characters";
import {dotProd, scalarProd, norm} from "main/linAlg";

const magicAngle = Math.PI/6;
const maximumCollisionDetectionPasses = 5;


function getXOrYCoord(vec, xOrY) {
  if (xOrY === 0) {
    return vec.x;
  }
  else {
    return vec.y;
  }
};

function turn(number, counterclockwise = true) {
  if (counterclockwise) {
    if (number === 3) {
      return 0;
    }
    else { 
      return number+1;
    }
  }
  else {
    if (number === 0) {
      return 3;
    }
    else {
      return number-1;
    }
  }
};

// returns true if the vector is moving into the wall, false otherwise
function movingInto (vec, wallTopOrRight, wallBottomOrLeft, wallType) {
  let sign = 1;
  switch (wallType[0].toLowerCase()) {
    case "l": // left wall
    case "g": // ground
    case "b":
    case "d":
    case "p": // platform
      sign = -1;
      break;
    default: // right wall, ceiling
      break;
  }
  // const outwardsWallNormal = new Vec2D ( sign * (wallTopOrRight.y - wallBottomOrLeft.y), sign*( wallBottomOrLeft.x-wallTopOrRight.x )  );
  // return ( dotProd ( vec, outwardsWallNormal ) < 0 );
  return (  ( dotProd ( vec, new Vec2D ( sign * (wallTopOrRight.y - wallBottomOrLeft.y), sign*( wallBottomOrLeft.x-wallTopOrRight.x )  ) ) < 0) );
};

// returns true if point is to the right of a "left" wall, or to the left of a "right" wall,
// and false otherwise
function isOutside (point, wallTopOrRight, wallBottomOrLeft, wallType) {
  //const vec = new Vec2D ( point.x - wallBottom.x, point.y - wallBottom.y );
  //return ( !movingInto(vec, wallTop, wallBottom, wallType ) );
  return ( !movingInto(new Vec2D ( point.x - wallBottomOrLeft.x, point.y - wallBottomOrLeft.y ), wallTopOrRight, wallBottomOrLeft, wallType ) );
};

function extremePoint(wall, extreme) {
  const  v1 = wall[0];
  const  v2 = wall[1];
  switch (extreme[0].toLowerCase()) {
    case "u":
    case "t":
      if (v2.y < v1.y) {
        return v1;
      }
      else {
        return v2;
      }
      break;
    case "d":
    case "b":
      if (v2.y > v1.y) {
        return v1;
      }
      else {
        return v2;
      }
      break;
    case "l":
      if (v2.x > v1.x) {
        return v1;
      }
      else {
        return v2;
      }
      break;
    case "r":
      if (v2.x < v1.x) {
        return v1;
      }
      else {
        return v2;
      }
    default:
      console.log( "error in 'extremePoint': invalid parameter "+extreme+", not up/top/down/bottom/left/right");
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

// say line1 passes through the two points p1 = (x1,y1), p2 = (x2,y2)
// and line2 by the two points p3 = (x3,y3) and p4 = (x4,y4)
// this function returns the parameter t, such that p3 + t*(p4-p3) is the intersection point of the two lines
function coordinateInterceptParameter (line1, line2) {
  //const x1 = line1[0].x;
  //const x2 = line1[1].x;
  //const x3 = line2[0].x;
  //const x4 = line2[1].x;
  //const y1 = line1[0].y;
  //const y2 = line1[1].y;
  //const y3 = line2[0].y;
  //const y4 = line2[1].y;
  //const t = ( (x3-x1)*(y2-y1) + (x2-x1)*(y1-y3) ) / ( (x4-x3)*(y2-y1) + (x2-x1)*(y3-y4) );
  //return t;
  return ( (    line2[0].x-line1[0].x)*(line1[1].y-line1[0].y) 
             + (line1[1].x-line1[0].x)*(line1[0].y-line2[0].y) ) 
          / (  (line2[1].x-line2[0].x)*(line1[1].y-line1[0].y) 
             + (line1[1].x-line1[0].x)*(line2[0].y-line2[1].y) );
};


// solves the quadratic equation a0 + a1 x + a2 x^2 = 0
// uses the sign to choose the solution
// do not call this function with parameter a2 = 0
function solveQuadraticEquation (a0, a1, a2, sign = 1) {
  const disc = Math.sqrt(a1*a1 - 4*a0*a2);
  return ((-a1 + sign*disc) / (2 * a2));
}

// in this function, we are considering a line that is sweeping,
// from the initial line 'line1' passing through the two points p1 = (x1,y1), p2 = (x2,y2)
// to the final line 'line2' passing through the two points p3 = (x3,y3) and p4 = (x4,y4)
// there are two sweeping parameters: 
//   't', which indicates how far along each line we are
//   's', which indicates how far we are sweeping between line1 and line2
// for instance:
//  s=0 means we are on line1,
//  s=1 means we are on line2,
//  t=0 means we are on the line between p1 and p3,
//  t=1 means we are on the line between p2 and p4
// this function returns a specific value for each of t and s,
// which correspond to when the swept line hits the origin O (at coordinates (0,0))
// if either of the parameters is not between 0 and 1, this function instead returns 'false'
// see '/doc/linesweep.png' for a visual representation of the situation
function lineSweepParameters( line1, line2, flip = false) {
  let sign = 1;
  if (flip) {
    sign = -1;
  }
  const x1 = line1[0].x;
  const x2 = line1[1].x;
  const x3 = line2[0].x;
  const x4 = line2[1].x;
  const y1 = line1[0].y;
  const y2 = line1[1].y;
  const y3 = line2[0].y;
  const y4 = line2[1].y;

  const a0 = x2*y1 - x1*y2;
  const a1 = x4*y1 - 2*x2*y1 + 2*x1*y2 - x3*y2 + x2*y3 - x1*y4;
  const a2 = x2*y1 - x4*y1 - x1*y2 + x3*y2 - x2*y3 + x4*y3 + x1*y4 - x3*y4;

  // s satisfies the equation:   a0 + a1*s + a2*s^2 = 0
  let s = -1; // initialise s

  if (Math.abs(a2) < 0.00001) {
    s = - a0 / a1;
  }
  else {
    s = solveQuadraticEquation( a0, a1, a2, sign );
  }
  const t = (s*(x1-x3) - x1) / ( x2-x1 + s*( x1-x2-x3+x4 ));

  if (s < 0 || s > 1 || t < 0 || t > 1 || s === Infinity || t === Infinity || isNaN(s) || isNaN(t)) {
    return false;
  }
  else {
    return [t,s];
  }
};


// orthogonally projects a point onto a line
// line is given by two points it passes through
function orthogonalProjection(point, line) {
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


// ecbp : projected ECB
// ecb1 : old ECB
// function return type: either false (no collision) or a pair (touchingWall, proposed new player center position (Vec2D))
// touchingWall is either false, left or right, indicating whether the player is still touching that wall after the transformation
// terminology in the comments: a wall is a segment with an inside and an outside,
// which is contained in an infinite line, extending both ways, which also has an inside and an outside
function findCollision (ecbp, ecb1, position, wall, wallType) {

  const wallTop    = extremePoint(wall, "top");
  const wallBottom = extremePoint(wall, "bottom");
  const wallLeft   = extremePoint(wall, "left");
  const wallRight  = extremePoint(wall, "right");

  
  let wallTopOrRight = wallTop;
  let wallBottomOrLeft = wallBottom;
  let same = 3;
  let opposite = 1;
  let other = 0;
  let xOrY = 1; // y by default
  let isPlatform = false;
  let flip = false;
  switch(wallType[0].toLowerCase()) {
    case "l": // left wall
      same = 1;
      opposite = 3;
      flip = true;
      break;
    case "p": // platform
      isPlatform = true;
    case "g": // ground
    case "b":
    case "d":
      same = 0;
      opposite = 2;
      wallTopOrRight  = wallRight;
      wallBottomOrLeft = wallLeft;
      xOrY = 0;
      flip = true;
      break;
    case "c": // ceiling
    case "t":
    case "u":
      same = 2;
      opposite = 0;
      wallTopOrRight  = wallRight;
      wallBottomOrLeft = wallLeft;
      xOrY = 0;
      break;
    default: // right wall by default
      break;
  }

  const sameECBMov = new Vec2D ( ecbp[same].x-ecb1[same].x, ecbp[same].y-ecb1[same].y);

  // first check if player ECB was even near the wall
  if (    (ecbp[0].y > wallTop.y    && ecb1[0].y > wallTop.y   ) // player ECB stayed above the wall
       || (ecbp[2].y < wallBottom.y && ecb1[2].y < wallBottom.y) // played ECB stayed below the wall
       || (ecbp[3].x > wallRight.x  && ecb1[3].x > wallRight.x ) // player ECB stayed to the right of the wall
       || (ecbp[1].x < wallLeft.x   && ecb1[1].x < wallLeft.x  ) // player ECB stayed to the left of the wall
     ) {
    console.log("'findCollision': no collision, ECB not even near "+wallType+" surface.");
    return false;
  }
  else if ( !isOutside ( ecb1[opposite], wallTopOrRight, wallBottomOrLeft, wallType ) ) {
    console.log("'findCollision': no collision, ECB already fully on other side of "+wallType+" surface.");
    return false; // no collision: player was already on the other side of the line spanned by the wall
  }
  else if ( isOutside ( ecbp[same], wallTopOrRight, wallBottomOrLeft, wallType ) ) {
    console.log("'findCollision': no collision, same-side projected ECB on the outside of "+wallType+" surface.");
    return false; // no collision: same-side projected ECB point on the outside of the line spanned by the wall
  }
  else {
    // from now on, we know that the projected same-side ECB point is on the inside of the line spanned by the wall

    // if the surface is a platform, and the bottom ECB point is below the platform, we shouldn't do anything
    // maybe this should be changed to checking whether player position is below the platform, instead of bottom ECB point
    // note however that just changing 'ecb1[same]' to 'position' leads to the player passing through platforms (at the moment)
    if ( isPlatform ) {
      if ( !isOutside ( ecb1[same], wallTopOrRight, wallBottomOrLeft, wallType )) {
        console.log("'findCollision': no collision, bottom ECB point below platform.");
        return false;
      }
    }


    // -------------------------------------------------------------------------------------------------------------------------------------------------------
    // now, we check whether the ECB is colliding on an edge, and not a vertex

    let edgeCase = false;
    let counterclockwise = true;
    let corner = false; // no value for now

    // first, figure out which is the relevant ECB edge that could collide at the corner
    // we know that one of the endpoints of this edge is the same-side ECB point of the wall,
    // we are left to find the other

    // case 1
    if ( getXOrYCoord(ecb1[same], xOrY) > getXOrYCoord(wallTopOrRight, xOrY) ) {
      counterclockwise ^= flip;
      other = turn(same, counterclockwise);
      if (   isOutside ( position, wallTopOrRight, wallBottomOrLeft, wallType ) 
          && getXOrYCoord(ecbp[other], xOrY) < getXOrYCoord(wallTopOrRight, xOrY) ) {
        edgeCase = true;
        corner = wallTopOrRight;
      }
    }

    // case 2
    if ( getXOrYCoord(ecb1[same], xOrY) < getXOrYCoord(wallBottomOrLeft, xOrY) ) {
      counterclockwise = false;
      counterclockwise ^= flip;
      other = turn(same, counterclockwise);
      if (   isOutside ( position, wallTopOrRight, wallBottomOrLeft, wallType ) 
          && getXOrYCoord(ecbp[other], xOrY) > getXOrYCoord(wallBottomOrLeft, xOrY) ) {
        edgeCase = true;
        corner = wallBottomOrLeft;
      }
    }

    if (edgeCase) {
      // the relevant ECB edge, that might collide with the corner, is the edge between ECB points 'same' and 'other'

      // we now sweep a line,
      // starting from the relevant ECB1 edge, and ending at the relevant ECBp edge,
      // and figure out where this would intersect the corner

      // first we have to recenter everything around the corner,
      // as the 'lineSweepParameters' function calculates collision with respect to the origin

      const recenteredECB1Edge = [ new Vec2D( ecb1[same ].x - corner.x, ecb1[same ].y - corner.y )
                                 , new Vec2D( ecb1[other].x - corner.x, ecb1[other].y - corner.y)];
      const recenteredECBpEdge = [ new Vec2D( ecbp[same ].x - corner.x, ecbp[same ].y - corner.y )
                                 , new Vec2D( ecbp[other].x - corner.x, ecbp[other].y - corner.y)];

      let edgeCollision = false; // initialising
      let [t,s] = [0,0];

      let lineSweepResult = lineSweepParameters( recenteredECB1Edge, recenteredECBpEdge, false);
      if (lineSweepResult === false) {
        lineSweepResult = lineSweepParameters( recenteredECB1Edge, recenteredECBpEdge, true);
        if (lineSweepResult === false) {
          // no edge collision, 'edgeCollision' remains false
        }
        else {
          edgeCollision = true;
          [t,s] = lineSweepResult;
        }
      }
      else {
        edgeCollision = true;
        [t,s] = lineSweepResult;
      }      
      // shouldn't need to calculate both sets of parameters
      // at the moment I am not sure which one is relevant 
      // (it should depend on relative positions and wall types),
      // so I just check both
      
      if (edgeCollision === false) {
        console.log("'findCollision': no collision, relevant edge of ECB does not cross "+wallType+" corner.");
        return false;
      }
      else {
        // this is the ECB edge at the point of contact with the corner
        const contactECBedge = [ new Vec2D( ecb1[same ].x + s*(ecbp[same ].x - ecb1[same ].x), ecb1[same ].y + s*(ecbp[same ].y - ecb1[same ].y))
                               , new Vec2D( ecb1[other].x + s*(ecbp[other].x - ecb1[other].x), ecb1[other].y + s*(ecbp[other].y - ecb1[other].y)) ];
        const newSameECB = orthogonalProjection(ecbp[same], contactECBedge);
        const newCenter = new Vec2D( position.x + newSameECB.x - ecbp[same].x , position.y + newSameECB.y - ecbp[same].y );
        const touchingWall = false; // colliding with ECB edge never counts as touching
        console.log("'findCollision': collision, relevant edge of ECB crossed "+wallType+" corner.");
        return ( [touchingWall, newCenter] );
      }
    }

    // end of edge case checking
    // -------------------------------------------------------------------------------------------------------------------------------------------------------


    else {
      // cover the case where the same-side ECB point was in fact already on the inside of the line spanned by the wall
      if ( !isOutside ( ecb1[same], wallTopOrRight, wallBottomOrLeft, wallType )) {
        if (isPlatform) {
          console.log("'findCollision': no collision, non-crossing same-side ECB point not pushed back by platform.");
          return false;
        }
        // this next part is a bit dubious
        else if ( getXOrYCoord(ecbp[same], xOrY) > getXOrYCoord(wallTopOrRight, xOrY) || getXOrYCoord(ecbp[same], xOrY) < getXOrYCoord(wallBottomOrLeft, xOrY)) {
          // projected same-side ECB point is past the extreme point of the wall
          console.log("'findCollision': no collision, noncrossing same-side ECB point beyond "+wallType+" surface.");
          return false;
        }
        else {
          const newSameECB = orthogonalProjection(ecbp[same], wall);
          const newCenter = new Vec2D( position.x + newSameECB.x - ecbp[same].x , position.y + newSameECB.y - ecbp[same].y );
          let touchingWall = wallType;
          if (getXOrYCoord(newCenter, xOrY) < getXOrYCoord(wallBottomOrLeft, xOrY) || getXOrYCoord(newCenter, xOrY) > getXOrYCoord(wallTopOrRight, xOrY) ) {
            touchingWall = false;
          }
          console.log("'findCollision': collision, noncrossing same-side ECB point, "+wallType+" surface.");
          return ( [touchingWall, newCenter] );
        }
      }


      else {
        // we now know that the same-side ECB point went from the outside to the inside of the line spanned by the wall
        // we only need to work with the same-side ECB points, because of wall and airborne ECB angle restrictions
        if ( !movingInto( sameECBMov, wallTopOrRight, wallBottomOrLeft, wallType) ) {
          console.log("'findCollision': no collision, same-side ECB on the outside of "+wallType+" surface and not moving towards it.");
          return false; // no collision: player not moving towards the line spanned by the wall
          // this clause makes sure that in later calls of 'coordinateIntercept', the relevant lines aren't going to be parallel
        }
        else {
          const t = coordinateInterceptParameter (wall, [ecb1[same],ecbp[same]]); // need to put wall first
          if ( t > 1 ) { // I should also check check whether t < 0, but that seems to cause glitches with Fox's Illusion at the moment?
            console.log("'findCollision': no collision, intersection parameter outside of allowable range, with "+wallType+" surface.");
            return false; // no collision
          }
          else {
            const intersection = new Vec2D (ecb1[same].x + t*(ecbp[same].x-ecb1[same].x), ecb1[same].y + t*(ecbp[same].y-ecb1[same].y));
            if (getXOrYCoord(intersection, xOrY) > getXOrYCoord(wallTopOrRight, xOrY) || getXOrYCoord(intersection, xOrY) < getXOrYCoord(wallBottomOrLeft, xOrY)) {
              console.log("'findCollision': no collision, intersection point outside of "+wallType+" surface.");
              return false; // no collision
            }
            else {
              const newSameECB = orthogonalProjection(ecbp[same], wall);
              const newCenter = new Vec2D( position.x + newSameECB.x - ecbp[same].x , position.y + newSameECB.y - ecbp[same].y );
              let touchingWall = wallType;
              if (getXOrYCoord(newCenter, xOrY) < getXOrYCoord(wallBottomOrLeft, xOrY) || getXOrYCoord(newCenter, xOrY) > getXOrYCoord(wallTopOrRight, xOrY) ) {
                touchingWall = false;
              }
              console.log("'findCollision': collision, crossing same-side ECB point, "+wallType+" surface.");
              return ( [touchingWall, newCenter] );
            }
          }
        }
      }
    }
  }
};


// this function loops over all walls/surfaces it is provided, calculating the collision offsets that each ask for,
// and at each iteration returning the smallest possible offset
// a 'wallAndThenWallTypeAndIndex' is of the form '[wall, [wallType, index]]'
// where "index" is the index of the wall in the list of walls of that type in the stage
// this function returns a 'maybeCenterAndTouchingType'
// which is one of the following three options: 
//          option 1: 'false'                      (no collision) 
//          option 2: '[center, false]'            (collision, but no longer touching) 
//          option 3: '[center, wallTypeAndIndex]' (collision, still touching wall with given type and index)
function loopOverWalls( ecbp, ecb1, position, wallAndThenWallTypeAndIndexs, oldMaybeCenterAndTouchingType, passNumber ) {
  let newCollisionHappened = false;
  const suggestedMaybeCenterAndTouchingTypes = [oldMaybeCenterAndTouchingType];
  if (passNumber > maximumCollisionDetectionPasses) {
    return oldMaybeCenterAndTouchingType;
  }
  else { 
    const collisionData = wallAndThenWallTypeAndIndexs.map( 
                                              // [  [ touchingWall, center ]  , touchingType ] ]
              (wallAndThenWallTypeAndIndex)  => [ findCollision (ecbp, ecb1, position, wallAndThenWallTypeAndIndex[0]
                                                                , wallAndThenWallTypeAndIndex[1][0] )
                                                , wallAndThenWallTypeAndIndex[1] ]);
    for (let i = 0; i < collisionData.length; i++) {
      if (collisionData[i][0] === false) { // option 1: no collision
      }
      else if (collisionData[i][0][0] === false) { // option 2: collision, but no longer touching
        newCollisionHappened = true;
        suggestedMaybeCenterAndTouchingTypes.push( [collisionData[i][0][1], false] );
      }
      else { // option 3: collision, still touching wall with given type and index)
        newCollisionHappened = true;
        suggestedMaybeCenterAndTouchingTypes.push( [collisionData[i][0][1], collisionData[i][1] ]);
      }
    }
    if (newCollisionHappened) {
      const newMaybeCenterAndTouchingType = closestCenterAndTouchingType( position, suggestedMaybeCenterAndTouchingTypes);
      const vec = new Vec2D( newMaybeCenterAndTouchingType[0].x - position.x, newMaybeCenterAndTouchingType[1].y - position.y);
      const newecbp = moveECB (ecbp, vec);
      return (loopOverWalls (newecbp, ecb1, position, wallAndThenWallTypeAndIndexs
                            , newMaybeCenterAndTouchingType, passNumber+1
                            ) );
    }
    else {
      return oldMaybeCenterAndTouchingType;
    }
  }
};

// finds the maybeCenterAndTouchingType with the closest center to the provided position
// recall that a 'maybeCenterAndTouchingType' is given by one of the following three options: 
//          option 1: 'false'                      (no collision) 
//          option 2: '[center, false]'            (collision, but no longer touching) 
//          option 3: '[center, wallTypeAndIndex]' (collision, still touching wall with given type and index)
function closestCenterAndTouchingType(oldCenter, maybeCenterAndTouchingTypes) {
  let newMaybeCenterAndTouchingType = false;
  let start = -1;
  const l = maybeCenterAndTouchingTypes.length;

  // start by looking for the first possible new center
  for (let i = 0; i < l; i++) {
    if (maybeCenterAndTouchingTypes[i] === false ) {
      // option 1: do nothing
    }
    else {
      // options 2 or 3: we have found a possible new center
      newMaybeCenterAndTouchingType = maybeCenterAndTouchingTypes[i];
      start = i+1;
      break;
    }
  }
  if ( newMaybeCenterAndTouchingType === false || start > l) {
    // no possible new centers were found in the previous loop
    return false;
  }
  else {
    // options 2 or 3: possible new centers, find the closest one
    for (let j = start; j < l; j++) {
      if (maybeCenterAndTouchingTypes[j] === false ) {
        // option 1: no center proposed
        // do nothing
      }
      else if (squaredDist (oldCenter,newMaybeCenterAndTouchingType[0]) > squaredDist(oldCenter, maybeCenterAndTouchingTypes[j][0])) {
        // options 2 or 3: new proposed center
        // moreover, this center is closer to 'oldCenter' than the previous proposed center
        // use this centerAndTouchingType instead
        newMaybeCenterAndTouchingType = maybeCenterAndTouchingTypes[j];
      }
    }
    return newMaybeCenterAndTouchingType;
  }
};

function squaredDist (center1, center2) {
  return (center1.x * center2.x + center1.y * center2.y);
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

export function getNewMaybeCenterAndTouchingType(ecbp, ecb1, position, wallAndThenWallTypeAndIndexs) {
  let maybeCenterAndTouchingType = false;
  maybeCenterAndTouchingType = loopOverWalls(ecbp, ecb1, position, wallAndThenWallTypeAndIndexs, maybeCenterAndTouchingType, 0 );
  return maybeCenterAndTouchingType;
};
