# 迭代器

**迭代器是帮助我们对某个数据结构进行遍历的对象。**

**在JavaScript中，迭代器也是一个具体的对象，这个对象需要符合迭代器协议（iterator protocol）：**

- 迭代器协议定义了产生一系列值（无论是有限还是无限个）的标准方式；
- 在JavaScript中这个标准就是一个特定的next方法；

```JS
    const names = ["abc", "cba", "nba"]
    
    // 给数组names创建一个迭代器(迭代器: names的跌大气)
    let index = 0
    const namesIterator = {
      next: function() {
        // done: Boolean
        // value: 具体值/undefined
        if (index < names.length) {
          return { done: false, value: names[index++] }
        } else {
          return { done: true }
        }
      }
    }

    console.log(namesIterator.next())
    console.log(namesIterator.next())
    console.log(namesIterator.next())
    console.log(namesIterator.next())
```

一个迭代器对象必须包含next函数，next函数里面必须返回包含了done和value属性的对象。

## 迭代器工具函数

我们可以结合闭包来实现一个迭代器工具函数：

```JS
    const names = ["abc", "cba", "nba"]
    const nums = [100, 24, 55, 66, 86]

    // 封装一个函数
    function createArrayIterator(arr) {
      let index = 0
      return {
        next: function() {
          if (index < arr.length) {
            return { done: false, value: arr[index++] }
          } else {
            return { done: true }
          }
        }
      }
    }

    const namesIterator = createArrayIterator(names)
    console.log(namesIterator.next())
    console.log(namesIterator.next())
    console.log(namesIterator.next())
    console.log(namesIterator.next())

    const numsIterator = createArrayIterator(nums)
    console.log(numsIterator.next())
    console.log(numsIterator.next())
    console.log(numsIterator.next())
    console.log(numsIterator.next())
    console.log(numsIterator.next())
    console.log(numsIterator.next())
```

### next

**next方法有如下的要求：**

一个无参数或者一个参数的函数，返回一个应当拥有以下两个属性的对象：

- done（boolean）

​	✓ 如果迭代器可以产生序列中的下一个值，则为 false。（这等价于没有指定 done 这个属性。）

​	✓ 如果迭代器已将序列迭代完毕，则为 true。这种情况下，value 是可选的，如果它依然存在，即为迭代结束之后的默认返回值。

- value

​	✓ 迭代器返回的任何 JavaScript 值。done 为 true 时可省略。



## 可迭代对象

我们可以考虑为普通对象(不可迭代)创建一个迭代器，实现迭代对象中的各类属性。

我们把这个迭代器放入一个普通对象当中，实现对该对象指定属性的迭代遍历。

**这些都是可迭代对象：String、Array、Map、Set、arguments对象、NodeList集合；**

```JS

    // 将infos变成一个可迭代对象
    /*
      1.必须实现一个特定的函数: [Symbol.iterator]
      2.这个函数需要返回一个迭代器(这个迭代器用于迭代当前的对象)
    */
    const infos = {
      friends: ["kobe", "james", "curry"],
      [Symbol.iterator]: function() {
        let index = 0
        const infosIterator = {
          next: function() {
            // done: Boolean
            // value: 具体值/undefined
            if (index < infos.friends.length) {
              return { done: false, value: infos.friends[index++] }
            } else {
              return { done: true }
            }
          }
        }
        return infosIterator
      }
    }
```

什么是可迭代对象？就是将迭代器引入一个普通对象当中当做一个对象内部的函数来使用，以实现该对象内部某些属性的迭代遍历。

同时我们设置这个实现迭代器的函数的键名为 `[Symbol.iterator]`，它指向一个函数，该函数内部有迭代器的实现，**并且最终返回这个迭代器。**

完成上述两步操作后，这个对象就称之为可迭代对象。

**一旦对对象设置了可迭代特性，我们就可以实现 for...of遍历。**

