// 封装请求的方法：url=>promise(result)
function requestData(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, 2000);
  });
}

function* getData() {
  const res1 = yield requestData("a");
  const res2 = yield requestData(res1 + "b");
  const res3 = requestData(res2 + "c");
  console.log(res3);
}

const generator = getData();
generator.next().value.then(res => {
  //   console.log("res1:", res);
  // 把res1传递给generator继续向下执行，作为参数传递给下面的yield
  generator.next(res1).value.then(res2 => {
    generator.next(res2).value.then(res3 => {
      generator.next(res3);
    });
  });
});

// 最终优化方案：

async function getData() {
  const res1 = await requestData("a");
  const res2 = await requestData(res1 + "b");
  const res3 = await requestData(res2 + "c");
  console.log(res3);
}
