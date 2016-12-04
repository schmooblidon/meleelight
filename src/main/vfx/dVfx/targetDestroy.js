import {makeColour} from "main/vfx/makeColour";
import {fg2} from "main/main";
import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
import {twoPi} from "main/render";
export default(j)=> {
  fg2.save();
  const col = makeColour(255, 255, 255, 0.8);
  fg2.fillStyle = col;
  fg2.strokeStyle = col;
  fg2.lineWidth = 3;
  fg2.translate((vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0], (vfxQueue[j][2].y * -activeStage.scale) + activeStage.offset[
          1]);
  fg2.beginPath();
  fg2.arc(0, 0, vfxQueue[j][1] * 2, 0, twoPi);
  fg2.closePath;
  fg2.stroke();
  fg2.scale((activeStage.scale / 4.5), (activeStage.scale / 4.5));
  for (let i = 0; i < 6; i++) {
    fg2.rotate(Math.PI / 3);
    fg2.beginPath();
    fg2.moveTo(0, -14 - vfxQueue[j][1] * 2);
    fg2.lineTo(6, -22 - vfxQueue[j][1] * 2);
    fg2.lineTo(0, -40 - vfxQueue[j][1] * 2);
    fg2.lineTo(-6, -22 - vfxQueue[j][1] * 2);
    fg2.closePath();
    fg2.fill();
  }
  fg2.restore();
};