import {makePolygonShape} from "./threeUtil.js";
import {createOrUpdateShapeBufferGeometry} from "./createOrUpdateShapeBufferGeometry";
import {stageTransform} from "./stageTransform";
import * as THREE from "three";

export function drawECB(scene, ecb, attributes, name = "ECB") : void {
  const ecbGroup = new THREE.Group();
  const ecbShape = makePolygonShape( ecb, true );
  createOrUpdateShapeBufferGeometry(scene, name, { shape : ecbShape, fill : attributes.fill, stroke : attributes.stroke, transform : stageTransform, pts : 1 });
};