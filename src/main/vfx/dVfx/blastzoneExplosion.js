import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
import {makeColour} from "main/vfx/makeColour";
import {drawArrayPath} from "main/vfx/drawArrayPath";
import {fg2} from "main/main";
import {twoPi} from "main/render";

export default (posInQueue) => {
  fg2.save();
  fg2.translate((vfxQueue[posInQueue].newPos.x * activeStage.scale) + activeStage.offset[0], (vfxQueue[posInQueue].newPos.y * -activeStage.scale) + activeStage.offset[
          1]);
  fg2.rotate(vfxQueue[posInQueue].face * Math.PI / 180);
  let col = makeColour(149, 255, 163, 0.8 * ((vfxQueue[posInQueue].frames - vfxQueue[posInQueue].timer) / vfxQueue[posInQueue].frames));
  drawArrayPath(fg2, col, 1, 0, -200 - (20 + (100 * (vfxQueue[posInQueue].timer / 20))), vfxQueue[posInQueue].path1, 1.3, 1.3);
  if (vfxQueue[posInQueue].timer >= vfxQueue[posInQueue].svg2Active[0] && vfxQueue[posInQueue].timer <= vfxQueue[posInQueue].svg2Active[1]) {
    col = "rgb(166,223,255)";
    drawArrayPath(fg2, col, 1, 0, -90, vfxQueue[posInQueue].path2, (vfxQueue[posInQueue].svg2Scale[vfxQueue[posInQueue].timer - 1][0]) *
        1.5, (vfxQueue[posInQueue].svg2Scale[vfxQueue[posInQueue].timer - 1][1]) * 1.5);
  }
  if (vfxQueue[posInQueue].timer >= vfxQueue[posInQueue].svg3Active[0] && vfxQueue[posInQueue].timer <= vfxQueue[posInQueue].svg3Active[1]) {
    col = "rgb(255,161,161)";
    drawArrayPath(fg2, col, 1, 0, -90, vfxQueue[posInQueue].path2, (vfxQueue[posInQueue].svg3Scale[vfxQueue[posInQueue].timer - vfxQueue[
            posInQueue].svg3Active[0]][0]) * 1.5, (vfxQueue[posInQueue].svg3Scale[vfxQueue[posInQueue].timer - vfxQueue[posInQueue].svg3Active[0]]
            [1]) * 1.5);
  }
  col = makeColour(242, 255, 93, 0.8 * ((vfxQueue[posInQueue].frames - vfxQueue[posInQueue].timer) / vfxQueue[posInQueue].frames));
  drawArrayPath(fg2, col, 1, 0, 0, vfxQueue[posInQueue].path4, 1.5, 1.5);
  if (vfxQueue[posInQueue].timer < 10) {
    fg2.fillStyle = makeColour(255, 255, 255, 0.8 * ((10 - vfxQueue[posInQueue].timer) / 10));
    fg2.scale(0.5, 1);
    fg2.beginPath();
    fg2.arc(0, 0, (450 * (vfxQueue[posInQueue].timer / 10) + 170), twoPi, 0);
    fg2.fill();
    fg2.closePath();
  }
  fg2.restore();
};