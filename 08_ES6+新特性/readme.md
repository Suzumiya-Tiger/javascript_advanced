##  标签模板字符串

```js
    function foo(...args) {
      console.log("参数:", args)
    }
    foo("why", 18, 1.88)
```

首先 `...args`是能够以数组解构的方式来接收若干个非数组形式的参数，这是一个需要记录的知识点。

函数接收对象还有一种非常特殊的方式，它允许以模板字符串的形式传入参数，并且可以插入动态的属性值：

```js
    foo`my name is ${name}, age is ${age}, height is ${1.88}`
```

函数内部打印出来的 `args`是一种极其特殊的存在，它存放着一个数组，而数组里面又分别存放着一个数组和插入值元素：

它的内部第一个元素是数组，存放着模板字符串，里面根据分割的插入值从而被分成了若干个片段，除该数组以外的其它若干个元素都是插入值。

![image-20240216121452382](/Users/heinrichhu/前端项目/JavaScript_Advanced/ES6+新特性/image-20240216121452382.png)

![image-20240216121921340](/Users/heinrichhu/前端项目/JavaScript_Advanced/ES6+新特性/image-20240216121921340.png)

这种标签模板字符串的应用常常应用于React，比如可以利用这种特性实现css in js：

![image-20240216122331543](/Users/heinrichhu/前端项目/JavaScript_Advanced/ES6+新特性/image-20240216122331543.png)



## 函数默认值

注意，函数的参数默认赋值不对`null`做处理，只针对`undefined`进行处理：

```js
    // 注意: 默认参数是不会对null进行处理的
    function foo(arg2,arg1 = "我是默认值") {
      // 1.两种写法不严谨
      // 默认值写法一:
      // arg1 = arg1 ? arg1: "我是默认值"

      // 默认值写法二:
      // arg1 = arg1 || "我是默认值"

      // 2.严谨的写法
      // 三元运算符
      // arg1 = (arg1 === undefined || arg1 === null) ? "我是默认值": arg1
      
      // ES6之后新增语法: ??
      // arg1 = arg1 ?? "我是默认值"

      // 3.简便的写法: 默认参数
      console.log(arg1)
    }
```

如果我们期望对`null`进行非空判断处理，那么我们需要自己对传参进行三元运算符的判断。

顺带一提，`??`形式的判断是针对属性为`null`或者`undefined`来进行判断的。

**另外注意：**

- **如果只是部分参数需要默认赋值，默认赋值的参数应该放在最后面，而不应该放在没有默认赋值传参的前面。这个和剩余参数的处理方式相同，但是默认参数应该放在剩余参数的前面。**
- **有默认赋值的传参不计算在函数的`length`之内。**



### 默认参数解构

对象的解构过程中也可以给解构的对应属性添加默认值：

```js
     const obj = { name: "why" }
      const { name = "kobe", age = 18 } = obj
```

同样，我们也可以针对函数传参的默认赋值进行进一步的解构，直接使用对象内部的属性：

```js
    function foo({ name, age } = { name: "why", age: 18 }) {
      console.log(name, age)
    }

    function foo({ name = "why", age = 18 } = {}) {
      console.log(name, age)
    }

    foo() 
```

第一个代码是默认对象中存在name和age，但可能没有赋值，所以会对传参对象内部的属性进行一个默认赋值操作。

第二个代码的解构思路在于：如果函数在调用时没有传参 ，那么我们就自动增加一个对象和内部属性，并且进行默认赋值。

 

## 箭头函数的补充

箭头函数不存在显式原型，但是箭头函数存在隐式原型，它关联着 `Function.prototype`。

正因为箭头函数没有显式原型，没有办法完成构造函数调用的新对象隐式原型关联函数的显式原型，所以箭头函数无法被当做构造函数使用。

```js
      // 1.function定义的函数是有两个原型的:
      function foo() {}
      console.log(foo.prototype); // new foo() -> f.__proto__ = foo.prototype
      console.log(foo.__proto__); // -> Function.prototype

      // 2.箭头函数是没有显式原型
      // 在ES6之后, 定义一个类要使用class定义
      var bar = () => {};
      console.log(bar.__proto__ === Function.prototype);
      // 没有显式原型
      console.log(bar.prototype);
      var b = new bar();
```



