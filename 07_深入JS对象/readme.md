# 深入JS对象

### 对象字面量增强

ES6针对对象字面量进行了增强，分别是属性的简写，方法的简写和计算属性名。

我们可以直接在对象中引入对象作用域外部的属性，并且可以使用省略式的语法糖写法。同时，我们也可以使用箭头函数来定义对象内部的函数方法：

```js
    /*
      1.属性的增强
      2.方法的增强
      3.计算属性名的写法
    */

    var name = "why"
    var age = 18

    var key = "address" + " city"

    var obj = {
      // 1.属性的增强
      name,
      age,

      // 2.方法的增强
      running: function() {
        console.log(this)
      },
      swimming() {
        console.log(this)
      },
      eating: () => {
        console.log(this)
      },

      // 3.计算属性名
      [key]: "广州"
    }

    obj.running()
    obj.swimming()
    obj.eating()
```

请注意，当我们希望省略对象中的属性的值时，必须确保键和值名称完全一致，才能进行省略操作，这都是一种简写的语法糖。

同时，我们也可以实现类似于class对函数方法定义的写法，这也是一种语法糖，只需要在对象中直接以 `Fn(){}`的形式完成定义操作，不同于箭头函数，该函数内部会绑定this。

同时我们可以针对外部的属性，采用`[键名]`的形式来完成计算属性名的动态插入。



### 解构

我们可以对数组或者对象进行解构，这方便了我们直接获取对象中的某个指定变量。

数组的解构会根据数组的下标顺序依次解构对应的属性，普通对象的解构可以通过指定的属性名来获取对应的属性值。

#### 数组

```js
    var names = ["abc", "cba", undefined, "nba", "mba"]


    // 1.数组的解构
     var name1 = names[0]
     var name2 = names[1]
     var name3 = names[2]
    // 1.1. 基本使用
     var [name1, name2, name3] = names
     console.log(name1, name2, name3)


```

数组的解构拥有严格的顺序，如果我们不想获取中间某个变量，必须使用逗号分隔空白留置属性：

```js
    // 1.2. 顺序问题: 严格的顺序
     var [name1, , name3] = names
     console.log(name1, name3)
```

同时，我们可以利用 `...`来完成剩余变量的表示

```js
    // 1.3. 解构出数组
     var [name1, name2, ...newNames] = names
     console.log(name1, name2, newNames)
```

同样，我们可以通过默认赋值来对解构的属性进行赋值操作，防止出现 `undefined`的情况。

```js
    // 1.4. 解构的默认值
    var [name1, name2, name3 = "default"] = names
    console.log(name1, name2, name3)
```

#### 对象

```js
   // 2.对象的解构
    var obj = { name: "why", age: 18, height: 1.88 }
    // var name = obj.name
    // var age = obj.age
    // var height = obj.height
    // 2.1. 基本使用
     var { name, age, height } = obj
     console.log(name, age, height)

```

对象的解构没有顺序可言，而是根据key值来选择解构指定的对应值。

```js
    // 2.2. 顺序问题: 对象的解构是没有顺序, 根据key解构
     var { height, name, age } = obj
     console.log(name, age, height)
```

我们可以对对象进行重命名操作，以 `key:重命名键名`来完成重命名操作：

```js
    //  2.3. 对变量进行重命名
     var { height: wHeight, name: wName, age: wAge } = obj
     console.log(wName, wAge, wHeight)
```

同样我们可以结合重命名进行默认赋值操作：

```js
   // 2.4. 默认值
    var { 
      height: wHeight, 
      name: wName, 
      age: wAge, 
      address: wAddress = "中国"
    } = obj
    console.log(wName, wAge, wHeight, wAddress)
```

剩余操作会将剩下的参数放在一个新对象之中：

```js
    // 2.5. 对象的剩余内容
    var {
      name,
      age,
      ...newObj
    } = obj
    console.log(newObj)
```



#### 常用场景

我们常常使用函数传参来进行对象的解构操作，通过对传参进行对象形式的属性对照操作，完成解构：

```js
    // 应用: 在函数中(其他类似的地方)
    function getPosition({ x, y }) {
      console.log(x, y)
    }

    getPosition({ x: 10, y: 20 })
    getPosition({ x: 25, y: 35 })
```

![image-20240215013454104](/Users/heinrichhu/前端项目/JavaScript_Advanced/07_深入JS对象/image-20240215013454104.png)



