import {vfxQueue} from "main/vfx/vfxQueue";
import {drawArrayPath} from "main/vfx/drawArrayPath";
import {fg2} from "main/main";
import {activeStage} from "stages/activeStage";
import {drawVfx} from "main/vfx/drawVfx";
import vfx from "main/vfx/vfxData/index";
import {Vec2D} from "../../util/Vec2D";
export default(j) => {
  if (vfxQueue[j][1] === 1) {
    drawArrayPath(fg2, "rgb(253,255,161)", vfxQueue[j][3], (vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0], ((
        vfxQueue[j][2].y + 7) * -activeStage.scale) + activeStage.offset[1], vfx.normalhit.path2, 0.2 * (activeStage.scale / 4.5),
        0.2 * (activeStage.scale / 4.5));
  }
  drawVfx("fireburst", new Vec2D(-10 + 20 * Math.random() + vfxQueue[j][2].x, -10 + 20 * Math.random() + vfxQueue[
          j][2].y), 6);
  drawVfx("burncircle", new Vec2D(-10 + 20 * Math.random() + vfxQueue[j][2].x, -10 + 20 * Math.random() +
      vfxQueue[j][2].y), 1);
};