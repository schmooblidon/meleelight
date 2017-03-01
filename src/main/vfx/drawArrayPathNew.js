import * as THREE from "three";
// drawArrayPathNew
export function drawArrayPathNew(scene, col, face, tX, tY, path, scaleX, scaleY, rotate) {
  const curve = new THREE.Shape();
  curve.moveTo(path[0][0], path[0][1]);
  let n = 0;
  for (let j = 1; j < path.length; j++) {
    if (path[j].length === 2) {
      curve.moveTo(path[j][0], path[j][1]);
    }
    else if (path[j].length === 6) {
      n++;
      curve.bezierCurveTo(path[j][0], path[j][1], path[j][2], path[j][3], path[j][4], path[j][5]);
    }
  }
  curve.closePath();
  const geometry = curve.createPointsGeometry ( 5 * n );
  const material = new THREE.LineBasicMaterial( { color : col } );
  const curveObject = new THREE.Line( geometry, material );
  curveObject.scale.set( scaleX * face, scaleY, 1);
  curveObject.rotateZ(rotate);
  curveObject.translateX(tX);
  curveObject.translateY(tY);
  scene.add(curveObject);
}