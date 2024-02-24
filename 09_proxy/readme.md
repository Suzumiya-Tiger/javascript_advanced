# Proxy

在Vue2中，我们通过监听对象内部属性变化的操作，核心是由存储属性描述符来实现的：

```js
    // 2.监听所有的属性: 遍历所有的属性, 对每一个属性使用defineProperty
    const keys = Object.keys(obj);
    for (const key of keys) {
      let value = obj[key];
      Object.defineProperty(obj, key, {
        set: function (newValue) {
          console.log(`监听: 给${key}设置了新的值:`, newValue);
          value = newValue;
        },
        get: function () {
          console.log(`监听: 获取${key}的值`);
          return value;
        }
      });
    }
```

但是通过 `Object.defineProperty(obj,属性，{...操作})`存在一个重大缺陷：**无法实现新增属性和删除属性的监听和操作，只能实现已有对象属性的修改和获取的监听操作。**

在JavaScript中，`Proxy` 对象用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等）。

`Proxy` 可以让你在访问对象的属性或者调用函数之前插入更多的自定义操作，这对于编写API，自动填充属性/方法，或者在访问某些特殊属性时触发特定行为等场景非常有用。

所以，Proxy(代理对象)横空出世，专为解决监听对象属性而生，代理对象可以捕获对象的所有操作，从而反向控制原对象的活动。 





## Proxy的基本使用

在ES6中，新增了一个Proxy类，用于帮助我们创建一个代理对象。

如果我们希望监听一个对象的所有操作，那么我们可以先创建一个Proxy代理对象。

之后对该对象所有的操作，实际上都由这个代理对象来完成，代理对象可以监听我们想要对原对象进行哪些操作。



- 首先，我们需要 `new Proxy对象`，并且传入需要侦听的对象和一个处理对象，该处理对象可以称之为handler:

  `const p=new Proxy(target,handler)`

- 其次，我们之后所有的操作都是直接对Proxy的操作，而不是原有对象，因为我们需要在handler里面进行监听。

```js
      const obj = {
        name: "why",
        age: 18,
        height: 1.88
      };

    //   1.创建出来一个Proxy对象
    const objProxy=new Proxy(obj,{

    })
    // 2.对obj的所有操作，应该去操作objProxy
    console.log(objProxy.name);
    objProxy.name="kobe";
    console.log(objProxy.name);
    console.log(obj)
```



### Proxy捕获器 

如果我们想要侦听某些具体的操作，那么就可以在handler中添加对应的**捕获器（Trap）**：

**set和get分别对应的是函数类型：**

- set函数有四个参数：

✓ target：目标对象（侦听的对象）；

✓ property：将被设置的属性key；

✓ value：新属性值；

✓ receiver：调用的代理对象；

-  get函数有三个参数：

✓ target：目标对象（侦听的对象）；

✓ property：被获取的属性key；

✓ receiver：调用的代理对象；

```js
      const obj = {
        name: "why",
        age: 18,
        height: 1.88
      };

      //   1.创建出来一个Proxy对象
      const objProxy = new Proxy(obj, {
        get: function (target, key) {
          console.log(`监听: 获取${key}的值`);
          return target[key];
        }, 
        set: function (target, key, value) {
          console.log(`监听: 给${key}设置了新的值:`, value);
          target[key] = value;
        }
      });
      // 2.对obj的所有操作，应该去操作objProxy
      objProxy.name = "kobe";
```

如果对代理对象进行**新增**操作，一样会触发对应的set方法的调用实现。

#### 其它监听

除此以外，我们还可以设置其它的监听函数：

- **handler.has()**

in 操作符的捕捉器。

- **handler.get()**

属性读取操作的捕捉器。

- **handler.set()**

属性设置操作的捕捉器。

- **handler.deleteProperty()**

delete 操作符的捕捉器。

-  handler.apply()

函数调用操作的捕捉器。

-  handler.construct()

new 操作符的捕捉器。



对象属性的删除操作不会触发handler中的set方法，而是需要另外一个handler方法来实现删除的监听操作，那就是 `deleteProperty`：

```js
      const obj = {
        name: "why",
        age: 18,
        height: 1.88
      };

      //   1.创建出来一个Proxy对象
      const objProxy = new Proxy(obj, {
        get: function (target, key) {
          console.log(`监听: 获取${key}的值`);
          return target[key];
        },
        set: function (target, key, value) {
          console.log(`监听: 给${key}设置了新的值:`, value);
          target[key] = value;
        },
        deleteProperty: function (target, key) {
          console.log(`监听: 删除了${key}`);
          delete target[key];
        },
        has:function (target, key) {
          console.log(`监听: 判断是否有${key}`);
          return key in target;
        }
      });
      // 2.对obj的所有操作，应该去操作objProxy
      objProxy.name = "kobe";
```

