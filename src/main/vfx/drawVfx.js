
import {deepCopyObject} from "main/util/deepCopy";
import {vfx} from "main/vfx";
import {activeStage} from "stages/activeStage";
import {addToVfxQueue} from "main/vfx/vfxQueue";
import {Vec2D} from "../util/Vec2D";

export function drawVfx(vfxConfig) {
  let facing = vfxConfig.f;
  if (typeof(vfxConfig.f) === 'undefined'){
    facing = -1;
  }
  let instance = deepCopyObject(true, vfx[vfxConfig.name]);
  if (instance.name === "circleDust") {
    instance.circles[0] = Math.random() * -2;
    instance.circles[1] = (Math.random() * -activeStage.scale) - 2;
    instance.circles[2] = Math.random() * 2;
    instance.circles[3] = (Math.random() * activeStage.scale) + 2;
  }
  instance = Object.assign(instance,vfxConfig);
  const x = vfxConfig.pos.x;
  const y = vfxConfig.pos.y;
  instance.face = vfxConfig.face;
  instance.newPos = new Vec2D(x, y);
  instance.facing = facing;
  instance.timer = 0;
  addToVfxQueue(instance);
}