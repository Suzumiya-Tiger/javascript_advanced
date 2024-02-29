function requestData(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      //   resolve(url);
      reject("error message");
    }, 2000);
  });
}

async function getData() {
  //出现异常则会抛出给外层的catch进行捕获
  const res1 = await requestData("why");
  console.log("res1:", res1);

  const res2 = await requestData(res1 + "kobe");
  console.log("res2:", res2);
}

getData().catch(err => {
  console.log("err:", err);
});
