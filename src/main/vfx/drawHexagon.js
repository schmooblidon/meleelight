import {fg2} from 'main/main';
export function drawHexagon(r, tX, tY, width) {
  fg2.save();
  fg2.translate(tX, tY);
  let a = r * Math.sin(Math.PI / 6);
  let b = r * Math.cos(Math.PI / 6);
  fg2.beginPath();
  fg2.moveTo(0, r);
  fg2.lineTo(b, r - a);
  fg2.lineTo(b, -r + a);
  fg2.lineTo(0, -r);
  fg2.lineTo(-b, -r + a);
  fg2.lineTo(-b, r - a);
  fg2.lineTo(0, r);
  const rs = r - width;
  a = rs * Math.sin(Math.PI / 6);
  b = rs * Math.cos(Math.PI / 6);
  fg2.moveTo(0, rs);
  fg2.lineTo(-b, rs - a);
  fg2.lineTo(-b, -rs + a);
  fg2.lineTo(0, -rs);
  fg2.lineTo(b, -rs + a);
  fg2.lineTo(b, rs - a);
  fg2.lineTo(0, rs);
  fg2.closePath();
  fg2.fill();
  fg2.restore();
}