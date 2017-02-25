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

export function unmakeColour(string) {
  const regexp = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/;
  const list = regexp.exec(string);
  return { r : parseInt(list[1]) || 0, g : parseInt(list[2]) || 0, b : parseInt(list[3]) || 0, a : parseFloat(list[4]) || 1 };
}
