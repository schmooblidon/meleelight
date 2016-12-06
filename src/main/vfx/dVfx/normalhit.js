import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
import {makeColour} from "main/vfx/makeColour";
import {fg2} from "main/main";
import {twoPi} from "main/render";
import {drawArrayPath} from "main/vfx/drawArrayPath";
import vfx from "main/vfx/vfxData/index";
export default(j) =>{
  fg2.save();
  fg2.translate((vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0], (vfxQueue[j][2].y * -activeStage.scale) + activeStage.offset[
          1]);
  switch (vfxQueue[j][1]) {
    case 1:
      fg2.fillStyle = makeColour(255, 188, 14, 0.62);
      fg2.beginPath();
      fg2.arc(0, 0, 20, 0, twoPi);
      fg2.closePath();
      fg2.fill();
      fg2.beginPath();
      fg2.moveTo(0, 30);
      fg2.lineTo(5, 5);
      fg2.lineTo(30, 0);
      fg2.lineTo(5, -5);
      fg2.lineTo(0, -30);
      fg2.lineTo(-5, -5);
      fg2.lineTo(-30, 0);
      fg2.lineTo(-5, 5);
      fg2.closePath();
      fg2.fill();
      break;
    case 2:
      drawArrayPath(fg2, "rgb(255,61,61)", vfxQueue[j][3], 0, 0, vfx.normalhit.path1, 0.2 * (activeStage.scale / 4.5),
          0.2 * (activeStage.scale / 4.5));
      break;
    case 3:
      drawArrayPath(fg2, "rgb(150, 208, 255)", vfxQueue[j][3], 0, 0, vfx.normalhit.path2, 0.2 * (activeStage.scale /
          4.5), 0.2 * (activeStage.scale / 4.5));
      break;
    case 4:
    case 5:
    case 6:
    case 7:
      for (let n = 0; n < vfx.normalhit.path3.length; n++) {
        drawArrayPath(fg2, makeColour(120, 255, 99, 4 / vfxQueue[j][1]), vfxQueue[j][3], 0, 0, vfx.normalhit.path3[
            n], 0.2 * (vfxQueue[j][1] / 7) * (activeStage.scale / 4.5), 0.2 * (vfxQueue[j][1] / 7) * (activeStage.scale /
            4.5));
      }
      break;
    default:
      break;
  }
  fg2.restore();
};