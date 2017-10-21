import {makeColour} from "main/vfx/makeColour";

export function chromaticAberration( ctx, drawFunction, col1, col2, opacity, vec ) {

  ctx.save();

  ctx.globalCompositeOperation = "screen";

  drawFunction(makeColour(0, col1.g, 0, opacity), makeColour(0, col2.g, 0, opacity));

  ctx.translate(-vec.x,-vec.y);
  drawFunction(makeColour(col1.r, 0, 0, opacity), makeColour(col2.r, 0, 0, opacity));

  ctx.translate(2*vec.x,2*vec.y);
  drawFunction(makeColour(0, 0, col1.b, opacity), makeColour(0, 0, col2.b, opacity));

  ctx.restore();
  
}