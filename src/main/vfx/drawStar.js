import {fg2} from 'main/main';

export function drawStar(tX, tY, rMin, rMax, m = 4, theta = 0) {
  const n = 2*m;
  fg2.save();
  fg2.translate(tX, tY);
  fg2.beginPath();
  fg2.moveTo(rMax * Math.cos(theta), rMax * Math.sin(theta));
  for (let i = 1; i<n+1; i++) {
    if (i % 2 === 0) {
      fg2.lineTo(rMax * Math.cos(2*Math.PI*i/n + theta), rMax * Math.sin(2*Math.PI*i/n + theta));
    }
    else {
      fg2.lineTo(rMin * Math.cos(2*Math.PI*i/n + theta), rMin * Math.sin(2*Math.PI*i/n + theta));
    }
  }
  fg2.closePath();
  fg2.fill();
  fg2.restore();
}