**注意：所有的监听函数内部其实都是针对于原对象实现了具体的操作，本质上对obj的操作通过映射到objProxy的handler内部来进一步实现。我们对对象的操作应该建立在代理对象上去完成，而不应该直接操作原对象，从而实现了对象代理的效果。**



# Reflect

Reflect是一个对象，字面意思是反射。

它主要提供了很多操作JS对象的方法，有些类似于Object中操作对象的方法。

另外在使用Proxy时，可以做到不操作原对象。

这里可以举个例子，Reflect的内部方法其实相对而言更加完善和健全：

```javascript
    const obj = {
      name: "why",
      age: 18
    }

    Object.defineProperty(obj, "name", {
      configurable: false
    })
    // Reflect.defineProperty()

    // 1.用以前的方式进行操作
    // delete obj.name
    // if (obj.name) {
    //   console.log("name没有删除成功")
    // } else {
    //   console.log("name删除成功")
    // }

    // 2.Reflect
    if (Reflect.deleteProperty(obj, "name")) {
      console.log("name删除成功")
    } else {
      console.log("name没有删除成功")
    }
```

相较于我们无法确定通过对象属性描述符来删除对象的内部属性这一操作是否成功，`Reflect.deleteProperty(obj,属性)`在执行后会返回一个boolean类型的返回值，使得我们可以得到一个确定的结果。

## Reflect的常见用法

- `Reflect.has(target, propertyKey)`

 判断一个对象是否存在某个属性，和 in 运算符 的功能完全相同。

-  `Reflect.get(target, propertyKey[, receiver])`

 获取对象身上某个属性的值，类似于 target[name]。

-  `Reflect.set(target, propertyKey, value[, receiver])`

 将值分配给属性的函数。返回一个Boolean，如果更新成功，则返回true。

-  `Reflect.deleteProperty(target, propertyKey)`



## Reflect和Proxy结合运用

Reflect可以防止对象不可写入或者不可修改的情况下，开发者未知针对对象的操作是否成功，所以我们需要应用Reflect来实现操作成功的检测，它有以下两个好处：

- 不会直接修改原对象。
- 可以检测对对象的修改操作是否成功。

```js
      const obj = {
        name: "why",
        age: 18,
        height: 1.88
      };
      const objProxy = new Proxy(obj, {
        get: function (target, key) {
          console.log(`监听: 获取${key}的值`);
          return target[key];
        },
        set: function (target, key, value) {
          console.log(`监听: 给${key}设置了新的值:`, value);
          //   target[key] = value;
          //   好处一：代理对象的目的：不再直接操作对象。
          //   好处二：Reflect.set方法能够返回一个布尔值，表示是否设置成功
          const isSuccess = Reflect.set(target, key, value);
          if(!isSuccess){
            throw new Error("设置失败");
          }
        }
      });
```

同时，set方法还有一个传参为`receiver`，它代表了proxy代理对象，在代码中直指 `objProxy`。

receiver应用于某些特殊场景，常用于有写访问描述符的对象，通过下面的实例进行讲解：

```javascript
      const obj = {
        _name: "why",
        set name(newVal) {
          console.log("this", this);
          this._name = newVal;
          console.log(this._name)
        },
        get name() {
          console.log("获取了name的值");
          return this._name;
        }
      };
      const objProxy = new Proxy(obj, {
        get: function (target, key) {
          console.log(`监听: 获取${key}的值`);
          return target[key];
        },
        set: function (target, key, value) {
          console.log(`监听: 给${key}设置了新的值:`, value);
          //   target[key] = value;
          //   好处一：代理对象的目的：不再直接操作对象。
          //   好处二：Reflect.set方法能够返回一个布尔值，表示是否设置成功
          console.log("proxy中的设置方法被调用");
          const isSuccess = Reflect.set(target, key, value);
          if (!isSuccess) {
            throw new Error("设置失败");
          }
        }
      });
      objProxy.name='aaa';
```

`obj.name = "kobe";`会触发obj内部对应name的set方法，所以会触发内部的方法调用。

同理如果我们对objProxy的属性进行设置，同样会触发set方法，再通过 `Reflect.set(target, key, value);`会进一步触发obj对象的同步修改，也就是调用obj的set方法。

在你的 `Proxy` 对象中，`set` 方法使用了 `Reflect.set(target, key, value)` 来设置属性值。

`Reflect.set` 方法会触发目标对象的 setter 方法（如果存在的话）。在你的例子中，当你执行 `objProxy.name='aaa'` 时，`Reflect.set` 方法会触发 `obj` 对象的 `name` setter 方法，这个 setter 方法会设置 `_name` 属性的值。

