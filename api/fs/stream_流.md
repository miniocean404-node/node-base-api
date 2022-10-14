# 读取流

```js
const rs = fs.createReadStream("./index.js", {
  encoding: null, // encoding 可以是 Buffer 接受的任何一种。
  // 如果指定了 fd 并且 start 被省略或 undefined，则 fs.createReadStream() 从当前文件位置顺序读取。
  // 如果指定了 fd，则 ReadStream 将忽略 path 参数并使用指定的文件描述符。 这意味着不会触发 'open' 事件。 fd 应该是阻塞的；非阻塞 fd 应该传给 net.Socket。
  // 如果 fd 指向仅支持阻塞读取的字符设备（例如键盘或声卡），则读取操作不会在数据可用之前完成。 这可以防止进程退出和流自然关闭。将 emitClose 选项设置为 true 以更改此行为。
  fd: null,
  mode: 0o666, // 置文件模式（权限和粘滞位），但前提是文件已创建
  // 如果 autoClose 为 false，则即使出现错误，文件描述符也不会关闭。 关闭它并确保没有文件描述符泄漏是应用程序的责任。
  // 如果 autoClose 设置为 true（默认行为），则在 'error' 或 'end' 时，文件描述符将自动关闭。
  autoClose: true,
  emitClose: false,
  start: 0, // 开始位置
  end: Infinity, // 结束位置
  highWaterMark: 64 * 1024, // 读取时中间仓库最大存储限制 与可读流的 16 kb 默认 highWaterMark 不同，此方法返回的流的默认 highWaterMark 为 64 kb。
  fs: null, // fs 选项，可以覆盖 open、read 和 close 的相应 fs 实现。 提供 fs 选项时，需要覆盖 open、read 和 close。
});

rs.close();

rs.bytesRead; // 到目前为止已读取的字节数。
rs.path; // 流正在读取的文件的路径，如 fs.createReadStream() 的第一个参数中所指定。 如果 path 作为字符串传入，则 readStream.path 将是字符串。 如果 path 作为 Buffer 传入，则 readStream.path 将是 Buffer。
rs.pending; // 如果底层文件尚未打开，即在触发 'ready' 事件之前，则此属性为 true。
// 当 fs.ReadStream 的文件描述符被打开时触发
// ReadStream 使用的整数文件描述符。
rs.on("open", () => {});
// 当 fs.ReadStream 准备好使用时触发。'open' 后立即触发
rs.on("ready", () => {});
// 当 fs.ReadStream 的底层文件描述符已关闭时触发。
rs.on("close", () => {});
```

# 写入流

```js
// 1. 如果将 autoClose 设置为 true（默认行为），则在 'error' 或 'finish' 时文件描述符将自动关闭。
// 如果 autoClose 为 false，则即使出现错误，文件描述符也不会关闭。 关闭它并确保没有文件描述符泄漏是应用程序的责任。
// 将 emitClose 选项设置为 true 以更改此行为。
// 2. 通过提供 fs 选项，可以覆盖 open、write、writev 和 close 的相应 fs 实现。 在没有 writev() 的情况下覆盖 write() 会降低性能，因为某些优化 (_writev()) 将被禁用。 提供 fs 选项时，需要覆盖 open、close、以及 write 和 writev 中的至少一个。
// 与 ReadStream 一样，如果指定了 fd，则 WriteStream 将忽略 path 参数并使用指定的文件描述符。 这意味着不会触发 'open' 事件。 fd 应该是阻塞的；非阻塞 fd 应该传给 net.Socket。
// 3. 如果 options 是字符串，则它指定编码。
const ws = fs.createWriteStream("./1.txt", {
  flags: "w",
  encoding: "utf-8",
  fd: null,
  mode: 0o666,
  autoClose: true,
  emitClose: false,
  start: 0,
  fs: null,
});

// 到目前为止写入的字节数。 不包括仍在排队等待写入的数据。
ws.bytesWritten;

// 流正在写入的文件的路径，如 fs.createWriteStream() 的第一个参数中所指定。 如果 path 作为字符串传入，则 writeStream.path 将是字符串。
// 如果 path 作为 Buffer 传入，则 writeStream.path 将是 Buffer。
ws.path;

// 如果底层文件尚未打开，即在触发 'ready' 事件之前，则此属性为 true。
ws.pending;

// 当 fs.ReadStream 的底层文件描述符已关闭时触发。
ws.on("close", () => {});

// 当 fs.ReadStream 的文件描述符(fd)被打开时触发。
ws.on("open", () => {});

// 当 fs.ReadStream 准备好使用时触发。
ws.on("ready", () => {});
```