数组可以直接使用for...of遍历，是因为数组内部本身就有一个`[Symbol.iterator]`函数，可以通过迭代器的`next()`去逐个获取其数组内部的元素。

注意，`[Symbol.iterator]`是一个固定的迭代器方法的属性名，不允许变更。



### 迭代器的通用设计

```JS
  // 2.迭代infos中的key/value
    const infos = {
      name: "why",
      age: 18,
      height: 1.88,

      [Symbol.iterator]: function() {
        // const keys = Object.keys(this)
        // const values = Object.values(this)
        const entries = Object.entries(this)
        let index = 0
        const iterator = {
          next: function() {
            if (index < entries.length) {
              return { done: false, value: entries[index++] }
            } else {
              return { done: true }
            }
          }
        }
        return iterator
      }
    }
    // 可迭对象可以进行for of操作
    for (const item of infos) {
      const [key, value] = item
      console.log(key, value)
    }
```



### 可迭代对象的应用场景

- **JavaScript中语法**：for ...of、展开语法（spread syntax）、yield*（后面讲）、解构赋值（Destructuring_assignment）;

​	*注意：对象的直接解构并不代表着它是一个可迭代对象，而是JS引擎在ES9进行的特殊优化。*

- **创建一些对象时**：new Map([Iterable])、new WeakMap([iterable])、new Set([iterable])、new WeakSet([iterable]);
- **一些方法的调用**：Promise.all(iterable)、Promise.race(iterable)、Array.from(iterable);

```JS
    // 1.用在特定的语法上
    const names = ["abc", "cba", "nba"]
    const info = {
      name: "why",
      age: 18,
      height: 1.88,
      [Symbol.iterator]: function() {
        const values = Object.values(this)
        let index = 0
        const iterator = {
          next: function() {
            if (index < values.length) {
              return { done: false, value: values[index++] }
            } else {
              return { done: true }
            }
          }
        }
        return iterator
      }
    }

    function foo(arg1, arg2, arg3) {
      console.log(arg1, arg2, arg3)
    }

    foo(...info)

```

在`new Set(可迭代对象)`的传参中，要求传入的参数必须是一个可迭代对象，普通字符串在被传入应用时会被执行`new String()`的隐式转化。

```JS

    // 2.一些类的构造方法中, 也是传入的可迭代对象
    const set = new Set(["aaa", "bbb", "ccc"])
    const set2 = new Set("abc")
    console.log(set2)
    const set3 = new Set(info)
    console.log(set3)
```



在`Promise.all()`中期望传入的也是一个可迭代对象，在`Array.from()`要求传入的参数必须是一个可迭代对象。

```JS
    // 3.一些常用的方法
    const p1 = Promise.resolve("aaaa")
    const p2 = Promise.resolve("aaaa")
    const p3 = Promise.resolve("aaaa")
    const pSet = new Set()
    pSet.add(p1)
    pSet.add(p2)
    pSet.add(p3)
    Promise.all(pSet).then(res => {
      console.log("res:", res)
    })

    function bar() {
      // console.log(arguments)
      // 将arguments转成Array类型
      const arr = Array.from(arguments)
      console.log(arr)
    }

    bar(111, 222, 333)
```



### 自定义类的迭代器

```JS
    class Person {
      constructor(name, age, height, friends) {
        this.name = name
        this.age = age
        this.height = height
        this.friends = friends
      }

      // 实例方法
      running() {}
      [Symbol.iterator]() {
        let index = 0
        const iterator = {
          next: () => {
            if (index < this.friends.length) {
              return { done: false, value: this.friends[index++] }
            } else {
              return { done: true }
            }
          }
        }
        return iterator
      }
    }

    const p1 = new Person("why", 18, 1.88, ["curry", "kobe", "james", "tatumu"])
    const p2 = new Person("kobe", 30, 1.98, ["curry", "james", "aonier", "weide"])

    for (const item of p2) {
      console.log(item)
    }
```

