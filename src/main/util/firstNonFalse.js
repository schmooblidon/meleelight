export function firstNonFalse( list ) {
  if (list === null || list === undefined || list.length < 1) {
    return false;
  }
  else {
    const [head, ...tail] = list;
    if ( head === false ) {
      return firstNonFalse(tail);
    }
    else {
      return head;
    }
  }
}