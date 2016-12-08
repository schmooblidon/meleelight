export function drawArrayPathNew(can, col, face, tX, tY, path, scaleX, scaleY, rotate, rpX, rpY) {
  can.save();
  can.translate(tX - rpX, tY - rpY);
  can.rotate(rotate);
  for (let j = 0; j < path.length; j++) {
    const x = (path[j][0] * scaleX * face) + rpX;
    const y = (path[j][1] * scaleY) + rpY;
    if (j === 0) {
      can.fillStyle = col;
      can.beginPath();
      can.moveTo(x, y);
    } else {
      if (path[j].length === 2) {
        can.moveTo(x, y);
      } else {
        can.bezierCurveTo(x, y, (path[j][2] * scaleX * face) + rpX, (path[j][3] * scaleY) + rpY, (path[j][4] * scaleX *
            face) + rpX, (path[j][5] * scaleY) + rpY);
      }
    }
  }
  can.closePath();
  can.fill();
  can.restore();
}