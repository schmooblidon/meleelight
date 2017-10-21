import {vfxQueue} from "main/vfx/vfxQueue";
import general from "main/vfx/dVfx/general";
export default (posInQueue) => {
  general(posInQueue, -Math.atan2(vfxQueue[posInQueue].facing.y,vfxQueue[posInQueue].facing.x)+Math.PI/2);
};