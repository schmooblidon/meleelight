import {vfxQueue} from "main/vfx/vfxQueue";
import {player, fg2} from "main/main";
import {drawHexagon} from "main/vfx/drawHexagon";
import {activeStage} from "stages/activeStage";
export default (posInQueue) =>{
  fg2.save();
  let part = Math.round(vfxQueue[posInQueue].timer / 2);
  const tX = (player[vfxQueue[posInQueue].face].phys.pos.x * activeStage.scale) + activeStage.offset[0];
  const tY = ((player[vfxQueue[posInQueue].face].phys.pos.y + 6) * -activeStage.scale) + activeStage.offset[1];
  part = Math.round(player[vfxQueue[posInQueue].face].shineLoop / 2);
  fg2.fillStyle = "rgba(52, 189, 229, 0.92)";
  if (part === 1) {
    drawHexagon(4 * activeStage.scale, tX, tY, 8);
  } else if (part === 2) {
    drawHexagon(6 * activeStage.scale, tX, tY, 12);
  } else if (part === 3) {
    drawHexagon(8 * activeStage.scale, tX, tY, 16);
  } else {
    console.log(vfxQueue[posInQueue].face);
  }
  fg2.restore();
};