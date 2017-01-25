// @flow
export const deepCopy = function<T>(deep: bool, target:  Object & T , object:  Object & T , exclusionList? : Array<string> = []): Object & T {
  if (deep) {
    const result = {};
    if( object instanceof Object) {
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          result[key] = (typeof object[key] === 'object' && (exclusionList.indexOf(key) === -1) ) ?
              deepCopy(deep, result[key], object[key], exclusionList) : object[key];
        }
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