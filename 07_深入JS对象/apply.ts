Function.prototype.hyCall = function (thisArgs, otherArgs) {
  let objTarget = thisArgs === null || thisArgs === undefined ? window : Object(thisArgs);
  Object.defineProperty(objTarget, "fn", {
    enumerable: false,
    writable: false,
    configurable: false,
    value: this
  });
  objTarget.fn(...otherArgs);
  delete objTarget.fn;
};
