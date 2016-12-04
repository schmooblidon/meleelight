import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
import {makeColour} from "main/vfx/makeColour";
import {drawArrayPath} from "main/vfx/drawArrayPath";
import {fg2} from "main/main";
import {twoPi} from "main/render";

export default (j) => {
  fg2.save();
  fg2.translate((vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0], (vfxQueue[j][2].y * -activeStage.scale) + activeStage.offset[
          1]);
  fg2.rotate(vfxQueue[j][3] * Math.PI / 180);
  let col = makeColour(149, 255, 163, 0.8 * ((vfxQueue[j][0].frames - vfxQueue[j][1]) / vfxQueue[j][0].frames));
  drawArrayPath(fg2, col, 1, 0, -200 - (20 + (100 * (vfxQueue[j][1] / 20))), vfxQueue[j][0].path1, 1.3, 1.3);
  if (vfxQueue[j][1] >= vfxQueue[j][0].svg2Active[0] && vfxQueue[j][1] <= vfxQueue[j][0].svg2Active[1]) {
    col = "rgb(166,223,255)";
    drawArrayPath(fg2, col, 1, 0, -90, vfxQueue[j][0].path2, (vfxQueue[j][0].svg2Scale[vfxQueue[j][1] - 1][0]) *
        1.5, (vfxQueue[j][0].svg2Scale[vfxQueue[j][1] - 1][1]) * 1.5);
  }
  if (vfxQueue[j][1] >= vfxQueue[j][0].svg3Active[0] && vfxQueue[j][1] <= vfxQueue[j][0].svg3Active[1]) {
    col = "rgb(255,161,161)";
    drawArrayPath(fg2, col, 1, 0, -90, vfxQueue[j][0].path2, (vfxQueue[j][0].svg3Scale[vfxQueue[j][1] - vfxQueue[
            j][0].svg3Active[0]][0]) * 1.5, (vfxQueue[j][0].svg3Scale[vfxQueue[j][1] - vfxQueue[j][0].svg3Active[0]]
            [1]) * 1.5);
  }
  col = makeColour(242, 255, 93, 0.8 * ((vfxQueue[j][0].frames - vfxQueue[j][1]) / vfxQueue[j][0].frames));
  drawArrayPath(fg2, col, 1, 0, 0, vfxQueue[j][0].path4, 1.5, 1.5);
  if (vfxQueue[j][1] < 10) {
    fg2.fillStyle = makeColour(255, 255, 255, 0.8 * ((10 - vfxQueue[j][1]) / 10));
    fg2.scale(0.5, 1);
    fg2.beginPath();
    fg2.arc(0, 0, (450 * (vfxQueue[j][1] / 10) + 170), twoPi, 0);
    fg2.fill();
    fg2.closePath();
  }
  fg2.restore();
};