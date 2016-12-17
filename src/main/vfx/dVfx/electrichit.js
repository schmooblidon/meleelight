import {activeStage} from "stages/activeStage";
import {vfxQueue} from "main/vfx/vfxQueue";
import {fg2} from "main/main";
import {makeColour} from "main/vfx/makeColour";
import {twoPi} from "main/render";
import {drawArrayPath} from "main/vfx/drawArrayPath";
import vfx from "main/vfx/vfxData/index";
import {Vec2D} from "../../util/Vec2D";
export default(j)=> {
  const s = activeStage.scale / 4.5;
  fg2.save();
  fg2.translate((vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0], (vfxQueue[j][2].y * -activeStage.scale) + activeStage.offset[
          1]);
  switch (vfxQueue[j][1]) {
    case 1:
      fg2.fillStyle = makeColour(133, 122, 250, 0.62);
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
      drawArrayPath(fg2, "rgb(50,252,162)", vfxQueue[j][3], 0, 0, vfx.normalhit.path1, 0.2 * (activeStage.scale / 4.5),
          0.2 * (activeStage.scale / 4.5));
      break;
    case 3:
      drawArrayPath(fg2, "rgb(0,0,0)", vfxQueue[j][3], 0, 0, vfx.normalhit.path2, 0.2 * (activeStage.scale / 4.5), 0.2 *
          (activeStage.scale / 4.5));
      break;
    case 4:
      drawArrayPath(fg2, "rgb(198,222,255)", vfxQueue[j][3], 0, 0, vfx.normalhit.path2, 0.2 * (activeStage.scale / 4.5),
          0.2 * (activeStage.scale / 4.5));
      break;
    case 5:
      for (let n = 0; n < vfx.normalhit.path3.length; n++) {
        drawArrayPath(fg2, "rgb(0,0,0)", vfxQueue[j][3], 0, 0, vfx.normalhit.path3[n], 0.2 * (vfxQueue[j][1] / 7) *
            (activeStage.scale / 4.5), 0.2 * (vfxQueue[j][1] / 7) * (activeStage.scale / 4.5));
      }
      break;
    case 6:
      for (let m = 0; m < vfx.normalhit.path3.length; m++) {
        drawArrayPath(fg2, "rgb(139,130,242)", vfxQueue[j][3], 0, 0, vfx.normalhit.path3[m], 0.2 * (vfxQueue[j][1] /
            7) * (activeStage.scale / 4.5), 0.2 * (vfxQueue[j][1] / 7) * (activeStage.scale / 4.5));
      }
      break;
    default:
      break;
  }
  fg2.fillStyle = "rgb(209, 181, 255)";
  if (vfxQueue[j][1] < 13) {
    for (let i = 0; i < 2; i++) {
      fg2.beginPath();
      fg2.arc((-30 + 60 * Math.random()) * s, (-30 + 60 * Math.random()) * s, 4 * s, 0, twoPi);
      fg2.closePath();
      fg2.fill();
    }
  }
  fg2.strokeStyle = "rgb(209, 181, 255)";
  fg2.lineWidth = 2;
  fg2.beginPath();
  //updated j to avoid off by one error. this may not be correct
  for (let j = 0;  (vfxQueue[j]) && j < 4 - (Math.round(vfxQueue[j][1] / 4)); j++) {
    const start = new Vec2D((-30 + 60 * Math.random()), (-30 + 60 * Math.random()));
    fg2.moveTo(start.x * s, start.y * s);
    const next1 = new Vec2D(start.x + (-10 + Math.random() * 20), start.y + (-10 + Math.random() * 20));
    const next2 = new Vec2D(next1.x + (-10 + Math.random() * 20), next1.y + (-10 + Math.random() * 20));
    const next3 = new Vec2D(next2.x + (-10 + Math.random() * 20), next2.y + (-10 + Math.random() * 20));
    fg2.lineTo(next1.x * s, next1.y * s);
    fg2.lineTo(next2.x * s, next2.y * s);
    fg2.lineTo(next3.x * s, next3.y * s);
  }
  fg2.closePath();
  fg2.stroke();

  fg2.restore();
};