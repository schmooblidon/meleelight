export function blendColours(start,end,opacity){
  const blended = [];
  const difference = [];
  for (let i=0; i<3; i++){
    start[i] = parseInt(start[i]);
    difference[i] = end[i]-start[i];
    blended[i] = start[i]+difference[i]*opacity;
  }
  return [Math.floor(blended[0]),Math.floor(blended[1]),Math.floor(blended[2])];
}