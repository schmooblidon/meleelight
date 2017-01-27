// @flow

export function deepValue (obj : Object, path : string ) {
  let val = obj;
  const accessors = path.split('.');
  for (let i=0; i < accessors.length && val !== undefined; i++) {
    val = val[accessors[i]];
  }
  return val;
};