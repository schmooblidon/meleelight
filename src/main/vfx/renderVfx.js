import {vfxQueue,dropFromVfxQueue} from "main/vfx/vfxQueue";
import {getShowSFX, dVfx} from "main/vfx";

export function renderVfx (otherFrame){
  let altFrame = otherFrame;
  altFrame = altFrame || false;
  const popQueue = [];
  for (let j = 0; j < vfxQueue.length; j++) {
    vfxQueue[j][1]++;
    if (vfxQueue[j][0].frames >= vfxQueue[j][1]) {
      if (getShowSFX()) {
        if (!altFrame) {
          dVfx[vfxQueue[j][0].name](j);
        }
        // if 30fps mode on the other frame, still call swing function but just don't draw
        else if (vfxQueue[j][0].name === "swing") {
          dVfx.swing(j, false);
        }
      }
    } else {
      popQueue.push(j);
    }
  }
  for (let k = 0; k < popQueue.length; k++) {
    dropFromVfxQueue(popQueue[k] - k, 1);
  }
}