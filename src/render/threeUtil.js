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

export function drawBezierCurves (scene, path) {  
  for (let j = 0; j < path.length; j++) {
    const curve = new THREE.Shape();
    curve.moveTo(path[j][0], path[j][1]);
    for (let k = 2; k < path[j].length-5; k += 6) {      
      curve.bezierCurveTo(path[j][k], path[j][k+1], path[j][k+2], path[j][k+3], path[j][k+4], path[j][k+5]);
    }
    curve.closePath();
    // create the geometry by passing through a non-buffered geometry to create a non-indexed buffered geometry
    // this incurs a significant slowdown on load, but saves some memory
    //const geometry = new THREE.BufferGeometry().fromGeometry(new THREE.ShapeGeometry(curve, 3));
    const geometry = new THREE.ShapeBufferGeometry(curve, 3);
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    geometry.attributes.position.onUploadCallback = function (name) { this.array = null; } ;
    geometry.attributes.normal.onUploadCallback = function (name) { this.array = null; } ;
    geometry.attributes.uv.onUploadCallback = function (name) { this.array = null; } ;
    geometry.parameters = null; 
    const material = new THREE.MeshBasicMaterial( { color : new THREE.Color("rgb(255,0,255)"), opacity : 0 } );
    material.transparent = true;
    material.side = THREE.DoubleSide;
    const curveObject = new THREE.Mesh( geometry, material );
    scene.add(curveObject);
  }
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

export function makeDiskShape(cx, cy, r) {
  const disk = new THREE.Shape();
  disk.absarc(cx, cy, r, 0, 2*Math.PI, false);
  return disk;
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

export function drawShape (scene, shape, meshMat, lineMat, transform = null, pts = 12) {
  const group = new THREE.Group();
  if (meshMat !== null && meshMat !== undefined) {
    const meshGeometry = new THREE.ShapeBufferGeometry(shape, pts);
    const mesh = new THREE.Mesh(meshGeometry, meshMat);
    group.add(mesh);
  }
  if (lineMat !== null && lineMat !== undefined) {
    const lineGeometry = shape.createPointsGeometry(pts);
    const line = new THREE.Line(lineGeometry, lineMat);
    group.add(line);
  }
  if (transform !== null && transform !== undefined) {
    transform(group);
  }
  scene.add(group);
}

export function drawLine(scene, mat, x1, y1, x2, y2) {
  const line = new THREE.Shape();
  line.moveTo(x1,y1);
  line.lineTo(x2,y2);
  const geometry = line.createPointsGeometry();
  const object = new THREE.Line(geometry, mat);
  scene.add(object);
}

