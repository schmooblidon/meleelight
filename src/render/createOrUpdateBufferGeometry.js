import {drawShape} from "./threeUtil";
import {getObjectByNameNonRecursive} from "../main/util/renderUtils";
import {lineBasicMaterial, lineBasicMaterialT, meshBasicMaterial, meshBasicMaterialT} from "./materials";
import {lineMaterial, polygonLineGeometry} from "./lineGeometry";
import {makePolygonMeshGeometry} from "./makePolygonMeshGeometry";
import * as THREE from "three";

export function createOrUpdateBufferGeometry (scene, name, instructions) {
  const sceneObject = getObjectByNameNonRecursive(scene, name);
  if (sceneObject) {
    updateBufferGeometry(sceneObject, instructions);
  }
  else {
    createBufferGeometry(scene, name, instructions);
  }
};

function updateBufferGeometry(sceneObject, instructions) {
  // update object position
  if (instructions.position) {
    const p = instructions.position;
    sceneObject.position.set(p.x, p.y, p.z);
  }
  if (instructions.scale) {
    const s = instructions.scale;
    sceneObject.scale.set(s.x,s.y,s.z);
  }

  // update materials
  const opacity = instructions.opacity;

  // update mesh material
  const meshCol = instructions.fill;
  const mesh = getObjectByNameNonRecursive(sceneObject, "mesh");
  if (instructions.updateMaterial && meshCol && mesh && mesh.material) {
    if (meshCol) {
      mesh.material.color.set(meshCol);
    }
    if (opacity) {
      mesh.material.opacity = opacity;
    }
  }

  // update line material
  const lineCol = instructions.stroke;
  const linewidth = instructions.linewidth;
  const line = getObjectByNameNonRecursive(sceneObject, "line");
  if (instructions.updateMaterial && lineCol && line && line.material) {
    if (lineCol) {
      if (line.material.color) {
        line.material.color.set(lineCol);
      }
      else {
        line.material.uniforms["uCol"].value = lineCol;
      }
    }
    if (linewidth) {
      if (line.material.linewidth) {
        line.material.linewidth = linewidth;
      }
      else {
        line.material.uniforms["uWidth"].value = linewidth;
      }
    }
    if (opacity) {
      if (line.material.opacity) {
        line.material.opacity = opacity;
      }
      else {
        line.material.uniforms["uAlpha"].value = opacity;
      }
    }    
  }

  // update the geometry
  if (instructions.updateVertices === true) {
    if (line && instructions.lineVertices) {
      const p = line.geometry.attributes.position.array;
      const mv = instructions.lineVertices;
      for (let i = 0; i < p.length; i++) {
        p[i] = mv[i];
      }
      line.geometry.attributes.position.needsUpdate = true;
    }
    if (mesh && instructions.meshVertices) {
      const p = mesh.geometry.attributes.position.array;
      const mv = instructions.meshVertices;
      for (let i = 0; i < p.length; i++) {
        p[i] = mv[i];
      }
      mesh.geometry.attributes.position.needsUpdate = true;
      if (line) { 
        line.translateZ(0.01); 
      };
    }
  }

  // update visibility
  const vis = instructions.visible;
  if (vis !== undefined) {
    sceneObject.visible = vis;
  }
  else {
    sceneObject.visible = true;
  }

  // don't transform object: assumption is that transformation is determined at creation and then fixed
};

