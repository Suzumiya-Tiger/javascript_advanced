const promise = new Promise((resolve, reject) => {
  reject("failure");
});
promise.then(res => {
  console.log("resolve", res);
});
promise.catch(err => {
  console.log("reject", err);
});
promise.catch(err => {
  console.log("reject", err);
});
promise.catch(err => {
  console.log("reject", err);
});