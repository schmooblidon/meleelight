import {vfxQueue} from "main/vfx/vfxQueue";
import {drawArrayPath} from "main/vfx/drawArrayPath";
import {fg2} from "main/main";
import {activeStage} from "stages/activeStage";
import {drawVfx} from "main/vfx/drawVfx";
import vfx from "main/vfx/vfxData/index";
import {Vec2D} from "../../util/Vec2D";
export default (posInQueue) => {
  if (vfxQueue[posInQueue].timer === 1) {
    drawArrayPath(fg2, "rgb(253,255,161)", vfxQueue[posInQueue].face, (vfxQueue[posInQueue].newPos.x * activeStage.scale) + activeStage.offset[0], ((
        vfxQueue[posInQueue].newPos.y + 7) * -activeStage.scale) + activeStage.offset[1], vfx.normalhit.path2, 0.2 * (activeStage.scale / 4.5),
        0.2 * (activeStage.scale / 4.5));
  }
  drawVfx({
    name: "fireburst",
    pos: new Vec2D(-10 + 20 * Math.random() + vfxQueue[posInQueue].newPos.x, -10 + 20 * Math.random() + vfxQueue[
            posInQueue].y),
    face: 6
  });
  drawVfx({
    name: "burncircle",
    pos: new Vec2D(-10 + 20 * Math.random() + vfxQueue[posInQueue].newPos.x, -10 + 20 * Math.random() +
        vfxQueue[posInQueue].newPos.y),
    face: 1
  });
};