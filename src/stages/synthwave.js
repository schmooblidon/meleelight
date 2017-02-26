import {bg2} from "main/main";

const lines = [];
// add z position
for (let i=0;i<25;i++) {
  lines.push(i);
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
  for (let i=0;i<25;i++) {
    bg2.moveTo(0,500+(lines[i]*lines[i])/2);
    bg2.lineTo(1200,500+(lines[i]*lines[i])/2);
    lines[i] += 0.1;
    if (lines[i] > 25) {
      lines[i] = 0;
    } 
  }
  bg2.stroke();
}