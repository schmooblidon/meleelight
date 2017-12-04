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
  fg2.globalCompositeOperation = "screen";
  if (part === 1) {
    fg2.fillStyle = "rgb(0, 0, 229)";
    drawHexagon(3.5 * activeStage.scale, tX, tY, 7);
    fg2.fillStyle = "rgb(0, 189, 0)";
    drawHexagon(4 * activeStage.scale, tX, tY, 7);
    fg2.fillStyle = "rgb(52, 0, 0)";
    drawHexagon(4.5 * activeStage.scale, tX, tY, 7);
  } else if (part === 2) {
    fg2.fillStyle = "rgb(0, 0, 229)";
    drawHexagon(5.5 * activeStage.scale, tX, tY, 11);
    fg2.fillStyle = "rgb(0, 189, 0)";
    drawHexagon(6 * activeStage.scale, tX, tY, 11);
    fg2.fillStyle = "rgb(52, 0, 0)";
    drawHexagon(6.5 * activeStage.scale, tX, tY, 11);
  } else if (part === 3) {
    fg2.fillStyle = "rgb(0, 0, 229)";
    drawHexagon(7.5 * activeStage.scale, tX, tY, 15);
    fg2.fillStyle = "rgb(0, 189, 0)";
    drawHexagon(8 * activeStage.scale, tX, tY, 15);
    fg2.fillStyle = "rgb(52, 0, 0)";
    drawHexagon(8.5 * activeStage.scale, tX, tY, 15);
  } else {
    console.log(vfxQueue[posInQueue].face);
  }
  fg2.restore();
};