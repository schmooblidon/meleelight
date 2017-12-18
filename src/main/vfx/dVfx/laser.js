import {vfxQueue} from "main/vfx/vfxQueue";
import {fg2} from "main/main";
import {Vec2D} from "main/util/Vec2D";
import {makeColour} from "main/vfx/makeColour";
import {activeStage} from "stages/activeStage";
import {lines} from "main/vfx/lines";
import {chromaticAberration} from "main/vfx/chromaticAberration";

import {twoPi} from "main/render";
export default (posInQueue)=> {
  if (vfxQueue[posInQueue].timer === 1) {
    const n = 8 + Math.floor(6*Math.random());
    const midAngle = vfxQueue[posInQueue].face === 1 ? vfxQueue[posInQueue].facing : Math.PI - vfxQueue[posInQueue].facing;
    lines({ name : "laserSpark", color : vfxQueue[posInQueue].color1 }, vfxQueue[posInQueue].newPos, n, midAngle-0.75*Math.PI/2, midAngle+0.75*Math.PI/2, 2);
  }
  fg2.save();
  fg2.translate((vfxQueue[posInQueue].newPos.x * activeStage.scale) + activeStage.offset[0], (vfxQueue[posInQueue].newPos.y * -activeStage.scale) + activeStage.offset[
          1]);
  fg2.rotate(-vfxQueue[posInQueue].facing * vfxQueue[posInQueue].face);

  fg2.lineWidth = 3;
  if (vfxQueue[posInQueue].timer > 3) {
    const color1 = vfxQueue[posInQueue].color1;
    fg2.globalCompositeOperation = "screen";
    const t = vfxQueue[posInQueue].timer;
    drawCircle(makeColour(0, 0, color1.b, (1 - (t - 4) / 6)), t, -0.25);
    drawCircle(makeColour(0, color1.g, 0, (1 - (t - 4) / 6)), t, -0.1);
    drawCircle(makeColour(color1.r, 0, 0, (1 - (t - 4) / 6)), t, 0.05);
  }
  const color2 = vfxQueue[posInQueue].color2;
  chromaticAberration(fg2, (c1, c2) => drawEnergyLine(c1, posInQueue), color2, color2, Math.min(1, (1 - (vfxQueue[posInQueue].timer - 4) / 6)), new Vec2D ( 0.3*activeStage.scale, 0) );
  fg2.restore();
};

function drawCircle(col, t, offset) {
  fg2.strokeStyle = col;
  fg2.beginPath();
  fg2.arc(0, 0, (offset + t * 0.6) * activeStage.scale, 0, twoPi);
  fg2.closePath();
  fg2.stroke();
}

function drawEnergyLine(col, posInQueue) {
  fg2.fillStyle = col;
  fg2.beginPath();
  fg2.moveTo((-vfxQueue[posInQueue].timer * 1) * vfxQueue[posInQueue].face * activeStage.scale, (-1.6 - vfxQueue[posInQueue].timer * 1.6) * activeStage.scale);
  fg2.lineTo((-2.3 - vfxQueue[posInQueue].timer * 1) * vfxQueue[posInQueue].face * activeStage.scale, (-2.4 - vfxQueue[posInQueue].timer * 1.6) * activeStage.scale);
  fg2.lineTo((-2.3 - vfxQueue[posInQueue].timer * 1) * vfxQueue[posInQueue].face * activeStage.scale, (2.4 + vfxQueue[posInQueue].timer * 1.6) * activeStage.scale);
  fg2.lineTo((-vfxQueue[posInQueue].timer * 1) * vfxQueue[posInQueue].face * activeStage.scale, (1.6 + vfxQueue[posInQueue].timer * 1.6) * activeStage.scale);
  fg2.closePath();
  fg2.fill();
}

export function drawLaserLine ( h, t, v1, v2, v3, v4, d, col1, col2 ) {
  fg2.lineWidth = 2;
  fg2.strokeStyle = col1;
  fg2.fillStyle = col2;
  fg2.beginPath();
  fg2.moveTo(h.x, h.y);
  fg2.lineTo(h.x + v1.x * d, h.y + v1.y);
  fg2.lineTo(t.x + v2.x * d, t.y + v2.y);
  fg2.lineTo(t.x, t.y);
  fg2.lineTo(t.x + v3.x * d, t.y + v3.y);
  fg2.lineTo(h.x + v4.x * d, h.y + v4.y);
  fg2.closePath();
  fg2.fill();
  fg2.stroke();
}