var name = 'window'
function Person (name) {
  this.name = name
  this.foo1 = function () {
    console.log(this.name)
  },
  this.foo2 = () => console.log(this.name),
  this.foo3 = function () {
    return function () {
      console.log(this.name)
    }
  },
  this.foo4 = function () {
    return () => {
      console.log(this.name)
    }
  }
}
/** new构造函数的过程
 * 1.创建一个空的对象
 * 2.将空对象的原型指向构造函数的原型
 * 3.将构造函数的this指向这个空对象
 * 4.执行构造函数
 * 5.返回这个对象
 * 
 * 为JavaScript中的函数是对象，当你在构造函数中定义一个函数时，
 * 它实际上是在每个新创建的实例上创建一个新的函数对象。
 * 每次调用new Person()时，都会执行Person构造函数中的所有代码，包括创建新的函数对象。
 */
var person1 = new Person('person1')
var person2 = new Person('person2')

// person1.foo1() // person1
// person1.foo1.call(person2) // person2

// person1.foo2() // person1

/* 因为foo2作为箭头函数和作为上层作用域Person的this绑定同轴，所以无论如何变更person2的绑定方式，都无法改变箭头函数的指向 */
// person1.foo2.call(person2) // person1

// person1.foo3()() // window

/* 注意，这里作为独立函数来调用 */
// person1.foo3.call(person2)() // window
// person1.foo3().call(person2) // person2

// person1.foo4()() // person1
// person1.foo4.call(person2)() // person2
// person1.foo4().call(person2) // person1