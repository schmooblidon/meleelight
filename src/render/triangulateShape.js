import * as THREE from "three";
import {earcut} from "./earcut";

export function triangulateShape ( contour, holes ) {
  function removeDupEndPts( points ) {
    const l = points.length;
    if ( l > 2 && points[ l - 1 ].equals( points[ 0 ] ) ) {
      points.pop();
    }
  }
  function addContour( vertices, contour ) {
    for ( let i = 0; i < contour.length; i ++ ) {
      vertices.push( contour[ i ].x );
      vertices.push( contour[ i ].y );
    }
  }
  removeDupEndPts( contour );
  holes.forEach( removeDupEndPts );
  const vertices = [];
  addContour( vertices, contour );
  const holeIndices = [];
  let holeIndex = contour.length;
  for ( let i = 0; i < holes.length; i ++ ) {
    holeIndices.push( holeIndex );
    holeIndex += holes[ i ].length;
    addContour( vertices, holes[ i ] );
  }
  const result = earcut( vertices, holeIndices, 2 );
  const grouped = [];
  for ( let i = 0; i < result.length; i += 3 ) {
    grouped.push( result.slice( i, i + 3 ) );
  }
  return grouped;
};