同时，箭头函数不绑定this，arguments，super参数，箭头函数的this和外层词法作用域相绑定。



## 拷贝

请注意，本章在面试题汇总收集里面有详细的讲解。

### 可迭代对象和展开语法

在 JavaScript 中，可迭代对象是指实现了迭代协议的对象。迭代协议要求对象定义或继承一个名为 `Symbol.iterator` 的方法。

`Symbol.iterator` 方法应返回一个迭代器对象，即一个具有 `next` 方法的对象。每次调用 `next` 方法，都应返回一个结果对象，该对象有两个属性：`value` 和 `done`。`value` 属性表示当前的值，`done` 属性是一个布尔值，表示是否已经迭代完所有的值。

数组、字符串、Map、Set 等内置类型都是可迭代对象，因为它们的原型链上都定义了 `Symbol.iterator` 方法。你也可以自定义可迭代对象，只需要在对象上实现 `Symbol.iterator` 方法即可。

**对象默认不是可迭代的，在U don't know JS里面关于for of有讲解这一概念。**

只有可迭代对象才能实现展开语法，但是在普通对象中做了一次增强：**对象字面量可以实现可迭代效果**。

 

### 展开语法(Spread syntax)

可以在函数调用/数组构造时，将数组表达式或者string在语法层面展开；

还可以在构造字面量对象时, 将对象表达式按key-value的方式展开；

◼ **展开语法的场景：**

在函数调用时使用； 

在数组构造时使用；

在构建对象字面量时，也可以使用展开运算符，这个是在ES2018（ES9）中添加的新特性；

◼ **谨记：展开运算符其实是一种浅拷贝；**

```js
    // 1.基本演练
    // ES6
    const names = ["abc", "cba", "nba", "mba"]
    const str = "Hello"

    // const newNames = [...names, "aaa", "bbb"]
    // console.log(newNames)

    function foo(name1, name2, ...args) {
      console.log(name1, name2, args)
    }

    foo(...names)
    foo(...str)

    // ES9(ES2018)
    const obj = {
      name: "why",
      age: 18
    }
    // 不可以这样来使用
    // foo(...obj) // 在函数的调用时, 用展开运算符, 将对应的展开数据, 进行迭代
    // 可迭代对象: 数组/string/arguments

    const info = {
      ...obj,
      height: 1.88,
      address: "广州市"
    }
    console.log(info)
```



### 赋值操作

针对对象的赋值操作实际上就是将被赋值的属性赋予一个指向堆内存的对象的内存地址，我们常常称其为 **引用赋值**。

![image-20240216150332723](/Users/heinrichhu/前端项目/JavaScript_Advanced/ES6+新特性/image-20240216150332723.png)

引用赋值会导致其中一个对象修改了属性，另外一个对象也会受到影响。

### 浅拷贝

浅拷贝顾名思义，它会创建一个新的对象和内存地址，里面复制了一圈目标对象的属性，但是目标对象的函数或对象只是**赋值**了原对象的函数或对象的 **内存地址**。

```js
      // 2.浅拷贝
      const info2 = {
        ...obj
      };
      info2.name = "kobe";
      console.log(obj.name);
      console.log(info2.name);
      info2.friend.name = "james";
      console.log(obj.friend.name);
```



浅拷贝不会深层次地去拷贝对象内部的引用对象/函数，它只会负责拷贝基本属性。

 



### 深拷贝

```js
     // 3.深拷贝
      // 方式一: 第三方库
      // 方式二: 自己实现
      // function deepCopy(obj) {}
      // 方式三: 利用先有的js机制, 实现深拷贝JSON
      const info3 = JSON.parse(JSON.stringify(obj)); 
      console.log(info3.friend.name);
      info3.friend.name = "james";
      console.log("info3.friend.name:", info3.friend.name);
      console.log(obj.friend.name);
```

请注意，使用`JSON.parse(JSON.stringify(obj))`不能够深拷贝函数，常用于普通对象和数组对象。

![image-20240216153716714](/Users/heinrichhu/前端项目/JavaScript_Advanced/ES6+新特性/image-20240216153716714.png)



## Symbol

