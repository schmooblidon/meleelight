import {vfxQueue} from "main/vfx/vfxQueue";
import {makeColour} from "main/vfx/makeColour";
import {fg2} from "main/main";
import {drawHexagon} from "main/vfx/drawHexagon";
import {activeStage} from "stages/activeStage";
import {stars} from "main/vfx/stars";

const blue = "rgba(52, 189, 229, 0.82)";
const lightBlue = "rgba(196, 252, 254, 0.82)";
const white =  "rgba(235, 250, 255, 0.9)";

export default(j) =>{
  fg2.save();
  const tX = (vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0];
  const tY = (vfxQueue[j][2].y * -activeStage.scale) + activeStage.offset[1];
  let r;
  let a;
  let b;

  const starShapeMin = 0.3 * activeStage.scale;
  const starShapeMax = 1.1 * activeStage.scale;
  const starSides = 4;
  const starAngle = 0;
  const starCount = 12;

  if (vfxQueue[j][1] === 1) {
    fg2.fillStyle = lightBlue;
    drawHexagon(5.1 * activeStage.scale, tX, tY, 10);
    fg2.fillStyle = white;
    drawHexagon(6 * activeStage.scale, tX, tY, 5);
    r = 5.1 * activeStage.scale;
    a = r * Math.sin(Math.PI / 6);
    b = r * Math.cos(Math.PI / 6);
    fg2.translate(tX, tY);
    fg2.beginPath();
    fg2.moveTo(0, r);
    fg2.lineTo(b, r - a);
    fg2.lineTo(b, -r + a);
    fg2.lineTo(0, -r);
    fg2.closePath();
    fg2.fill();
    stars(0, 0, starShapeMin, starShapeMax, starSides, starAngle, starCount, 1 * activeStage.scale, 7.5 * activeStage.scale );
  } else if (vfxQueue[j][1] === 2) {
    fg2.fillStyle = lightBlue;
    drawHexagon(6.6 * activeStage.scale, tX, tY, 10);
    fg2.fillStyle = white;
    drawHexagon(7.5 * activeStage.scale, tX, tY, 5);
    fg2.translate(tX, tY);
    r = 6.6 * activeStage.scale;
    a = r * Math.sin(Math.PI / 6);
    b = r * Math.cos(Math.PI / 6);
    fg2.beginPath();
    fg2.moveTo(-b, r - a);
    fg2.lineTo(0, r);
    fg2.lineTo(b, r - a);
    fg2.lineTo(b, -r + a);
    fg2.closePath();
    fg2.fill();
    stars(0, 0, starShapeMin, starShapeMax, starSides, starAngle, starCount, 4 * activeStage.scale, 9 * activeStage.scale );
  } else {
    fg2.fillStyle = lightBlue;
    drawHexagon(8.1 * activeStage.scale, tX, tY, 10);
    fg2.fillStyle = white;
    drawHexagon(9 * activeStage.scale, tX, tY, 5);
    fg2.translate(tX, tY);
    r = 8.1 * activeStage.scale;
    a = r * Math.sin(Math.PI / 6);
    b = r * Math.cos(Math.PI / 6);
    fg2.beginPath();
    fg2.moveTo(-b, -r + a);
    fg2.lineTo(-b, r - a);
    fg2.lineTo(0, r);
    fg2.lineTo(b, r - a);
    fg2.closePath();
    fg2.fill();
    stars(0, 0, starShapeMin, starShapeMax, starSides, starAngle, starCount, 5 * activeStage.scale, 10 * activeStage.scale );
  }
  fg2.restore();
};