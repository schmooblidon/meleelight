export function randomAnnulusPoint(x, y, rMin, rMax) {
  const t = Math.random()*2*Math.PI;
  const r = (rMax-rMin)*Math.sqrt(Math.random())+rMin; // sqrt needed for the distribution to be uniform
  return [ x + r*Math.cos(t), y + r*Math.sin(t)];  
}
