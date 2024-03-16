var obj = {
  name: "haruhi"
};
function foo(name, age, height) {
  console.log("foo函数:", this);
  // 注意区分this指向的是函数所绑定的当前上下文对象，而直接调用属性名则则按照函数的词法作用域查找
  console.log(name, age, height);
  console.log(this.name, age, height);
}
// apply
// 要求以数组进行参数传递
// foo.apply(obj, ["YAMATO", 16, 1.56]);

// call
// 要求以参数列表的形式进行传递
foo.call(obj, "yuki", 15, 1.52);
