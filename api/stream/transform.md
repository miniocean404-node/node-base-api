# Transform 转换流
## 简介
转换流是 Duplex 流，其中输出以某种方式与输入相关。 与所有 Duplex 流一样，Transform 流实现了 Readable 和 Writable 接口。
Transform 流的示例包括：
* 压缩流
* 加密流

## 转换流
```js
const transform = new Transform({
    allowHalfOpen: true, // 如果设置为 false，则流将在可读端结束时自动结束可写端。
    readableObjectMode: false, // 为流的可读端设置 objectMode。 如果 提供的流 objectMode 是 true，则无效。 默认值: false。
    writableObjectMode: false, // 为流的可写端设置 objectMode。 如果 提供的流 objectMode 是 true，则无效。 默认值: false。
    readableHighWaterMark: 16384, // 提供的读流有 则无效
    writableHighWaterMark: 16384, // 提供的写流有 则无效
    transform(chunk, encoding, callback) {},
    flush(callback) {},
});

// 销毁流，并可选择地触发 'error' 事件。 在此调用之后，转换流将释放任何内部资源。 
// 实现者不应覆盖此方法，而应实现 readable._destroy()。 Transform 的 _destroy() 的默认实现也会触发 'close'，除非 emitClose 设置为 false。
// 返回: <this>
transform.destroy(new Error('转换流错误'))
```

## 继承
```js
class MyTransform extends Transform {
  constructor(props) {
    super(props);
  }

  // chunk <Buffer> | <string> | <any> 要转换的 Buffer，从 string 转换为 stream.write()。 如果流的 decodeStrings 选项是 false 或者流在对象模式下运行，则块将不会被转换，而是传给 stream.write() 的任何内容。
  // encoding <string> 如果块是字符串，则这是编码类型。 如果块是缓冲区，则这是特殊值 'buffer'。 在这种情况下忽略它。
  // callback <Function> 在处理提供的 chunk 后调用的回调函数（可选地带有错误参数和数据）。
  // 所有 Transform 流实现都必须提供 _transform() 方法来接受输入并产生输出。 transform._transform() 实现处理写入的字节，计算输出，然后使用 transform.push() 方法将该输出传给可读部分。
  // callback 函数必须在当前块被完全消耗时才被调用。 如果在处理输入时发生错误，则传给 callback 的第一个参数必须是 Error 对象，否则传给 null。 如果将第二个参数传给 callback，它将被转发到 transform.push() 方法。 换句话说，以下内容是等效的：
  _transform(chunk, encoding, callback) {
    super._transform(chunk, encoding, callback);
  }

  // callback: 在刷新剩余数据时调用的回调函数（可选地带有错误参数和数据）
  // 此函数不得由应用程序代码直接调用。 它应该由子类实现，并且只能由内部 Readable 类方法调用。
  // 当没有更多的写入数据被消耗时，但在触发 'end' 事件以表示 Readable 流结束之前，将调用此方法。
  // 在 transform._flush() 实现中，transform.push() 方法可以被调用零次或多次，视情况而定。 必须在刷新操作完成时调用 callback 函数。
  _flush(callback) {
    super._flush(callback);
  }
}
```
