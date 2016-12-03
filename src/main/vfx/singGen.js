import {vfxQueue} from "main/vfx/vfxQueue";
import {player,fg2} from "main/main";
import {Vec2D} from "main/util/Vec2D";
import {activeStage} from "stages/activeStage";
import {drawArrayPathNew} from "main/vfx/drawArrayPathNew";
import {twoPi} from "main/render";
import vfx from "main/vfx/vfxData/index";
// singGen produces sing vfx according to different parameters
// rMin: initial note radius
// rMax: final note radius
// notePhase: angle offset for notes
// posScale: modifier to account for how much the sing vfx should move left to right to follow the animation
// posPhase : phase offset for the sing vfx left/right movement
export function singGen(j, rMin, rMax, notePhase, posScale, posPhase) {
  let i;
  fg2.save();
  const p = vfxQueue[j][3];
  // total 31
  // fade out on 26
  // 5 frames of fade in, full opacity on frame 6
  const frame = vfxQueue[j][1];
  const pos = new Vec2D(player[p].phys.pos.x, player[p].phys.pos.y + 8);
  const lrScaling = posScale * player[p].phys.face;
  fg2.translate((pos.x * activeStage.scale) + activeStage.offset[0] + lrScaling * Math.cos(frame / 6.5 + posPhase), (pos.y * -activeStage.scale) + activeStage.offset[1] - 2.5 * Math.sin(frame / 8));
  // cos/sin functions account for the character animation moving the sing vfx
  const opaqMultiplier = 0.8;
  let opaq = opaqMultiplier;  //opacity
  if (frame < 6) {
    opaq = opaqMultiplier * frame / 6;
  }
  else if (frame > 25) {
    opaq = opaqMultiplier * (1 - ((frame - 25) / 6));
  }
  fg2.strokeStyle = "rgba(244, 212, 45," + opaq + ")";
  fg2.lineWidth = 3;
  for (i = 0; i < 5; i++) {
    fg2.beginPath();
    fg2.arc(0, 0, i * 2 * activeStage.scale, 0, twoPi);
    fg2.closePath();
    fg2.stroke();
  }
  const angles = [notePhase + frame * 0.1, notePhase + 2 * Math.PI / 3 + frame * 0.1, notePhase + 4 * Math.PI / 3 + frame * 0.1];
  let r = rMax; // distance of notes from center
  if (frame < 15) {
    r = rMin + frame * (rMax - rMin) / 15;
  }
  opaq += 0.2;
  const col = ["rgba(255,1,2," + opaq + ")", "rgba(5,255,0," + opaq + ")", "rgba(12,0,255," + opaq + ")"];
  for (i = 0; i < 3; i++) {
    drawArrayPathNew(fg2, col[i], 1, ((r * Math.cos(angles[i]) - 3) * activeStage.scale), ((r * Math.sin(angles[i]) + 3) * -activeStage.scale), vfx.sing.path, 0.7 * (activeStage.scale /
        4.5), 0.7 * (activeStage.scale / 4.5), 0, 0, 0);
  }
  fg2.restore();
}