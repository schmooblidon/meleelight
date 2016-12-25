

export function isCloseToOneOf(val, list, threshold) {
  if (list.length < 1) {
    return false;
  }
  else {
    const [head, ...tail] = list;
    if (Math.abs(val - head) < threshold) {
      return true;
    }
    else {
      return isCloseToOneOf(val, tail, threshold);
    }
  }
  
};