// @flow
/*eslint-disable */

export function deepCopyObject <T : { [_: *] : * } > (deep: bool, object: T, exclusionList: ?Array<*> = []): $ObjMap<T,<V>(_: V) => V> {
  if (deep) {
    const result = {};
    for (const key in object) {
      // if (object.hasOwnProperty(key)) {
      if (object[key] === null ||  exclusionList.indexOf(key) !== -1) {
        result[key] = object[key];
      }
      else if (Array.isArray(object[key])) {
        result[key] = deepCopyArray(deep, object[key], exclusionList);
      }
      else if (typeof(object[key]) === "object") {
        result[key] = deepCopyObject(deep, object[key], exclusionList);
      }
      else {
        result[key] = object[key];
      }
    }
    return result;
  }
  else {
    return Object.assign({}, object);
  }
};

export function deepCopyArray < T : Array<*> > (deep: bool, array: T, exclusionList: ?Array<*>): Array<*> {
  if (deep) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] === null || (exclusionList && exclusionList.indexOf(i) !== -1)) {
          result[i] = array[i];
        }
        else if (Array.isArray(array[i])) {
          result[i] = deepCopyArray(deep, array[i], exclusionList);
        }
        else if (typeof(array[i]) === "object") {
          result[i] = deepCopyObject(deep, array[i], exclusionList);
        }
        else {
          result[i] = array[i];
        }
    }
    result.length = array.length;
    return result;
  }
  else {
    return Object.assign({}, ...array);
  }
};