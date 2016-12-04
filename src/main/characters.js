/* eslint-disable */
export const CHARIDS = {
    MARTH_ID : 0,
    PUFF_ID : 1,
    FOX_ID : 2
};


export let chars = [];
export function setChars(index,val){
  chars[index] = val;
}
export const hitboxes = [];
export function setHitBoxes(index,val){
  hitboxes[index] = val;
}

export const offsets = [];
 export function setOffsets(charId,val){
 offsets[charId] = val;
 }
 export const charAttributes = [];
 export function setCharAttributes(charId,val){
 charAttributes[charId] = val;
 }
 export const intangibility = [];
 export function setIntangibility(charId,val){
 intangibility[charId] =val;
 }
 export const framesData = [];
 export function setFrames(charId,val){
 framesData[charId] = val;
 }
 export const actionSounds = [];
 export function setActionSounds(charId,val){
 actionSounds[charId] =val;
 }
export function charObject(num) {
  this.attributes = charAttributes[num];
  this.animations = 0;
  this.hitboxes = hitboxes[num];
}