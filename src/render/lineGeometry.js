/*eslint indent:0*/

import {Vec2D} from "../main/util/Vec2D";
import {add, normalise} from "../main/linAlg";
import {unmakeColour} from "../main/vfx/makeColour";

import * as THREE from "three";

const lineShader = new THREE.ShaderMaterial ({

    uniforms: {
      "uCol" : { type: "c", value: 0xff00ff },
      "uAlpha" : { type : "f", value : 1 },
      "uWidth" : { type : "f", value : 1 }
    },

    blending: THREE.NormalBlending,
  
    vertexShader : [
      "attribute vec2 offset;",
      "varying vec2 vOffset;",
      "uniform float uWidth;",
      "void main(){",
        "vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);",
        "vOffset = normalize(offset);",
        "gl_Position = projectionMatrix * vec4(mvPosition.xy + 0.5*(uWidth+8.0)*offset, mvPosition.zw);",
      "}"
    ].join("\n"),
  
    fragmentShader : [
      "uniform vec3 uCol;",
      "uniform float uWidth;",
      "uniform float uAlpha;",
      "varying vec2 vOffset;",
      "void main() {",
        "float mag = length(vOffset);",
        "gl_FragColor = vec4(uCol, uAlpha*(1.0-smoothstep((uWidth-1.0)/(uWidth+4.0),(uWidth+1.0)/(uWidth+4.0),mag)));",
      "}"
    ].join("\n"),

    side : THREE.DoubleSide,

    transparent : true,

  });

export function lineMaterial(col, opacity, linewidth) {
  const material = lineShader.clone(); // cloning avoids multiple shaders being stored on the GPU
  let colour = col;
  if (typeof col === 'string') {
    if (col.substring(0,3) === "rgb") {
      colour = unmakeColour(col);
      colour.r *= 1/255;
      colour.g *= 1/255;
      colour.b *= 1/255;
    }
  }
  material.uniforms["uCol"].value = colour;
  material.uniforms["uAlpha"].uAlpha = opacity || 1;
  material.uniforms["uWidth"].value = linewidth || 1;
  return material;
};

export function createLineGeometry ( points, offsets, closed = true ) {
  const lg = points.length;
  if (lg > 1) {
    const pointArray = new Float32Array( 6 * lg );
    const indexArray = new Uint32Array( closed ? 6 * lg : 6 * (lg - 1));
    const offsetArray = new Float32Array( 4 * lg );
    for (let i = 0; i < lg; i++) {
      const point = points[i];
      const offset = offsets[i];
      pointArray[6*i  ]  = point.x;
      pointArray[6*i+1]  = point.y;
      pointArray[6*i+2]  = point.z;
      pointArray[6*i+3]  = point.x;
      pointArray[6*i+4]  = point.y;
      pointArray[6*i+5]  = point.z;
      offsetArray[4*i  ] =  offset.x;
      offsetArray[4*i+1] =  offset.y;
      offsetArray[4*i+2] = -offset.x;
      offsetArray[4*i+3] = -offset.y;
      if (i > 0) {
        indexArray[6*i-6] = 2*i  ;
        indexArray[6*i-5] = 2*i-1;
        indexArray[6*i-4] = 2*i-2;
        indexArray[6*i-3] = 2*i  ;
        indexArray[6*i-2] = 2*i-1;
        indexArray[6*i-1] = 2*i+1;
      }
    }
    if (closed) {
      indexArray[6*lg-6] = 0     ;
      indexArray[6*lg-5] = 2*lg-1;
      indexArray[6*lg-4] = 2*lg-2;
      indexArray[6*lg-3] = 0     ;
      indexArray[6*lg-2] = 2*lg-1;
      indexArray[6*lg-1] = 1     ;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute("position", new THREE.BufferAttribute(pointArray , 3));
    geometry.addAttribute("offset"  , new THREE.BufferAttribute(offsetArray, 2));
    geometry.setIndex( new THREE.BufferAttribute(indexArray, 1));
    return geometry;
  }
}

export function regularPolygonLineGeometry (n) {
  const points = [];
  const offsets = [];
  for (let i = 0; i < n; i++) {
    const pt = { x : Math.cos(2*i*Math.PI/n), y : Math.sin(2*i*Math.PI/n), z : 0 };
    points.push(pt);
    offsets.push({ x : pt.x, y : pt.y });
  }
  return createLineGeometry (points, offsets, true);
}

// create a polygon from a polar parametrisation
// polar takes an angle and returns a 3D point { x : x, y : y, z : z }
export function polygonLineGeometryFromPolar (n, polar) {
  const points = [];
  const offsets = [];
  for (let i = 0; i < n; i++) {
    const theta = 2*i*Math.PI/n;
    points.push(polar(theta));
    offsets.push({ x : Math.cos(theta), y : Math.sin(theta) });
  }
  return createLineGeometry (points, offsets, true);
}

export function polygonLineGeometry(points, closed = true, z = 0.01) {
  const lg = points.length;
  if (lg > 2) {
    const dirs = [];
    const offsets = [];
    for (let i = 0; i < lg-1; i++) {
      const p1 = points[i];
      const p2 = points[i+1];
      const v = new Vec2D (p1.y-p2.y,p2.x-p1.x);
      dirs.push(v);
    }
    let v0;
    if (closed) {
      const p1 = points[lg-1];
      const p2 = points[0];
      const v = new Vec2D (p1.y-p2.y,p2.x-p1.x);
      v0 = normalise(add(dirs[0],v));
      offsets.push(v0);
    }
    else {
      offsets.push(normalise(dirs[0]));
    }
    for (let i = 1; i < lg-1; i++) {
      offsets.push(normalise(add(dirs[i-1],dirs[i])));
    }
    if (closed) {
      offsets.push(v0);
    }
    else {
      offsets.push(offsets[lg-2]);
    }
    
    return createLineGeometry ( points.map( (vec) => ({ x : vec.x, y : vec.y, z : z }) )
                              , offsets
                              , closed );
  }
  else {
    console.log("error in 'polygonLineGeometry': need at least 2 points");
  }
}