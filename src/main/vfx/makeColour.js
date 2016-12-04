import {getTransparency} from "main/vfx/transparency";
export function makeColour(r, g, b, a) {
  // maybe some hsl too
  if (getTransparency()) {
    return `rgba(${r},${g},${b},${a})`;
  }
  else {
    return `rgb(${r},${g},${b})`;
  }
}