import {vfxQueue} from "main/vfx/vfxQueue";
import {fg2} from "main/main";
import {makeColour} from "main/vfx/makeColour";
import {activeStage} from "stages/activeStage";
import {twoPi} from "main/render";
export default (posInQueue)=> {
  fg2.save();
  fg2.translate((vfxQueue[posInQueue].newPos.x * activeStage.scale) + activeStage.offset[0], (vfxQueue[posInQueue].newPos.y * -activeStage.scale) + activeStage.offset[
          1]);
  fg2.rotate(-vfxQueue[posInQueue].facing * vfxQueue[posInQueue].face);

  fg2.lineWidth = 3;
  if (vfxQueue[posInQueue].timer > 3) {
    const color1 = vfxQueue[posInQueue].color1;
    fg2.strokeStyle = makeColour(color1.r, color1.g, color1.b, (1 - (vfxQueue[posInQueue].timer - 4) / 6));
    fg2.beginPath();
    fg2.arc(0, 0, (-0.1 + vfxQueue[posInQueue].timer * 0.6) * activeStage.scale, 0, twoPi);
    fg2.closePath();
    fg2.stroke();
  }
  const color2 = vfxQueue[posInQueue].color2;
  fg2.fillStyle = makeColour(color2.r, color2.g, color2.b, Math.min(1, (1 - (vfxQueue[posInQueue].timer - 4) / 6)));
  fg2.beginPath();
  fg2.moveTo((-vfxQueue[posInQueue].timer * 1) * vfxQueue[posInQueue].face * activeStage.scale, (-1.6 - vfxQueue[posInQueue].timer * 1.6) * activeStage.scale);
  fg2.lineTo((-2.3 - vfxQueue[posInQueue].timer * 1) * vfxQueue[posInQueue].face * activeStage.scale, (-2.4 - vfxQueue[posInQueue].timer * 1.6) * activeStage.scale);
  fg2.lineTo((-2.3 - vfxQueue[posInQueue].timer * 1) * vfxQueue[posInQueue].face * activeStage.scale, (2.4 + vfxQueue[posInQueue].timer * 1.6) * activeStage.scale);
  fg2.lineTo((-vfxQueue[posInQueue].timer * 1) * vfxQueue[posInQueue].face * activeStage.scale, (1.6 + vfxQueue[posInQueue].timer * 1.6) * activeStage.scale);
  fg2.closePath();
  fg2.fill();
  fg2.restore();
};