
import vsstages from 'stages/vs-stages/vs-stages';
import tstages from 'stages/targetstages/tstages';
import {Box2D} from "../main/util/Box2D";
import {Vec2D} from "../main/util/Vec2D";
const stageMapping = {
  0: "battlefield",
  1: "ystory",
  2: "pstadium",
  3: "dreamland"
};

export function setVsStage(val) {
  activeStage = vsstages[stageMapping[val]];
}

export const targetStageMapping = {
  0: "targetstage1",
  1: "targetstage2",
  2: "targetstage3",
  3: "targetstage4",
  4: "targetstage5",
  5: "targetstage6",
  6: "targetstage7",
  7: "targetstage8",
  8: "targetstage9",
  9: "targetstage10"
};

export function setActiveStageTarget(val) {
  activeStage = tstages[targetStageMapping[val]];
}

export let activeStage = {
  box: [new Box2D([-68.4, -108.8], [68.4, 0])],
  platform: [[new Vec2D(-57.6, 27.2), new Vec2D(-20, 27.2)], [new Vec2D(20, 27.2), new Vec2D(57.6, 27.2)], [new Vec2D(-18.8, 54.4), new Vec2D(18.8, 54.4)]],
  ground: [[new Vec2D(-68.4, 0), new Vec2D(68.4, 0)]],
  ceiling: [[new Vec2D(-68.4, -108.8), new Vec2D(68.4, -108.8)]],
  wallL: [[new Vec2D(-68.4, 0), new Vec2D(-68.4, -108.8)]],
  wallR: [[new Vec2D(68.4, 0), new Vec2D(68.4, -108.8)]],
  startingPoint: [new Vec2D(-50, 50), new Vec2D(50, 50), new Vec2D(-25, 5), new Vec2D(25, 5)],
  startingFace: [1, -1, 1, -1],
  respawnPoints: [new Vec2D(-50, 50), new Vec2D(50, 50), new Vec2D(-25, 35), new Vec2D(25, 35)],
  respawnFace: [1, -1, 1, -1],
  blastzone: new Box2D([-224, -108.8], [224, 200]),
  ledge: [[0, 0], [0, 1]],
  ledgePos: [new Vec2D(-68.4, 0), new Vec2D(68.4, 0)],
  scale: 4.5,
  offset: [600, 480],
};

export function getActiveStage() {
  return activeStage;
}

export const customTargetStages = [];
export function setCustomTargetStages(index, val) {
  customTargetStages[index] = val;
}

export function setActiveStageCustomTarget(val){
  activeStage = customTargetStages[val];
}