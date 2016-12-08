export function deepCopyObject(deep, target, ...object) {
  if (deep) {
    let result = target;
    result = result || {};

    for (let i = 2; i < arguments.length; i++) {
      const obj = arguments[i];

      if (!obj)
        continue;

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object')
            result[key] = deepCopyObject(deep, result[key], obj[key]);
          else
            result[key] = obj[key];
        }
      }
      // adds length property for arrays
      if (obj instanceof Array) {
        result.length = obj.length;
      }
    }

    return result;
  } else {
    return Object.assign(target, ...object);
  }
}