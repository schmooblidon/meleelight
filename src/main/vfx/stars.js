import {Vec2D} from "../util/Vec2D";
import {randomAnnulusPoint} from "../util/randomAnnulusPoint";
import {drawStar} from "./drawStar";
import {drawVfx} from "./drawVfx";
import {vfx} from "main/vfx";

export function stars(tX, tY, n, minSpread, maxSpread) {
  
  for (let i = 0; i < n; i++) {
    const [deltaX, deltaY] = randomAnnulusPoint(0, 0, minSpread, maxSpread);
    drawVfx({ name : "star", timer : 0, pos : new Vec2D(tX,tY), face : [deltaX, deltaY], facing : 0.4 + 0.8*Math.random()});
  }

}