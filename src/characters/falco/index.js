
import moves from "characters/falco/moves";
import "characters/falco/attributes";
import "characters/falco/ecb";
import {actionStates} from "physics/actionStateShortcuts";
import {setupActionStates} from "../../physics/actionStateShortcuts";
import {CHARIDS} from "../../main/characters";
import baseActionStates from "../shared/moves";

const Falco = {
  moves,
  attributes: {},
  ecb: {},
};

export default Falco;

// Remove when actionStates are figured out.
setupActionStates(CHARIDS.FALCO_ID, {
  ...baseActionStates,
  ...Falco.moves,
});

actionStates[CHARIDS.FALCO_ID].ESCAPEB.setVelocities = [0,0,0,0,0,0,-0.52963,-1.50741,-2.36296,-6.60,-2.70864,-1.69136,-1.37381,-1.12101,-1.26280,-1.57886,-1.72066,-1.73426,-1.69565,-1.76333,-2.00805,-2.14219,-1.95447,-1.44489,-0.84652,-0.48166,-0.27840,-0.23674,-0.35667,-0.66763,-0.43237];
actionStates[CHARIDS.FALCO_ID].ESCAPEF.setVelocities = [0,0,0,0,0,0,2.75,4.95,5.5,1.18,1.0199,1.23857,1.99807,2.13604,2.0652,1.94967,1.92641,1.89979,1.8698,1.83645,1.65,1.33462,1.05177,0.80152,0.58387,0.39882,0.24637,0.12652,0.03926,-0.01538,-0.03745];
actionStates[CHARIDS.FALCO_ID].DOWNSTANDB.setVelocities = [-0.1071,-0.12,-0.13,-0.14,-0.14,-0.27,-0.51,-0.72,-0.91,-1.08,-1.23,-1.35,-1.45,-1.53,-1.59,-1.62,-1.55,-1.43,-1.34,-1.30,-1.30,-1.34,-1.43,-1.53,-1.61,-1.65,-1.65,-1.62,-1.56,-1.46,-1.33,-1.16,-0.96,-0.73,-0.46];
actionStates[CHARIDS.FALCO_ID].DOWNSTANDF.setVelocities = [0.19,0.25,0.61,1.55,1.79,4.38,3.99,3.62,3.26,2.92,2.60,2.30,2.02,1.76,1.51,1.29,1.08,0.89,0.72,0.56,0.43,0.31,0.21,0.13,0.07,0.03,0.004,-0.003,0,0,0,0,0,0,0,0];
actionStates[CHARIDS.FALCO_ID].TECHB.setVelocities = [0,-2.18,-2.15,-2.11,-2.07,-2.03,-1.99,-1.94,-1.90,-1.85,-1.81,-1.76,-1.71,-1.65,-1.60,-1.55,-1.49,-1.43,-1.38,-1.31,-1.25,-1.19,-1.13,-1.06,-0.99,-0.92,-0.85,-0.78,-0.71,-0.64,-0.56,0,0,0,0,0,0,-0.003,-0.003,-0.003];
actionStates[CHARIDS.FALCO_ID].TECHF.setVelocities = [0,0,0,0,0,0,0,2.93,2.86,2.78,2.71,2.63,2.54,2.46,2.37,2.28,2.18,2.08,1.98,1.88,1.77,1.66,1.54,1.43,1.31,1.18,1.06,0.93,0.80,0.66,0,0,0,0,0,0,0,0,0,0];
actionStates[CHARIDS.FALCO_ID].CLIFFCATCH.posOffset = [[-73.78,-15.44],[-73.46,-15.55],[-73,-15.70],[-72.46,-15.88],[-71.89,-16.07],[-71.35,-16.25],[-70.90,-16.40]];
actionStates[CHARIDS.FALCO_ID].CLIFFWAIT.posOffset = [-70.6,-16.5];
