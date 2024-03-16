function foo() {
  console.log("foo:", this);
}
// var obj = {
//   foo: foo
// };

/* 1.显式绑定高于隐式绑定 */
// obj.foo.apply("abc");

/* 1.1.bind绑定高于隐式绑定 */
// var bar = foo.bind("aaa");
// var obj = {
//   name: "shy",
//   baz: bar
// };
// obj.baz();

/* 2.new绑定高于隐式绑定 */
// var obj = {
//   name: "shy",
//   foo: function () {
//     console.log("foo:", this);
//     console.log("foo:", this === obj);
//   }
// };
// const newObj = new obj.foo();

/* 3.new绑定无法和apply/call一起使用，但是可以和bind使用 */
// new优先级高于bind
// function bee() {
//   console.log("bee:", this);
// }
// var bindFn = bee.bind("aaa");
// new bindFn();

/* 3.1 bind和apply,call的优先级比较:bind高于apply/call，可以理解为显式硬绑定的胜利 */
function bee() {
  console.log("bee:", this);
}
var bindFn = bee.bind("aaa");
// bindFn被apply "劫持" 调用
bindFn.apply("bbb");
