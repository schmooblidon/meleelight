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


function centerFromSameECB( sameECB, same, offsets ) {
  switch(same) {
    case 1:
      return ( new Vec2D ( sameECB.x - offsets[1], sameECB.y - offsets[2] ) );
      break;
    case 2:
      return ( new Vec2D ( sameECB.x , sameECB.y - offsets[3]) );
      break;
    case 3:
      return ( new Vec2D ( sameECB.x + offsets[1], sameECB.y - offsets[2] ) );
      break;
    default: // default = 0, bottom ECB point
      return ( new Vec2D ( sameECB.x , sameECB.y - offsets[0] ) );
      break;
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
function findCollision (ecbp, ecb1, offsets, wall, wallType) {

  const wallTop    = extremePoint(wall, "top");
  const wallBottom = extremePoint(wall, "bottom");
  const wallLeft   = extremePoint(wall, "left");
  const wallRight  = extremePoint(wall, "right");

  
  let wallTopOrRight = wallTop;
  let wallBottomOrLeft = wallBottom;
  let same = 3;
  let opposite = 1;
  let xOrY = 1; // y by default
  switch(wallType[0].toLowerCase()) {
    case "l": // left wall
      same = 1;
      opposite = 3;
      break;
    case "g": // ground
    case "b":
    case "d":
    case "p": // platform
      same = 0;
      opposite = 2;
      wallTopOrRight  = wallRight;
      wallBottomOrLeft = wallLeft;
      xOrY = 0;
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

  // first check if player was even near the wall
  if (    (ecbp[0].y > wallTop.y    && ecb1[0].y > wallTop.y   ) // player stayed above the wall
       || (ecbp[2].y < wallBottom.y && ecb1[2].y < wallBottom.y) // played stayed below the wall
       || (ecbp[3].x > wallRight.x  && ecb1[3].x > wallRight.x ) // player stayed to the right of the wall
       || (ecbp[1].x < wallLeft.x   && ecb1[1].x < wallLeft.x  ) // player stayed to the left of the wall
     ) {
    console.log("'findCollision': no collision, not even near "+wallType+" surface.");
    return false;
  }
  else if ( !movingInto( sameECBMov, wallTopOrRight, wallBottomOrLeft, wallType)) {
    console.log("'findCollision': no collision, not moving towards "+wallType+" surface.");
    return false; // no collision: player not moving towards the line spanned by the wall
    // this clause makes sure that in later calls of 'coordinateIntercept', the relevant lines aren't going to be parallel
  }
  else if ( !isOutside ( ecb1[opposite], wallTopOrRight, wallBottomOrLeft, wallType ) ) {
    console.log("'findCollision': no collision, already on other side of "+wallType+" surface.");
    return false; // no collision: player was already on the other side of the line spanned by the wall
  }
  else if ( isOutside ( ecbp[same], wallTopOrRight, wallBottomOrLeft, wallType ) ) {
    console.log("'findCollision': no collision, same-side projected ECB on the outside of "+wallType+" surface.");
    return false; // no collision: same-side projected ECB point on the outside of the line spanned by the wall
  }
  else {
    // from now on, we know that the projected same-side ECB point is on the inside of the line spanned by the wall

    // cover the case where the same-side ECB point was in fact already on the inside of the line spanned by the wall
    if ( !isOutside ( ecb1[same], wallTopOrRight, wallBottomOrLeft, wallType )) {
      // this first part is a bit dubious
      if ( getXOrYCoord(ecbp[same], xOrY) > getXOrYCoord(wallTopOrRight, xOrY) || getXOrYCoord(ecbp[same], xOrY) < getXOrYCoord(wallBottomOrLeft), xOrY) {
        // projected same-side ECB point is past the extreme point of the wall
        console.log("'findCollision': no collision, noncrossing same-side ECB point beyond "+wallType+" surface.");
        return false;
      }
      else {
        const newSameECB = orthogonalProjection(ecbp[same], wall);
        const newCenter = centerFromSameECB( newSameECB, same, offsets );
        let touchingWall = wallType;
        if (getXOrYCoord(newCenter, xOrY) < getXOrYCoord(wallBottomOrLeft, xOrY) || getXOrYCoord(newCenter, xOrY) > getXOrYCoord(wallTopOrRight, xOrY) ) {
          touchingWall = false;
        }
        console.log("'findCollision': collision, noncrossing same-side ECB point, "+wallType+" surface.");
        return ( [touchingWall, newCenter] );
      }
    }

    // now the real collision checking
    // only need to work with same-side ECB point,
    // and no need to do corner checking,
    // because of wall and airborne ECB angle restrictions
    // we know that the same-side ECB point went from the outside to the inside of the line spanned by the wall
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
          const newCenter = centerFromSameECB( newSameECB, same, offsets );
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
function loopOverWalls( ecbp, ecb1, offsets, oldCenter, wallAndThenWallTypeAndIndexs, oldMaybeCenterAndTouchingType, passNumber ) {
  let newCollisionHappened = false;
  const suggestedMaybeCenterAndTouchingTypes = [oldMaybeCenterAndTouchingType];
  if (passNumber > maximumCollisionDetectionPasses) {
    return oldMaybeCenterAndTouchingType;
  }
  else { 
    const collisionData = wallAndThenWallTypeAndIndexs.map( 
                                              // [  [ touchingWall, center ]  , touchingType ] ]
              (wallAndThenWallTypeAndIndex)  => [ findCollision (ecbp, ecb1, offsets, wallAndThenWallTypeAndIndex[0]
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
      console.log("Here is the suggestedMaybeCenterAndTouchingTypes I am passing on to closestCenterAndTouchingType:");
      console.log(suggestedMaybeCenterAndTouchingTypes.toString());
      const newMaybeCenterAndTouchingType = closestCenterAndTouchingType( oldCenter, suggestedMaybeCenterAndTouchingTypes);
      console.log ("Here is the newMaybeCenterAndTouchingType: ");
      console.log (newMaybeCenterAndTouchingType.toString());
      const vec = new Vec2D( newMaybeCenterAndTouchingType[0].x - ecbp[0].x, newMaybeCenterAndTouchingType[1].y - ecbp[1].y);
      const newecbp = moveECB (ecbp, vec);
      return (loopOverWalls (newecbp, ecb1, offsets, oldCenter, wallAndThenWallTypeAndIndexs
                            , newMaybeCenterAndTouchingType, passNumber+1
                            ) );
    }
    else {
      return oldMaybeCenterAndTouchingType;
    }
  }
};

// finds the maybeCenterAndTouchingType with the closest center to the provided 'oldCenter'
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

export function getNewMaybeCenterAndTouchingType(ecbp, ecb1, offsets, wallAndThenWallTypeAndIndexs) {
  let maybeCenterAndTouchingType = false;
  const oldCenter = new Vec2D( ecb1[0].x, ecb1[1].y);
  maybeCenterAndTouchingType = loopOverWalls(ecbp, ecb1, offsets, oldCenter, wallAndThenWallTypeAndIndexs, maybeCenterAndTouchingType, 0 );
  return maybeCenterAndTouchingType;
};