## 手写apply/call/bind

在JavaScript中，函数本身也是对象，可以拥有属性和方法。

但是，当你创建一个函数的实例（也就是通过`new`关键字创建的对象）时，**这个实例只能访问到函数的原型（`prototype`）上的属性和方法，而不能访问到函数对象本身的属性和方法。**

这是因为在JavaScript中，每一个对象都有一个内部属性`[[Prototype]]`，它指向了创建这个对象的函数的`prototype`。当你试图访问一个对象的某个属性或方法时，JavaScript会首先在这个对象本身上查找，如果找不到，就会去它的`[[Prototype]]`（也就是它的原型）上查找，依此类推，直到找到相应的属性或方法，或者查找到原型链的末端（`null`）。

所以，当你创建一个函数的实例时，这个实例只能访问到函数的`prototype`上的属性和方法，而不能访问到函数对象本身的属性和方法。如果你想让所有实例都能访问到某个方法，你应该将这个方法定义在函数的`prototype`上，而不是函数对象本身上。

### 理解Function

我们需要知道，apply和call等一系列方法，是基于`Function.prototype`所定义的，也就是说只有基于 `new Function(){}`生成的函数实例，才能够调用这些方法。

`Function.prototype`是所有JS函数的显式原型，对应的这些js函数的隐式原型关联着`Function.prototype`，它们可以基于原型链调用其上面的方法，也可以称之为普通函数都共享着`Function.prototype`上面的方法。

普通函数本身也是一个对象，它可以通过隐式绑定使得`Function.prototype`上面的方法，在调用中使得其方法内部的`this`指向函数本身。

### 使用隐式绑定实现apply/call

我们可以基于隐式绑定来实现apply方法：

```js
    
    // new Function()
    // foo.__proto__ === Function.prototype
    function foo(name, age) {
      console.log(this, name, age)
    }
		// 1.给函数对象添加方法: hyapply
    Function.prototype.hycall = function(thisArg, ...otherArgs) {
      // this -> 调用的函数对象
      // thisArg -> 传入的第一个参数, 要绑定的this
      // console.log(this) // -> 当前调用的函数对象
      // this.apply(thisArg)

      // 1.获取thisArg, 并且确保是一个对象类型
      thisArg = (thisArg === null || thisArg === undefined)? window: Object(thisArg)

      // thisArg.fn = this
      Object.defineProperty(thisArg, "fn", {
        enumerable: false,
        configurable: true,
        value: this
      })
      thisArg.fn(...otherArgs)

      delete thisArg.fn
    }

  foo.hycall({ name: "why" }, "james", 25)
    foo.hycall(123, "why", 18)
    foo.hycall(null, "kobe", 30)
```

首先，我们需要在自定义apply方法里面分别传入两个参数，一个是需要绑定的目标对象，另外一个则是传入参数。

我们需要对目标对象的类型进行检测，如果目标对象是`null`或者`undefined`，那么我们就默认目标对象是一个`window`全局对象，如果不是则对目标对象再进行一次`Object()`处理。

为什么需要再进行一次 `Objcet()`处理？因为传入的目标对象可能是一个字符串或者数字，我们需要将其转换为对应的对象结构，使其符合目标对象的定义和应用方法。

我们需要在目标对象通过 `Object.defineProperty`来设置对象内部的`fn`，之所以如此定义就是为了防止可以直接从`thisArg`里面获取fn，因为我们的期望是fn通过隐式绑定目标对象来实现调用的效果，这也是为什么后面要删除目标对象上的`fn`，因为我们的最终目的不是在对象上添加`fn`。

`fn`只是某种意义上的“副作用"，根本意义在于基于目标对象实现`fn`，这一步也是整个自定义绑定函数的关键：**通过this来获取隐式绑定的函数对象，然后利用目标对象实现隐式绑定，这里实际上发生了两次隐式绑定的调用。**



### 封装固定处理逻辑

