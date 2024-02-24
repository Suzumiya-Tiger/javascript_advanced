const promise = new Promise((resolve, reject) => {
  // pending

  // fulfilled
  resolve("aaaa");

  // rejected
  // reject("bbbb")
});

promise
  .then(res => {
    console.log("then:", res);
    // foo()
  })
  .catch(err => {
    console.log("catch:", err);
    // foo()
  })
  .finally(() => {
    console.log("哈哈哈哈");
    console.log("呵呵呵呵");
  });
