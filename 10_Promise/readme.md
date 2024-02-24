## 异步处理代码的困境

我们在采用延时设计或者异步处理的函数设计时，在对应延时/异步代码完成后常常无法及时获取完成的状态。

所以在过去，我们常常只能使用callback回调来通知外部调用函数执行完成，因为函数内部的callback()在调用的时候，延时函数已经开始执行，进而外部调用函数的回调也会被触发执行。

```js
function exeCode(callback){
  setTimeout(()=>{
    console.log("aaa")
    let total=0;
    for(let i=0;i<100;i++){
      total+=i
    }
    //在某一个时刻只需要回调传入的函数
    callback(total)
  },3000)
}
exeCode((value)=>{
  console.log("延时函数执行完成",value)
})
```

回调函数比较好的一点就是可以把函数内部执行的某一个数值或者结果通过回调函数的传参，传递到外部调用函数。

**但是存在一个问题，如果出现执行出错的情况下，只能开发者进行分类处理，回调函数自身并不能做到错误识别。**

```JS
    // 1.设计这样的一个函数
    function execCode(counter, successCallback, failureCallback) {
      // 异步任务
      setTimeout(() => {
        if (counter > 0) { // counter可以计算的情况 
          let total = 0
          for (let i = 0; i < counter; i++) {
            total += i
          }
          // 在某一个时刻只需要回调传入的函数
          successCallback(total)
        } else { // 失败情况, counter有问题
          failureCallback(`${counter}值有问题`)
        }
      }, 3000)
    }

    // 2.ES5之前,处理异步的代码都是这样封装
    execCode(100, (value) => {
      console.log("本次执行成功了:", value)
    }, (err) => {
      console.log("本次执行失败了:", err)
    })
```



## Promise解决异步代码的困境

下面是我一开始写的错误代码：

```JS
function exeCode(counter) {
  const promise = new Promise();
  setTimeout(() => {
    if (counter > 0) {
      console.log("aaa");
      let total = 0;
      for (let i = 0; i < 100; i++) {
        total += i;
      }
      promise.resolve(total);
    } else {
      promise.catch(`counter 出现错误，它的数值是 ${counter}`);
    }
  }, 3000);
  return promise;
}
const result = exeCode(100);
result
  .then(res => {
    console.log("获取成功回调", res);
  })
  .catch(err => {
    console.log("获取失败回调", err);
  });

```

以下是我反应过来改进的正确代码：

```JS
function exeCode(counter) {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (counter > 0) {
        console.log("aaa");
        let total = 0;
        for (let i = 0; i < 100; i++) {
          total += i;
        }
        resolve(total);
      } else {
        reject(`counter 出现错误，它的数值是 ${counter}`);
      }
    }, 3000);
  });
  return promise;
}
const result = exeCode(100);
result
  .then(res => {
    console.log("获取成功回调", res);
  })
  .catch(err => {
    console.log("获取失败回调", err);
  });

```

这两段代码的主要区别在于 Promise 的使用方式。

在第一段代码中，Promise 正确地使用了构造函数，该构造函数接受一个**执行器函数**作为参数。执行器函数接受两个参数：resolve 和 reject，它们是两个函数，用于改变 Promise 的状态。当异步操作成功时，调用 resolve 函数并传入结果值，Promise 的状态变为 fulfilled；当异步操作失败时，调用 reject 函数并传入错误原因，Promise 的状态变为 rejected。这是正确使用 Promise 的方式。

在第二段代码中，Promise 的使用方式是错误的。**Promise 构造函数必须接受一个执行器函数作为参数**，但在这里没有传入任何参数。此外，resolve 和 reject 不是 Promise 实例的方法，不能通过 promise.resolve 或 promise.reject 来调用。这段代码会导致错误。

因此，第一段代码可以正常运行，而第二段代码会抛出错误。



## 什么是Promise?