我们通过在类里面写一个迭代器的实例方法，来实现类内部属性的迭代，以此来实现类的实例的属性迭代。

这里只需要迭代特定属性，所以就不采用 `Object.entires()` 或`Object.keys()`或 `Object.values()`，直接指定特定属性即可。



### 迭代器的中断

使用场景：遍历的过程中通过break、return、throw中断了循环操作；

我们可以在迭代器方法里面在写一个return函数，用于控制迭代器的遍历中断，迭代器的结果必须是一个对象，所以中断操作必须也返回一个对象。

```JS
    class Person {
      constructor(name, age, height, friends) {
        this.name = name
        this.age = age
        this.height = height
        this.friends = friends
      }

      // 实例方法
      running() {}
      [Symbol.iterator]() {
        let index = 0
        const iterator = {
          next: () => {
            if (index < this.friends.length) {
              return { done: false, value: this.friends[index++] }
            } else {
              return { done: true }
            }
          },
          return: () => {
            console.log("监听到迭代器中断了")
            return { done: true }
          }
        }
        return iterator
      }
    }

    
    const p1 = new Person("why", 18, 1.88, ["curry", "kobe", "james", "tatumu"])

    for (const item of p1) {
      console.log(item)
      if (item === "kobe") {
        break
      }
    }
```



# 生成器

生成器是ES6中新增的一种函数控制、使用的方案，它可以让我们更加灵活的控制函数什么时候继续执行、暂停执行等。

平时我们会编写很多的函数，这些函数终止的条件通常是返回值或者发生了异常。

- 首先，生成器函数需要在function的后面加一个符号：*

- 其次，生成器函数可以**通过yield关键字来控制函数的执行流程**：

- 最后，生成器函数的返回值是一个Generator（生成器）：

  ✓ 生成器事实上是一种特殊的迭代器；

​	✓ MDN：Instead, they return a special type of iterator, called a **Generator**.



```JS
    /*
      生成器函数: 
        1.function后面会跟上符号: *
        2.代码的执行可以被yield控制
        3.生成器函数默认在执行时, 返回一个生成器对象
          * 要想执行函数内部的代码, 需要生成器对象, 调用它的next操作
          * 当遇到yield时, 就会中断执行
    */

    // 1.定义了一个生成器函数
    function* foo() {
      console.log("1111")
      console.log("2222")
      yield
      console.log("3333")
      console.log("4444")
      yield
      console.log("5555")
      console.log("6666")
    }

    // 2.调用生成器函数, 返回一个 生成器对象
    const generator = foo()
    // 调用next方法
    generator.next()
    generator.next()
    generator.next()
```

* 要想执行函数内部的代码, 需要生成器对象, 调用它的next操作
*  当遇到yield时, 就会中断执行

也就是必须通过next去推动生成器函数的执行，然后通过yield设置关卡暂停执行，如果想要继续执行，那就必须继续再调用一个`generator.next()`。

**第一次执行`next()`会停留在第一个yield，但是请注意第一个yield的赋值和传参仅仅和第二次的 `next()`相关。**

**生成器无需return迭代器对象，生成器的迭代器对象是自动生成的。**



## 生成器的返回值

生成器通过`next()`调用得到的返回值默认是 `{value:undefined,done:false}`，迭代完成后返回 ` {value:undefined,done:true}`。**这是一个标准的迭代器通过 `next()`调用所生成的结果格式 **

生成器的返回值结果仅仅和 `yield`相关，返回结果的次数和`yield`出现的次数保持一致。

如果我们期望获取的value是有值的，那么我们可以在`yield`后面添加对应value值的结果，那么其返回的迭代对象的value就是对应的yield的value值的结果。

最后迭代完成的迭代对象，我们可以通过最后return的结果来对迭代对象的value进行赋值。

