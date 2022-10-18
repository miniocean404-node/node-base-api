# 模块 API
```js
// 当流不再可读、可写或遇到错误或过早关闭事件时获得通知的函数。
// stream.finished() 在调用 callback 后清理事件监听器（特别是 'error'、'end'、'finish' 和 'close'）。
// 这样做的原因是意外的 'error' 事件（由于不正确的流实现）不会导致意外崩溃。 如果这是不需要的行为，则需要在回调中调用返回的清理函数：
// stream <Stream> 可读和/或可写的流。
// 返回: <Function> 清除所有已注册监听器的函数。
const clean = stream.finished(
  fs.createWriteStream("file.txt"),
  {
    error: true, // 如果设置为 false，则对 emit('error', err) 的调用不会被视为已完成
    readable: true, // 当设置为 false 时，即使流可能仍然可读，也会在流结束时调用回调
    writable: true, // 当设置为 false 时，即使流可能仍可写，也会在流结束时调用回调。
  },
  (err) => {
    clean();
  }
);

// 当管道完全完成时调用。
// stream.pipeline() 将在所有流上调用 stream.destroy(err)，除了：
// 已触发 'end' 或 'close' 的 Readable 流。
// 已触发 'finish' 或 'close' 的 Writable 流。
// 在调用 callback 后，stream.pipeline() 在流上留下没有作用的事件监听器。 在失败后重用流的情况下，这可能会导致事件监听器泄漏和吞下错误。
stream.pipeline(rs, fs.createWriteStream("file.txt"), (err) => {});

// 一个从迭代器中创建可读流的实用方法。
// 默认情况下，Readable.from() 会将 options.objectMode 设置为 true，除非通过将 options.objectMode 设置为 false 来明确选择退出。
stream.Readable.from(rs, { objectMode: true });
```
