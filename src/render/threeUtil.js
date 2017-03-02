import * as THREE from "three";
import {earcut} from "./earcut";

THREE.ShapeUtils.triangulateShape = function ( contour, holes ) {
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

// drawArrayPathCompress
export function drawBezierCurves (scene, col, face, tX, tY, path, scaleX, scaleY, rotate, rpX, rpY) {  
  for (let j = 0; j < path.length; j++) {
    const curve = new THREE.Shape();
    curve.moveTo(path[j][0], path[j][1]);
    for (let k = 2; k < path[j].length-5; k += 6) {      
      curve.bezierCurveTo(path[j][k], path[j][k+1], path[j][k+2], path[j][k+3], path[j][k+4], path[j][k+5]);
    }
    curve.closePath();
    const material = new THREE.MeshBasicMaterial( { color : col } );
    const geometry = new THREE.ShapeBufferGeometry(curve, 3);
    const curveObject = new THREE.Mesh( geometry, material );
    curveObject.scale.set( scaleX * face, scaleY, 1);
    curveObject.translateX(tX-rpX);
    curveObject.translateY(tY-rpY);
    curveObject.rotateZ(rotate);
    curveObject.translateX(rpX);
    curveObject.translateY(rpY);
    scene.add(curveObject);
  }
}

// drawArrayPath
export function drawLinearCurve(scene, col, face, tX, tY, path, scaleX, scaleY) {
  const lg = path.length;
  if (lg > 1) {
    const curve = new THREE.Shape();
    curve.moveTo(path[0], path[1]);
    for (let k = 2; k < lg - 1; k += 2) {
      curve.lineTo(path[k], path[k+1]);
    }
    curve.closePath();
    const material = new THREE.MeshBasicMaterial( { color : col } );
    const geometry = new THREE.ShapeGeometry(curve);
    const curveObject = new THREE.Mesh (geometry, material);
    curveObject.scale.set( scaleX * face, scaleY, 1);
    curveObject.translateX(tX);
    curveObject.translateY(tY);
    scene.add(curveObject);
  }
}

// drawArrayPathNew
export function drawBezierCurve(scene, col, face, tX, tY, path, scaleX, scaleY, rotate) {
  const curve = new THREE.Shape();
  curve.moveTo(path[0][0], path[0][1]);
  let n = 0;
  for (let j = 1; j < path.length; j++) {
    if (path[j].length === 2) {
      curve.moveTo(path[j][0], path[j][1]);
    }
    else if (path[j].length === 6) {
      n++;
      curve.bezierCurveTo(path[j][0], path[j][1], path[j][2], path[j][3], path[j][4], path[j][5]);
    }
  }
  curve.closePath();
  const material = new THREE.MeshBasicMaterial( { color : col } );
  const geometry = new THREE.ShapeGeometry(curve);
  const curveObject = new THREE.Mesh (geometry, material);
  curveObject.scale.set( scaleX * face, scaleY, 1);
  curveObject.rotateZ(rotate);
  curveObject.translateX(tX);
  curveObject.translateY(tY);
  scene.add(curveObject);
}

export function makeRectShape (xmin, xmax, ymin, ymax) {
  const rect = new THREE.Shape();
  rect.moveTo(xmin, ymin);
  rect.lineTo(xmax, ymin);
  rect.lineTo(xmax, ymax);
  rect.lineTo(xmin, ymax);
  rect.closePath();
  return rect;
}

export function drawShape (scene, shape, meshMat, lineMat, transform = null) {
  const meshGeometry = new THREE.ShapeGeometry(shape);
  const lineGeometry = shape.createPointsGeometry();
  const mesh = meshMat === null ? null : new THREE.Mesh(meshGeometry, meshMat);
  const line = meshMat === null ? null : new THREE.Line(lineGeometry, lineMat);
  if (transform !== null && transform !== undefined) {
    const group = new THREE.group();
    meshMat === null ? void 0 : group.add(mesh);
    lineMat === null ? void 0 : group.add(line);
    transform(group);
    scene.add(group);
  }
  else {
    meshMat === null ? void 0 : scene.add(mesh);
    lineMat === null ? void 0 : scene.add(line);
  }
}

export function makePolygonShape (path, closed = true) {
  const polygon = new THREE.Shape();
  polygon.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i++ ) {
    polygon.lineTo(path[i].x, path[i].y);
  }
  if (closed) {
    polygon.closePath();
  }
  return polygon;
}

export function drawLine(scene, mat, x1, y1, x2, y2) {
  const line = new THREE.Shape();
  line.moveTo(x1,y1);
  line.lineTo(x2,y2);
  const geometry = line.createPointsGeometry();
  const object = new THREE.Line(geometry, mat);
  scene.add(object);
}

