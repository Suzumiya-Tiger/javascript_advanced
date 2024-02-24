function exeCode(counter) {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (counter > 0) {
        console.log("aaa");
        let total = 0;
        for (let i = 0; i < 100; i++) {
          total += i;
        }
        resolve(total);
      } else {
        reject(`counter 出现错误，它的数值是 ${counter}`);
      }
    }, 3000);
  });
    return promise
}
const result = exeCode(-100);
result
  .then(res => {
    console.log("获取成功回调", res);
  })
  .catch(err => {
    console.log("获取失败回调", err);
  });
