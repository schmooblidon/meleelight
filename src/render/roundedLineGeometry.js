/*eslint indent:0*/
/*eslint camelcase:0*/

import {Vec2D} from "../main/util/Vec2D";
import {add, norm, normalise, scalarProd, dotProd, crossProd, scaledNormal} from "../main/linAlg";
import {unmakeColour} from "../main/vfx/makeColour";
import {miter} from "./lineGeometry";

import * as THREE from "three";

const roundedLineShader = new THREE.ShaderMaterial ({

    uniforms: {
      "uCol" : { type: "c", value: 0xff00ff },
      "uAlpha" : { type : "f", value : 1 },
      "uWidth" : { type : "f", value : 1 }
    },

    blending: THREE.NormalBlending,
  
    vertexShader : [
      "attribute vec2 offset;",
      "attribute float side;",
      "attribute float round;",
      "varying float vSide;",
      "varying float vRound;",
      "varying vec2 vOffset;",
      "uniform float uWidth;",
      "void main(){",
        "vSide = side;", // passed on to the fragment shader
        "vRound = round;",
        "vOffset = offset;",
        "vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);",
        "gl_Position = projectionMatrix * vec4(mvPosition.x + 0.5*(uWidth+3.0)*offset.x, mvPosition.y - 0.5*(uWidth+3.0)*offset.y, mvPosition.zw);",
      "}"
    ].join("\n"),
  
    fragmentShader : [
      "uniform vec3 uCol;",
      "uniform float uAlpha;",
      "uniform float uWidth;",
      "varying float vSide;",
      "varying float vRound;",
      "varying vec2 vOffset;",
      "void main() {",
        "float mag = abs(vSide);",
        "if (vRound > 0.0001) {",
          "mag = length(vOffset);",
        "}",
        "gl_FragColor = vec4(uCol.rgb, uAlpha*(1.0-smoothstep((0.5*uWidth-1.0)/(0.5*uWidth+1.5),(0.5*uWidth+1.0)/(0.5*uWidth+1.5),mag)));",
        // testing: "gl_FragColor = vec4(mag,mag,mag,1);",
      "}"
    ].join("\n"),

    side : THREE.DoubleSide,

    transparent : true,

  });

