// warning: this function is currently buggy and does not properly deep copy objects...
// use `deepCopy` instead wherever possible
export function deepCopyObject(deep, target, ...object) {
  if(typeof target === 'object') {
    return {...{...target}, ...{...object}};
  }
  return [...target,...object];
  // if (deep) {
  //   let result = target;
  //   result = result || {};
  //
  //   for (let i = 2; i < arguments.length; i++) {
  //     const obj = arguments[i];
  //
  //     if (arguments.length === 3 && obj instanceof Array){
  //       result = [];
  //     }
  //
  //     if (!obj)
  //       continue;
  //
  //     for (const key in obj) {
  //       if (obj.hasOwnProperty(key)) {
  //         if (typeof obj[key] === 'object')
  //           result[key] = deepCopyObject(deep, result[key], obj[key]);
  //         else
  //           result[key] = obj[key];
  //       }
  //     }
  //   }
  //
  //   return result;
  // } else {
  //   return Object.assign(target, ...object);
  // }
}