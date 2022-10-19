# Duplex 双工流
## 简介
双工流是同时实现 Readable 和 Writable 接口的流。
    Duplex 流的示例包括：
     * TCP 套接字
     * 压缩流
     * 加密流

## 初始化
```js
const duplex = new Duplex({
    allowHalfOpen: true, // 如果设置为 false，则流将在可读端结束时自动结束可写端。
    readable: true, // 是否可读。 默认值: true。
    writable: true, // 是否可写。 默认值: true。
    readableObjectMode: false, // 为流的可读端设置 objectMode。 如果 提供的流 objectMode 是 true，则无效。 默认值: false。
    writableObjectMode: false, // 为流的可写端设置 objectMode。 如果 提供的流 objectMode 是 true，则无效。 默认值: false。
    readableHighWaterMark: 16384, // 提供的读流有 则无效
    writableHighWaterMark: 16384, // 提供的写流有 则无效
    read: (size) => {},
    write: (chunk, encoding, callback) => {},
});
```

## 继承
```js
class MyDuplex extends Duplex {
  constructor(props) {
    super(props);
  }

  _read(size) {}

  _write(chunk, encoding, callback) {
    // 底层源代码只处理字符串。
  }

  _writev(chunks, callback) {
    super._writev(chunks, callback);
  }

  _construct(callback) {
    super._construct(callback);
  }

  _destroy(error, callback) {
    super._destroy(error, callback);
  }

  _final(callback) {
    super._final(callback);
  }
}
```