然而，`Proxy` 对象只能拦截对其自身属性的操作，不能拦截对其目标对象内部属性（如 `_name`）的操作。因此，你无法通过 `Proxy` 对象监听到 `this._name = newVal` 这个操作。

以下是执行结果：

![image-20240219234327218](/Users/heinrichhu/前端项目/JavaScript_Advanced/09_proxy/image-20240219234327218.png)

在JavaScript中，`Proxy` 对象是用来创建一个对象的代理，可以定义或修改对象的一些操作行为。例如，你可以拦截并定义对象属性的读取（`get`）、设置（`set`）等操作。

然而，`Proxy` 对象的拦截行为只能应用于它自身的属性。也就是说，如果你创建了一个 `Proxy` 对象来代理另一个对象，那么你只能拦截对 `Proxy` 对象自身属性的操作，不能拦截对其代理的目标对象的内部属性的操作。

在你的例子中，`obj` 是 `Proxy` 对象 `objProxy` 的目标对象，`_name` 是 `obj` 的内部属性。当你通过 `objProxy` 设置 `name` 属性时，实际上是触发了 `obj` 的 `name` setter 方法，这个方法会设置 `_name` 属性的值。

但是，这个操作是在 `obj` 的内部进行的，`Proxy` 对象 `objProxy` 无法拦截到这个操作，因此你无法通过 `objProxy` 监听到 `this._name = newVal` 这个操作。

**总而言之，就是通过走代理对象的set是无法直接做到监听目标对象内部的赋值操作的。**

所以，我们需要通过`receiver`来设置目标对象set方法里面的`this`：

` isSuccess = Reflect.set(target, key, value,receiver);`

这个`receiver`会改变目标对象的`this`，此时this会指向`objProxy`，因此，你可以通过 `objProxy` 对象监听到 `this._name = newVal` 这个操作。

我们通过这个方法，实现了两次赋值的监听：

```javascript
      const obj = {
        _name: "why",
        set name(newVal) {
          console.log("this", this);
          this._name = newVal;
          console.log(this._name);
        },
        get name() {
          console.log("获取了name的值");
          return this._name;
        }
      };
      const objProxy = new Proxy(obj, {
        get: function (target, key) {
          console.log(`监听: 获取${key}的值`);
          return target[key];
        },
        set: function (target, key, value, receiver) {
          console.log(`监听: 给${key}设置了新的值:`, value);
          //   target[key] = value;
          //   好处一：代理对象的目的：不再直接操作对象。
          //   好处二：Reflect.set方法能够返回一个布尔值，表示是否设置成功
          //   好处三：Reflect.set方法的第三个参数receiver，表示当前的代理对象，可以决定对象的访问描述符中的set和get中的this指向

          console.log("proxy中的设置方法被调用");
          const isSuccess = Reflect.set(target, key, value, receiver);
          if (!isSuccess) {
            throw new Error("设置失败");
          }
        }
      });
      objProxy.name = "aaa";
```

我们看一下输出结果：

![image-20240219235949526](/Users/heinrichhu/前端项目/JavaScript_Advanced/09_proxy/image-20240219235949526.png)

为什么最后的打印操作会优先执行 `objProxy`里面的get方法：

在JavaScript中，当你尝试获取一个对象的属性值时，如果该对象是一个`Proxy`对象，那么会首先触发该`Proxy`对象的`get`方法。在你的代码中，`this._name`实际上是尝试获取`_name`属性的值，因此会首先触发`objProxy`的`get`方法。

在`get`方法被触发后，会执行`get`方法中的代码，包括打印`监听: 获取_name的值`。然后，`get`方法会返回`_name`属性的值，这个值就是你在`console.log(this._name)`中打印的值。

因此，你会看到先输出`监听: 获取_name的值`，然后才输出`_name`属性的值。这是因为在获取`_name`属性的值时，首先触发了`objProxy`的`get`方法。

## Reflect的consturt

如果我们期望能够做到讲一个函数作为自己的构造函数，同时又能够继承另一个函数的内部属性调用，往常我们只能够通过借助构造函数调用实现，比如以下代码：

```JS
    function Person(name, age) {
      this.name = name
      this.age = age
    }
    function Student(name, age) {
      Person.call(this, name, age)
    }

		const stu = new Student("why", 18)
```

我们可以通过 `Reflect.construct(实际调用函数,[传参],构造函数)` 实现上面的代码效果：

```JS
    function Person(name, age) {
      this.name = name
      this.age = age
    }

    function Student(name, age) {
      // Person.call(this, name, age)
      const _this = Reflect.construct(Person, [name, age], Student)
      return _this
    }

    // const stu = new Student("why", 18)
    const stu = new Student("why", 18)
    console.log(stu)
    console.log(stu.__proto__ === Student.prototype)
```

