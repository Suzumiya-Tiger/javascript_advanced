# Storage

WebStorage主要提供了一种机制，可以让浏览器提供一种比cookie更直观的key、value存储方式：

- localStorage：本地存储，提供的是一种**永久性的存储方法**，在关闭掉网页重新打开时，存储的内容依然保留；
- sessionStorage：会话存储，提供的是本次会话的存储，**在关闭掉会话时，存储的内容会被清除**；

storage的应用场景就是为了存储token或者cookies，避免频繁地向服务器请求对应的凭证，我们可以将这些凭证保存到storage里面。

包括用户的用户名和密码都可以存储在storage里面。

```javascript
    // storage基本使用
    // 1.token的操作
    let token = localStorage.getItem("token")
    if (!token) {
      console.log("从服务器获取token")
      token = "coderwhytokeninfo"
      localStorage.setItem("token", token)
    }

    // 2.username/password的操作
    let username = localStorage.getItem("username")
    let password = localStorage.getItem("password")
    if (!username || !password) {
      console.log("让用户输入账号和密码")
      username = "coderwhy"
      password = "123456"
      // 将token/username/password保存到storage
      localStorage.setItem("username", username)
      localStorage.setItem("password", password)
    }

    // 3.后续的操作
    console.log(token)
    console.log(token.length)
    console.log(token + " 哈哈哈")
```

## storage的区别

```javascript
    // 1.验证一: 关闭网页
    // 1.1.localStorage的存储保持
    // localStorage.setItem("name", "localStorage")

    // 1.2.sessionStorage的存储会消失
    // sessionStorage.setItem("name", "sessionStorage")


    // 2.验证二: 打开新的网页
    // localStorage.setItem("info", "local")
    // sessionStorage.setItem("info", "session")

    
    // 3.验证三: 打开新的页面, 并且是在新的标签中打开
    localStorage.setItem("infoTab", "local")
    sessionStorage.setItem("infoTab", "session")
```

验证一：关闭网页重新打开后，localStorage的存储会保持，而sessionStorage的存储会消失。

验证二：我们在通过a标签切换页面时(在页面内跳转)，sessionStorage和localStorage都会保存设置的信息。

验证三:如果我们通过打开一个新的标签页进行页面跳转(在页面外跳转)，sessionStorage会消失，而localStorage会保存。 

## storage常用方法

 Storage.length：只读属性，返回一个整数，表示存储在Storage对象中的数据项数量； 

Storage.key(index)：该方法接受一个数值n作为参数，返回存储中的第n个key名称； 

Storage.getItem()：该方法接受一个key作为参数，并且返回key对应的value；

Storage.setItem()：该方法接受一个key和value，并且将会把key和value添加到存储中。

 	✓ 如果key已经存储，则更新其对应的值； 

Storage.removeItem()：该方法接受一个key作为参数，并把该key从存储中删除;

Storage.clear()：该方法的作用是清空存储中的所有key；



## storage的工具封装

我们一般会在实际业务中针对storage做一个封装处理：

```javascript
class Cache {
  constructor(isLocal = true) {
    this.storage = isLocal ? localStorage: sessionStorage
  }

  setCache(key, value) { 
    if (!value) {
      throw new Error("value error: value必须有值!")
    }

    if (value) {
      this.storage.setItem(key, JSON.stringify(value))
    }
  }

  getCache(key) {
    const result = this.storage.getItem(key)
    if (result) {
      return JSON.parse(result)
    }
  }

  removeCache(key) {
    this.storage.removeItem(key)
  }

  clear() {
    this.storage.clear()
  }
}

const localCache = new Cache()
const sessionCache = new Cache(false)

```

  