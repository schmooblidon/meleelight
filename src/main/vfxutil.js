export let transparency = true;

export function getTransparency(){
  return transparency;
}
export function toggleTransparency(){
  transparency = !transparency;
}

export function makeColour(r, g, b, a) {
  // maybe some hsl too
  if (transparency) {
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  }
  else {
    return "rgb(" + r + "," + g + "," + b + ")";
  }
}

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