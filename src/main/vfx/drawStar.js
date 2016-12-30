import {fg2 as fg3} from 'main/main';

export function drawStar(tX, tY, rMin, rMax, m = 4, theta = 0, col) {
  const n = 2*m;
  fg3.save();
  fg3.translate(tX, tY);
  fg3.beginPath();
  fg3.moveTo(rMax * Math.cos(theta), rMax * Math.sin(theta));
  for (let i = 1; i<n+1; i++) {
    if (i % 2 === 0) {
      fg3.lineTo(rMax * Math.cos(2*Math.PI*i/n + theta), rMax * Math.sin(2*Math.PI*i/n + theta));
    }
    else {
      fg3.lineTo(rMin * Math.cos(2*Math.PI*i/n + theta), rMin * Math.sin(2*Math.PI*i/n + theta));
    }
  }
  fg3.closePath();
  fg3.fillStyle = col;
  fg3.fill();
  fg3.restore();
}
