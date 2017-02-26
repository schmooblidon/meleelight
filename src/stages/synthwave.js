import {bg2} from "main/main";
import {Vec2D} from "main/util/Vec2D";
import {chromaticAberration} from "main/vfx/chromaticAberration";
import {makeColour} from "main/vfx/makeColour";

const lines = [];
const depth = 2;
const lineCount = 15;
const hScale = 1;
const speed = 0.01;
// add z position
for (let i=0;i<lineCount;i++) {
  lines.push(i*hScale);
}

export function drawSynthWave() {
  const col = { r : 130, g : 30, b : 150 };
  // draw vertical lines
  chromaticAberration( bg2, (c1,c2) => drawVertLines(c1), col, col, 1, new Vec2D(0.8,0) );
  // draw horizontal lines
  chromaticAberration( bg2, (c1,c2) => drawHorizLines(c1), col, col, 1, new Vec2D(0,0.8) );
  // thick line on the horizon
  bg2.lineWidth = 5;
  bg2.strokeStyle = "#c238d4";
  bg2.beginPath();
  bg2.moveTo(0,500);
  bg2.lineTo(1200,500);
  bg2.stroke();
  bg2.lineWidth = 2;
  bg2.strokeStyle = "#dc6eec";
  bg2.stroke();
}

function drawVertLines(col) {
  bg2.lineWidth = 3;
  bg2.strokeStyle = col;
  bg2.beginPath();
  for (let i=-12;i<13;i++) {
    bg2.moveTo(600+(1200/25)*i,500);
    bg2.lineTo(600+(1200/7)*i,750);
  }
  bg2.stroke();
}

function drawHorizLines(col) {
  bg2.lineWidth = 3;
  bg2.strokeStyle = col;
  for (let i=0;i<lineCount;i++) {
    bg2.moveTo(0,500+Math.pow(lines[i],2) * depth);
    bg2.lineTo(1200,500+Math.pow(lines[i],2) * depth);
    lines[i] += speed;
    if (lines[i] > lineCount * hScale) {
      lines[i] = 0;
    } 
  }
  bg2.stroke();
}