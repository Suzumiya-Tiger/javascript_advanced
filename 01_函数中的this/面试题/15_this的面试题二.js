var name = "window";
var person1 = {
  name: "person1",
  foo1: function () {
    console.log(this.name);
  },
  foo2: () => console.log(this.name),
  foo3: function () {
    return function () {
      console.log(this.name);
    };
  },
  foo4: function () {
    return () => {
      console.log(this.name);
    };
  }
};

var person2 = { name: "person2" };

person1.foo1(); // person1
person1.foo1.call(person2); // person2
person1.foo2(); // window
person1.foo2.call(person2); // window
person1.foo3()(); // window
person1.foo3.call(person2)(); // window
person1.foo3().call(person2); // person2
// 第一个表达式的this指向persion1，而箭头函数获取的是外层函数作用域的this指向，所以指向person1
person1.foo4()(); // person1
person1.foo4.call(person2)(); // person2
person1.foo4().call(person2); // person1
