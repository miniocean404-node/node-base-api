# 可写流
Writable 流的示例包括：
1. 客户端上的 HTTP 请求
2. 服务器上的 HTTP 响应
3. 文件系统写入流
4. 压缩流
5. 加密流
6. TCP 套接字
7. 子进程标准输入
8. process.stdout、process.stderr
其中一些示例实际上是实现 Writable 接口的 Duplex 流。

## Writable 类
### 初始化
```js
const ws = new Writable({
    highWaterMark: 16384, // stream.write() 开始返回 false 时的缓冲级别。 默认值: 16384 (16KB) 或 16 表示 objectMode 流。
    decodeStrings: true, // 是否将传给 stream.write() 的 string 编码为 Buffer（使用 stream.write() 调用中指定的编码），然后再将它们传给 stream._write()。 其他类型的数据不会被转换（即 Buffer 不会被解码为 string）。 设置为 false 将阻止 string 被转换。 默认值: true。
    defaultEncoding: "utf-8", // 没有将编码指定为 stream.write() 的参数时使用的默认编码。 默认值: 'utf8'。
    objectMode: false, //  stream.write(anyObj) 是否为有效操作。 当设置后，如果流实现支持，则可以写入字符串、Buffer 或 Uint8Array 以外的 JavaScript 值。 默认值: false。
    emitClose: true, // 流被销毁后是否应该触发 'close'。 默认值: true。
    autoClose:false, // 此流是否应在结束后自动调用自身的 .destroy()。 默认值: false。
    write: (chunk, encoding, callback) => {}, // stream._write() 方法的实现。
    writev: (chunks, callback) => {}, // stream._writev() 方法的实现。
    destroy: () => {}, // stream._destroy() 方法的实现。
    final: () => {}, // stream._final() 方法的实现。
});
```

### 属性
```js
// 流是否已经销毁
ws.destroyed;

// 是否可写
ws.writable;

// 在调用 writable.end() 之后是 true。 此属性不指示数据是否已刷新，
ws.writableEnded;

// 缓存数量
// 需要调用 writable.uncork() 以完全解开流的次数
ws.writableCorked;

// 在触发 'finish' 事件之前立即设置为 true。
ws.writableFinished;

// 构造此 Writable 时传入的 highWaterMark 的值
ws.writableHighWaterMark;

// 此属性包含队列中准备写入的字节数（或对象数）。 该值提供有关 highWaterMark 状态的内省数据。
ws.writableLength;

// 是否是 objectMode 模式
ws.writableObjectMode;
```

### 事件
```js
// 当流及其任何底层资源（例如文件描述符）已关闭时，则会触发 'close' 事件。 该事件表明将不再触发更多事件，并且不会发生进一步的计算。
// 如果 Writable 流是使用 emitClose 选项创建的，则始终会触发 'close' 事件。
ws.on("close", () => {});

// stream.write(chunk) 为 true 代表缓冲区有空间
// 如果对 stream.write(chunk) 的调用返回 false，则 'drain' 事件将在适合继续将数据写入流时触发。
ws.on("drain", () => {});

// 如果在写入或管道数据时发生错误，则会触发 'error' 事件。
ws.on("error", (err) => {});

// 在调用 stream.end() 方法之后，并且所有数据都已刷新到底层系统，则触发 'finish' 事件。
ws.on("finish", () => {});

// 接收到管道的可写源流
// 当在可读流上调用 stream.pipe() 方法将此可写流添加到其目标集时，则触发 'pipe' 事件。
ws.on("pipe", (src) => {});

// 取消管道此可写流的源流
// 当在 Readable 流上调用 stream.unpipe() 方法时，则会触发 'unpipe' 事件，从其目标集合中删除此 Writable。
ws.on("unpipe", (src) => {});
```

