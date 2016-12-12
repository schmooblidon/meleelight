// finds the smallest value t of the list with t > min, t <= max
// returns false if none are found
export function findSmallestWithin(list, min, max, smallestSoFar = false) {
  if (list === null || list === undefined || list.length < 1) {
    return smallestSoFar;
  }
  else {
    const [head, ...tail] = list;
    if (head === false) {
      return findSmallestWithin(tail, min, max, smallestSoFar);
    }
    else if (head > min && head <= max) {
      if (smallestSoFar === false) {
        return findSmallestWithin(tail, min, max, head);
      }
      else if (head > smallestSoFar) {
        return findSmallestWithin(tail, min, max, smallestSoFar);
      }
      else {
        return findSmallestWithin(tail, min, max, head);
      }
    }
    else {
      return findSmallestWithin(tail, min, max, smallestSoFar);
    }
  }
};