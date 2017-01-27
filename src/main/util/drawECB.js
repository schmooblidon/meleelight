import {fg2} from "../main";
import {activeStage} from "../../stages/activeStage";
import {Vec2D} from "./Vec2D";

import type {ECB} from "./ecbTransform";

export function drawECB(ecb : ECB, color : string) : void {
  fg2.strokeStyle = color;
  fg2.lineWidth = 1;
  fg2.beginPath();
  fg2.moveTo((ecb[0].x * activeStage.scale) + activeStage.offset[0], (ecb[0].y * -activeStage.scale) + activeStage.offset[1]);
  fg2.lineTo((ecb[1].x * activeStage.scale) + activeStage.offset[0], (ecb[1].y * -activeStage.scale) + activeStage.offset[1]);
  fg2.lineTo((ecb[2].x * activeStage.scale) + activeStage.offset[0], (ecb[2].y * -activeStage.scale) + activeStage.offset[1]);
  fg2.lineTo((ecb[3].x * activeStage.scale) + activeStage.offset[0], (ecb[3].y * -activeStage.scale) + activeStage.offset[1]);
  fg2.closePath();
  fg2.stroke();
};