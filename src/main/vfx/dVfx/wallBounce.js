import {vfxQueue} from "main/vfx/vfxQueue";
import general from "main/vfx/dVfx/general";
export default(j) =>{
  if (vfxQueue[j][4]) {
    general(j, Math.PI / 2);
  } else {
    general(j, Math.PI * 1.5);
  }
};