Symbol是为了解决对象重名变量冲突的问题，因为你无法保证传入对象的属性名不会和后续操作产生冲突。

**那么为什么需要Symbol呢？**

- 在ES6之前，对象的属性名都是字符串形式，那么很容易造成属性名的冲突；
- 比如原来有一个对象，我们希望在其中添加一个新的属性和值，但是我们在不确定它原来内部有什么内容的情况下，很容易
- 造成冲突，从而覆盖掉它内部的某个属性；
- 比如我们前面在讲apply、call、bind实现时，我们有给其中添加一个fn属性，那么如果它内部原来已经有了fn属性了呢？
- 比如开发中我们使用混入，那么混入中出现了同名的属性，必然有一个会被覆盖掉；

◼ Symbol就是为了解决上面的问题，用来**生成一个独一无二的值**。

- Symbol值是通过Symbol函数来生成的，生成后可以作为**属性名**；
- 也就是在ES6中，**对象的属性名可以使用字符串，也可以使用Symbol值**；

◼ **Symbol即使多次创建值，它们也是不同的：**Symbol函数执行后每次创建出来的值都是独一无二的； 

```js
    // ES6之后可以使用Symbol生成一个独一无二的值
    const s1 = Symbol()
    // const info = { name: "why" }
    const obj = {
      [s1]: "aaa" 
    }
    console.log(obj)

    const s2 = Symbol()
    obj[s2] = "bbb"
    console.log(obj)

    function foo(obj) {
      const sKey = Symbol()
      obj[sKey] = function() {}
      delete obj[sKey]
    }

    foo(obj)
```



**我们也可以在创建Symbol值的时候传入一个描述description**：这个是ES2019（ES10）新增的特性：

```js
    // 2.获取symbol对应的key
    console.log(Object.keys(obj))
    console.log(Object.getOwnPropertySymbols(obj))
    const symbolKeys = Object.getOwnPropertySymbols(obj) //[Symbol(),symbol()]
    for (const key of symbolKeys) {
      console.log(obj[key]) //获取对应的值
    }

    // 3.description
    // 3.1.Symbol函数直接生成的值, 都是独一无二
    const s3 = Symbol("ccc")
    console.log(s3.description)
    const s4 = Symbol(s3.description)
    console.log(s3 === s4)

    // 3.2. 如果相同的key, 通过Symbol.for可以生成相同的Symbol值
    const s5 = Symbol.for("ddd")
    const s6 = Symbol.for("ddd")
    console.log(s5 === s6)

    // 获取传入的key
    console.log(Symbol.keyFor(s5))
```

`Object.keys()`无法获取一个对象中的Symbol键，我们需要使用 `Object.getOwnPropertySymbols(obj)`来获取obj对象上面的Symbol属性。

 通过`Symbol()`函数生成的属性名都是独一无二的，就算使用`Symbol`的描述符`description`作为另一个`Symbol()`的描述符，也无济于事，不会使得二者相等。

但是我们可以使用 `Symbol.for(key)`应用相同的key使得两个Symbol的值相等。



# Set

**Set是一个新增的数据结构，可以用来保存数据，它是一个类似于数组，但是和数组的区别就是元素不可以重复。**

创建Set我们必须通过**Set构造函数**。

我们可以使用通过`new Set()`创建set实例中的`add`方法，来实现Set集合中添加属性的方法：

```js
   // 2.添加元素
    set.add(10)
    set.add(22)
    set.add(35)
    set.add(22)
    console.log(set)

    const info = {}
    const obj = {name: "obj"}
    set.add(info)
    set.add(obj)
//重复添加的值不会被添加进set集合对象
    set.add(obj)
    console.log(set)
```

因为`new Set()`可以接受一个可迭代对象作为参数，所以我们常常会使用它来**实现数组的去重，**然后使用 `Array.from(set对象)`将其转换为数组，输出正确的结果：

```js
 //将目标数组作为参数传入new Set()
		const newNamesSet = new Set(names)
    const newNames = Array.from(newNamesSet)
    console.log(newNames)
```

### Set常见的属性

size：返回Set中元素的个数；

### Set常用的方法

