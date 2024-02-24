const promise = new Promise((resolve, reject) => {});
// promise可以使用then输出resolve和reject的结果，但本质上和then().catch()是一样的'
promise.then(
  res => {
    console.log("resolve", res);
  },
  err => {
    console.log("reject", err);
  }
);

// 除此以外，promise的决议结果可以多次输出，但是promise的决议结果不会变更
promise.then(res => {
  console.log("resolve", res);
});
promise.then(res => {
  console.log("resolve", res);
});
promise.then(res => {
  console.log("resolve", res);
});