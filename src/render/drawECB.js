import {makePolygonShape} from "./threeUtil.js";
import {createOrUpdateBufferGeometry} from "./createOrUpdateBufferGeometry";
import {activeStage} from "../stages/activeStage";
import * as THREE from "three";

export function drawECB(scene, ecb, attributes, name = "ECB", z) : void {
  const meshVertices = new Float32Array( [
    ecb[0].x, ecb[1].y, 0.0,
    ecb[0].x, ecb[0].y, 0.0,
    ecb[1].x, ecb[1].y, 0.0,
    ecb[2].x, ecb[2].y, 0.0,
    ecb[3].x, ecb[3].y, 0.0,
  ] );
  const lineVertices = new Float32Array( [
    ecb[0].x, ecb[0].y, 0.0,
    ecb[1].x, ecb[1].y, 0.0,
    ecb[2].x, ecb[2].y, 0.0,
    ecb[3].x, ecb[3].y, 0.0,
    ecb[0].x, ecb[0].y, 0.0,
  ] );
  const indices = new Uint32Array( [
    0, 1, 2,
    0, 2, 3,
    0, 3, 4,
    0, 4, 1
  ] );
  createOrUpdateBufferGeometry(scene, name, { position : new THREE.Vector3(activeStage.offset[0], activeStage.offset[1],z)
                                            , scale : new THREE.Vector3(activeStage.scale, -activeStage.scale, 1)
                                            , meshVertices : meshVertices
                                            , lineVertices : lineVertices
                                            , indices : indices
                                            , updateVertices : true
                                            , fill : attributes.fill
                                            , stroke : attributes.stroke });
};