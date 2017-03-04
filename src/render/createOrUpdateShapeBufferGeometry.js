import {drawShape} from "./threeUtil";
import {getObjectByNameNonRecursive} from "../main/util/renderUtils";
import * as THREE from "three";

export function createOrUpdateShapeBufferGeometry (scene, name, instructions) {
  const sceneObject = getObjectByNameNonRecursive(scene, name);
  if (sceneObject !== null && sceneObject !== undefined) {
    const col = instructions.color;

    // update material directly
    if (sceneObject.material && instructions.updateMaterial === true) {
      if (col !== undefined) {
        sceneObject.material.color.set(col);
      }
      if (instructions.opacity !== undefined) {
        sceneObject.material.transparent = true;
        sceneObject.opacity = instructions.opacity;
      }
    }

    // update object position
    if (instructions.position !== undefined) {
      sceneObject.position.set(instructions.position.x, instructions.position.y, instructions.position.z);
    }
    if (instructions.scale !== undefined) {
      const s = instructions.scale;
      sceneObject.scale.set(s,s,1);
    }

    // update mesh attributes
    if (sceneObject.mesh) {
      const mesh = sceneObject.mesh;
      if (mesh.material && instructions.updateMaterial === true) {
        const meshCol = instructions.fill;
        if (meshCol !== undefined ) {
          mesh.material = meshCol;
        }
      }
    }

    // update line attributes
    if (sceneObject.line) {
      const line = sceneObject.line;
      if (line.material && instructions.updateMaterial === true) {
        const lineCol = instructions.stroke;
        if (lineCol !== undefined ) {
          sceneObject.line.material.color.set(lineCol);
        }
        const linewidth = instructions.linewidth;
        if (linewidth !== undefined ) {
          sceneObject.line.material.linewidth = linewidth;
        }
      }
    }

    // update the geometry
    // TODO: find a way to gracefully update geometry

    // update visibility
    const vis = instructions.visible;
    if (vis !== undefined) {
      sceneObject.visible = vis;
    }
    else {
      sceneObject.visible = true;
    }

    // don't transform object: assumption is that transformation is determined at creation and then fixed

  }
  else if (instructions.shape !== undefined) {
    const shape = instructions.shape;
    const group = new THREE.Group();
    group.name = name;
    let pts = 12;
    if (instructions.pts !== undefined) {
      pts = instructions.pts;
    }

    // outline material
    let lineMat = null;
    if ( instructions.stroke !== undefined) {
      const lineGeometry = shape.createPointsGeometry(pts);
      const lineBasicMaterial = { color : instructions.stroke };
      if (instructions.lineWidth !== undefined) {
        lineBasicMaterial.linewidth = instructions.linewidth;
      }
      if (instructions.opacity !== undefined) {
        lineBasicMaterial.opacity = instructions.opacity;
      }
      lineMat = new THREE.LineBasicMaterial(lineBasicMaterial);
      if (instructions.opacity !== undefined) {
        lineMat.transparent = true;
      }
    }

    // fill material
    let meshMat = null;
    if (instructions.fill !== undefined) {
      const meshGeometry = new THREE.ShapeBufferGeometry(shape, pts);
      const meshBasicMaterial = { color : instructions.fill };
      if (instructions.opacity !== undefined) {
        meshBasicMaterial.opacity = instructions.opacity;
      }
      meshMat = new THREE.MeshBasicMaterial(meshBasicMaterial);
      if (instructions.opacity !== undefined) {
        meshMat.transparent = true;
      }
      meshMat.side = THREE.DoubleSide;
    }

    // create object and put it into the group 'group'
    drawShape(group, instructions.shape, meshMat, lineMat, instructions.transform, pts);

    // update object position
    if (instructions.position !== undefined) {
      group.position.set(instructions.position.x, instructions.position.y, instructions.position.z);
    }

    scene.add(group);
  }
};