- Promise是一个类，可以翻译成 承诺、许诺 、期约；
- 当我们需要的时候，给予调用者一个承诺：待会儿我会给你回调数据时，就可以创建一个Promise的对象；
- 在通过new创建Promise对象时，我们需要传入一个回调函数，我们称之为executor；

✓ **这个回调函数会被立即执行(重点:立即执行)，并且给传入另外两个回调函数resolve、reject；**

✓ 当我们调用resolve回调函数时，会执行Promise对象的then方法传入的回调函数；

✓ 当我们调用reject回调函数时，会执行Promise对象的catch方法传入的回调函数；



### Promise的代码结构

如果同时调用`resolve()`和`reject()`，那么只会输出`resolve()`的结果。

在执行器的代码没有得出执行结果时，也就是没有调用resolve或者reject时，此时我们称之为pending状态。

一旦执行了决断体(resolve或者reject)，那么就会进入fulfilled或rejected的决断状态。

**Promise的状态一旦被决断，那么其状态就绝对不会被变更，也不能执行某一个回调函数来改变状态，这也是本章第一行解释的原因。**



#### Promise对应的三种状态

- *待定（pending）*: 初始状态，既没有被兑现，也没有被拒绝；

✓ 当执行executor中的代码时，处于该状态；

-  *已兑现（fulfilled）*: 意味着操作成功完成；

✓ 执行了resolve时，处于该状态，Promise已经被兑现；

-  *已拒绝（rejected）*: 意味着操作失败；

✓ 执行了reject时，处于该状态，Promise已经被拒绝；



#### **Executor**

这个传入的回调函数就是执行器函数，它携带两个传参分别是resolve和reject ，这个回调函数会立即执行。

通常情况下我们会在Executor里面确定我们的Promise状态，也就是最终决断的状态。

```JS
    // 1.创建一个Promise对象
    const promise = new Promise((resolve, reject) => {
      // 注意: Promise的状态一旦被确定下来, 就不会再更改, 也不能再执行某一个回调函数来改变状态
      // 1.待定状态 pending
      console.log("111111")
      console.log("222222")
      console.log("333333")

      // 2.兑现状态 fulfilled
      resolve()

      // 3.拒绝状态 rejected
      reject()
    })

    promise.then(value => {
      console.log("成功的回调")
    }).catch(err => {
      console.log("失败的回调")
    })
```



### Promise中的resolve

resolve可以写入各类普通值，不只是数字字符串，也可以写入数组对象等等。

除此以外，resolve还可以再次接收一个Promise作为传参，但是如果采用了一个Promise最为传参，**那么该resolve会直接返回这个Promise的实例**，本次Promise决断的结果，将等待这个Promise实例的决议，来决定thenable的决议结果：

```JS
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p的resolve结果");
  });
});

const promise = new Promise((resolve, reject) => {
  // 1.resolve可以接收各类普通值，比如字符串、数字、对象数组等等
  // resolve('resolve');
  // resolve([1, 2, 3]);
  // 2.除此以外，resolve还可以接收另一个Promise实例作为参数
  // 如果resolve接收的参数是一个Promise实例，那么它会直接返回这个Promise实例
  // 当前Promise的决断会由这个Promise实例的决断来决定
  resolve(p);
});
promise.then(res => {
  console.log(res); //p的resolve结果
});

```

如果resolve中存在一个`{then:function(){}}`，那么将直接调用这个`then`作为thenable的结果来执行，作为回调结果。



### 决断状态调度

```JS
const promise = new Promise((resolve, reject) => {});
// promise可以使用then输出resolve和reject的结果，但本质上和then().catch()是一样的'
promise.then(
  res => {
    console.log("resolve", res);
  },
  err => {
    console.log("reject", err);
  }
);

// 除此以外，promise的决议结果可以多次输出，但是promise的决议结果不会变更
promise.then(res => {
  console.log("resolve", res);
});
promise.then(res => {
  console.log("resolve", res);
});
promise.then(res => {
  console.log("resolve", res);
});
```

