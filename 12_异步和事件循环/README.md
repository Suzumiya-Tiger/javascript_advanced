# 异步处理

## 异步请求代码结构

我们之前处理函数内部的异步请求/处理完成后的回调往往是通过回调函数或者Promise来完成的：

```js
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

```javascript
    function execCode(counter) {
      const promise = new Promise((resolve, reject) => {
        // 异步任务
        setTimeout(() => {
          if (counter > 0) { // counter可以计算的情况 
            let total = 0
            for (let i = 0; i < counter; i++) {
              total += i
            }
            // 成功的回调
            resolve(total)
          } else { // 失败情况, counter有问题
            // 失败的回调
            reject(`${counter}有问题`)
          }
        }, 3000)
      })
      
      return promise
    }

    execCode(255).then(value => {
      console.log("成功:", value)
    }).catch(err => {
      console.log("失败:", err)
    })

```

普通的回调函数需要我们在调用函数的时候，为其定义一个成功回调或者失败回调，而Promise调用则是需要构造一个Promise函数，并异步地通过thenable输出其决议结果。

如果我们应用网络请求来解决异步处理，我们常常会设计一个函数，里面会返回一个Promise请求的结果。

而我们通常把网络请求放在Promise的内部来处理，等待网络请求回调输出以后，再通过thenable输出请求结果。

```javascript
```

