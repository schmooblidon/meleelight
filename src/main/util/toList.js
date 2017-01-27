// temporary workaround for custom stage data being objects and not arrays
export function toList(list) {
  if (list.length === 0) {
    return [];
  }
  else {
    const [head, ...tail] = list;
    return ( [head] . concat (toList(tail)));
  }
}