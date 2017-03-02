import * as THREE from 'three';
import { MeshText2D, textAlign } from 'three-text2d';

export function clearScene(scene){
  while (scene.children.length > 0) {
    let child = scene.children[0];
    scene.remove(child);
    if (child.geometry) {
      child.geometry.dispose();
    }
    /*
    if (child.material) {
      child.material.dispose();
    }
    if (child.texture) {
      child.texture.dispose();
    } */
    child = undefined;
  }
}

export function fillBackground(scene,color){
  scene.background = new THREE.Color( color );
}

export function addTexttoScene(scene,text,x,y,layer,config){
  if(config === null || config === undefined){
    const text = new MeshText2D(text,config);
    text.position.set(x,y,layer);
    scene.add(text);
  }else {
    const text = new MeshText2D(text, {
      align: textAlign.center,
      font: '25px Arial',
      fillStyle: '#000000',
      antialias: true
    });
    text.position.set(x,y,layer);
    scene.add(text);
  }
}

export function addImageToScene(scene,image,x,y) {
  const loader = new THREE.TextureLoader();
  // load a resource
  loader.load(
    // resource URL
    image.src,
    // Function when resource is loaded
    ( texture ) => {
      // do something with the texture
      const material = new THREE.MeshBasicMaterial( {
        map: texture
      } );
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(x, y),material);
      plane.overdraw = true;
      scene.add(plane);
    },
    // Function called when download progresses
    ( xhr ) => {
      console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    },
    // Function called when download errors
    ( xhr ) => {
      console.log( 'An error happened' );
    }
  );
  // plane

}