- add(value)：添加某个元素，返回Set对象本身；
- delete(value)：从set中删除和这个值相等的元素，返回boolean类型；
- has(value)：判断set中是否存在某个元素，返 回boolean类型； 
- clear()：清空set中所有的元素，没有返回值；
- forEach(callback, [, thisArg])：通过forEach遍历set；
-  **另外Set是支持for of的遍历的，这意味着它也是一个可迭代对象。**

```js
    // 4.Set的其他属性和方法
    // 属性
    console.log(set.size)
    // 方法
    // 4.1. add方法
    set.add(100)
    console.log(set)
    // 4.2. delete方法
    set.delete(obj)
    console.log(set)
    // 4.3. has方法
    console.log(set.has(info))
    // 4.4. clear方法
    // set.clear()
    // console.log(set)
    // 4.5. forEach
    set.forEach(item => console.log(item))

    // 5.set支持for...of
    for (const item of set) {
      console.log(item)
    }
```

## WeakSet

我们先从一段普通的代码开始：

```js
    // 1.Weak Reference(弱引用)和Strong Reference(强引用)
    let obj1 = { name: "why" }
    let obj2 = { name: "kobe" }
    let obj3 = { name: "jame" }

     let arr = [obj1, obj2, obj3]
     obj1 = null
     obj2 = null
     obj3 = null

     const set = new Set(arr)
     arr = null
```

上面看似只是一段普通的代码，实际上却大有玄机，我之前错误地理解了`arr`数组中三个obj在执行赋值`null`后，其数组中的三个对象也会变成`null`，实际上理解完全错误。

数组存放的只不过是三个obj对象的内存地址，而后这三个obj变更了内存地址的指向，但是并不影响数组中持续存储原数组对象的内存地址，因为我们实现三个obj的赋值本质上只不过是赋值内存地址，无论原对象如何变更赋值指向，其数组保存的内存地址是不受影响的。

![image-20240217012043019](/Users/heinrichhu/前端项目/JavaScript_Advanced/ES6+新特性/image-20240217012043019.png)

在JavaScript中，当你创建一个对象并将其赋值给一个变量时，这个变量就持有了对这个对象的一个**强引用**。**只要这个强引用存在，垃圾回收器就不会回收这个对象。**

在你的代码中，`arr` 是一个数组，它包含对 `obj1`、`obj2` 和 `obj3` 的强引用。当你将 `obj1`、`obj2` 和 `obj3` 设置为 `null` 时，你只是删除了这些变量对原始对象的引用，**但是 `arr` 仍然持有对这些对象的强引用**，所以这些对象不会被垃圾回收，它们在 `arr` 中的值也不会变为 `null`。

当你将 `arr` 设置为 `null` 时，你删除了 `arr` 对这些对象的强引用，但是 `set` 仍然持有对这些对象的强引用，所以这些对象仍然不会被垃圾回收。

总的来说，只有当一个对象没有任何强引用指向它时，它才会被垃圾回收。在你的代码中，只有当 `arr` 和 `set` 都被设置为 `null` 时，`obj1`、`obj2` 和 `obj3` 才会被垃圾回收。



```js
    const set = new Set(arr)
     arr = null
```

set变量依然保持了对三个obj对象的强引用，但是如果改成了`new weakSet(arr)`，就会导致引用关系丢失。

### WeakSet的定义

 **和Set类似的另外一个数据结构称之为WeakSet，也是内部元素不能重复的数据结构。**

**那么和Set有什么区别呢？**

- 区别一：**WeakSet中只能存放对象类型，**不能存放基本数据类型；
- 区别二：WeakSet对元素的引用是**弱引用**，<u>如果没有其他引用对某个对象进行引用，那么GC可以对该对象进行回收</u>；

####  WeakSet常见的方法

- add(value)：添加某个元素，返回WeakS et对象本身；
- delete(value)：从WeakSet中删除和这个值相等的元素，返回boolean类型；
- has(value)：判断WeakSet中是否存在某个元素，返回boolean类型；



**注意：WeakSet不能遍历**！

因为WeakSet只是对对象的弱引用，如果我们遍历获取到其中的元素，那么有可能造成对象不能正常的销毁。

**所以存储到WeakSet中的对象是没办法获取的；**



那么我们如何理解WeakSet的作用呢？

