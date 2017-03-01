import * as THREE from "three";
// drawArrayPath
export function drawArrayPath(scene, col, face, tx, tY, path, scaleX, scaleY) {
  const lg = path.length;
  if (lg > 1) {
    const curve = new THREE.Shape();
    curve.moveTo(path[0], path[1]);
    for (let k = 2; k < lg - 1; k += 2) {
      curve.lineTo(path[k], path[k+1]);
    }
    curve.closePath();
    const geometry = curve.createPointsGeometry ( 12 );
    const material = new THREE.LineBasicMaterial( { color : col } );
    const curveObject = new THREE.Line( geometry, material );
    curveObject.scale.set( scaleX * face, scaleY, 1);
    curveObject.translateOnAxis( new THREE.Vector3(1,0,0),  tx);
    curveObject.translateOnAxis( new THREE.Vector3(0,1,0),  tY);
    scene.add(curveObject);
  }
}
