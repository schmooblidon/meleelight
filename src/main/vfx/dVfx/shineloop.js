import {vfxQueue} from "main/vfx/vfxQueue";
import {player, fg2} from "main/main";
import {drawHexagon} from "main/vfx/drawHexagon";
import {activeStage} from "stages/activeStage";
export default(j) =>{
  fg2.save();
  let part = Math.round(vfxQueue[j][1] / 2);
  const tX = (player[vfxQueue[j][3]].phys.pos.x * activeStage.scale) + activeStage.offset[0];
  const tY = ((player[vfxQueue[j][3]].phys.pos.y + 6) * -activeStage.scale) + activeStage.offset[1];
  part = Math.round(player[vfxQueue[j][3]].shineLoop / 2);
  fg2.fillStyle = "rgb(143, 228, 255)";
  if (part === 1) {
    drawHexagon(4 * activeStage.scale, tX, tY, 14);
  } else if (part === 2) {
    drawHexagon(6 * activeStage.scale, tX, tY, 14);
  } else if (part === 3) {
    drawHexagon(8 * activeStage.scale, tX, tY, 14);
  } else {
    console.log(vfxQueue[j][3]);
  }
  fg2.restore();
};