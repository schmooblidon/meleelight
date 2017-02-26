import {bg2} from "main/main";
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