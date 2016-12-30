import {Vec2D} from "../util/Vec2D";
import {randomAnnulusPoint} from "../util/randomAnnulusPoint";
import {drawStar} from "./drawStar";
import {addToVfxQueue} from "./vfxQueue";
import {vfx} from "main/vfx";

export function stars(tX, tY, n, minSpread, maxSpread) {
  
  for (let i = 0; i < n; i++) {
    const [deltaX, deltaY] = randomAnnulusPoint(0, 0, minSpread, maxSpread);
    addToVfxQueue([vfx["star"], 0, new Vec2D(tX, tY), [deltaX, deltaY], 0.4 + 0.8*Math.random()]);
  }
 
}
