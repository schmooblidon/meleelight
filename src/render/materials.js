import * as THREE from "three";

export const meshBasicMaterial  = new THREE.MeshBasicMaterial( { color : 0xff00ff, opacity : 0, side : THREE.DoubleSide } );
export const meshBasicMaterialT = new THREE.MeshBasicMaterial( { color : 0xff00ff, opacity : 0, side : THREE.DoubleSide, transparent : true} );
export const lineBasicMaterial  = new THREE.LineBasicMaterial( { color : 0xff00ff, linewidth : 1 } );
export const lineBasicMaterialT = new THREE.LineBasicMaterial( { color : 0xff00ff, linewidth : 1, transparent : true } );