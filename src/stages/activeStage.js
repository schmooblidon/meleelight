import vsstages from 'stages/vs-stages/vs-stages';
import tstages from 'stages/targetstages/tstages';
import {Box2D} from "../main/util/Box2D";
import {Vec2D} from "../main/util/Vec2D";



// for stages to have connected grounds/platforms, they need to provide a 'connectednessFunction'
// input of a connectedness function: [ [type, index ], side ]
// type is either "g" (ground) or "p" (platform),
// index is the index of that surface in the stage's list of surfaces (grounds or platforms depending on type)
// side is either "l" (left) or "r" (right)
// given such an input, the function should return which ground/platform is connected to that side of the given ground/platform,
// in the format [ newType, newIndex ],
// or return 'false' if the ground/platform is not connected on that side to any other ground/platform
// if 'connectednessFunction' is not supplied, it is assumed that no grounds/platforms are connected to any other grounds/platforms


import {syncStage} from "../main/multiplayer/streamclient";
import {deepObjectMerge} from "../main/util/deepCopyObject";
const stageMapping = {
  0: "battlefield",
  1: "ystory",
  2: "pstadium",
  3: "dreamland",
  4: "fdest",
  5: "fountain"
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
  ledge: [["ground", 0, 0], ["ground", 0, 1]],
  ledgePos: [new Vec2D(-68.4, 0), new Vec2D(68.4, 0)],
  scale: 4.5,
  offset: [600, 480],
};


export function setActiveStageBuilderTestStage( stageTemp ) {
  activeStage = stageTemp;
}

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