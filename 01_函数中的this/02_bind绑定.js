var obj = {
  name: "haruhi"
};
function foo(name, age, height) {
  console.log("foo函数:", this);
  console.log(name, age, height);
}
// bindObj是一个绑定了obj上下文的函数，这个函数是以foo为原型创建的
const bindObj = foo.bind(obj);
bindObj("yuki", 15, 1.52);