```js
    // new Function()
    // foo.__proto__ === Function.prototype
    function foo(name, age) {
      console.log(this, name, age)
    }

    // foo函数可以通过apply/call
    // foo.apply("aaa", ["why", 18])
    // foo.call("bbb", "kobe", 30)

    // 1.封装思想
    // 1.1.封装到独立的函数中
    function execFn(thisArg, otherArgs, fn) {
      // 1.获取thisArg, 并且确保是一个对象类型
      thisArg = (thisArg === null || thisArg === undefined)? window: Object(thisArg)

      // thisArg.fn = this
      Object.defineProperty(thisArg, "fn", {
        enumerable: false,
        configurable: true,
        value: fn
      })

      // 执行代码
      thisArg.fn(...otherArgs)

      delete thisArg.fn
    }

    // 1.2. 封装原型中
    Function.prototype.hyexec = function(thisArg, otherArgs) {
      // 1.获取thisArg, 并且确保是一个对象类型
      thisArg = (thisArg === null || thisArg === undefined)? window: Object(thisArg)

      // thisArg.fn = this
      Object.defineProperty(thisArg, "fn", {
        enumerable: false,
        configurable: true,
        value: this
      })
      thisArg.fn(...otherArgs)

      delete thisArg.fn
    }


    // 1.给函数对象添加方法: hyapply
    Function.prototype.hyapply = function(thisArg, otherArgs) {
      this.hyexec(thisArg, otherArgs)
    }
    // 2.给函数对象添加方法: hycall
    Function.prototype.hycall = function(thisArg, ...otherArgs) {
      this.hyexec(thisArg, otherArgs)
    }

    foo.hyapply({ name: "why" }, ["james", 25])
    foo.hyapply(123, ["why", 18])
    foo.hyapply(null, ["kobe", 30])
    
    foo.hycall({ name: "why" }, "james", 25)
    foo.hycall(123, "why", 18)
    foo.hycall(null, "kobe", 30)

```

我们需要以封装独立函数的形式来处理相同的绑定逻辑，那么应该给独立函数传入一个fn，因为封装函数在定义fn的时候，this不一定是正确的，我们应该指定this的具体指向。

### 封装bind

```js
    // apply/call
    function foo(name, age, height, address) {
      console.log(this, name, age, height, address)
    }

    // Function.prototype
    // var newFoo = foo.bind({ name: "why" }, "why", 18)
    // newFoo(1.88)

    // 实现hybind函数
    Function.prototype.hybind = function(thisArg, ...otherArgs) {
      // console.log(this) // -> foo函数对象
      thisArg = thisArg === null || thisArg === undefined ? window: Object(thisArg)
      Object.defineProperty(thisArg, "fn", {
        enumerable: false,
        configurable: true,
        writable: false,
        value: this
      })

      return (...newArgs) => {
        // var allArgs = otherArgs.concat(newArgs)
        var allArgs = [...otherArgs, ...newArgs]
        thisArg.fn(...allArgs)
      }
    }

    var newFoo = foo.hybind("abc", "kobe", 30)
    newFoo(1.88, "广州市")
```

事实上，我们可以借用箭头函数内部的this绑定外部函数的词法作用域（注意区分函数内部词法作用域和代码块的区别）的原理，来实现`this`的绑定。

在这里直接使用`return`一个箭头函数，此时`fn`内部的`this`会沿着词法作用域向外层查找，它会将`this`绑定到`thisArg`(隐式绑定)。

bind需要接受两次传参，第一次是调用bind时的传参`...otherArgs`，第二次是在执行bind绑定函数时的二次传参`...newArgs`，我们需要在箭头函数里面实现两个传参的合并，将其一次性传入调用函数里面。



# ES6+新特性



## 词法环境(词法作用域)

**词法环境是一种规范类型，用于在词法嵌套结构中定义关联的变量、函数等标识符；**

-  一个词法环境是由环境记录（Environment Record）和一个外部词法环境（o*ute;r* Lexical Environment）组成；
-  一个词法环境经常用于关联一个函数声明、代码块语句、try-catch语句，**当它们的代码被执行时，词法环境被创建出来。**

![image-20240215172623806](/Users/heinrichhu/前端项目/JavaScript_Advanced/07_深入JS对象/image-20240215172623806.png)

![image-20240215172529404](/Users/heinrichhu/前端项目/JavaScript_Advanced/07_深入JS对象/image-20240215172529404.png)

在执行上下文栈里面，每个执行上下文都存在一个**环境记录(Environment Record)**和**外部变量(outer)**，分别存放着自身内部存放的各类变量和外部的词法作用域链的指向，在查找属性时就会沿着词法作用域进行顺序查找。

词法环境常常应用于let和const，这两者会生成暂时性死区，编译器会记录其的状态，在获取该属性时会检查是否赋值。变量环境常应用于var和其自身的变量提升。