```js
   // 3.WeakSet的应用
    const pWeakSet = new WeakSet()
    class Person {  
      constructor() {
        pWeakSet.add(this)
      }

      running() {
        if (!pWeakSet.has(this)) {
          console.log("Type error: 调用的方式不对")
          return
        }
        console.log("running~")
      }
    }

    let p = new Person()
    // p = null
    p.running()
    const runFn = p.running
    runFn()
    const obj = { run: runFn }
    obj.run()
```

 

只有我们每次通过`new Person()`创建的对象，才会被添加到`pWeakSet`里面去，因为`new Person()`会触发`constructor(){}`里面的操作，使得`pWeakSet`添加对应的对象实例。

我们可以防止`window`或者其他对象引用该方法时被正常调用，只允许基于这个构造函数创建的实例对象来进行调用操作。





# Map

Map在中文里面的释义是**映射**，Map对象中的数值展现的数据形式是 `key:value`键值对的形式。

传统对象只能用字符串或者`Symbol()`生成的属性来当做键，**而Map可以使用对象来作为键**。

普通对象使用`[对象]:值`的形式充当键值对有一个弊端，那就是对应的键名永远不会是对象，而是 `[Object Object]`这样统一的字符串。

而且因为用这种方式定义的键都是相同的字符串`[Object Object]`，所以会导致后面定义的键值对覆盖前面定义的键值对。

Map和Set的不同之处就在于Map可以定义键，而且相较于对象可以定义不同复杂类型的键：

```js
    const info = { name: "why" }
    const info2 = { age: 18 }

    // 1.对象类型的局限性: 不可以使用复杂类型作为key
    // const obj = {
    //   address: "北京市",
    //   [info]: "哈哈哈",
    //   [info2]: "呵呵呵"
    // }
    // console.log(obj)

    // 2.Map映射类型
    const map = new Map()
    map.set(info, "aaaa")
    map.set(info2, "bbbb")
    console.log(map)
```



### Map常见的属性

size：返回Map中元素的个数；

## Map常见的方法

- set(key, value)：在Map中添加key、value，并且返回整个Map对象；
- get(key)：根据key获取Map中的value；
- has(key)：判断是否包括某一个key，返回Boolean类型；
- delete(key)：根据key删除一个键值对，返回Boolean类型；
- clear()：清空所有的元素；
- forEach(callback, [, thisArg])：通过forEach遍历Map，**获取的item是属性的value值**；
- **Map也可以通过for of进行遍历，遍历出来的单项是以 `[键，值]`这样的数组形式展示的。**



Map其实最大的用途就是**允许使用对象作为一个键来使用**。





## WeakMap

**weakMap的键只允许是对象的形式，而且通过WeakMap构建的对象实例会建立弱引用关联。**

WeakMap是不允许遍历的，恰恰就是基于其弱引用特性所导致的。



# ES6+各类新特性

## 遍历普通对象的值

期望获取对象的键和值都拥有了对应的新方法：

```js
   const obj = {
      name: "why",
      age: 18,
      height: 1.88,
      address: "广州市"
    }

    // 1.获取所有的key
    const keys = Object.keys(obj)
    console.log(keys)

    // 2.ES8 Object.values
    const values = Object.values(obj)
    console.log(values)
```

### Object.entires()

同时我们可以考虑使用 `Object.entires(obj)`来获取对应普通对象的键值对，它将以数组的方式呈现：

```js
     // 3.ES8 Object.entries
    // 3.1. 对对象操作
    const entries = Object.entries(obj)
    console.log(entries)
    for (const entry of entries) {
      const [key, value] = entry
      console.log(key, value)
    }

    // 3.2. 对数组/字符串操作(了解)
    console.log(Object.entries(["abc", "cba"]))
    console.log(Object.entries("Hello"))
```

![image-20240218122910853](/Users/heinrichhu/前端项目/JavaScript_Advanced/ES6+新特性/image-20240218122910853.png)

我们可以使用 `for...of`方法来处理`Object.entires()`处理的对象，因为其生成的结果就是一个数组。



## 字符串填充

在ES8中提供了 `padstart(整体字符串位数，填充字符串)`这一用于填充字符串的方法，它会在字符串的前面填充，根据你选择的整体位数来填充对应的字符串，如果整体位数已经满足了你定义的整体位数，则不做填充 ：

