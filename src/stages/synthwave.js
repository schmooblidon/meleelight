import {bg2} from "main/main";

const lines = [];
const depth = 4;
const lineCount = 25;
const hScale = 1;
const speed = 0.1;
// add z position
for (let i=0;i<lineCount;i++) {
  lines.push(i*hScale);
}

export function drawSynthWave(){
  bg2.lineWidth = 3;
  bg2.strokeStyle = "purple";
  // thick line on the horizon
  bg2.beginPath();
  bg2.moveTo(0,500);
  bg2.lineTo(1200,500);
  bg2.stroke();
  bg2.lineWidth = 2;
  // draw vertical lines
  bg2.beginPath();
  for (let i=-12;i<13;i++) {
    bg2.moveTo(600+(1200/25)*i,500);
    bg2.lineTo(600+(1200/7)*i,750);
  }
  // draw horizontal lines
  
  for (let i=0;i<lineCount;i++) {
    bg2.moveTo(0,500+Math.pow(lines[i],1.4)*depth);
    bg2.lineTo(1200,500+Math.pow(lines[i],1.4)*depth);
    lines[i] += speed;
    if (lines[i] > lineCount * hScale) {
      lines[i] = 0;
    } 
  }
  bg2.stroke();
}