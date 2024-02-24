var name = "window";
function Person(name) {
  this.name = name;
  this.obj = {
    name: "obj",
    foo1: function () {
      return function () {
        console.log(this.name);
      };
    },
    foo2: function () {
      return () => {
        console.log(this.name);
      };
    }
  };
}
var person1 = new Person("person1");
var person2 = new Person("person2");

// person1.obj.foo1()() // window

/* 这里不要被call混淆了，就算被call绑定到了person2,其内部return的函数依旧是独立函数 */
// person1.obj.foo1.call(person2)() // window

// person1.obj.foo1().call(person2) // person2

// person1.obj.foo2()() // obj
// person1.obj.foo2.call(person2)() // person2
// person1.obj.foo2().call(person2) // obj
