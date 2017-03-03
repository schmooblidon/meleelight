import {activeStage} from "../stages/activeStage";
import {makePolygonShape, drawShape} from "./threeUtil.js";
import * as THREE from "three";

export function drawECB(scene, ecb, attributes) : void {
  const ecbGroup = new THREE.Group();
  const ecbShape = makePolygonShape( ecb, true );
  const strokeMat = (attributes.stroke === null || attributes.stroke === undefined) ? null : new THREE.LineBasicMaterial({ color : attributes.stroke, linewidth : 5 });
  const meshMat = (attributes.fill === null || attributes.fill === undefined) ? null : new THREE.MeshBasicMaterial({ color : attributes.fill });
  drawShape(ecbGroup, ecbShape, meshMat, strokeMat, null, 1);
  ecbGroup.scale.set(activeStage.scale,-activeStage.scale,1);
  ecbGroup.translateX(activeStage.offset[0]);
  ecbGroup.translateY(activeStage.offset[1]);
  scene.add(ecbGroup);
};