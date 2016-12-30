import {vfxQueue} from "main/vfx/vfxQueue";
import {fg2} from "main/main";
import {drawStar} from "main/vfx/drawStar";
import {activeStage} from "stages/activeStage";

export default(j)=> {
  const tX = vfxQueue[j][2].x;
  const tY = vfxQueue[j][2].y;
  const t = vfxQueue[j][1] / vfxQueue[j][0].frames;
  const [deltaX, deltaY] = vfxQueue[j][3];
  const scale = vfxQueue[j][4];
  const [x,y] = [tX + deltaX * (0.9+0.35*t), tY + deltaY * (0.9+0.35*t) + 0.8*activeStage.scale*t*t];
  fg2.fillStyle = "rgba(196,252,254,"+(3-4*t)+")";
  drawStar(x, y, scale * 0.3 * activeStage.scale, scale * 1.1 * activeStage.scale, 4, 0);
};