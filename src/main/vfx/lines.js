import {Vec2D} from "../util/Vec2D";
import {drawVfx} from "./drawVfx";

export function lines(additionalProps, pos, n, minAngle, maxAngle, c) {
  for (let i = 0; i < n; i++) {
    const theta = c === 1 ? Math.random() * (maxAngle - minAngle) + minAngle
                          : powWithSign(Math.random()*2-1, c) * 0.5 * (maxAngle - minAngle) + 0.5 * (minAngle+maxAngle);
    const offset = Math.random();
    drawVfx( Object.assign({ timer : 0, pos : pos, face : 0, direction : new Vec2D ( Math.cos(theta), Math.sin(theta)), offset : offset }, additionalProps) );
  }
}

function powWithSign ( x, d ) {
  return x < 0 ? - Math.pow(-x,d) : Math.pow(x,d);
}