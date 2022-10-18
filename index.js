const stream = require("stream");
const fs = require("fs");

const rs = stream.Readable({
  highWaterMark: 16384, // 在停止从底层资源读取之前存储在内部缓冲区中的最大字节数
  encoding: null, // 如果指定，则缓冲区将使用指定的编码解码为字符串
  objectMode: false, // 此流是否应表现为对象流。 这意味着 stream.read(n) 返回单个值而不是大小为 n 的 Buffer
  read: () => {}, // stream._read() 方法的实现。
  destroy: () => {}, //  stream._destroy() 方法的实现。
  autoDestroy: false, //  此流是否应在结束后自动调用自身的 .destroy()。 默认值: false。
});