function createBufferGeometry(scene, name, instructions) {

  const group = new THREE.Group();
  group.name = name;

  if (instructions.shape !== undefined) {
    const shape = instructions.shape;
    const pts = instructions.pts || 5;

    // outline material
    let lineMat = null;
    if (instructions.stroke !== undefined) {
      const lineGeometry = shape.createPointsGeometry(pts);
      if (instructions.opacity !== undefined) {
        lineMat = lineBasicMaterialT.clone();
        lineMat.opacity = instructions.opacity;
      }
      else {
        lineMat = lineBasicMaterial.clone();
      }
      lineMat.color.set(instructions.stroke);
      if (instructions.lineWidth !== undefined) {
        lineMat.linewidth = instructions.linewidth;
      }
    }

    // fill material
    let meshMat = null;
    if (instructions.fill !== undefined) {
      const meshGeometry = new THREE.ShapeBufferGeometry(shape, pts);
      if (instructions.opacity !== undefined) {
        meshMat = meshBasicMaterialT.clone();
        meshMat.opacity = instructions.opacity;
      }
      else {
        meshMat = meshBasicMaterial.clone();
      }
      meshMat.color.set(instructions.fill);
    }

    // create object and put it into the group 'group'
    drawShape(group, instructions.shape, meshMat, lineMat, instructions.transform, pts);
  }
  else if (instructions.polygon !== undefined && instructions.polygon.points !== undefined) {
    if (instructions.fill !== undefined) {
      let meshMat = null;
      const meshGeometry = makePolygonMeshGeometry(instructions.polygon.points);
      if (instructions.opacity !== undefined) {
        meshMat = meshBasicMaterialT.clone();
        meshMat.opacity = instructions.opacity;
      }
      else {
        meshMat = meshBasicMaterial.clone();
      }
      meshMat.color.set(instructions.fill);
      const mesh = new THREE.Mesh(meshGeometry, meshMat);
      mesh.name = "mesh";
      group.add(mesh);
    }
    if (instructions.stroke !== undefined) {      
      const lineMat = lineMaterial(instructions.stroke, instructions.opacity, instructions.linewidth);
      const lineGeometry = polygonLineGeometry(instructions.polygon.points, instructions.polygon.closed);
      const line = new THREE.Mesh(lineGeometry, lineMat);
      line.name = "line";
      group.add(line);      
    }

  }
  else {
    // mesh triangle geometry
    let meshGeometry = null;
    if (instructions.meshVertices !== undefined && instructions.fill !== undefined) {
      meshGeometry = new THREE.BufferGeometry();
      meshGeometry.addAttribute("position", new THREE.BufferAttribute( instructions.meshVertices, 3 ) );
      if (instructions.indices !== undefined) {
        meshGeometry.setIndex( new THREE.BufferAttribute( instructions.indices, 1 ) );
      }
      if (instructions.updateVertices === true) {
        meshGeometry.dynamic = true;
      }
  
      // mesh material

      if (instructions.fill !== undefined) {
        let meshMat;
        if (instructions.opacity !== undefined) {
          meshMat = meshBasicMaterialT.clone();
          meshMat.opacity = instructions.opacity;
        }
        else {
          meshMat = meshBasicMaterial.clone();
        }
        meshMat.color.set(instructions.fill);
        const mesh = new THREE.Mesh(meshGeometry, meshMat);
        mesh.name = "mesh";
        group.add(mesh);
      }
    }
  
    // line geometry
    let lineGeometry = null;
    if (instructions.lineVertices !== undefined && instructions.stroke !== undefined) {
      lineGeometry = new THREE.BufferGeometry();
      lineGeometry.addAttribute("position", new THREE.BufferAttribute( instructions.lineVertices, 3 ));
      if (instructions.updateVertices === true) {
        lineGeometry.dynamic = true;
      }
      // outline material
      let lineMat = null;
      if (instructions.stroke !== undefined) {
        if (instructions.opacity !== undefined) {
          lineMat = lineBasicMaterialT.clone();
          lineMat.opacity = instructions.opacity;
        }
        else {
          lineMat = lineBasicMaterial.clone();
        }
        lineMat.color.set(instructions.stroke);
        if (instructions.lineWidth !== undefined) {
          lineMat.linewidth = instructions.linewidth;
        }
      }
  
      const line = new THREE.Line(lineGeometry, lineMat);
      line.name = "line";
      group.add(line);
    }
  }
  
  // update object position
  if (instructions.position !== undefined) {
    const p = instructions.position;
    group.position.set(p.x, p.y, p.z);
  }
  if (instructions.scale !== undefined) {
    const s = instructions.scale;
    group.scale.set(s.x,s.y,s.z);
  }
  scene.add(group);
}