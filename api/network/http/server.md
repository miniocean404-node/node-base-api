# server

## 初始化
```js
const app = http.createServer({
  insecureHTTPParser: false, // 使用不安全的 HTTP 解析器，当为 true 时接受无效的 HTTP 标头。 应避免使用不安全的解析器。 有关详细信息，请参阅 --insecure-http-parser。 默认值: false
  IncomingMessage: http.IncomingMessage, // 指定要使用的 IncomingMessage 类。 用于扩展原始的 IncomingMessage。 默认值: IncomingMessage
  ServerResponse: http.ServerResponse, // 指定要使用的 ServerResponse 类。 用于扩展原始的 ServerResponse。 默认值: ServerResponse。
});
```

## 事件
```js
// 每次收到带有 HTTP Expect: 100-continue 的请求时触发。 如果未监听此事件，则服务器将根据需要自动响应 100 Continue
// 处理和处理此事件时，不会触发 'request' 事件。
app.on("checkContinue", (req, res) => {
  // 如果客户端应该继续发送请求正文，则处理此事件涉及调用 response.writeContinue()，或者如果客户端不应该继续发送请求正文，则生成适当的 HTTP 响应
  res.writeContinue();
});

// 每次收到带有 HTTP Expect 标头的请求时触发，其中值不是 100-continue。 如果未监听此事件，则服务器将根据需要自动响应 417 Expectation Failed。
// 处理和处理此事件时，不会触发 'request' 事件。
app.on("checkExpectation", (req, res) => {});

// 1. 如果客户端连接触发 'error' 事件，则会在此处转发。 此事件的监听器负责关闭/销毁底层套接字。 例如，可能希望使用自定义 HTTP 响应更优雅地关闭套接字，而不是突然切断连接。
// 除非用户指定 <net.Socket> 以外的套接字类型，否则此事件保证传入 <net.Socket> 类（<stream.Duplex> 的子类）的实例。
// 默认行为是在 HPE_HEADER_OVERFLOW 错误的情况下尝试使用 HTTP '400 Bad Request' 或 HTTP '431 Request Header Fields Too Large' 关闭套接字。 如果套接字不可写或已经写入数据，则会立即被销毁。
// socket 是错误源自的 net.Socket 对象。
// 2. err 是 Error 的实例，有两个额外的列：
// bytesParsed: Node.js 可能正确解析的请求数据包的字节数；
// rawPacket: 当前请求的原始数据包。
// 在某些情况下，客户端已经收到响应和/或套接字已经被销毁，例如 ECONNRESET 错误。 在尝试向套接字发送数据之前，最好检查它是否仍然可写。
app.on("clientError", (err, socket) => {
  if (err.code === "ECONNRESET" || !socket.writable) return;

  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

// 服务器关闭时触发。
app.on("close", () => {});

// request <http.IncomingMessage> HTTP 请求的参数，如它在 'request' 事件中
// socket <stream.Duplex> 服务器和客户端之间的网络套接字
// head <Buffer> 隧道流的第一个数据包（可能为空）
// 除非用户指定 <net.Socket> 以外的套接字类型，否则此事件保证传入 <net.Socket> 类（<stream.Duplex> 的子类）的实例。
// 每次客户端请求 HTTP CONNECT 方法时触发。 如果未监听此事件，则请求 CONNECT 方法的客户端将关闭其连接。
// 触发此事件后，请求的套接字将没有 'data' 事件监听器，这意味着需要绑定它才能处理发送到该套接字上的服务器的数据。
app.on("connect", (req, socket, head) => {});

// 除非用户指定 <net.Socket> 以外的套接字类型，否则此事件保证传入 <net.Socket> 类（<stream.Duplex> 的子类）的实例。
// 当建立新的 TCP 流时会触发此事件。 socket 通常是 net.Socket 类型的对象。 通常用户不会想访问这个事件。 特别是，由于协议解析器附加到套接字的方式，套接字将不会触发 'readable' 事件。 socket 也可以在 request.connection 上访问。
// 此事件也可以由用户显式发出，以将连接注入 HTTP 服务器。 在这种情况下，任何 Duplex 流都可以通过。
// 如果此处调用 socket.setTimeout()，则当套接字已服务请求时（如果 server.keepAliveTimeout 非零）超时将替换为 server.keepAliveTimeout。
app.on("connection", (socket) => {});

// 每次有请求时触发。 每个连接可能有多个请求（在 HTTP Keep-Alive 连接的情况下）
app.on("request", (req, res) => {});

// head <Buffer> 升级流的第一个数据包（可能为空）
// 每次客户端请求 HTTP 升级时触发。 监听此事件是可选的，客户端不能坚持协议更改。
// 触发此事件后，请求的套接字将没有 'data' 事件监听器，这意味着需要绑定它才能处理发送到该套接字上的服务器的数据。
// 除非用户指定 <net.Socket> 以外的套接字类型，否则此事件保证传入 <net.Socket> 类（<stream.Duplex> 的子类）的实例。
app.on("upgrade", (req, socket, head) => {});

// 停止服务器
app.close(() => {});
```

