# 定时器
大多数情况下和浏览器使用一致，一些不同如下

## 定时器都有的
```js
// 暂时取消定时器
ref.unref();
// 定时器是否处于活跃状态
ref.hasRef();
// 恢复定时器
ref.ref();
```

## Timeout 类
```js
// 在已经调用其回调的定时器上使用它会重新激活定时器
// 将定时器的开始时间设置为当前时间，并重新调度定时器在调整为当前时间的先前指定的时长调用其回调。 这对于在不分配新的 JavaScript 对象的情况下刷新定时器很有用。
ref.refresh()

// 将 Timeout 强制为原始类型。 该原始类型可用于清除 Timeout。 该原始类型只能在创建 Timeout 的同一线程中使用。 
// 因此，要在 worker_threads 上使用它，则必须首先将其传给正确的线程。 
// 这允许增强与浏览器 setTimeout() 和 setInterval() 实现的兼容性。
ref[Symbol.toPrimitive]();
```