```js
// chunk <string> | <Buffer> | <Uint8Array> | <any> 可选的要写入的数据。 对于不在对象模式下操作的流，chunk 必须是字符串、Buffer 或 Uint8Array。
// 对于对象模式的流，chunk 可以是除 null 之外的任何 JavaScript 值。对象模式下的 Writable 流将始终忽略 encoding 参数。
// encoding <string> 如果 chunk 为字符串，则为编码。 默认值: 'utf8'
// callback <Function>
// 返回: <boolean> 如果流希望调用代码在继续写入其他数据之前等待 'drain' 事件被触发，则为 false；否则为 true。
// 1. 如果在接纳 chunk 后，内部缓冲区小于当创建流时配置的 highWaterMark，则返回值为 true。 如果返回 false，则应停止进一步尝试将数据写入流，直到触发 'drain' 事件
// 2. 当流没有排空时，对 write() 的调用将缓冲 chunk，并返回 false。 一旦所有当前缓冲的块都被排空（操作系统接受交付），则将触发 'drain' 事件。 建议一旦 write() 返回 false，则在触发 'drain' 事件之前不再写入块。
// 虽然允许在未排空的流上调用 write()，但 Node.js 将缓冲所有写入的块，直到出现最大内存使用量，此时它将无条件中止。 即使在它中止之前，高内存使用量也会导致垃圾收集器性能不佳和高 RSS（通常不会释放回系统，即使在不再需要内存之后）。 
// 由于如果远程对等方不读取数据，TCP 套接字可能永远不会排空，因此写入未排空的套接字可能会导致可远程利用的漏洞。
// 3. 在流未排空时写入数据对于 Transform 来说尤其成问题，因为 Transform 流是默认暂停，直到它们被管道传输、或添加 'data' 或 'readable' 事件句柄。
// 4. 如果要写入的数据可以按需生成或获取，则建议将逻辑封装成 Readable 并且使用 stream.pipe()。 但是，如果首选调用 write()，则可以使用 'drain' 事件遵守背压并避免内存问题：
ws.write("", "utf-8", (error) => {});

// 调用 writable.end() 方法表示不再有数据写入 Writable。
// 参数1：对于不在对象模式下操作的流，chunk 必须是字符串、Buffer 或 Uint8Array。 对于对象模式的流，chunk 可以是除 null 之外的任何 JavaScript 值。
ws.end("", "utf-8", () => {});

// 设置默认编码
ws.setDefaultEncoding("utf-8");

// 强制所有写入的数据都缓存在内存中。 当调用 stream.uncork() 或 stream.end() 方法时，缓冲的数据将被刷新
// writable.cork() 的主要目的是适应将几个小块快速连续写入流的情况。 writable.cork() 不是立即将它们转发到底层目标，而是缓冲所有块，
// 直到 writable.uncork() 被调用，如果存在，writable.uncork() 会将它们全部传给 writable._writev()。
// 这可以防止在等待处理第一个小块时正在缓冲数据的行头阻塞情况。 但是，在不实现 writable._writev() 的情况下使用 writable.cork() 可能会对吞吐量产生不利影响。
ws.cork();

// 1. writable.uncork() 方法会刷新自调用 stream.cork() 以来缓冲的所有数据。
// 2. 当使用 writable.cork() 和 writable.uncork() 管理写入流的缓冲时，建议使用 process.nextTick() 延迟对 writable.uncork() 的调用。
// 这样做允许对在给定 Node.js 事件循环阶段中发生的所有 writable.write() 调用进行批处理。
// 3. 如果在一个流上多次调用 writable.cork() 方法，则必须调用相同数量的 writable.uncork() 调用来刷新缓冲的数据。
ws.uncork();

// 强制销毁流 可选地触发 'error' 事件，并且触发 'close' 事件（除非 emitClose 设置为 false）
// 在此调用之后，则可写流已结束，随后对 write() 或 end() 的调用将导致 ERR_STREAM_DESTROYED 错误。
// 这是销毁流的破坏性和直接的方式。 先前对 write() 的调用可能没有排空，并且可能触发 ERR_STREAM_DESTROYED 错误。
// 如果数据应该在关闭之前刷新，或者在销毁流之前等待 'drain' 事件，则使用 end() 而不是销毁。 实现者不应覆盖此方法，而应实现 writable._destroy()。
ws.destroy(new Error("destroy"));
```
