const promise = new Promise((resolve, reject) => {
  resolve("aaaaaaa");
  // reject()
});

// 1.then方法是返回一个新的Promise, 这个新Promise的决议是等到then方法传入的回调函数有返回值时, 进行决议
// Promise本身就是支持链式调用
promise
  .then(res => {
    console.log("第一个then方法:", res);
    return "bbbbbbbb";
  })
  // then方法是返回一个新的Promise, 链式中的then是在等待这个新的Promise有决议之后执行的
  .then(res => {
    console.log("第二个then方法:", res);
    return "cccccccc";
  })
  .then(res => {
    console.log("第三个then方法:", res);
  });

promise.then(res => {
  "添加第一个then方法";
});
