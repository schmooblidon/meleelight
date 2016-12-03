
import {deepCopyObject} from "main/util/deepCopyObject";
import {vfx} from "main/vfx";
import {activeStage} from "stages/activeStage";
import {addToVfxQueue} from "main/vfx/vfxQueue";
import {Vec2D} from "../util/Vec2D";

export function drawVfx(name, pos, face, f) {
  let facing = f;
  if (typeof(f) === 'undefined') facing = -1;
  const instance = {};
  deepCopyObject(true, instance, vfx[name]);
  if (instance.name === "circleDust") {
    instance.circles[0] = Math.random() * -2;
    instance.circles[1] = (Math.random() * -activeStage.scale) - 2;
    instance.circles[2] = Math.random() * 2;
    instance.circles[3] = (Math.random() * activeStage.scale) + 2;
  }
  const newPos = new Vec2D(pos.x, pos.y);
  addToVfxQueue([instance, 0, newPos, face, facing]);
}