import {vfxQueue} from "main/vfx/vfxQueue";
import {player, fg2} from "main/main";
import {swordSwings} from "main/swordSwings";
import {activeStage} from "stages/activeStage";
import {makeColour} from "main/vfx/makeColour";
import {Vec2D} from "../../util/Vec2D";
export default(posInQueue, draw) =>{
  let shouldDraw = draw;
  shouldDraw = shouldDraw || true;
  const p = vfxQueue[posInQueue].facing.pNum;
  if (vfxQueue[posInQueue].facing.posNow === undefined || vfxQueue[posInQueue].facing.posNow === null) {
    vfxQueue[posInQueue].facing.posNow = new Vec2D(player[p].phys.pos.x, player[p].phys.pos.y);
    vfxQueue[posInQueue].facing.posPrev = new Vec2D(player[p].phys.posPrev.x, player[p].phys.posPrev.y);
  }
  const frame = vfxQueue[posInQueue].facing.frame;
  const swingType = vfxQueue[posInQueue].facing.swingType;
  const swordPrev = swordSwings[swingType][frame];
  if(swordSwings[swingType][frame + 1] === undefined){
    return;
  }
  const swordNow = swordSwings[swingType][frame + 1];
  const scale = player[p].charAttributes.charScale;
  const pos = vfxQueue[posInQueue].facing.posNow;
  const posPrev = vfxQueue[posInQueue].facing.posPrev;
  const sc = activeStage.scale;
  const soX = activeStage.offset[0];
  const soY = activeStage.offset[1];
  if (shouldDraw) {
    fg2.fillStyle = makeColour(46, 217, 255, (0.7 - (0.7 / 5 * vfxQueue[posInQueue].timer)));
    fg2.beginPath();
    fg2.moveTo(((scale * (swordNow[0][0] / 4.5 * player[p].phys.face) + pos.x) * sc + soX), ((scale * (swordNow[0]
        [1] / -4.5) + pos.y) * -sc + soY));
    fg2.lineTo(((scale * (swordNow[1][0] / 4.5 * player[p].phys.face) + pos.x) * sc + soX), ((scale * (swordNow[1]
        [1] / -4.5) + pos.y) * -sc + soY));
    fg2.lineTo(((scale * (swordPrev[1][0] / 4.5 * player[p].phys.face) + posPrev.x) * sc + soX), ((scale * (
    swordPrev[1][1] / -4.5) + posPrev.y) * -sc + soY));
    fg2.lineTo(((scale * (swordPrev[0][0] / 4.5 * player[p].phys.face) + posPrev.x) * sc + soX), ((scale * (
    swordPrev[0][1] / -4.5) + posPrev.y) * -sc + soY));
    fg2.closePath();
    fg2.fill();
  }
};