```js
    const minute = "15".padStart(2, "0")
     const second = "6".padStart(2, "0")

     console.log(`${minute}:${second}`) //15:06
```

我们也可以实现一个敏感数据的字符串加密化：

```js
      // 2.应用场景二: 对一些敏感数据格式化
      let cardNumber = "132666200001018899";
      const sliceNumber = cardNumber.slice(-4); 
      cardNumber = sliceNumber.padStart(cardNumber.length, "*");
      const cardEl = document.querySelector(".card");
      cardEl.textContent = cardNumber;  //**************8899
```



## 数组处理

### flat

我们可以使用flat来实现深层次数组的扁平化，里面的传参就是扁平化的程度，默认会全部展开和扁平化。

flat() 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

```js
     const nums = [10, 20, [111, 222], [333, 444], [[123, 321], [231, 312]]]
     const newNums1 = nums.flat(1)
     console.log(newNums1)
     const newNums2 = nums.flat(2)
     console.log(newNums2)
```



### flatMap

`flatMap()`可以实现对数组中每一个元素实现分割，借此完成一些特殊化的需求。**简单来说就是针对数组中字符串切割，将其作为独立元素塞进一个新数组里面。**

**`flatMap()` 方法首先使用映射函数映射每个元素，然后将结果压缩成一个新数组。**

注意一：flatMap是先进行map操作，再做flat的操作；

注意二：flatMap中的flat相当于深度为1； 

```js
    // 2.flatMap的使用:
    // 1> 对数组中每一个元素应用一次传入的map对应的函数
    const messages = [
      "Hello World aaaaa",
      "Hello Coderwhy",
      "你好啊 李银河"
    ]

    // 1.for循环的方式:
    // const newInfos = []
    // for (const item of messages) {
    //   const infos = item.split(" ")
    //   for (const info of infos) {
    //     newInfos.push(info)
    //   }
    // }
    // console.log(newInfos)

    // 2.先进行map, 再进行flat操作
    // const newMessages = messages.map(item => item.split(" "))
    // const finalMessages = newMessages.flat(1)
    // console.log(finalMessages)

    // 3.flatMap
    const finalMessages = messages.flatMap(item => item.split(" "))
    console.log(finalMessages)
```

flatMap实际上就是基于数组map处理后的结果进行一次扁平化的处理。



## 空值合并运算符

空值合并运算符 `??`只会在值为 `null`或者 `undefined`的时候判断为空，其它类型的值比如`false，""，0`都不会判断为空。

```js
    let info = undefined
    // info = info || "默认值"
    // console.log(info)

    // ??: 空值合并运算符
    info = info ?? "默认值"
    console.log(info)
```



## 可选链操作

JS代码在执行中如果出现错误，会导致下面的代码无法运行，以前多会选择使用if做递进判断，但是现在我们有了更好的用法：

```js
    const obj = {
      name: "why",
      friend: {
        name: "kobe",
         running: function() {
           console.log("running~")
         }
      }
    }

    // 1.直接调用: 非常危险
    // obj.friend.running()

    // 2.if判断: 麻烦/不够简洁
    // if (obj.friend && obj.friend.running) {
    //   obj.friend.running()
    // }

    // 3.可选链的用法: ?.
    obj?.friend?.running?.()
```

 

可选链的逻辑就是只有存在对应属性的情况下才能够获取，没有则默认返回一个 `undefined`。上面代码必须在running也需要进行可选链判断，不然不存在该属性的情况下会导致出现 `undefined()`的表达结果。

可选链也是ES11中新增一个特性，主要作用是让我们的代码在进行`null`和`undefined`判断时更加清晰和简洁。



## FinalizationRegistry

 

FinalizationRegistry 对象可以让你在对象被垃圾回收时请求一个回调。

- FinalizationRegistry 提供了这样的一种方法：当一个在注册表中注册的对象被回收时，请求在某个时间点上调用一个清理回调。（清理回调有时被称为 finalizer ）;
- 你可以通过调用register方法，注册任何你想要清理回调的对象，传入该对象和所含的值;

GC的回收常常发生在CPU空闲的时候进行处理，而不一定是立刻执行。

