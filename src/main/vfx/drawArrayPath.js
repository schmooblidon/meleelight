export function drawArrayPath(can, col, face, tX, tY, path, scaleX, scaleY) {
  for (let j = 0; j < path.length; j++) {
    const x = (path[j][0] * scaleX * face) + tX;
    const y = (path[j][1] * scaleY) + tY;
    if (j === 0) {
      can.fillStyle = col;
      can.beginPath();
      can.moveTo(x, y);
    } else {
      can.lineTo(x, y);
    }
  }
  can.closePath();
  can.fill();
}