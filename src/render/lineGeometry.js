/*eslint indent:0*/

import * as THREE from "three";

export function lineMaterial(col, opacity, linewidth) {
  const material = new THREE.ShaderMaterial ({

    uniforms: {
      "uCol" : { type: "c", value: col },
      "uAlpha" : { type : "f", value : opacity },
      "uWidth" : { type : "f", value : linewidth }
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
    ].join("\n")

  });

  material.side = THREE.DoubleSide;
  material.transparent = true;
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

export function polygonGeometry (n) {
  const points = [];
  const offsets = [];
  for (let i = 0; i < n; i++) {
    const pt = { x : Math.cos(2*i*Math.PI/n), y : Math.sin(2*i*Math.PI/n), z : 0 };
    points.push(pt);
    offsets.push({ x : pt.x, y : pt.y });
  }
  return createLineGeometry (points, offsets, true);
}