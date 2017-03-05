import * as THREE from "three";
import {triangulateShape} from "./triangulateShape";


// see https://github.com/mrdoob/three.js/blob/master/src/geometries/ShapeGeometry.js

export function makePolygonMeshGeometry(polygon, z = 0) {

  const lg = polygon.length;
  const vertices = [];
  const normals = [];
  const indices = [];

  // use earcut for triangulation
  const faces = triangulateShape( vertices );

  // vertices, normals
  for ( let i = 0; i < lg; i++ ) {
    const point = polygon[i];
    vertices.push( point.x, point.y, z );
    normals.push(0,0,1);
  }

  // indices
  for ( let i = 0; i < faces.length; i++ ) {
    const face = faces[i];
    const a = face[0];
    const b = face[1];
    const c = face[2];
    indices.push( a, b, c );
  }

  const meshGeometry = new THREE.BufferGeometry();
  meshGeometry.addAttribute("position", new THREE.BufferAttribute( vertices, 3 ) );
  meshGeometry.addAttribute("normal"  , new THREE.BufferAttribute( normals , 3 ) );
  meshGeometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );
  return meshGeometry;
}