import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
import {fg2} from "main/main";
import {makeColour} from "main/vfx/makeColour";
import {twoPi} from "main/render";
export default (posInQueue) =>{
  if (vfxQueue[posInQueue].randomTail === undefined || vfxQueue[posInQueue].randomTail === null) {
    vfxQueue[posInQueue].randomTail=[Math.random(), Math.random(), Math.random(), Math.random()];
  }
  fg2.save();
  fg2.translate((vfxQueue[posInQueue].newPos.x * activeStage.scale) + activeStage.offset[0], ((vfxQueue[posInQueue].newPos.y + 4) * -activeStage.scale) +
      activeStage.offset[1]);
  fg2.fillStyle = makeColour(Math.max(149, 251 - (vfxQueue[posInQueue].timer * 5)), Math.max(149, 187 - (vfxQueue[posInQueue].timer * 5)),
      Math.min(149, 90 + (vfxQueue[posInQueue].timer * 5)), (1 - (vfxQueue[posInQueue].timer / 15)));
  fg2.beginPath();
  fg2.arc((-2 + vfxQueue[posInQueue].randomTail[0] * 4) * activeStage.scale, (-2 + vfxQueue[posInQueue].randomTail[1] * 4) * activeStage.scale, 4 * activeStage.scale,
      0, twoPi);
  fg2.closePath();
  fg2.fill();
  fg2.fillStyle = makeColour(Math.max(149, 223 - (vfxQueue[posInQueue].timer * 5)), Math.min(149, 83 + (vfxQueue[posInQueue].timer * 5)),
      Math.min(149, 39 + (vfxQueue[posInQueue].timer * 5)), (1 - (vfxQueue[posInQueue].timer / 15)));
  fg2.beginPath();
  fg2.arc((-2 + vfxQueue[posInQueue].randomTail[2] * 4) * activeStage.scale, (-2 + vfxQueue[posInQueue].randomTail[3] * 4) * activeStage.scale, 2 * activeStage.scale,
      0, twoPi);
  fg2.closePath();
  fg2.fill();
  fg2.restore();
};