```js
    let obj = { name: "why", age: 18 }
    let info = { name: "kobe", age: 30 }

    const finalRegistry = new FinalizationRegistry((value) => {
      console.log("某一个对象被回收了:", value)
    })

    finalRegistry.register(obj, "why")
    finalRegistry.register(info, "kobe")

    // obj = null
    info = null
```



## WeakRef

假设我们默认为某个对象进行赋值操作，被赋值的属性和对象会产生强引用关联：

```js
    let info = { name: "why", age: 18 }
```

有时候对应的对象可能在别处建立了强引用，就会导致垃圾回收不会成功，所以我们可以延伸出一个观点：其它对需要GC垃圾回收的对象要使用弱引用，确保需要的时候该对象被回收。

```js
      let info = { name: "why", age: 18 };
      let obj = new WeakRef(info);
      let obj2 = new WeakRef(info);

      const finalRegistry = new FinalizationRegistry(() => {
        console.log("对象被回收~");
      });

      finalRegistry.register(info, "info");

      setTimeout(() => {
        info = null;
      }, 2000);

      setTimeout(() => {
        console.log(obj.deref().name, obj.deref().age);
      }, 8000);
```

无法直接从弱引用对象中获取属性，必须借助 `obj.deref()`进行解析，才能获取弱引用对象的内部属性。

 但是需要注意，一旦执行了类似于 `const newObj=obj.deref()`的对象和属性建立关系，就会导致newObj和obj建立了强引用关系，无法在后续的操作完成GC垃圾回收。



## Object.hasOwn(obj, propKey)

 该方法用于替代`obj.hasOwnProperty()`,主要是为了避免通过 `Object.create(null)`创建出来的实例对象无法正常调用`obj.hasOwnProperty()`，所提出的解决方案：

```js
    const info = Object.create(null)
    info.name = "why"
    // console.log(info.hasOwnProperty("name"))
    console.log(Object.hasOwn(info, "name"))
```





# Class全新的定义

## 设置公共属性

在新版本中，class可以直接采用赋值的形式定义自有的属性：

```js
    class Person {
      // 1.实例属性
      // 对象属性: public 公共 -> public instance fields
      height = 1.88     
      constructor(name, age) {
        // 对象中的属性: 在constructor通过this设置
        this.name = name
        this.age = age
        this.address = "广州市"
      }
    }
```

这种设置方法等效于在 `constructor`里面通过this来设置类的自有属性。

## 设置私有属性

以前JS标准没有发布私有属性的特性时，程序员约定俗成使用_开头来代表私有属性，而目前最新版本支持采用#开头的字段，强制约束为私有属性，外部无法访问：

```js
class Person {
  // 1.实例属性
  // 对象属性: public 公共 -> public instance fields
  height = 1.88     
  // ES13对象属性: private 私有: 程序员之间的约定
  #intro = "name is why"
  constructor(name, age) {
    // 对象中的属性: 在constructor通过this设置
    this.name = name
    this.age = age
    this.address = "广州市"
  }
}
```

## 设置类的自有属性

如果我们期望直接通过类访问内部的静态 属性或者方法，我们会通过 `static`字段来标识类的静态属性/静态方法：

```js
    class Person {
      // 1.实例属性
      // 对象属性: public 公共 -> public instance fields
      height = 1.88

      // 对象属性: private 私有: 程序员之间的约定
      // _intro = "name is why"
      
      // ES13对象属性: private 私有: 程序员之间的约定
      #intro = "name is why"


      // 2.类属性(static)
      // 类属性: public
      static totalCount = "70亿"

      // 类属性: private
      static #maleTotalCount = "20亿"

      constructor(name, age) {
        // 对象中的属性: 在constructor通过this设置
        this.name = name
        this.age = age
        this.address = "广州市"
      }

      // 3.静态代码块
      static {
        console.log("Hello World")
        console.log("Hello Person")
      }
    }
```

 如果静态属性加上了 `#`标识符作为属性的开头，那么就无法通过外部的实例访问。

**而静态代码块则是一种类的初始化的操作，它会先于所有操作之前优先执行：**

![image-20240218233251997](/Users/heinrichhu/前端项目/JavaScript_Advanced/ES6+新特性/image-20240218233251997.png)