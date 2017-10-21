import {fg2} from "main/main";
import {makeColour} from "main/vfx/makeColour";
import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
export default (posInQueue)=> {
  fg2.save();
  fg2.strokeStyle = makeColour(251, 246, 119, (0.3 * ((vfxQueue[posInQueue].frames - vfxQueue[posInQueue].timer) / vfxQueue[posInQueue].frames) +
  0.7));
  fg2.fillStyle = makeColour(255, 116, 92, (0.3 * ((vfxQueue[posInQueue].frames - vfxQueue[posInQueue].timer) / vfxQueue[posInQueue].frames) +
  0.7));
  fg2.translate((vfxQueue[posInQueue].newPos.x * activeStage.scale) + activeStage.offset[0], (vfxQueue[posInQueue].newPos.y * -activeStage.scale) + activeStage.offset[
          1]);
  fg2.lineWidth = 3;
  fg2.scale(Math.min(0.2 * vfxQueue[posInQueue].timer, 1), Math.min(0.2 * vfxQueue[posInQueue].timer, 1));
  fg2.rotate(vfxQueue[posInQueue].timer * Math.PI / 8);
  for (let i = 0; i < 4; i++) {
    fg2.scale(0.7 + Math.random() * 0.6, 0.7 + Math.random() * 0.6);
    fg2.rotate(i * Math.PI / 2);
    fg2.beginPath();
    fg2.arc(0, 0, 10 * (activeStage.scale / 4.5), 1.35 * Math.PI, 1.65 * Math.PI);
    fg2.closePath();
    fg2.stroke();
    fg2.beginPath();
    fg2.arc(0, 0, 15 * (activeStage.scale / 4.5), 1.35 * Math.PI, 1.65 * Math.PI);
    fg2.closePath();
    fg2.stroke();
    fg2.beginPath();
    fg2.arc(0, 0, 20 * (activeStage.scale / 4.5), 1.35 * Math.PI, 1.65 * Math.PI);
    fg2.closePath();
    fg2.stroke();
    fg2.beginPath();
    fg2.arc(0, 0, 23 * (activeStage.scale / 4.5), 1.35 * Math.PI, 1.65 * Math.PI);
    fg2.closePath();
    fg2.fill();
  }
  fg2.restore();
};