export function extremePoint(wall, extreme) {
  const  v1 = wall[0];
  const  v2 = wall[1];
  switch (extreme) {
    case "u":
    case "t":
      if (v2.y < v1.y) {
        return v1;
      }
      else {
        return v2;
      }
      break;
    case "d":
    case "b":
      if (v2.y > v1.y) {
        return v1;
      }
      else {
        return v2;
      }
      break;
    case "l":
      if (v2.x > v1.x) {
        return v1;
      }
      else {
        return v2;
      }
      break;
    case "r":
      if (v2.x < v1.x) {
        return v1;
      }
      else {
        return v2;
      }
    default:
      console.log( "error in 'extremePoint': invalid parameter "+extreme+", not up/top/down/bottom/left/right");
  }
};