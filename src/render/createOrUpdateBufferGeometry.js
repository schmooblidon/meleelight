import {drawShape} from "./threeUtil";
import {getObjectByNameNonRecursive} from "../main/util/renderUtils";
import * as THREE from "three";

export function createOrUpdateBufferGeometry (scene, name, instructions) {
  const sceneObject = getObjectByNameNonRecursive(scene, name);
  if (sceneObject !== null && sceneObject !== undefined) {
    const col = instructions.color;

    // update object position
    if (instructions.position !== undefined) {
      const p = instructions.position;
      sceneObject.position.set(p.x, p.y, p.z);
    }
    if (instructions.scale !== undefined) {
      const s = instructions.scale;
      sceneObject.scale.set(s.x,s.y,s.z);
    }

    // update mesh attributes
    const mesh = getObjectByNameNonRecursive(sceneObject, "mesh");
    if (mesh) {
      if (mesh.material && instructions.updateMaterial === true) {
        const meshCol = instructions.fill;
        if (meshCol !== undefined ) {
          mesh.material = meshCol;
        }
      }
    }

    // update line attributes
    const line = getObjectByNameNonRecursive(sceneObject, "line");
    if (line) {
      if (line.material && instructions.updateMaterial === true) {
        const lineCol = instructions.stroke;
        if (lineCol !== undefined ) {
          line.material.color.set(lineCol);
        }
        const linewidth = instructions.linewidth;
        if (linewidth !== undefined ) {
          line.material.linewidth = linewidth;
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
        if (line) { line.translateZ(0.01); };
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

  }
  else {
    const group = new THREE.Group();
    group.name = name;

    if (instructions.shape !== undefined) {
      const shape = instructions.shape;
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
          const meshBasicMaterial = { color : instructions.fill };
          if (instructions.opacity !== undefined) {
            meshBasicMaterial.opacity = instructions.opacity;
          }
          const meshMat = new THREE.MeshBasicMaterial(meshBasicMaterial);
          if (instructions.opacity !== undefined) {
            meshMat.transparent = true;
          }
          meshMat.side = THREE.DoubleSide;
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
        const lineBasicMaterial = { color : instructions.stroke };
        if (instructions.lineWidth !== undefined) {
          lineBasicMaterial.linewidth = instructions.linewidth;
        }
        if (instructions.opacity !== undefined) {
          lineBasicMaterial.opacity = instructions.opacity;
        }
        const lineMat = new THREE.LineBasicMaterial(lineBasicMaterial);
        if (instructions.opacity !== undefined) {
          lineMat.transparent = true;
        }
  
        const line = new THREE.Line(lineGeometry, lineMat);
        if (instructions.fill !== undefined) {
          line.translateZ(0.01);
        }
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
};