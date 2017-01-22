// @flow
export const deepCopy = function<T>(deep: bool, object: T & {}): T {
  if (deep) {
    const result = {};
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        result[key] = typeof object[key] === 'object' ? deepCopy(deep, object[key]) : object[key];
      }
    }
    // adds length property for arrays
    if (object instanceof Array) {
      result.length = object.length;
    }
    return (result : any);
  } else {
    return (Object.assign({}, (object : any)) : any);
  }
};