const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p的resolve结果");
  });
});

const promise = new Promise((resolve, reject) => {
  // 1.resolve可以接收各类普通值，比如字符串、数字、对象数组等等
  // resolve('resolve');
  // resolve([1, 2, 3]);
  // 2.除此以外，resolve还可以接收另一个Promise实例作为参数
  // 如果resolve接收的参数是一个Promise实例，那么它会直接返回这个Promise实例
  // 当前Promise的决断会由这个Promise实例的决断来决定
  resolve(p);
});
promise.then(res => {
  console.log(res);
});
 