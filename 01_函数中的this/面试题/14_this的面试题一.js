var name = "window";
var person = {
  name: "person",
  sayName: function () {
    console.log(this.name);
  }
};
function sayName() {
  var sss = person.sayName;
  sss(); // window
  person.sayName(); // person
  person.sayName(); // person
  /* 间接 函数引用，这种情况使用默认绑定规则。 */
  (b = person.sayName)(); // window
  //  它是一个独立函数，最终结果类似于下面这种情况
  // (obj2.foo=obj1.foo)() //window
}
sayName();
