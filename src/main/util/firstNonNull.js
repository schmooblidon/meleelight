// @flow

export function firstNonNull<T>( list : Array< T | null>) : T | null {
  if (list.length < 1) {
    return null;
  }
  else {
    const [head, ...tail] = list;
    if ( head === null ) {
      return firstNonNull(tail);
    }
    else {
      return head;
    }
  }
}