## 常用

global

Buffer 类

__dirname

__filename

console

process

queueMicrotask(callback)

queueMicrotask() 方法将微任务排队以调用 callback。 如果 callback 抛出异常，则将触发 process 对象的 'uncaughtException' 事件。

微任务队列由 V8 管理，并且可以以类似于 process.nextTick() 队列的方式使用，后者由 Node.js 管理。 在 Node.js 事件循环的每次轮询中，process.nextTick() 队列总是在微任务队列之前处理。
```js
 queueMicrotask(() => {
      this.emit('load', hit);
 });
```

exports

module

require()

## timer

setImmediate(callback[, ...args])

setInterval(callback, delay[, ...args])

setTimeout(callback, delay[, ...args])

clearImmediate(immediateObject)

clearInterval(intervalObject)

clearTimeout(timeoutObject)

## 文本

TextDecoder

TextEncoder

## URL

URL

URLSearchParams

WebAssembly