```JS
    // 1.定义了一个生成器函数
    function* foo(name1) {
      console.log("执行内部代码:1111", name1)
      console.log("执行内部代码:2222", name1)
      yield "aaaa"
      console.log("执行内部代码:3333", name2)
      console.log("执行内部代码:4444", name2)
     yield "bbbb"
      // return "bbbb"
      console.log("执行内部代码:5555", name3)
      console.log("执行内部代码:6666", name3)
      yield "cccc"
      return undefined
    }

    // 2.调用生成器函数, 返回一个 生成器对象
    const generator = foo("next1")
    // 调用next方法
    console.log(generator.next()) // { done: false, value: "aaaa" }
    console.log(generator.next()) // { done: false, value: "bbbb" }
    console.log(generator.next()) //  { done: false, value: "cccc" }
    console.log(generator.next()) // {done: true, value: undefined}
```



如果在函数执行的过程中，在yield的中间插入return，则代表整个迭代都结束，后面代码的执行被终止。

如果中间执行了return，后续再执行 `next()`也只会执行迭代执行结束的返回结果：

```JS
  // 1.定义了一个生成器函数
    function* foo(name1) {
      console.log("执行内部代码:1111", name1)
      console.log("执行内部代码:2222", name1)
      yield "aaaa"
      console.log("执行内部代码:3333", name2)
      console.log("执行内部代码:4444", name2)
       return "bbbb"
      console.log("执行内部代码:5555", name3)
      console.log("执行内部代码:6666", name3)
      yield "cccc"
      return undefined
    }

    // 2.调用生成器函数, 返回一个 生成器对象
    const generator = foo("next1")
  

    // 3.在中间位置直接return, 结果
     console.log(generator.next()) // { done: false, value: "aaaa" }
     console.log(generator.next()) // { done: true, value: "bbbb" }
     console.log(generator.next()) // { done: true, value: undefined }
     console.log(generator.next()) // { done: true, value: undefined }
     console.log(generator.next()) // { done: true, value: undefined }
     console.log(generator.next()) // { done: true, value: undefined }
```

同时，在迭代结束后的继续输出`generator.next()`时，返回的迭代输出结果对象的value统一都是 `undefined`。



### 执行过程中传参

这个生成器在执行过程中的传参和接收参数是一个非常神奇的操作，首先它通过`generator.next(传参)`来进行参数的传入操作，

然后再通过对应的yield来接收传入的参数，只不过是通过赋值接收的形式获取对应的参数，留给后面继续执行的代码调用该参数：

```JS
    // 1.定义了一个生成器函数
    function* foo(name1) {
      console.log("执行内部代码:1111", name1)
      console.log("执行内部代码:2222", name1)
      const name2 = yield "aaaa"
      console.log("执行内部代码:3333", name2)
      console.log("执行内部代码:4444", name2)
      const name3 = yield "bbbb"
      // return "bbbb"
      console.log("执行内部代码:5555", name3)
      console.log("执行内部代码:6666", name3)
      yield "cccc"
      return undefined
    }

    // 2.调用生成器函数, 返回一个 生成器对象
    const generator = foo("next1")


    // 4.给函数每次执行的时候, 传入参数
    console.log(generator.next())
    console.log(generator.next("next2"))
    console.log(generator.next("next3"))
    // console.log(generator.next())
```

第一次传参是没有yield来进行接收的，所以需要把参数直接传入foo函数即可。



### 生成器函数提前结束

我们可以通过 `generator.return(传参)`来中止函数的执行过程，但它能够履行传参和赋值的工作，它会获取yield返回的数值，最终返回结果是一个迭代完成的结果对象。

`当然我们也可以通过generator.throw(new Error('xxx'))`来抛出异常来中止函数的执行·，如果不捕获这个异常，那么就会在浏览器产生报错信息。



