const promise = new Promise((resolve, reject) => {
  // reject("error: aaaaa")
  resolve("aaaaaa");
});

// 1.catch方法也会返回一个新的Promise
// promise.catch(err => {
//   console.log("catch回调:", err)
//   return "bbbbb"
// }).then(res => {
//   console.log("then第一个回调:", res)
//   return "ccccc"
// }).then(res => {
//   console.log("then第二个回调:", res)
// })

// 2.catch方法的执行时机
promise
  .then(res => {
    console.log("then第一次回调:", res);
    // throw new Error("第二个Promise的异常error")
    return "bbbbbb";
  })
  .then(res => {
    console.log("then第二次回调:", res);
    throw new Error("第三个Promise的异常error");
  })
  .then(res => {
    console.log("then第三次回调:", res);
  })
  .catch(err => {
    console.log("catch回调被执行:", err);
  });

// 中断函数继续执行:
// 方式一: return
// 方式二: throw new Error()
// 方式三: yield 暂停(暂时性的中断)
