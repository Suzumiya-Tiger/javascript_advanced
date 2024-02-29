// 需求：判断一个标识符是否是对象
function isObject(value) {
  // null,object,function,array 都是一种对象类型
  const valueType = typeof value;
  return value !== null && (valueType === "object" || valueType === "function");
}
