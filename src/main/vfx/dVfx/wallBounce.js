import {vfxQueue} from "main/vfx/vfxQueue";
import general from "main/vfx/dVfx/general";
export default(j) =>{
  general(j, -Math.atan2(vfxQueue[j][4].y,vfxQueue[j][4].x)+Math.PI/2);
};