Promise可以采用实例中单单使用then来表示两种状态的捕获，本质上和`then().catch()`是一样的。

但是这里面存在一个特殊情况，那就是Promise的then的用法：

```JS
const promise = new Promise((resolve, reject) => {
  reject("failure");
});
promise.then(res => {
  console.log("resolve", res);
});
promise.catch(err => {
  console.log("reject", err);
});
promise.catch(err => {
  console.log("reject", err);
});
promise.catch(err => {
  console.log("reject", err);
});
```

在这里Promise的then一样会获取对应`reject()`输出的结果，但是这里没有衔接catch。

但是这样处理会导致报错，每一次reject都应该有对应的catch进行处理，而不是使用then来处理错误信息。



## Promise的then

 **then方法本身是有返回值的，<u>它的返回值是一个Promise</u>，所以我们可以执行thenable的链式调用。**

**Promise有三种状态，那么这个Promise处于什么状态呢？**

- 当then方法中的回调函数本身在执行的时候，那么它处于pending状态；
- 当then方法中的回调函数返回一个结果时，那么它处于fulfilled状态，并且会将结果作为resolve的参数；

✓ 情况一：返回一个普通的值；

✓ 情况二：返回一个Promise；

✓ 情况三：返回一个thenable值；

- 当then方法抛出一个异常时，那么它处于reject状态；

Promise的then方法调用本质上也是返回一个Promise，所以我们可以写作一个连锁的then调用，这被称之为**链式调用**：

```JS
const promise = new Promise((resolve, reject) => {
  resolve("aaaaaaa");
  // reject()
});

// 1.then方法是返回一个新的Promise, 这个新Promise的决议是等到then方法传入的回调函数有返回值时, 进行决议
// Promise本身就是支持链式调用
// then方法是返回一个新的Promise, 链式中的then是在等待这个新的Promise有决议之后执行的
promise
  .then(res => {
    console.log("第一个then方法:", res);
    return "bbbbbbbb";
  })
  .then(res => {
    console.log("第二个then方法:", res);
    return "cccccccc";
  })
  .then(res => {
    console.log("第三个then方法:", res);
  });

promise.then(res => {
  "添加第一个then方法";
});
```

这里需要区分两个第二个then方法调用，第一个then调用链式调用上的后续then调用都是基于前一个then的决议结果进行处理，和初始的Promise的resolve没有什么关系。 

两次的 `添加第一个then方法`输出关联的thenable都是独立的决议，仅仅和初始Promise的resolve相关，并且决议值在经过决议以后绝对不会变化。

 **而调用链上其它的后续thenable，会根据前一个thenable的返回值作为决议的结果。**

![image-20240220173126100](/Users/heinrichhu/前端项目/JavaScript_Advanced/10_Promise/image-20240220173126100.png)

第二个thenable的return返回值的整体过程，可以看做本次thenable的实际是执行了以下代码：

```JS
new Promise(resolve=>resolve("bbbbbbbb"))
```

所以return的作用非常重要，它实际上是**整个thenable作为`new Promise`的决议值存在。**否则后续的thenable获取的res将会是 `undefined`，即没有返回一个**决议值**。

当然我们也可以通过thenable来手动决议resolve的值：

```JS
    promise.then(res => {
      console.log("第一个Promise的then方法:", res)
      // 1.普通值
      // return "bbbbbbb"
      // 2.新的Promise
      // return newPromise
      // 3.thenable的对象
      return {
        then: function(resolve) {
          resolve("thenable")
        }
      }
    }).then(res => {
      console.log("第二个Promise的then方法:", res) // undefined
    })
```



## Promise的catch

catch方法也是返回一个Promise对象，它的决议结果可以通过thenable来进行接收：

