import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
import {makeColour} from "main/vfx/makeColour";
import {fg2} from "main/main";
import {twoPi} from "main/render";
import {Vec2D} from "../../util/Vec2D";
export default (j) => {
  fg2.save();
  fg2.translate((vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0], (vfxQueue[j][2].y * -activeStage.scale) + activeStage.offset[
          1]);
  let ellipseOffset = 0;
  let anglePos = vfxQueue[j][1] * Math.PI / 32;
  for (let i = 0; i < 8; i++) {
    const seed = Math.random() - 0.5;
    ellipseOffset = new Vec2D(35 * Math.cos(anglePos), 35 * Math.sin(anglePos) * 0.4);
    const pillarGrad = fg2.createLinearGradient(0, 0, 0, -vfxQueue[j][1] * 2 - seed * 60);
    pillarGrad.addColorStop(0, makeColour(255, 255, 255, 0.3));
    pillarGrad.addColorStop(0.5, makeColour(255, 255, 255, 0.3));
    pillarGrad.addColorStop(1, makeColour(255, 255, 255, 0));
    fg2.fillStyle = pillarGrad;
    fg2.fillRect(ellipseOffset.x, ellipseOffset.y - (vfxQueue[j][1] * 2 + seed * 60), 10 * (activeStage.scale / 4.5), (
        vfxQueue[j][1] * 2 + seed * 60) * (activeStage.scale / 4.5));
    anglePos += Math.PI / 4;
  }
  fg2.fillStyle = makeColour(163, 255, 203, 0.3);
  fg2.fillRect(-35, -(vfxQueue[j][1] % 15) * 5, 80 * (activeStage.scale / 4.5), 15 * (activeStage.scale / 4.5));
  fg2.restore();
  fg2.save();
  fg2.translate((vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0], (vfxQueue[j][2].y * -activeStage.scale) + activeStage.offset[
          1]);
  fg2.strokeStyle = makeColour(255, 149, 149, 0.8);
  fg2.lineWidth = 8;
  fg2.scale(0.8 + (Math.random() * 0.3), 0.2 + (0.2 * Math.random()));
  fg2.beginPath();
  fg2.arc(5, -vfxQueue[j][1] * 3, (35 + (vfxQueue[j][1] % 2) * 10) * (activeStage.scale / 4.5), 0, twoPi);
  fg2.closePath();
  fg2.stroke();
  fg2.restore();
};