import {activeStage} from "stages/activeStage";
import {vfxQueue} from "main/vfx/vfxQueue";
import {fg2} from "main/main";
import {twoPi} from "main/render";
import {Vec2D} from "../../util/Vec2D";
export default(j) =>{
  const s = activeStage.scale / 4.5;
  fg2.save();
  fg2.translate((vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0], (vfxQueue[j][2].y * -activeStage.scale) + activeStage.offset[
          1]);
  fg2.fillStyle = "rgb(209, 181, 255)";
  for (let i = 0; i < 1; i++) {
    fg2.beginPath();
    fg2.arc((-30 + 60 * Math.random()) * s, (-30 + 60 * Math.random()) * s, 4 * s, 0, twoPi);
    fg2.closePath();
    fg2.fill();
  }
  fg2.strokeStyle = "rgb(209, 181, 255)";
  fg2.lineWidth = 2;
  fg2.beginPath();
  // dropped loop since it only iterates once
  const start = new Vec2D((-30 + 60 * Math.random()), (-30 + 60 * Math.random()));
  fg2.moveTo(start.x * s, start.y * s);
  const next1 = new Vec2D(start.x + (-10 + Math.random() * 20), start.y + (-10 + Math.random() * 20));
  const next2 = new Vec2D(next1.x + (-10 + Math.random() * 20), next1.y + (-10 + Math.random() * 20));
  const next3 = new Vec2D(next2.x + (-10 + Math.random() * 20), next2.y + (-10 + Math.random() * 20));
  fg2.lineTo(next1.x * s, next1.y * s);
  fg2.lineTo(next2.x * s, next2.y * s);
  fg2.lineTo(next3.x * s, next3.y * s);

  fg2.closePath();
  fg2.stroke();
  fg2.restore();
};