export function roundedLineMaterial(col, opacity, linewidth) {
  const material = roundedLineShader.clone(); // cloning avoids multiple shaders being stored on the GPU
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

function getDirections(points, closed = true) {
  const lg = points.length;
  const dirs = [];
  if (lg > 1) {
    for (let i = 0; i < lg-1; i++) {
      const p1 = points[i];
      const p2 = points[i+1];
      dirs.push(normalise(new Vec2D (p2.x-p1.x,p2.y-p1.y)));
    }
    if (closed) {
      const pl = points[lg-1];
      const p0 = points[0];
      const v = normalise(new Vec2D (p0.x-pl.x,p0.y-pl.y));
      dirs.push(v);
    }
    else {
      dirs.push(dirs[lg-2]);
    }
  }
  return dirs;
}

export function getOffsets(dirs, closed = true) {
  const lg = dirs.length;
  const offsets = [];
  const dists = [];
  const zero = new Vec2D(0,0);
  const finalDir = closed ? dirs[lg-1] : dirs[0];
  for (let i = 0; i < lg; i++) {
    const dir = dirs[i];
    const prevDir = i === 0 ? finalDir : dirs[i-1];
    const n = scaledNormal(dir,-1);
    if (!closed && (i === 0 || i === lg - 1)) {
      offsets.push(n);
      offsets.push(scalarProd(-1,n));
      dists.push(1);
    }
    else {
      const prevn = scaledNormal(prevDir,-1);
      const m = miter(dir,prevDir,2); // miter of width 2 corresponds to normalised edge distances being 1/-1
      offsets.push(prevn);
      offsets.push(scalarProd(-1,m));
      offsets.push(zero);
      offsets.push(n);
      offsets.push(m);
      const sign = Math.sign(crossProd(dir,prevDir));
      const nm = norm(m);
      dists.push(sign*nm); // change this to sign for miter line-joins
                           // can also be changed to create bevel line-joins
    }
  }
  return [offsets, dists];
}

export function roundedPolygonLineGeometry(points, closed : true, z = 0.05) {
  const dirs = getDirections(points, closed);
  const [offsets, dists] = getOffsets(dirs, closed);
  const lg = points.length;
  if (lg > 1) {
    const pts = closed ? 5 * lg : 5 * lg - 6;
    const tris = closed ? 6 * lg : 6 * lg - 10;
    const pointArray = new Float32Array( 3 * pts );
    const indexArray = new Uint32Array( 3 * tris );
    const offsetArray = new Float32Array( 2 * pts );
    const sideArray = new Float32Array( pts );
    const roundArray = new Float32Array( pts );

    let np = 2; // number of points to create for a given point
    const off = closed ? 3 : 0;
    for (let i = 0, p = 0, t = 0; p < lg; i += np, p += 1, t += 2) {
      const point = points[p];
      np = !closed && (i === 0 || i === lg-1) ? 2 : 5;
      for (let j = 0; j < np; j++) {
        pointArray [3*i+3*j  ] = point.x;
        pointArray [3*i+3*j+1] = point.y;
        pointArray [3*i+3*j+2] = z;
        offsetArray[2*i+2*j  ] = offsets[i+j].x;
        offsetArray[2*i+2*j+1] = offsets[i+j].y;
      }

      const d = dists[p];
      const s = Math.sign(d);
      if (np === 5) {
        // add sides to side array (5 points situation)

        sideArray[i  ] = s;
        sideArray[i+1] = d;
        sideArray[i+2] = 0;
        sideArray[i+3] = s;
        sideArray[i+4] = -s;

        // set distance of outward miter point for rounding
        for (let j = 0; j < 5; j++) {
          roundArray[i+j] = j === 1 ? Math.abs(d) : 0;
        }

        // create geometry at corner
        indexArray[3*t   ] = i+2;
        indexArray[3*t+ 1] = i+4;
        indexArray[3*t+ 2] = i  ;

        indexArray[3*t+ 3] = i+2;
        indexArray[3*t+ 4] = i  ;
        indexArray[3*t+ 5] = i+1;

        indexArray[3*t+ 6] = i+2;
        indexArray[3*t+ 7] = i+1;
        indexArray[3*t+ 8] = i+3;

        indexArray[3*t+ 9] = i+2;
        indexArray[3*t+10] = i+3;
        indexArray[3*t+11] = i+4;
        t += 4;
      }
      else {
        // add distances to distance array (2 points situation)
        sideArray [i  ] =  1;
        sideArray [i+1] = -1;
        roundArray[i  ] =  0;
        roundArray[i+1] =  0;
      }

      // create straight line geometry to next point
      if (p < lg-1) {
        indexArray[3*t  ] = off+i;
        indexArray[3*t+1] = off+i+1;
        indexArray[3*t+2] = off+i+2;
  
        indexArray[3*t+3] = off+i+1;
        indexArray[3*t+4] = off+i+2;
        if (p === lg-2 && !closed) {
          indexArray[3*t+5] = off+i+3;
        }
        else {
          indexArray[3*t+5] = off+i+6;
        }
      }
      else if (closed) {
        indexArray[3*t  ] = off+i;
        indexArray[3*t+1] = off+i+1;
        indexArray[3*t+2] = 0;
  
        indexArray[3*t+3] = off+i+1;
        indexArray[3*t+4] = 0;
        indexArray[3*t+5] = 4;
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute("position", new THREE.BufferAttribute(pointArray , 3));
    geometry.addAttribute("offset"  , new THREE.BufferAttribute(offsetArray, 2));
    geometry.addAttribute("side"    , new THREE.BufferAttribute(sideArray  , 1));
    geometry.addAttribute("round"   , new THREE.BufferAttribute(roundArray , 1));
    geometry.setIndex( new THREE.BufferAttribute(indexArray, 1));
    return geometry;
  }
  else {
    console.log("error in 'roundedPolygonLineGeometry': need at least 2 points");
  }
}

export function roundedPolygon(points, instructions) {
  const w = instructions.w || instructions.linewidth || instructions.width || 1;
  const geometry = roundedPolygonLineGeometry( points
                                             , instructions.closed || true
                                             , instructions.z || 0.01 );
  const material = roundedLineMaterial( instructions.color || instructions.colour || instructions.col
                                      , instructions.opacity || instructions.alpha
                                      , w );
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}