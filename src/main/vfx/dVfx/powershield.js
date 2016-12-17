import {vfxQueue} from "main/vfx/vfxQueue";
import {fg2} from "main/main";
import {makeColour} from "main/vfx/makeColour";
import {activeStage} from "stages/activeStage";
export default(j)=> {
  if (vfxQueue[j][1] % 2) {
    fg2.save();
    fg2.fillStyle = makeColour(255, 255, 255, 0.3);
    fg2.translate((vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0], (vfxQueue[j][2].y * -activeStage.scale) + activeStage.offset[
            1]);
    const seed = (Math.random() + 1.5) * (activeStage.scale / 4.5);
    fg2.scale(seed, seed);
    for (let i = 0; i < 6; i++) {
      fg2.rotate(Math.PI / 3);
      fg2.beginPath();
      fg2.moveTo(0, -15);
      fg2.lineTo(6, -23);
      fg2.lineTo(0, -40);
      fg2.lineTo(-6, -23);
      fg2.closePath();
      fg2.fill();
    }
    fg2.restore();
  }
};