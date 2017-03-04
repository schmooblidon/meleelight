import {activeStage} from "../stages/activeStage";

function stageTransform (group) {
  group.scale.set(activeStage.scale,-activeStage.scale,1);
  group.translateX(activeStage.offset[0]);
  group.translateY(activeStage.offset[1]);
}