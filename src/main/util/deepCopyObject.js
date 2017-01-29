// warning: this function is currently buggy and does not properly deep copy objects...
// use `deepCopy` instead wherever possible
export function deepObjectMerge(deep, target, object, exclusionList) {
// warning: this function is currently buggy and does not properly deep copy objects...
// use `deepCopy` instead wherever possible

  if (deep) {
    let result = target;
    result = result || {};

    for (let i = 2; i < arguments.length; i++) {
      const obj = arguments[i];

      if (arguments.length === 3 && obj instanceof Array){
        result = [];
      } 

      if (!obj)
        continue;

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object' && exclusionList && exclusionList.indexOf(key) === -1)
            result[key] = deepObjectMerge(deep, result[key], obj[key]);
          else
            result[key] = obj[key];
        }
      }
    }

    return result;
  } else {
    return Object.assign(target, object);
  }
}