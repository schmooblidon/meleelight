/*eslint indent:0*/
/*eslint camelcase:0*/

import {Vec2D} from "../main/util/Vec2D";
import {add, norm, normalise, scalarProd, dotProd, crossProd, scaledNormal} from "../main/linAlg";
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
      "attribute float side;",
      "varying float vSide;",
      "uniform float uWidth;",
      "void main(){",
        "vSide = side;", // passed on to the fragment shader
        "vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);",
        "gl_Position = projectionMatrix * vec4(mvPosition.x + 0.5*(uWidth+3.0)*offset.x, mvPosition.y - 0.5*(uWidth+3.0)*offset.y, mvPosition.zw);",
      "}"
    ].join("\n"),
  
    fragmentShader : [
      "uniform vec3 uCol;",
      "uniform float uAlpha;",
      "uniform float uWidth;",
      "varying float vSide;",
      "void main() {",
        "float mag = abs(vSide);",
        "gl_FragColor = vec4(uCol.rgb, uAlpha*(1.0-smoothstep((0.5*uWidth-1.5)/(0.5*uWidth+1.5),(0.5*uWidth+1.5)/(0.5*uWidth+1.5),mag)));",
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
    const sideArray = new Float32Array( 2 * lg );
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
      sideArray[2*i  ] =  1;
      sideArray[2*i+1] = -1;
      if (i > 0) {
        indexArray[6*i-6] = 2*i  ;
        indexArray[6*i-5] = 2*i-1;
        indexArray[6*i-4] = 2*i-2;
        indexArray[6*i-3] = 2*i+1; 
        indexArray[6*i-2] = 2*i  ;
        indexArray[6*i-1] = 2*i-1;
      }
    }
    if (closed) {
      indexArray[6*lg-6] = 0     ;
      indexArray[6*lg-5] = 2*lg-1;
      indexArray[6*lg-4] = 2*lg-2;
      indexArray[6*lg-3] = 1     ;
      indexArray[6*lg-2] = 0     ;
      indexArray[6*lg-1] = 2*lg-1;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute("position", new THREE.BufferAttribute(pointArray , 3));
    geometry.addAttribute("offset"  , new THREE.BufferAttribute(offsetArray, 2));
    geometry.addAttribute("side"    , new THREE.BufferAttribute(sideArray  , 1));
    geometry.setIndex( new THREE.BufferAttribute(indexArray, 1));
    return geometry;
  }
}

export function regularPolygonLineGeometry (n, r = 1, z = 0) {
  const points = [];
  const offsets = [];
  for (let i = 0; i < n; i++) {
    const x = Math.cos(2*i*Math.PI/n);
    const y = Math.sin(2*i*Math.PI/n);
    const pt = { x : r*x, y : r*y, z : z };
    points.push(pt);
    offsets.push({ x : x, y : y });
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

export function polygonLineGeometry(points, closed = true, w = 1, z = 0.05) {
  const lg = points.length;
  if (lg > 1) {
    const dirs = [];
    const offsets = [];
    for (let i = 0; i < lg-1; i++) {
      const p1 = points[i];
      const p2 = points[i+1];
      const v = new Vec2D (p2.x-p1.x,p2.y-p1.y);
      dirs.push(normalise(v));
    }
    if (closed) {
      const pl = points[lg-1];
      const p0 = points[0];
      const v0 = normalise(new Vec2D (p0.x-pl.x,p0.y-pl.y));
      offsets.push(miter(v0, dirs[0], w));
      dirs.push(v0);
    }
    else {
      const d0 = dirs[0];
      dirs.push(d0);
      offsets.push(miter(d0,d0,w));
    }
    for (let i = 1; i < dirs.length; i++) {
      offsets.push(miter(dirs[i-1], dirs[i], w));
    }
    
    return createLineGeometry ( points.map( (vec) => ({ x : vec.x, y : vec.y, z : z }) )
                              , offsets
                              , closed );
  }
  else {
    console.log("error in 'polygonLineGeometry': need at least 2 points");
  }
}

// finds the offset vector for miter joint from two consecutive lines with direction vectors u, v
// and with line width w (corresponding to an offset of w/2 on each side)
// assumes that u and v are normalised
export function miter(u, v, w) {
  const n_u = scaledNormal(u,w);
  const n_v = scaledNormal(v,w);
  const n = add(n_u, n_v);
  const sin = crossProd(u,v);
  const cos = dotProd(u,v);
  let t;
  if (cos > 0) {
    t = w*sin/(1+cos);
  }
  else {
    t = w*(1-cos)/sin;
  }
  return scalarProd(0.25, add(n,add(scalarProd(t,u),scalarProd(-t,v))));
}

