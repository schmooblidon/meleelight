import {drawVfx} from "main/vfx/drawVfx";
import {drawArrayPath} from "main/vfx/drawArrayPath";
import {makeColour} from "main/vfx/makeColour";
import vfx from "main/vfx/vfxData/index";
import {activeStage} from "stages/activeStage";
import {vfxQueue} from "main/vfx/vfxQueue";
import {fg2} from "main/main";
import {twoPi} from "main/render";
import {Vec2D} from "../../util/Vec2D";
export default (posInQueue) =>{
  fg2.save();
  fg2.translate((vfxQueue[posInQueue].newPos.x * activeStage.scale) + activeStage.offset[0], (vfxQueue[posInQueue].newPos.y * -activeStage.scale) + activeStage.offset[
          1]);
  switch (vfxQueue[posInQueue].timer) {
    case 1:
    case 2:
      fg2.fillStyle = makeColour(255, 255, 255, 0.62);
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
      for (let n = 0; n < vfx.normalhit.path3.length; n++) {
        drawArrayPath(fg2, makeColour(255, 164, 56, 0.8), vfxQueue[posInQueue].face, 0, 0, vfx.normalhit.path3[n], 0.15 * (
            activeStage.scale / 4.5), 0.15 * (activeStage.scale / 4.5));
      }
      break;
    case 3:
      for (let m = 0; m < vfx.normalhit.path3.length; m++) {
        drawArrayPath(fg2, makeColour(255, 164, 56, 0.8), vfxQueue[posInQueue].face, 0, 0, vfx.normalhit.path3[m], 0.2 * (
            vfxQueue[posInQueue].timer / 7) * (activeStage.scale / 4.5), 0.2 * (vfxQueue[posInQueue].timer / 7) * (activeStage.scale / 4.5));
      }
      break;
    case 4:
    case 5:
    case 6:
    case 7:
      for (let k = 0; k < vfx.normalhit.path3.length; k++) {
        drawArrayPath(fg2, makeColour(255, 227, 79, 4 / vfxQueue[posInQueue].timer), vfxQueue[posInQueue].face, 0, 0, vfx.normalhit.path3[
            k], 0.1 * (vfxQueue[posInQueue].timer / 7) * (activeStage.scale / 4.5), 0.1 * (vfxQueue[posInQueue].timer / 7) * (activeStage.scale /
            4.5));
      }
      break;
    default:
      break;
  }
  drawVfx({
    name: "fireburst",
    pos: new Vec2D(-10 + 20 * Math.random() + vfxQueue[posInQueue].newPos.x, -10 + 20 * Math.random() + vfxQueue[
            posInQueue][2].y),
    face: 8
  });
  fg2.restore();
};