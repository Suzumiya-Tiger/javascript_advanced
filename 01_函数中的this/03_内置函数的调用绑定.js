// 内置函数或第三方库，根据一些经验判断this的指向
// setTimeout(function () {
//   console.log("定时器函数", this);
// }, 3000);
// forEach的第二个参数可以用于指定this
var names = ["yuki", "haruhi", "mikuru"];
var ob = { name: "why" };
names.forEach(item => {
  // node中指向空对象，浏览器指向绑定的this
  console.log("forEach:", this);
}, ob);
