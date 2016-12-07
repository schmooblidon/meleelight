import {Vec2D} from "main/characters";
import {dotProd, scalarProd, norm} from "main/linAlg";

const magicAngle = Math.PI/6;
const maximumCollisionDetectionPasses = 4;
const cornerPushoutMethod = "h"; // corners only push out horizontally
const additionalOffset = 0.0001;

function lengthen ( x ) {
  if (x > 0) {
    return x + additionalOffset;
  }
  else if (x < 0) {
    return x - additionalOffset;
  }
  else {
    console.log("error in function 'lengthen': argument is 0.");
    return 0;
  }
}


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

function pushoutMethodFromType(wallType) {
  switch (wallType) {
    case "c":
    case "g":
    case "p":
      return "v"; // vertical pushback
      break;
    case "l":
    case "r":
    case "p":
      return "h"; // horizontal pushback
      break;
    default:
      return "o"; // orthogonal pushback
      break;
  }
}

// returns true if the vector is moving into the wall, false otherwise
function movingInto (vec, wallTopOrRight, wallBottomOrLeft, wallType) {
  let sign = 1;
  switch (wallType) {
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
  switch (extreme) {
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
// please ensure this function is not called on parallel lines
function coordinateInterceptParameter (line1, line2) {
  //const x1 = line1[0].x;
  //const x2 = line1[1].x;
  //const x3 = line2[0].x;
  //const x4 = line2[1].x;
  //const y1 = line1[0].y;
  //const y2 = line1[1].y;
  //const y3 = line2[0].y;
  //const y4 = line2[1].y;
  //const t = ( (x1-x3)*(y2-y1) + (x1-x2)*(y1-y3) ) / ( (x4-x3)*(y2-y1) + (x2-x1)*(y3-y4) );
  //return t;
  return ( (    line1[0].x-line2[0].x)*(line1[1].y-line1[0].y) 
             + (line1[0].x-line1[1].x)*(line1[0].y-line2[0].y) ) 
          / (  (line2[1].x-line2[0].x)*(line1[1].y-line1[0].y) 
             + (line1[1].x-line1[0].x)*(line2[0].y-line2[1].y) );
};

// find the intersection of two lines
// please ensure this function is not called on parallel lines
function coordinateIntercept (line1, line2) {
  const t = coordinateInterceptParameter(line1, line2);
  return ( new Vec2D( line2[0].x + t*(line2[1].x - line2[0].x ), line2[0].y + t*(line2[1].y - line2[0].y ) ) );
};

// solves the quadratic equation a0 + a1 x + a2 x^2 = 0
// uses the sign to choose the solution
// do not call this function with parameter a2 = 0
function solveQuadraticEquation (a0, a1, a2, sign = 1) {
  const disc = a1*a1 - 4*a0*a2;
  if (disc < 0) {
    //console.log("error in function 'solveQuadraticEquation': negative discriminant");
    return false;
  }
  else {
    return ((-a1 + sign* Math.sqrt(disc)) / (2 * a2) );
  }
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

  if ( Math.abs( a0*a0*a2/(a1*a1) ) < 0.0001 ) {
    s = - a0 / a1;
  }
  else {
    s = solveQuadraticEquation( a0, a1, a2, sign );
    if (s === false) {
      return false; // non-real parameters
    }
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
// function return type: either false (no collision) or a triple [touchingWall, proposed new player position, sweeping parameter]
// touchingWall is either false, or the walltype, indicating whether the player is still touching that wall after the transformation
// the sweeping parameter s corresponds to the location of the collision, between ECB1 and ECBp
// terminology in the comments: a wall is a segment with an inside and an outside,
// which is contained in an infinite line, extending both ways, which also has an inside and an outside
function findCollision (ecbp, ecb1, position, wall, wallType) {

  const wallTop    = extremePoint(wall, "t");
  const wallBottom = extremePoint(wall, "b");
  const wallLeft   = extremePoint(wall, "l");
  const wallRight  = extremePoint(wall, "r");

  
  let wallTopOrRight = wallTop;
  let wallBottomOrLeft = wallBottom;
  let same = 3;
  let opposite = 1;
  let other = 0;
  let xOrY = 1; // y by default
  let isPlatform = false;
  let flip = false;
  let newPosition = new Vec2D(0,0);
  switch(wallType) {
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
    console.log("'findCollision': no collision, same-side projected ECB point on the outside of "+wallType+" surface.");
    return false; // no collision: same-side projected ECB point on the outside of the line spanned by the wall
  }
  else {
    // from now on, we know that the projected same-side ECB point is on the inside of the line spanned by the wall

    // if the surface is a platform, and the bottom ECB point is below the platform, we shouldn't do anything
    if ( isPlatform ) {
      if ( !isOutside ( ecb1[same], wallTopOrRight, wallBottomOrLeft, wallType )) {
        console.log("'findCollision': no collision, bottom ECB point below platform.");
        return false;
      }
    }


    // -------------------------------------------------------------------------------------------------------------------------------------------------------
    // now, we check whether the ECB is colliding on an edge, and not a vertex

    // first, figure out which is the relevant ECB edge that could collide at the corner
    // we know that one of the endpoints of this edge is the same-side ECB point of the wall,
    // we are left to find the other, which we'll call 'other'

    let edgeCase = false;
    let counterclockwise = true; // whether (same ECB point -> other ECB point) is counterclockwise or not
    let corner = false; // no value for now

    // case 1
    if ( getXOrYCoord(ecb1[same], xOrY) > getXOrYCoord(wallTopOrRight, xOrY) ) {
      counterclockwise = !flip;
      other = turn(same, counterclockwise);
      if ( getXOrYCoord(ecbp[other], xOrY) < getXOrYCoord(wallTopOrRight, xOrY) ) { 
        edgeCase = true;
        corner = wallTopOrRight;
      }
    }

    // case 2
    else if ( getXOrYCoord(ecb1[same], xOrY) < getXOrYCoord(wallBottomOrLeft, xOrY) ) {
      counterclockwise = flip;
      other = turn(same, counterclockwise);
      if ( getXOrYCoord(ecbp[other], xOrY) > getXOrYCoord(wallBottomOrLeft, xOrY) ) { 
        edgeCase = true;
        corner = wallBottomOrLeft;
      }
    }

    if (edgeCase) {
      // the relevant ECB edge, that might collide with the corner, is the edge between ECB points 'same' and 'other'

      let interiorECBside = "l";   
      if (counterclockwise === false) {   
        interiorECBside = "r";    
      }

      if (!isOutside ( corner, ecbp[same], ecbp[other], interiorECBside) && isOutside ( corner, ecb1[same], ecb1[other], interiorECBside) ) {

        let sweepingEdgeCollision = false;
        let [t,s] = [0,0];
        const touchingCorner = false; // colliding with ECB edge never counts as "touching"

        // we now sweep a line,
        // starting from the relevant ECB1 edge, and ending at the relevant ECBp edge,
        // and figure out where this would intersect the corner
        
        // first we recenter everything around the corner,
        // as the 'lineSweepParameters' function calculates collision with respect to the origin

        const recenteredECB1Edge = [ new Vec2D( ecb1[same ].x - corner.x, ecb1[same ].y - corner.y )
                                   , new Vec2D( ecb1[other].x - corner.x, ecb1[other].y - corner.y)];
        const recenteredECBpEdge = [ new Vec2D( ecbp[same ].x - corner.x, ecbp[same ].y - corner.y )
                                   , new Vec2D( ecbp[other].x - corner.x, ecbp[other].y - corner.y)];
        let lineSweepResult = lineSweepParameters( recenteredECB1Edge, recenteredECBpEdge, false);
        if (lineSweepResult === false) {
          lineSweepResult = lineSweepParameters( recenteredECB1Edge, recenteredECBpEdge, true);
          if (lineSweepResult === false) {
            // no edge collision, 'edgeCollision' remains false
          }
          else {
            sweepingEdgeCollision = true;
            [t,s] = lineSweepResult;
          }
        }
        else {
          sweepingEdgeCollision = true;
          [t,s] = lineSweepResult;
        }
        
        if (sweepingEdgeCollision) {
          switch (cornerPushoutMethod) {
            case "o": // orthogonal pushout     
              const contactECBedge = [ new Vec2D( ecb1[same ].x + s*(ecbp[same ].x - ecb1[same ].x), ecb1[same ].y + s*(ecbp[same ].y - ecb1[same ].y))
                                     , new Vec2D( ecb1[other].x + s*(ecbp[other].x - ecb1[other].x), ecb1[other].y + s*(ecbp[other].y - ecb1[other].y)) ];       
              const newSameECB = orthogonalProjection(ecbp[same], contactECBedge);
              newPosition = new Vec2D( position.x + lengthen (newSameECB.x - ecbp[same].x) , position.y + lengthen ( newSameECB.y - ecbp[same].y) );
              break;
            case "v": // vertical pushout
              const yIntersect = coordinateIntercept( [ ecbp[same], ecbp[other] ], [ corner, new Vec2D( corner.x, corner.y+1 ) ]);
              newPosition = new Vec2D( position.x , position.y + lengthen (corner.y-yIntersect.y ));
              break;
            case "h": // horizontal pushout
            default:
              const xIntersect = coordinateIntercept( [ ecbp[same], ecbp[other] ], [ corner, new Vec2D( corner.x+1, corner.y ) ]);
              newPosition = new Vec2D( position.x + lengthen (corner.x - xIntersect.x), position.y);
              break;
          }
          console.log("'findCollision': collision, relevant edge of ECB has moved across "+wallType+" corner.");
          return ( [touchingCorner, newPosition, s] ); // s is the sweeping parameter, t just moves along teh edge
        }
        else {
          console.log("'findCollision': no edge collision, relevant edge of ECB does not cross "+wallType+" corner.");
          console.log("'findCollision': moving on to non-edge collision checking.");
        }
      }
    }

    // end of edge case checking
    // -------------------------------------------------------------------------------------------------------------------------------------------------------


    if ( !isOutside ( ecb1[same], wallTopOrRight, wallBottomOrLeft, wallType )) {
      console.log("'findCollision': no collision, same-side ECB point did not cross "+wallType+" surface.");
      return false;
    }

    else{
      // we now know that the same-side ECB point went from the outside to the inside of the line spanned by the wall
      // we only need to work with the same-side ECB points, because of wall and airborne ECB angle restrictions,
      // and because we already dealt with ECB edge collisions

      // sweeping check
      const s = coordinateInterceptParameter (wall, [ecb1[same],ecbp[same]]); // need to put wall first
      if (s > 1 || s < 0) {
        console.log("'findCollision': no collision, sweeping parameter outside of allowable range, with "+wallType+" surface.");
        return false; // no collision
      }
      else {
        const intersection = new Vec2D (ecb1[same].x + s*(ecbp[same].x-ecb1[same].x), ecb1[same].y + s*(ecbp[same].y-ecb1[same].y));
        if (getXOrYCoord(intersection, xOrY) > getXOrYCoord(wallTopOrRight, xOrY) || getXOrYCoord(intersection, xOrY) < getXOrYCoord(wallBottomOrLeft, xOrY)) {
          console.log("'findCollision': no collision, intersection point outside of "+wallType+" surface.");
          return false; // no collision
        }
        else {
          switch (pushoutMethodFromType(wallType)){
            case "o": // orthogonal pushout
              const newSameECB = orthogonalProjection(ecbp[same], wall);
              newPosition = new Vec2D( position.x + lengthen (newSameECB.x - ecbp[same].x) , position.y + lengthen (newSameECB.y - ecbp[same].y) );
              break;
            case "v": // vertical pushout
              const yIntersect = coordinateIntercept(wall, [ecbp[same], new Vec2D( ecbp[same].x , ecbp[same].y -1) ]);
              newPosition = new Vec2D( position.x, position.y + lengthen (yIntersect.y - ecbp[same].y) );
              break;
            case "h": // horizontal pushout
            default:
              const xIntersect = coordinateIntercept(wall, [ecbp[same], new Vec2D( ecbp[same].x-1, ecbp[same].y) ]);
              newPosition = new Vec2D( position.x + lengthen (xIntersect.x - ecbp[same].x), position.y);
              break;
          }
          let touchingWall = wallType;
          if (getXOrYCoord(newPosition, xOrY) < getXOrYCoord(wallBottomOrLeft, xOrY) || getXOrYCoord(newPosition, xOrY) > getXOrYCoord(wallTopOrRight, xOrY) ) {
            touchingWall = false;
          }
          console.log("'findCollision': collision, crossing same-side ECB point, "+wallType+" surface.");
          return ( [touchingWall, newPosition, s] );
        }
      }
    }
  }
};


// this function loops over all walls/surfaces it is provided, calculating the collision offsets that each ask for,
// and at each iteration returning the smallest possible offset (i.e. collision with smallest sweeping parameter)
// a 'wallAndThenWallTypeAndIndex' is of the form '[wall, [wallType, index]]'
// where "index" is the index of the wall in the list of walls of that type in the stage
// this function returns a 'maybeCenterAndTouchingType'
// which is one of the following three options: 
//          option 1: 'false'                              (no collision) 
//          option 2: '[newPosition, false, s]'            (collision, but no longer touching) 
//          option 3: '[newPosition, wallTypeAndIndex, s]' (collision, still touching wall with given type and index)
// s is the sweeping parameter
function loopOverWalls( ecbp, ecb1, position, wallAndThenWallTypeAndIndexs, oldMaybeCenterAndTouchingType, passNumber ) {
  console.log("'loopOverWalls' pass number "+passNumber+".");
  let newCollisionHappened = false;
  const suggestedMaybeCenterAndTouchingTypes = [false]; // initialise list of new collisions
  if (passNumber > maximumCollisionDetectionPasses) {
    return oldMaybeCenterAndTouchingType;
  }
  else { 
    const collisionData = wallAndThenWallTypeAndIndexs.map( 
                                             // [  [ touchingWall, position, s ]  , touchingType ]
              (wallAndThenWallTypeAndIndex)  => [ findCollision (ecbp, ecb1, position, wallAndThenWallTypeAndIndex[0]
                                                                , wallAndThenWallTypeAndIndex[1][0] )
                                                , wallAndThenWallTypeAndIndex[1] ]);
    for (let i = 0; i < collisionData.length; i++) {
      if (collisionData[i][0] === false) { // option 1: no collision
      }
      else if (collisionData[i][0][0] === false) { // option 2: collision, but no longer touching
        newCollisionHappened = true;
        suggestedMaybeCenterAndTouchingTypes.push( [collisionData[i][0][1], false, collisionData[i][0][2] ] );
      }
      else { // option 3: collision, still touching wall with given type and index)
        newCollisionHappened = true;
        suggestedMaybeCenterAndTouchingTypes.push( [collisionData[i][0][1], collisionData[i][1], collisionData[i][0][2] ]);
      }
    }
    if (newCollisionHappened) {
      const newMaybeCenterAndTouchingType = closestCenterAndTouchingType(suggestedMaybeCenterAndTouchingTypes);
      const vec = new Vec2D( newMaybeCenterAndTouchingType[0].x - position.x, newMaybeCenterAndTouchingType[0].y - position.y);
      const newecbp = moveECB (ecbp, vec);
      return (loopOverWalls ( newecbp, ecb1, position
                            , wallAndThenWallTypeAndIndexs
                            , newMaybeCenterAndTouchingType 
                            , passNumber+1 
                            ) );
    }
    else {
      return oldMaybeCenterAndTouchingType;
    }
  }
};

// finds the maybeCenterAndTouchingType collision with smallest sweeping parameter
// recall that a 'maybeCenterAndTouchingType' is given by one of the following three options: 
//          option 1: 'false'                         (no collision) 
//          option 2: '[newPosition, false, s]             (collision, but no longer touching) 
//          option 3: '[newPosition, wallTypeAndIndex, s]' (collision, still touching wall with given type and index)
// s is the sweeping parameter
function closestCenterAndTouchingType(maybeCenterAndTouchingTypes) {
  let newMaybeCenterAndTouchingType = false;
  let start = -1;
  const l = maybeCenterAndTouchingTypes.length;

  // start by looking for the first possible new position
  for (let i = 0; i < l; i++) {
    if (maybeCenterAndTouchingTypes[i] === false ) {
      // option 1: do nothing
    }
    else {
      // options 2 or 3: we have found a possible new position
      newMaybeCenterAndTouchingType = maybeCenterAndTouchingTypes[i];
      start = i+1;
      break;
    }
  }
  if ( newMaybeCenterAndTouchingType === false || start > l) {
    // no possible new positions were found in the previous loop
    return false;
  }
  else {
    // options 2 or 3: possible new positions, choose the one with smallest sweeping parameter
    for (let j = start; j < l; j++) {
      if (maybeCenterAndTouchingTypes[j] === false ) {
        // option 1: no new position proposed
        // do nothing
      }
      // otherwise, compare sweeping parameters
      else if (maybeCenterAndTouchingTypes[j][2] < newMaybeCenterAndTouchingType[2]) {
        // next proposed position has smaller sweeping parameter, so use it instead
        newMaybeCenterAndTouchingType = maybeCenterAndTouchingTypes[j];
      }
      else {
        // discard the next proposed position
      }
    }
    return newMaybeCenterAndTouchingType;
  }
};


function moveECB (ecb, vec) {
  return ( [ new Vec2D (ecb[0].x+vec.x,ecb[0].y+vec.y)
           , new Vec2D (ecb[1].x+vec.x,ecb[1].y+vec.y)
           , new Vec2D (ecb[2].x+vec.x,ecb[2].y+vec.y)
           , new Vec2D (ecb[3].x+vec.x,ecb[3].y+vec.y)
           ] );
};

export function getNewMaybeCenterAndTouchingType(ecbp, ecb1, position, wallAndThenWallTypeAndIndexs) {
  // start at loop number 1, with no collisions given
  return loopOverWalls(ecbp, ecb1, position, wallAndThenWallTypeAndIndexs, false, 1 );
};
