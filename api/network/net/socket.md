# Socket 类

## 简介
1. 此类是 TCP 套接字或流式 IPC 端点（在 Windows 上使用命名管道，否则使用 Unix 域套接字）的抽象。 它也是 EventEmitter。
2. net.Socket 可以由用户创建并直接用于与服务器交互。 例如，通过 net.createConnection() 返回它，因此用户可以使用它与服务器对话。
3. 它也可以由 Node.js 创建并在接收到连接时传给用户。 例如，它被传给在 net.Server 上触发的 'connection' 事件的监听器，因此用户可以使用它与客户端进行交互。

## 创建
```js
// 创建新的套接字对象。
// 新创建的套接字可以是 TCP 套接字或流式 IPC 端点，这取决于它 connect() 什么。
const socket = new net.Socket({
  // fd: 110, // 如果指定，则使用给定的文件描述符封装现有的套接字，否则将创建新的套接字。
  allowHalfOpen: false, // 如果 allowHalfOpen 设置为 true，套接字将不会自动将其可写端 end()，从而允许用户写入任意数量的数据。 用户必须显式调用 end() 来关闭连接
  readable: false, // 当传入 fd 时，则允许在套接字上读取，否则将被忽略。 默认值: false。
  writable: false, // 当传入 fd 时，则允许在套接字上写入，否则将被忽略。 默认值: false。
});
```

## 事件
```js
// 接收到数据时触发。 参数 data 将是 Buffer 或 String。 数据的编码由 client.setEncoding() 设置。
client.on("data", (data) => {
    console.log("服务端数据：", data.toString());
});

// 在解析主机名之后但在连接之前触发。 不适用于 Unix 套接字。
client.on("lookup", (err, address, family, host) => {});

// 当成功建立套接字连接时触发。 参见 net.createConnection()。
client.on("connect", () => {});

// 当套接字准备好使用时触发。'connect' 后立即触发。
client.on("ready", () => {
    client.write(`我是 ${client.address()}`, "utf-8", () => {});

    client.end();
});

// 当写缓冲区变空时触发。 可用于限制上传。
client.on("drain", () => {});

// 如果套接字因不活动而超时则触发。 这只是通知套接字已空闲。 用户必须手动关闭连接。
client.on("timeout", () => {});

// 发生错误时触发。 'close' 事件将在此事件之后直接调用。
client.on("error", (err) => {
    console.log("客户端错误:", err);
});

// 但是，如果 allowHalfOpen 设置为 true，套接字将不会自动将其可写端 end()，从而允许用户写入任意数量的数据。 用户必须显式调用 end() 来关闭连接（即发回一个 FIN 数据包）。
client.on("end", () => {
    console.log("客户端结束了");
});

// 一旦套接字完全关闭就触发。 参数 hadError 是布尔值，表示套接字是否由于传输错误而关闭。
client.on("close", (hadError) => {
    if (hadError) {
        console.log("客户端有错误");
    }
    console.log("客户端关闭了");

    client.destroy();
});
```

## 属性
```js
// 远程 IP 地址的字符串表示形式。 例如，'74.125.127.100' 或 '2001:4860:a005::68'。 如果套接字被破坏（例如，如果客户端断开连接），则值可能是 undefined。
socket.remoteAddress

// 远程 IP 系列的字符串表示形式。 'IPv4' 或 'IPv6'。
socket.remoteFamily

// 远程端口的数字表示。
socket.remotePort

// 如果套接字尚未连接，则为 true，要么是因为 .connect() 尚未被调用，要么是因为它仍在连接过程中
socket.pending

// 远程客户端连接的本地 IP 地址的字符串表示形式。
socket.localAddress

// 本地端口的数字表示。
socket.localPort

// 指示连接是否被破坏。 一旦连接被破坏，就不能再使用它传输数据
socket.destroyed

// 如果 true，则 socket.connect(options[, connectListener]) 已被调用且尚未完成。 它将保持 true 直到套接字连接，然后将其设置为 false 并触发 'connect' 事件。 
// 请注意，socket.connect(options[, connectListener]) 回调是 'connect' 事件的监听器。
socket.connecting

// 此属性显示为写入而缓冲的字符数。 缓冲区可能包含编码后长度未知的字符串。 所以这个数字只是缓冲区中字节数的近似值。
// net.Socket 具有 socket.write() 始终有效的特性。 这是为了帮助用户快速启动和运行。 计算机无法始终跟上写入套接字的数据量。 网络连接可能太慢了。 Node.js 将在内部对写入套接字的数据进行排队，并在可能的情况下通过网络将其发送出去。
// 这种内部缓冲的结果是内存可能会增长。 经历过大型或不断增长的 bufferSize 的用户应该尝试使用 socket.pause() 和 socket.resume() 来"节流"他们程序中的数据流。
socket.bufferSize

// 接收的字节数。
socket.bytesRead

// 发送的字节数。
socket.bytesWritten
```