```JS
    function* foo(name1) {
      console.log("执行内部代码:1111", name1)
      console.log("执行内部代码:2222", name1)
      const name2 = yield "aaaa"
      console.log("执行内部代码:3333", name2)
      console.log("执行内部代码:4444", name2)
      const name3 = yield "bbbb"
      // return "bbbb"
      console.log("执行内部代码:5555", name3)
      console.log("执行内部代码:6666", name3)
      yield "cccc"

      console.log("最后一次执行")
      return undefined
    }

    const generator = foo("next1")

    // 1.generator.return提前结束函数
    // console.log(generator.next())
    // console.log(generator.return("next2"))
    // console.log("-------------------")
    // console.log(generator.next("next3"))
    // console.log(generator.next("next4"))

    // 2.generator.throw向函数抛出一个异常
    console.log(generator.next())
    console.log(generator.throw(new Error("next2 throw error")))
    console.log("-------------------")
    console.log(generator.next("next3"))
    console.log(generator.next("next4"))
```

#### 总结

return传值后这个生成器函数就会结束，之后调用next不会继续生成值了；

抛出异常后我们可以在生成器函数中捕获异常；

​	但是在catch语句中不能继续yield新的值了，但是可以在catch语句外使用yield继续中断函数的执行；



## 生成器替代迭代器

```JS
    // 1.对之前的代码进行重构(用生成器函数)
    const names = ["abc", "cba", "nba"]
    const nums = [100, 22, 66, 88, 55]

    function* createArrayIterator(arr) {
      for (let i = 0; i < arr.length; i++) {
        yield arr[i]
      }
      // yield arr[0]
      // yield arr[1]
      // yield arr[2]
      // return undefined
    }

    // const namesIterator = createArrayIterator(names)
    // console.log(namesIterator.next())
    // console.log(namesIterator.next())
    // console.log(namesIterator.next())
    // console.log(namesIterator.next())

    // const numsIterator = createArrayIterator(nums)
    // console.log(numsIterator.next())
    // console.log(numsIterator.next())
    // console.log(numsIterator.next())
    // console.log(numsIterator.next())
    // console.log(numsIterator.next())
    // console.log(numsIterator.next())

    // 2.生成器函数, 可以生成某个范围的值
    // [3, 9)
    function* createRangeGenerator(start, end) {
      for (let i = start; i < end; i++) {
        yield i
      }
    }

    const rangeGen = createRangeGenerator(3, 9)
    console.log(rangeGen.next())
    console.log(rangeGen.next())
    console.log(rangeGen.next())
    console.log(rangeGen.next())
    console.log(rangeGen.next())
    console.log(rangeGen.next())
    console.log(rangeGen.next())
    console.log(rangeGen.next())
```

我们通过一个生成器函数，直接遍历获取可迭代对象中每一个值，以此来输出对应的数值。

生成器函数最重要的作用，是为了做到生成一个可选范围的值，我们可以选择一个范围，以此生成这个范围对应的数字。



### 生成器yield语法糖

yield*可以用于可迭代对象的自动迭代，它会遍历和自动yield可迭代对象的每一个元素，一行代码就可以解决上面的繁琐代码。

```JS
      // 1.yield*替换之前的方案
      const names = ["abc", "cba", "nba"];
      const nums = [100, 22, 66, 88, 55];

      function* createArrayIterator(arr) {
        yield* arr;
      }

      const namesIterator = createArrayIterator(names);
      console.log(namesIterator.next());
      console.log(namesIterator.next());
      console.log(namesIterator.next());
      console.log(namesIterator.next());
```

我们可以用这个语法糖来直接实现迭代器：

```JS
    // 2.yield替换类中的实现
    class Person {
      constructor(name, age, height, friends) {
        this.name = name
        this.age = age
        this.height = height
        this.friends = friends
      }

      // 实例方法
      *[Symbol.iterator]() {
        yield* this.friends
      }
    }

    const p = new Person("why", 18, 1.88, ["kobe", "james", "curry"])
    for (const item of p) {
      console.log(item)
    }

    const pIterator = p[Symbol.iterator]()
    console.log(pIterator.next())
    console.log(pIterator.next())
    console.log(pIterator.next())
    console.log(pIterator.next())
```