## let和const

var可以重复声明一个同名变量，而let和const不允许重复声明同名变量。

const定义的对象不能被修改，但可以单独修改对象的属性值。

### 作用域提升

在声明变量的作用域中，如果这个变量可以在声明之前被访问，那么我们会将其称之为作用域提升。 

let和const没有作用域提升，只不过它们声明的变量确实会在解析阶段被创建出来。

### 暂时性死区

**let和const声明的变量在执行赋值操作之前，是无法访问到该变量的。**

**暂时性死区和变量定义的位置无关，仅仅和代码执行的顺序有关系。**

```js
     function foo() {
       console.log(message)
     }

     let message = "Hello World"
     foo()
     console.log(message)
```

**暂时性死区形成之后，在该区域内这个标识符无法被访问。**

就算这个标识符在外层作用域有被定义，但是在函数内部的词法作用域是独立存在的，而标识符又位于该词法作用域范围内的，会触发暂时性死区。

```js
    let message = "Hello World"
    function foo() {
      console.log(message)
      let message = "哈哈哈哈"
    }

    foo()
```



### 全局作用域

如果我们使用var定义一个变量，该变量默认会添加到window上面。

而let和const就算在全局作用域定义，也不会添加到window上面。

let和const依旧被存放在环境记录里面，但是并没有存放在window里面。

window本身作为合成的环境记录，它自身就是一个对象。除了这一类var变量声明和其它类似于函数声明被存放在`Global Object`(其实就是window)以外，像let和const是会被放在另外一个特殊对象里面。

![image-20240216012144968](/Users/heinrichhu/前端项目/JavaScript_Advanced/07_深入JS对象/image-20240216012144968.png)



### 块级作用域

块级作用域实际上指的就是 `{}`这一类代码块，注意区分函数的词法作用域。 

**在ES5之前，只有全局和函数会形成自己的作用域，**就算是 `if(true){}`也不会形成自己的作用域。

而在ES6开始，我们可以利用let和const声明的变量，来结合代码块形成自己的会计作用域。

因为没有形成作用域，所以代码块外部的变量也可以访问到代码块内部的属性：

```js
    {
      var message = "Hello World"
    }
    console.log(message)
```

![image-20240216012726605](/Users/heinrichhu/前端项目/JavaScript_Advanced/07_深入JS对象/image-20240216012726605.png)



**注意！在ES6中新增了块级作用域，并且通过let、const、function、class声明的标识符是具备块级作用域的限制的：**

**一旦形成了作用域，外部是无法访问对应作用域里面的属性的。所以由let和const形成的块级作用域，外界是无法访问的。**

```js
    {
      var message = "Hello World"
      let age = 18
      const height = 1.88

      class Person {}

      function foo() {
        console.log("foo function")
      }
    }

     console.log(age)
     console.log(height)
     const p = new Person()
    foo()
```

但是这里存在一个例外： **代码块中的函数是可以在外部被访问的，这是JS引擎的特殊化处理。**

只不过这个代码块的函数是没有办法做到提前访问的。

### 块级作用域的应用

我们通过以下代码来了解块级作用域的执行顺序：

```js
     var message = "Hello World"
     var age = 18
     function foo() {}
     let address = "广州市"

     {
       var height = 1.88

       let title = "教师"
       let info = "了解真相~"
     }
```

我们可以观察其在内存中的表现，首先我们要明确一个概念： **代码块是不会形成一个新的执行上下文的，代码块只会形成一个新的词法环境，它拥有自己的环境记录和outer。**

执行上下文栈中的执行上下文首先会根据代码形成自己的 **词法环境 **和 **语法环境** ，词法环境和变量环境内部大多描述的都是同样的值。

词法环境多处理let和const这一类定义的赋值，而语法环境常常指的就是通过var定义的变量或者function声明。

在执行上下文被执行的过程中，执行到对应的代码块时，执行上下文的词法环境**同时会指向在堆空间中创建的代码块的词法环境**。

然后继续到执行到代码块外部的代码，对应的堆空间中的代码块的词法环境会被销毁。这也是为什么代码块外部的环境无法访问代码块内部属性的原因。

![image-20240216015241644](/Users/heinrichhu/前端项目/JavaScript_Advanced/07_深入JS对象/image-20240216015241644.png)



#### 论证块级作用域