## 属性
```js
// 限制解析器等待接收完整 HTTP 标头的时间。
// 如果标头发送非常缓慢,基于不活动的超时仍然允许连接保持打开状态。 为了防止这种情况，每当标头数据到达时，都会进行额外的检查，以确保自连接建立以来没有超过 server.headersTimeout 毫秒。
// 如果检查失败，则会在服务器对象上触发 'timeout' 事件，并且（默认情况下）套接字将被销毁。
app.headersTimeout = 60000;

// 限制最大传入标头计数。 如果设置为 0，则不会应用任何限制
app.maxHeadersCount = 2000;

// 指示服务器是否正在监听连接。
app.listening;

// 值 0 将禁用传入连接的超时行为。
// 套接字超时逻辑是在连接上设置的，因此更改此值只会影响到服务器的新连接，而不会影响任何现有连接
app.timeout = 120000;

// 值 0 将禁用传入连接的超时行为。
// 在完成写入最后一个响应之后，在套接字将被销毁之前，服务器需要等待额外传入数据的不活动毫秒数。 如果服务器在 keep-alive 超时触发之前收到新数据，则将重置常规的不活动超时，即 server.timeout。
// 套接字超时逻辑是在连接上设置的，因此更改此值只会影响到服务器的新连接，而不会影响任何现有连接。
app.keepAliveTimeout = 5000
```

## 方法
```js
app.listen(
  {
    port: 3000,
    host: "0.0.0.0",
    backlog: 511, // backlog 参数来指定待处理连接队列的最大长度。 实际长度将由操作系统通过 sysctl 设置确定，例如 Linux 上的 tcp_max_syn_backlog 和 somaxconn。 此参数的默认值为 511（不是 512）。
    path: "", // 如果指定了 port，则将被忽略。 请参阅标识 IPC 连接的路径。
    exclusive: false, // 当 exclusive 为 true 时，句柄不共享，尝试共享端口会导致错误。
    readableAll: false, // 对于 IPC 服务器，使管道对所有用户都可读。 默认值: false。
    writableAll: false, // 对于 IPC 服务器，使管道对所有用户都可写。 默认值: false。
    ipv6Only: false, // 对于 TCP 服务器，将 ipv6Only 设置为 true 将禁用双栈支持，即绑定到主机 :: 不会绑定 0.0.0.0。 默认值: false。
  },
  () => {}
);

// 设置套接字的超时值，并在服务器对象上触发 'timeout' 事件，如果发生超时，则将套接字作为参数传入。
// 如果 Server 对象上有 'timeout' 事件监听器，则将使用超时套接字作为参数调用它。
// 但是，如果将回调分配给服务器的 'timeout' 事件，则必须显式处理超时
app.setTimeout(120000, () => {});
```