```JS
      promise
        .catch(err => {
          console.log("catch回调:", err);
          return "bbbbb";
        })
        .then(res => {
          console.log("then第一个回调:", res);
          return "ccccc";
        })
        .then(res => {
          console.log("then第二个回调:", res);
        });
```

这里可能会出现一个场景，就是第一次**catch回调生成的Promise实例决议结果是一个reject**，你不能够忽略这种场景的存在。

```JS
    const promise = new Promise((resolve, reject) => {
       reject("error: aaaaa")
    })   
		// 2.catch方法的执行时机
    promise.then(res => {
      console.log("then第一次回调:", res)
      // throw new Error("第二个Promise的异常error") 
      return "bbbbbb"
    }).then(res => {
      console.log("then第二次回调:", res)
      throw new Error("第三个Promise的异常error")
    }).then(res => {
      console.log("then第三次回调:", res)
    }).catch(err => {
      console.log("catch回调被执行:", err)
    })

```

在链式调用中，如果初始Promise的决议是reject，那么只有catch会执行，前面的thenable调用都不会得到执行。

如果初始Promise的决议是resolve，那么只会执行调用链上的thenable，而不会执行catch。

如果期望在调用链上门的thenable里面能够输出一个reject的决议结果，那么我们考虑使用 `throw new Error()`，从而直接使得调用链上面的catch被执行(其它thenable不会被执行)。

如果出现异常，但是调用链上面没有catch，那就会因为没有错误捕获机制(catch)而出现报错。

这是上面代码的执行结果：

![image-20240220184242285](/Users/heinrichhu/前端项目/JavaScript_Advanced/10_Promise/image-20240220184242285.png)



#### 函数中断执行的方法

最后，我们需要梳理一下函数中断执行的方法：

```JS
    // 中断函数继续执行:
    // 方式一: return
    // 方式二: throw new Error()
    // 方式三: yield 暂停(暂时性的中断)
```



## Promise的finally

无论Promise的最终结果是then还是catch，最终都会被执行的代码就是finally。

也就是不管Promise实例最终的决议结果是什么，finally都会被执行。

```JS
    const promise = new Promise((resolve, reject) => {
      // pending

      // fulfilled
      resolve("aaaa")

      // rejected
      // reject("bbbb")
    })

    promise.then(res => {
      console.log("then:", res)
      // foo()
    }).catch(err => {
      console.log("catch:", err)
      // foo()
    }).finally(() => {
      console.log("哈哈哈哈")
      console.log("呵呵呵呵")
    })
```



## Promise的类方法

### resolve

有时候我们已经有一个现成的内容了，希望将其转成Promise来使用，这个时候我们可以使用`Promise.resolve()`方法来完成。

直接调用`Promise.resolve()`就相当于直接构建一个Promise实例，里面的执行器传参resolve有被调用：

```JS
    // 类方法
    const promise = Promise.resolve("Hello World")

    // 相当于
    // new Promise((resolve) => {
    //   resolve("Hello World")
    // })
```

我们可以通过 `Promise.resolve("Hello World")`直接接入`.then`输出结果：

```JS
    const promise = Promise.resolve("Hello World")    
		promise.then(res => {
      console.log("then结果:", res)
    })
```

这个方法主要应用于一些已经拥有结果的代码，将其作为一个普通值传入 `Promise.resolve()`作为参数使用。



### reject

如果我们想执行一个直接拒绝的代码，我们就可以直接使用 `Promise.reject()`，这相当于我们调用了 `new Promise((_,reject)=>{reject()})`,_在传参中代表了无需被使用的占位符，这是代码操作中常见的用法。

```JS
    // 类方法
    const promise = Promise.reject("rejected error")
    // 相当于
    // new Promise((_, reject) => {
    //   reject("rejected error")
    // })
        promise.catch(err => {
      console.log("err:", err)
    })
```



## Promise.all

它的作用是将多个Promise包裹在一起形成一个新的Promise；

新的Promise状态由包裹的所有Promise共同决定：

