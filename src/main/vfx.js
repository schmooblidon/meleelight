import vfxData from 'main/vfx/vfxData';
import dVfxData from 'main/vfx/dVfx';
const twoPi = Math.PI * 2;

export let showVfx = true;

export function getShowSFX() {
  return showVfx;
}
export function toggleShowSFX() {
  showVfx = !showVfx;
}


export const vfx = {
  ...vfxData
};

vfx.wallBounce.path = vfx.groundBounce.path;
vfx.wallBounce.colour = vfx.groundBounce.colour;
vfx.wallBounce.frames = vfx.groundBounce.frames;
vfx.ceilingBounce.path = vfx.groundBounce.path;
vfx.ceilingBounce.colour = vfx.groundBounce.colour;
vfx.ceilingBounce.frames = vfx.groundBounce.frames;


export const dVfx = {
  ...dVfxData
};





