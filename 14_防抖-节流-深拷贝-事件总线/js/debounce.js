function hydebounce(cbFn, delay, immediate = false) {
  // 1.用于记录上一次事件触发的timer
  let timer = null;
  let isInvoke = false;
  // 2.触发事件时的执行函数
  const _debounce = function (...args) {
    return new Promise((resolve, reject) => {
      try {
        // 2.1 如果再次触发事件，清除上一次的timer
        if (timer) clearTimeout(timer);
        let res = undefined;
        // 假设第一次操作不需要延迟
        if (immediate && !isInvoke) {
          res = cbFn.apply(this, args);
          resolve(res);
          isInvoke = true;
          return;
        }
        // 2.2 延迟去执行对应的cbFn函数(传入的回调函数)
        timer = setTimeout(() => {
          res = cbFn.apply(this, args);
          resolve(res);

          // 重置timer
          timer = null;
          // 重置立即执行状态控制器
          isInvoke = false;
        }, delay);
      } catch (error) {
        console.log(error);
      }
    });
  };
  // 3.给_debounce绑定一个取消的函数
  _debounce.cancel = function () {
    clearTimeout(timer);
    timer = null;
    // 重置立即执行状态控制器
    isInvoke = false;
  };
  return _debounce;
}

export default hydebounce;
