# event

## 常用
```js
import EventEmitter from "events";

const event = new EventEmitter("");

// eventName: 正在监听的事件的名称
// listener: 事件处理函数
// 在有新的事件监听时触发
event.once("newListener", (eventName, listener) => {});

// 在事件移除时触发
event.once("removeListener", (eventName, listener) => {});

// 发射事件,返回是否有监听者 bool 值
const isHaveOn = event.emit("name", {});
// 关闭事件
event.off("name", () => {});
// 单次监听
event.once("name", () => {});
// 持续监听
event.on("name", () => {});

// 删除所有监听器，或指定 eventName 的监听器。
// name 可选
event.removeAllListeners("name");

// 从名为 eventName 的事件的监听器数组中移除指定的 listener。
// listener 为 on 时候的回调函数
event.removeListener("name", () => {});
```

## 查询
```js
// 监听的事件名数组
event.eventNames();

// 事件为 name 的监听器数量
event.listenerCount("name");
```

## 将事件放置开头
```js
// 将 listener 函数添加到名为 eventName 的事件的监听器数组的开头。 不检查是否已添加 listener。 多次调用传入相同的 eventName 和 listener 组合将导致多次添加和调用 listener。
event.prependListener("name", () => {});
// 单词添加事件 name 数组的开头，监听一次后移除
event.prependOnceListener("name", () => {});
```

## 常量
```js
// 默认情况下，最多可为任何单个事件注册 10 个监听器。
// 可以使用 emitter.setMaxListeners(n) 方法为单个 EventEmitter 实例更改此限制。
// emitter.getMaxListeners() 获取当前实例最大监听数
// 要更改所有 EventEmitter 实例的默认值，则可以使用 EventEmitter.defaultMaxListeners 属性。
EventEmitter.defaultMaxListeners = 10;

// 此符号应用于安装仅监视 'error' 事件的监听器。 在调用常规 'error' 监听器之前调用使用此符号安装的监听器。
// 一旦触发 'error' 事件，使用此符号安装监听器不会改变行为，因此如果未安装常规 'error' 监听器，则进程仍将崩溃。
EventEmitter.errorMonitor = () => {};
```

## 副本
```js
// 返回名为 eventName 的事件的监听器(on)数组的副本。
const eventArr1 = event.listeners("name");

// 返回名为 eventName 的事件的监听器数组的副本，包括任何封装器（例如由 .once() 创建的封装器）。
const eventArr2 = event.rawListeners("name");
```

## 事件是否被触发
```js
// 事件实例中的 这个事件 是否触发，如果错误就返回 reject
// 注意：当使用 events.once() 函数等待在同一批 process.nextTick() 操作中触发的多个事件时，或者同步触发多个事件时，有一个边缘情况值得注意。
// 具体来说，因为 process.nextTick() 队列在 Promise 微任务队列之前被排空，并且因为 EventEmitter 同步触发所有事件，但是 EventEmitter.once 是异步处理结果，所以 events.once() 有可能错过事件。
EventEmitter.once(event, "name").then(({ value }) => {});
// 如果 EventEmitter 触发 'error'，则将抛出错误。 它在退出循环时删除所有监听器。 每次迭代返回的 value 是由触发的事件参数组成的数组。
for (const ev of EventEmitter.on(event, "name")) {
}
```
