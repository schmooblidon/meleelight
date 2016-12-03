import {makeColour} from "../makeColour";
import {fg2} from "../../main";
import {vfxQueue} from "../vfxQueue";
import {activeStage} from "../../../stages/activeStage";
import {twoPi} from "../../render";
export default (j) => {
  fg2.fillStyle = makeColour(255, 254, 108, 0.9 * ((vfxQueue[j][0].frames - vfxQueue[j][1]) / vfxQueue[j][0].frames));
  fg2.beginPath();
  fg2.arc((vfxQueue[j][2].x * activeStage.scale) + activeStage.offset[0], (vfxQueue[j][2].y * -activeStage.scale) + activeStage.offset[1],
      5 * (activeStage.scale / 4.5), twoPi, 0);
  fg2.fill();
};