## 方法
```js
// 返回操作系统报告的绑定 address、地址 family 名称和套接字的 port：{ port: 12346, family: 'IPv4', address: '127.0.0.1' }
socket.address();

// 此函数是异步的。 建立连接后，将触发 'connect' 事件。 如果连接出现问题，则将触发 'error' 事件并将错误传给 'error' 监听器，而不是触发 'connect' 事件。
// 最后一个参数 connectListener（如果提供）将作为 'connect' 事件的监听器添加一次。
socket.connect({
  // TCP 连接，可用的 options 是
  port: 8080, // 必需的。 套接字应连接到的端口
  host: "localhost", // 套接字应连接到的主机。 默认值: 'localhost'。
  localAddress: "localhost", // 套接字应该连接的本地地址。
  localPort: 3000, // 套接字应连接的本地端口。
  family: 0, // IP 堆栈的版本。 必须是 4、6 或 0。 值 0 表示允许 IPv4 和 IPv6 地址。 默认值: 0
  hints: 0, // 可选的 dns.lookup() 提示。
  lookup: dns.lookup, // 自定义查找函数。 默认值: dns.lookup().
  // IPC 连接，可用的 options 是
  path: "", // 必需的。 客户端应该连接到的路径。 请参阅标识 IPC 连接的路径。 如果提供，则忽略上面特定于 TCP 的选项。
  // 对于 IPC TCP ，可用的 options 包括
  // 如果指定，传入的数据存储在单个 buffer 中，并在数据到达套接字时传给提供的 callback。 这将导致流功能不提供任何数据。
  // 套接字将像往常一样触发 'error'、'end' 和 'close' 等事件。 pause() 和 resume() 等方法也将按预期运行。
  onread: {
    buffer: Buffer.alloc(10), // 用于存储传入数据的可重用内存块或返回此类数据的函数。
    callback(bytesWritten, buf) {}, // 为每个传入数据块调用此函数。 传给它的有两个参数：写入 buffer 的字节数和对 buffer 的引用。 从此函数返回 false 以隐式 pause() 套接字。 该函数将在全局上下文中执行。
  },
});

// path <string> 客户端应该连接到的路径。 请参阅标识 IPC 连接的路径。
socket.connect("path", () => {});

// 如果整个数据被成功刷新到内核缓冲区，则返回 true。 如果所有或部分数据在用户内存中排队，则返回 false。 当缓冲区再次空闲时，将触发 'drain'。
// 可选的 callback 参数将在数据最终写完时执行（可能不会立即执行）。
socket.write("", "utf-8", () => {});

// 半关闭套接字。 即，它发送一个 FIN 数据包。 服务器可能仍会发送一些数据。
socket.end("", "utf-8", () => {});

// 确保此套接字上不再发生 I/O 活动。 销毁流并关闭连接。
socket.destroy(new Error("销毁"));

// 暂停读取数据。 也就是说，不会触发 'data' 事件。 用于限制上传。
socket.pause();

// 调用 socket.pause() 后继续读取。
socket.resume();

// 在以前的 unref 套接字上调用 ref() 不会让程序退出
socket.ref();

// 在套接字上调用 unref() 将允许程序退出。
socket.unref();

// 将套接字的编码设置为可读流。
socket.setEncoding("utf-8");

// 启用/禁用保持活动功能，并可选择在空闲套接字上发送第一个保持活动探测之前设置初始延迟
// 设置 initialDelay（以毫秒为单位）以设置接收到的最后一个数据包和第一个保持活动探测之间的延迟。 将 0 设置为 initialDelay 将使该值与默认（或先前）设置保持不变
socket.setKeepAlive(false, 0);

// Nagle 的算法在数据通过网络发送之前延迟数据。 它试图以延迟为代价来优化吞吐量。
// 为 noDelay 传入 true 或不传入参数将禁用套接字的 Nagle 算法
socket.setNoDelay(true);

// 将套接字设置为在套接字上 timeout 毫秒不活动后超时。 默认情况下 net.Socket 没有超时。
// 当空闲超时被触发时，套接字将收到 'timeout' 事件，但连接不会被切断。 用户必须手动调用 socket.end() 或 socket.destroy() 才能结束连接。
socket.setTimeout(10000, () => {});
```
