import {vfxQueue} from "main/vfx/vfxQueue";
import general from "./general";
export default (j) =>{
  general(j, Math.PI/2-vfxQueue[j][4]);
};