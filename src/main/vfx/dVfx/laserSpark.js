import {vfxQueue} from "main/vfx/vfxQueue";
import {fg2} from "main/main";
import {makeColour} from "main/vfx/makeColour";
import {activeStage} from "stages/activeStage";

export default (posInQueue)=> {
  const x = vfxQueue[posInQueue].pos.x;
  const y = vfxQueue[posInQueue].pos.y;
  const t = vfxQueue[posInQueue].timer / vfxQueue[posInQueue].frames;
  const dir = vfxQueue[posInQueue].direction;
  const col = vfxQueue[posInQueue].color;
  const offset = vfxQueue[posInQueue].offset;
  const u = (8*offset+12*t);
  const [px,py] = [(x + u*dir.x)*activeStage.scale + activeStage.offset[0], (y + u*dir.y)* -activeStage.scale + activeStage.offset[1]];
  fg2.strokeStyle = makeColour(col.r, col.g, col.b, 3-4*t);
  fg2.lineWidth = 1;
  fg2.beginPath();
  fg2.moveTo(px, py);
  fg2.lineTo(px + 5*activeStage.scale*dir.x, py - 5*activeStage.scale*dir.y);
  fg2.stroke();
};