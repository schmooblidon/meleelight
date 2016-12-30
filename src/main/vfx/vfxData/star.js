import {makeColour} from "main/vfx/makeColour";

export default {
  name: "star",
  frames: 15,
  color : (t) => makeColour((1-t)*196+t*52, (1-t)*252+t*189, (1-t)*254+t*229, t > 0.75 ? 0.9*(1-4*(t-0.8)) : 0.9 )
};