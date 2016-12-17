import {
  setupActionStates
} from "physics/actionStateShortcuts";
import baseActionStates from "../shared/moves";
import {CHARIDS} from "main/characters";
import {actionStates} from "../../physics/actionStateShortcuts";
import   moves from "./moves";

const Marth = {
  moves,
  attributes: {},
  ecb: {},
};

export default Marth;

// Remove when actionStates are figured out.
setupActionStates(CHARIDS.MARTH_ID, {
  ...baseActionStates,
  ...Marth.moves,
});


actionStates[CHARIDS.MARTH_ID].ESCAPEB.setVelocities = [-2.267, -2.536, -2.706, -2.780, -2.758, -2.640, -2.426, -2.116, -1.711, -1.209, -0.888, -0.819, -0.758, -0.707, -0.664, -0.631, -0.606, -0.591, -0.585, -0.587, -0.599, -0.620, -0.809, -1.072, -1.205, -1.207, -1.078, -0.819, -0.617, -0.556, -0.487, -0.413, -0.332, -0.245, -0.152];
actionStates[CHARIDS.MARTH_ID].ESCAPEF.setVelocities = [1.282, 1.254, 1.267, 1.322, 1.418, 1.557, 1.737, 1.959, 4.447, 4.593, 2.338, 2.229, 2.070, 1.862, 1.605, 1.298, 0.941, 0.727, 0.687, 0.648, 0.608, 0.569, 0.529, 0.490, 0.450, 0.411, 0.372, 0.332, 0.293, 0.254, 0.215, 0.176, 0.137, 0.098, 0.058];
actionStates[CHARIDS.MARTH_ID].DOWNSTANDB.setVelocities = [-0.185, -0.370, -0.573, -1.540, -1.614, -1.586, -1.566, -1.614, -1.647, -1.666, -1.669, -1.657, -1.630, -1.588, -1.531, -1.397, -1.224, -1.094, -1.006, -0.962, -0.960, -0.926, -0.816, -0.684, -0.529, -0.352, -0.226, -0.171, -0.124, -0.084, -0.051, -0.025, -0.007, 0.004, 0.008];
actionStates[CHARIDS.MARTH_ID].DOWNSTANDF.setVelocities = [0.467, 1.360, 1.733, 2.135, 2.355, 2.581, 2.055, 2.281, 2.184, 1.902, 1.703, 1.521, 1.357, 1.211, 1.082, 0.971, 0.878, 0.802, 0.743, 0.703, 0.680, 0.674, 0.686, 0.716, 0.763, 0.775, 0.727, 0.661, 0.577, 0.474, 0.352, 0.241, 0.163, 0.101, 0.055];
actionStates[CHARIDS.MARTH_ID].TECHB.setVelocities = [0, 0, 0, 0, 0, 0, 0, -2.832, -2.726, -2.622, -2.521, -2.422, -2.326, -2.233, -2.142, -2.054, -1.968, -1.885, -1.811, -1.748, -1.691, -1.639, -1.593, -1.553, -1.519, -1.490, -1.467, -1.450, -1.439, -1.433, -1.433, -0.002, -0.003, -0.004, -0.005, -0.006, -0.006, -0.007, -0.007, -0.006];
actionStates[CHARIDS.MARTH_ID].TECHF.setVelocities = [0, 0, 0, 0, 0, 0, 0, 4.036, 3.526, 2.726, 2.317, 1.862, 1.656, 1.625, 1.768, 1.989, 2.094, 2.083, 1.956, 1.846, 1.814, 1.757, 1.676, 1.570, 1.440, 1.286, 1.107, 0.949, 0.834, 0.727, 0.629, 0.540, 0.459, 0.387, 0.323, 0.268, 0.222, 0.184, 0.155, 0.135];
actionStates[CHARIDS.MARTH_ID].CLIFFCATCH.posOffset = [[-71.9, -22.3], [-73.1, -22.19], [-72.21, -24], [-71.8, -24], [-71.1, -23.74], [-70.74, -23.76], [-71.3, -23.75]];
actionStates[CHARIDS.MARTH_ID].CLIFFWAIT.posOffset = [-71.3, -23.75];
