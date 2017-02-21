// @flow
/*eslint indent:1*/

import {Vec2D} from "../../main/util/Vec2D";
import {coordinateInterceptParameter} from "../../physics/environmentalCollision";
import {euclideanDist, subtract, orthogonalProjection} from "../../main/linAlg";
import {extremePoint} from "./extremePoint";

type Line = [Vec2D, Vec2D];
type Polygon = Array<Vec2D>;


export function intersectsAny (newLine : Line, lines : Array<Line>) : bool {
  for (let i = 0; i < lines.length; i++) {
    if (intersects(newLine, lines[i])) {
      return true;
    }
  } 
  return false;
}

function intersects( line1 : Line, line2 : Line) : bool {
  const t1 = coordinateInterceptParameter(line1, line2);
  const t2 = coordinateInterceptParameter(line2, line1);
  if (isNaN(t1) || isNaN(t2) || t1 === Infinity || t2 === Infinity || t1 < 0 || t2 < 0 || t1 > 1 || t2 > 1) {
    return false;
  }
  else {
    return true;
  }
}

function isInside( point : Vec2D, lines : Array<Line>) : bool {
  const pt = new Vec2D( point.x+0.001, point.y);
  const atInfinity = new Vec2D( point.x+0.001, point.y + 100000);
  return !evenNumberOfTrue( lines.map((line) => intersects(line, [pt, atInfinity])));
}

function evenNumberOfTrue ( list : Array<bool> ) : bool {
  if (list.length < 1) {
    return true;
  }
  else {
    const [head, ...tail] = list;
    if (head === true) {
      return !evenNumberOfTrue(tail);
    }
    else {
      return evenNumberOfTrue(tail);
    }
  }
}

function distanceToLines( point : Vec2D, lines : Array<Line>) : number {
  if (isInside(point, lines)) {
    return -1;
  }
  else {
    return minimum( lines.map( (line) => distanceToLine(point, line)));
  }
}

export function distanceToLine (point : Vec2D, line : Line) : number {
  if (euclideanDist(line[0], line[1]) < 0.001 ) {
    return euclideanDist(point, line[0]);
  }
  else {
    const projectedPoint = orthogonalProjection(point,line);
    const lineRight = extremePoint(line,"r");
    const lineLeft = extremePoint(line,"l");
    const lineTop = extremePoint(line,"t");
    const lineBot = extremePoint(line,"b");
    if (projectedPoint.x > lineRight.x) {
      return euclideanDist (point, lineRight);
    }
    else if (projectedPoint.x < lineLeft.x) {
      return euclideanDist (point, lineLeft);
    }
    else if (projectedPoint.y > lineTop.y) {
      return euclideanDist (point, lineTop);
    }
    else if (projectedPoint.y < lineBot.y) {
      return euclideanDist (point, lineBot);
    }
    else {
      return euclideanDist(point, projectedPoint);
    }
  }
}


function minimum ( numbers : Array<number>) : number {
  if (numbers.length < 1) {
    return Infinity;
  }
  else {
    const [head, ...tail] = numbers;
    const next = minimum(tail);
    if (head < next) {
      return head;
    }
    else {
      return next;
    }
  }
}

export function distanceToPolygon( point : Vec2D, polygon : Polygon) : number {
  return distanceToLines(point, linesOfPolygon(polygon));
}

function linesOfPolygon( polygon : Polygon ) : Array<Line> {
  const lg = polygon.length;
  let pt = polygon[lg-1];
  const lines = [];
  for (let i = 0; i < polygon.length; i++) {
    lines.push([pt, polygon[i]]);
    pt = polygon[i];
  }
  return lines;
}

function distanceBetweenLines( line1 : Line, line2 : Line) : number {
  if (intersects(line1, line2)) {
    return 0;
  }
  else {
    return minimum( [ distanceToLine(line1[0], line2)
                    , distanceToLine(line1[1], line2)
                    , distanceToLine(line2[0], line1)
                    , distanceToLine(line2[1], line1)
                    ] );
  }
}

export function lineDistanceToLines( thisLine : Line, otherLines : Array<Line>) : number {
  return minimum( otherLines.map( (otherLine) => distanceBetweenLines(thisLine, otherLine)));
}
