import puff from 'characters/puff/moves';
import {player} from "../../main/main";
export function puffNextJump(p, input) {
  if (Math.abs(input[p][0].lsX) > 0.3 && Math.sign(input[p][0].lsX) !== player[p].phys.face) {
    puff["AERIALTURN" + (1 + player[p].phys.jumpsUsed)].init(p, input);
  }
  else {
    puff["JUMPAERIAL" + (1 + player[p].phys.jumpsUsed)].init(p, input);
  }
}