```html

<html>
    <button>按钮0</button>
  <button>按钮1</button>
  <button>按钮2</button>
  <button>按钮3</button>
</html>
<script>

    // 2.监听按钮的点击
    const btnEls = document.querySelectorAll("button")
     for (var i = 0; i < btnEls.length; i++) {
       var btnEl = btnEls[i];
        btnEl.onclick = function() {
           debugger
           console.log(`点击了${i}按钮`)
         }
       }
     }
</script>
```

众所周知，`var`在代码块中是无法形成自己的词法作用域的，这意味着`var`声明的变量实际上存在于全局作用域。

当遍历循环完成后，`i`实际上已经是最后一次遍历的结果，导致无论点击哪个按钮，最后获取的`i`的值的依然都是3。

![image-20240216015900294](/Users/heinrichhu/前端项目/JavaScript_Advanced/07_深入JS对象/image-20240216015900294.png)



过往的解决方法是每次循环时往`btnEl`里面添加`index`，亦或者利用**iife形成的闭包的特性**，iife会形成独立封闭的词法作用域。

每个IIFE都拥有独立的AO对象，传递给AO对象的值通过闭包特性得以保留，我们可以通过以下概念加强对IIFE的理解：

**在 JavaScript 中，函数创建了自己的作用域，这意味着在函数内部声明的变量只能在函数内部访问。**

这就是为什么立即执行函数（IIFE）可以在每次循环迭代中创建自己的作用域。

在你的代码中，**立即执行函数 `(function(m) {...})(i)` 创建了一个新的作用域，并且在每次循环迭代中都会执行。**这个函数接收一个参数 `m`，并且在每次迭代时，都会将当前的索引 `i` 传递给它。这样，每个按钮的点击事件处理器就可以访问到它在循环中的索引 `m`，即使循环已经结束。

如果没有这个立即执行函数，所有的点击事件处理器都会共享同一个 `i` 变量，当循环结束后，`i` 的值会是 `btnEls.length`，所以无论点击哪个按钮，打印出来的都会是 `点击了${btnEls.length}按钮`。通过使用立即执行函数，我们可以为每个按钮创建一个独立的作用域，使得每个按钮都能正确地访问到它在循环中的索引。

![image-20240216020417316](/Users/heinrichhu/前端项目/JavaScript_Advanced/07_深入JS对象/image-20240216020417316.png)

```js
    const btnEls = document.querySelectorAll("button")
     for (var i = 0; i < btnEls.length; i++) {
       var btnEl = btnEls[i];
       // btnEl.index = i
       (function(m) {
         btnEl.onclick = function() {
           debugger
           console.log(`点击了${m}按钮`)
         }
       })(i)
     }
```



最后我们可以提出终极解决方案，利用let/const形成的块级作用域保留了每一次循环的 `i`值。

```js
    for (let i = 0; i < btnEls.length; i++) {
      const btnEl = btnEls[i]; 
      btnEl.onclick = function() {
        console.log(`点击了${i}按钮`)
      }
    }
```

**每一次执行代码块时都会在堆内存中生成代码块自身的词法记录**，这个词法记录里面会保存对应的 i的值。

得益于我们创建了一个点击事件的函数，函数内部存在一个 `[[scope]]`，它会引用对应的代码块的词法记录。所以在执行完这个代码块后，代码块对应的词法记录不会被销毁。

同时`btnEl`作为一个DOM对象，它的`onClick`事件 又关联了这个点击事件的函数，从而导致函数也不会被垃圾回收(销毁)。

每一次触发点击事件，因为`onClick`内部没有对应的`i`值，所以会沿着词法环境作用域链向外部去寻找 `i`，最终获取由`const`形成的词法环境中定义的 `i` 的值。

![image-20240216021750175](/Users/heinrichhu/前端项目/JavaScript_Advanced/07_深入JS对象/image-20240216021750175.png)

![image-20240216021842852](/Users/heinrichhu/前端项目/JavaScript_Advanced/07_深入JS对象/image-20240216021842852.png)

**一定要基于内存关联联系去理解为什么i可以保存在对应的块级作用域之中！因为块级作用域的原因，i得以保存在对应代码块的词法记录里面，而代码块的词法记录得益于function和btnEl的持久化不会被销毁。**



### 实际应用的选择

![image-20240216022558418](/Users/heinrichhu/前端项目/JavaScript_Advanced/07_深入JS对象/image-20240216022558418.png)