// 如果异步函数中存在一个异常，这个异常不会被浏览器立即处理
// 它会进行一个如下处理：Promise.reject(error)
async function foo2() {
  console.log("aaaa");
    console.log("bbbb");
    // 异常错误
    "abc".filter()
  console.log("cccc");

  return 123;
}
foo2
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