- 当所有的Promise状态变成fulfilled状态时，新的Promise状态为fulfilled，并且会将所有Promise的返回值组成一个数组；
- 当有一个Promise状态为reject时，新的Promise状态为reject，并且会将第一个reject的返回值作为参数；
- 我们可以使用这个类的方法来实现全部Promise的决议完成后输出决议结果，决议结果会按照传入的Promise的顺序(非完成顺序)进行依次输出：

```JS
    // 创建三个Promise
    const p1 = new Promise((resolve, reject) => {
      setTimeout(() => {
        // resolve("p1 resolve")
        reject("p1 reject error")
      }, 3000)
    })

    const p2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("p2 resolve")
      }, 2000)
    })
    
    const p3 = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("p3 resolve")
      }, 5000)
    })

    // all:全部/所有
    Promise.all([p1, p2, p3]).then(res => {
      console.log("all promise res:", res)
    }).catch(err => {
      console.log("all promise err:", err)
    })
```

对应的res的输出结果将会是一个数组，里面包含了所有决议的结果，按照写入传参的顺序依次排列。

一旦存在一个Promise实例输出决议是reject，那么`Promise.all`将会在catch输出reject的决议值，并且只会输出第一个决议为reject的Promise实例的决议值。



## Promise.allSettled

这个类方法不论哪个Promise实例会输出reject的结果，都会将所有的Promise实例的决议结果通过thenable输出，它的catch永远都不会执行。

```JS
 // 创建三个Promise
    const p1 = new Promise((resolve, reject) => {
      setTimeout(() => {
        // resolve("p1 resolve")
        reject("p1 reject error")
      }, 3000)
    })

    const p2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("p2 resolve")
      }, 2000)
    })
    
    const p3 = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("p3 resolve")
      }, 5000)
    })

    // 类方法: allSettled
    Promise.allSettled([p1, p2, p3]).then(res => {
      console.log("all settled:", res)
    })
```



它的输出结果是一个数组对象，对象里面包含两个属性：一个是决议类型，一个是决议结果：

![image-20240220213224293](/Users/heinrichhu/前端项目/JavaScript_Advanced/10_Promise/image-20240220213224293.png)



## Promise.race

 

race是竞技、竞赛的意思，表示多个Promise相互竞争，谁先有结果，那么就使用谁的结果；

```JS
    // 创建三个Promise
    const p1 = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("p1 resolve")
        // reject("p1 reject error")
      }, 3000)
    })

    const p2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        // resolve("p2 resolve")
        reject("p2 reject error")
      }, 2000)
    })
    
    const p3 = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("p3 resolve")
      }, 5000)
    })


    // 类方法: race方法
    // 特点: 会等到一个Promise有结果(无论这个结果是fulfilled还是rejected)
    Promise.race([p1, p2, p3]).then(res => {
      console.log("race promise:", res)
    }).catch(err => {
      console.log("race promise err:", err)
    })
```



## Promise.any

如果我们期望在 `Promise.race()`里面获取第一个resolve的结果，而不是无论决议结果是resolve还是reject都照常获取其输出的值，那么我们可以考虑这个类方法。

如果所有结果都是reject，那么最后执行的结果就是`Promise.any().catch()`的输出结果。

```JS
    // 创建三个Promise
    const p1 = new Promise((resolve, reject) => {
      setTimeout(() => {
        // resolve("p1 resolve")
        reject("p1 reject error")
      }, 3000)
    })

    const p2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        // resolve("p2 resolve")
        reject("p2 reject error")
      }, 2000)
    })
    
    const p3 = new Promise((resolve, reject) => {
      setTimeout(() => {
        // resolve("p3 resolve")
        reject("p3 reject error")
      }, 5000)
    })

    // 类方法: any方法
    Promise.any([p1, p2, p3]).then(res => {
      console.log("any promise res:", res)
    }).catch(err => {
      console.log("any promise err:", err)
    })
```

