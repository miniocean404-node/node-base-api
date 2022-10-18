const stream = require("stream");
const { ReadStream } = require("fs");

class MyReadable extends ReadStream {
  constructor(highWaterMark, ...option) {
    super({
      highWaterMark,
      autoDestroy: true,
      emitClose: true,
    });
  }

  // 调用 readable._read() 时，如果资源中的数据可用，则实现应开始使用 this.push(dataChunk) 方法将该数据推送到读取队列中。
  // 一旦调用了 readable._read() 方法，则不会再次调用它，直到通过 readable.push() 方法推送更多数据。 空缓冲区和字符串等空数据不会导致调用 readable._read()。
  // size 参数是建议性的。 对于“读取”是返回数据的单个操作的实现，可以使用 size 参数来确定要获取多少数据。 其他实现可能会忽略此参数，并在数据可用时简单地提供数据。 在调用 stream.push(chunk) 之前不需要“等待”直到 size 个字节可用。
  _read(size) {
    // readable._read() 处理过程中发生的错误必须通过 readable.destroy(err) 方法传播。 从 readable._read() 中抛出 Error 或手动触发 'error' 事件会导致未定义的行
    this.destroy(new Error(""));

    // chunk <Buffer> | <Uint8Array> | <string> | <null> | <any> 要推入读取队列的数据块。 对于不在对象模式下操作的流，chunk 必须是字符串、Buffer 或 Uint8Array。 对于对象模式的流，chunk 可以是任何 JavaScript 值。
    // encoding <string> 字符串块的编码。 必须是有效的 Buffer 编码，例如 'utf8' 或 'ascii'。
    // 返回: <boolean> 如果可以继续推送额外的数据块，则为 true；否则为 false。
    // 当 chunk 为 Buffer、Uint8Array 或 string 时，数据的 chunk 将被添加到内部队列中供流的用户消费。 将 chunk 作为 null 传递信号表示流结束 (EOF)，之后不能再写入数据。
    // 当 Readable 处于暂停模式时，在 'readable' 事件触发时调用 readable.read() 方法可以读出添加了 readable.push() 的数据。
    // 当 Readable 工作在流动模式时，添加了 readable.push() 的数据将通过触发 'data' 事件来传递。
    // readable.push() 方法设计得尽可能灵活。 例如，当封装提供某种形式的暂停/恢复机制和数据回调的低层源时，低层源可以由自定义 Readable 实例封装：
    this.push("", "utf-8");
    super._read(size);
  }

  // 可选实现
  _destroy(error, callback) {
    super._destroy(error, callback);
  }

  // 可选实现
  _construct(callback) {
    super._construct(callback);
  }
}
