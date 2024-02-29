function hyajax({ url, method = "get", data = {}, timeout = 10000 } = {}) {
  // 1.创建xhr请求(AJAX请求)
  const xhr = new XMLHttpRequest();
  // 1.1.创建promise
  const promise = new Promise((resolve, reject) => {
    // 2.请求完成后的响应回调获取
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject({ status: xhr.status, message: xhr.statusText });
      }
    };
    // 3.设置类型
    xhr.responseType = "json";
    // 设置超时时间
    xhr.timeout = timeout;
    // 4.open方法
    if (method.toUpperCase() === "GET") {
      const queryString = [];
      for (const key in data) {
        queryString.push(`${key}=${data[key]}`);
      }
      url = url + "?" + queryString.join("&");
      xhr.open(method, url);
      xhr.send();
    } else {
      xhr.open(method, url);
      // 5.设置请求头
      xhr.setRequestHeader("Content-Type", "application/json");
      // 6.发出请求
      xhr.send(JSON.stringify(data));
    }
  });
  // 为了外界能够调用xhr完成取消这类功能，我们应该把promise单独返回出去，同时把xhr写在promise的外层作用域
  // 最后我们把xhr添加到promise的里面，以方便外界调用xhr.abort()之类的功能
  promise.xhr = xhr;
  return promise;
}
