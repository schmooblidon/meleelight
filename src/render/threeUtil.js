import {Vec2D} from "../main/util/Vec2D";
import {normalise} from "../main/linAlg";
import {lineMaterial, createLineGeometry} from "./lineGeometry";
import {meshBasicMaterialT} from "./materials";
import {triangulateShape} from "./triangulateShape";
import * as THREE from "three";

// use earcut for triangulation
THREE.ShapeUtils.triangulateShape = triangulateShape;

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
    const curveObject = new THREE.Mesh( geometry, meshBasicMaterialT );
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
    mesh.name = "mesh";
    group.add(mesh);
  }
  if (lineMat !== null && lineMat !== undefined) {
    const lineGeometry = shape.createPointsGeometry(pts);
    const line = new THREE.Line(lineGeometry, lineMat);
    if (meshMat !== null && meshMat !== undefined) {
      line.translateZ(0.01);
    }
    group.add(line);
    line.name = "line";
  }
  if (transform !== null && transform !== undefined) {
    transform(group);
  }
  scene.add(group);
}

export function drawLine(scene, style, x1, y1, x2, y2, z = 0.1, order = 1) {
  const pts = [{ x : x1, y: y1, z: z}, { x:x2, y:y2, z:z }];
  const v = new Vec2D (y1-y2,x2-x1);
  const nv = normalise(v);
  const offsets = [nv,nv];
  const line = createLineGeometry ( pts, offsets, false );
  const opacity = style.opacity || 1;
  const linewidth = style.linewidth || 1;
  const col = style.color || style.col || "#ff00ff";
  const mat = lineMaterial(new THREE.Color(col), opacity, linewidth);
  const object = new THREE.Mesh(line, mat);
  scene.add(object);
  object.renderOrder = order;
}

