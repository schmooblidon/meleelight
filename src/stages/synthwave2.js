import {bg1,bg2} from "main/main";
import {Vec2D} from "main/util/Vec2D";
import {chromaticAberration} from "main/vfx/chromaticAberration";
import {makeColour} from "main/vfx/makeColour";

const lines = [];
const hScale = 1;
const lineCount = 40;
const height = 400;
const heightOffset = 100;
const speed = -0.03;
const focal = 1;

const offset = - height + height * lineCount * hScale / (focal + lineCount * hScale);

// add z position
for (let i=0;i<lineCount;i++) {
  lines.push(i*hScale);
}

export function drawSynthWaveInit() {
  bg1.fillStyle = "black";
  bg1.fillRect(0,0,1200,750);
  // stars
  bg1.fillStyle = "rgba(255,255,255,0.6)";
  for (let i=0;i<300;i++) {
    bg1.beginPath();
    bg1.arc(1200*Math.random(), 500*Math.random(), Math.random()*Math.random()*2, 0, Math.PI*2);
    bg1.closePath();
    bg1.fill();
  }
  // gradient
  const bgGrad = bg1.createLinearGradient(0, 0, 1200, 0);
  bgGrad.addColorStop(0, "rgba(242, 76, 166,0.3)");
  bgGrad.addColorStop(0.5, "rgba(0,0,0,0)");
  bgGrad.addColorStop(1, "rgba(66, 88, 255, 0.3)");
  bg1.fillStyle = bgGrad;
  bg1.fillRect(0,0,1200,750);
  // sun
  // set dimensions
  const top = 30;
  const topLine = top+20;
  const radius = 70;
  // make glow
  const sunGlow = bg1.createRadialGradient(600,top+radius,radius,600,top+radius,radius+60);
  sunGlow.addColorStop(0, "rgba(232, 76, 110, 0.3)");
  sunGlow.addColorStop(1, "rgba(142, 67, 168, 0)");
  bg1.fillStyle = sunGlow;
  bg1.fillRect(0,0,1200,750);
  const sunGrad = bg1.createLinearGradient(0, top, 0, top+radius*2);
  sunGrad.addColorStop(0, "rgba(250, 227, 59, 0.6)");
  sunGrad.addColorStop(0.5, "rgba(250, 97, 96, 0.6)");
  sunGrad.addColorStop(0.75, "rgba(250, 52, 104, 0.6)");
  sunGrad.addColorStop(1, "rgba(250, 60, 134, 0.6)");
  bg1.fillStyle = sunGrad;
  // creating clipping path
  const lineSeperation = 20;
  const thickness = 2;
  bg1.save();
  bg1.beginPath();
  bg1.moveTo(0,0);
  bg1.lineTo(1200,0);
  bg1.lineTo(1200,topLine);
  bg1.lineTo(0,topLine);
  for (let i=0;i<7;i++) {  
    bg1.moveTo(0,topLine+i*lineSeperation+i*thickness);
    bg1.lineTo(1200,topLine+i*lineSeperation+i*thickness);
    bg1.lineTo(1200,topLine+(i+1)*lineSeperation);
    bg1.lineTo(0,topLine+(i+1)*lineSeperation);
  }
  bg1.clip();
  // draw sun
  bg1.beginPath();
  bg1.arc(600,top+radius,radius,0,Math.PI*2);
  bg1.closePath();
  bg1.fill();
  bg1.restore();
}

export function drawSynthWave() {
  const col = { r : 130, g : 30, b : 150 };
  // draw vertical lines
  chromaticAberration( bg2, (c1,c2) => drawVertLines(c1), col, col, 1, new Vec2D(1.3,0) );
  // draw horizontal lines
  chromaticAberration( bg2, (c1,c2) => drawHorizLines(c1), col, col, 1, new Vec2D(0,1.3) );
  // thick line on the horizon, at y-coordinate height + heightOffset;
  bg2.lineWidth = 5;
  bg2.strokeStyle = "#c238d4";
  const y = height + heightOffset;
  bg2.beginPath();
  bg2.moveTo(0,y);
  bg2.lineTo(1200,y);
  bg2.stroke();
  bg2.lineWidth = 2;
  bg2.strokeStyle = "#dc6eec";
  bg2.stroke();
  // move lines for the next frame
  for (let i=0;i<lineCount;i++) {
    lines[i] += speed;
    if (lines[i] < 0) {
      lines[i] = lineCount * hScale;
    }
    else if (lines[i] > lineCount * hScale) {
      lines[i] = 0;
    }
  }
}

function drawVertLines(col) {
  const y = height + heightOffset;
  bg2.lineWidth = 3;
  bg2.strokeStyle = col;
  bg2.beginPath();
  for (let i=-12;i<13;i++) {
    bg2.moveTo(600+(1200/25)*i,y);
    bg2.lineTo(600+(1200/7)*i,750);
  }
  bg2.stroke();
}

function drawHorizLines(col) {
  bg2.lineWidth = 3;
  bg2.strokeStyle = col;
  for (let i=0;i<lineCount;i++) {
    const y = projectedYCoord(lines[i]) ;
    bg2.moveTo(0   , y);
    bg2.lineTo(1200, y);
  }
  bg2.stroke();
}

function projectedYCoord ( y ) {
  return heightOffset + offset + 2 * height - height * y / (focal + y);
}