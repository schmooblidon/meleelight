import {vfxQueue} from "main/vfx/vfxQueue";
import {fg2} from "main/main";
import {drawStar} from "main/vfx/drawStar";
import {activeStage} from "stages/activeStage";

export default(j)=> {
  const tX = vfxQueue[j][2].x;
  const tY = vfxQueue[j][2].y;
  const t = vfxQueue[j][1] / vfxQueue[j][0].frames;
  const col = vfxQueue[j][0].color(t);
  const [deltaX, deltaY] = vfxQueue[j][5];
  const [x,y] = [tX + deltaX * (1+0.2*t), tY + deltaY * (1+0.2*t)];
  drawStar(x, y, 0.3 * activeStage.scale, 1.1 * activeStage.scale, 4, 0, col);
};