import {vfxQueue} from "main/vfx/vfxQueue";
import {activeStage} from "stages/activeStage";
import {fg2} from "main/main";
import {twoPi} from "main/render";
export default (j) =>{
  const frame = vfxQueue[j][1];
  fg2.save();
  fg2.translate((vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0], (vfxQueue[j][2].y * -activeStage.scale) + activeStage.offset[
          1]);
  fg2.lineWidth = 4;
  fg2.strokeStyle = "rgba(255, 127, 112," + (0.8 - 0.15 * frame) + ")";
  fg2.beginPath();
  fg2.arc(0, 0, (13 - frame * 1) * activeStage.scale, 0, twoPi);
  fg2.closePath();
  fg2.stroke();
  const grd = fg2.createRadialGradient(0, 0, 5, 0, 0, (25 - frame * 2) * activeStage.scale);
  grd.addColorStop(0, "rgba(255,255,255," + (1 - 0.15 * frame) + ")");
  grd.addColorStop(1, "rgba(97, 255, 250, 0)");
  if (frame < 3) {
    fg2.fillStyle = grd;
    fg2.beginPath();
    fg2.arc(0, 0, (25 - frame * 2) * activeStage.scale, 0, twoPi);
    fg2.closePath();
    fg2.fill();
  }
  //fg2.strokeStyle = "rgb(112, 212, 255)";
  fg2.strokeStyle = grd;
  fg2.beginPath();
  fg2.arc(0, 0, (10 - frame * 1) * activeStage.scale, 0, twoPi);
  fg2.closePath();
  fg2.stroke();
  for (let i = 0; i < 14; i++) {
    fg2.rotate(Math.PI / 7 + (-0.3 + Math.random() * 0.6));
    fg2.beginPath();
    fg2.moveTo(0, ((15 + Math.random() * 10) - frame * 1.5) * activeStage.scale);
    fg2.lineTo(0, ((-15 - Math.random() * 10) + frame * 1.5) * activeStage.scale);
    fg2.closePath();
    fg2.stroke();
  }
  fg2.restore();
};