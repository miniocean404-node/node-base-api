# server

## 创建
```js
// 创建新的 TCP 或 IPC 服务器。服务器可以是 TCP 服务器或 IPC 服务器，这取决于其 listen() 什么
const server = new net.Server({
  allowHalfOpen: false,
  pauseOnConnect: false, //true的话每个传入连接关联的套接字将被暂停，并且不会从其句柄读取数据。 这允许在进程之间传递连接，而原始进程不会读取任何数据。 要开始从暂停的套接字读取数据，则调用 socket.resume()
});

const server2 = net.createServer(
  {
    allowHalfOpen: false,
    pauseOnConnect: false,
  },
  // 自动设置为 'connection' 事件的监听器。
  () => {}
);
```

## 事件
```js
// 服务器关闭时触发。
server.on("close", () => {});

// 建立新连接时触发。 socket 是 net.Socket 的实例。
server.on("connection", (socket) => {});

// 发生错误时触发。 与 net.Socket 不同，除非手动调用 server.close()，否则 'close' 事件不会在此事件之后直接触发。
server.on("error", (err) => {});

// 在调用 server.listen() 后绑定服务器时触发。
server.on("listening", () => {});

// 如果监听 IP 套接字，则返回操作系统报告的服务器的绑定 address、地址 family 名称和 port（用于在获取操作系统分配的地址时查找分配的端口）：{ port: 12346, family: 'IPv4', address: '127.0.0.1' }。
// server.address() 在 'listening' 事件触发之前或调用 server.close() 之后返回 null。
server.address();

// 停止服务器接受新连接并保持现有连接。 该函数是异步的，当所有连接都结束并且服务器触发 'close' 事件时，则服务器最终关闭。 一旦 'close' 事件发生，则可选的 callback 将被调用。
// 与该事件不同，如果服务器在关闭时未打开，它将以 Error 作为唯一参数被调用。
server.close((err) => {});
```

## 属性
```js
// 服务器是否正在监听连接
server.listening

// 此属性以在服务器的连接计数变高时拒绝连接
// 一旦套接字已发送给具有 child_process.fork() 的子进程，则不建议使用此选项
server.maxConnections
```

## 方法
```js
// 让服务活跃起来
server.ref()

// 让服务暂停，也将允许程序退出
server.unref()

// 服务器上的并发连接数。
// 当向具有 child_process.fork() 的子进程发送套接字时，这将变为 null。 要轮询衍生并获取当前的活动连接数，则改用异步的 server.getConnections()。
server.getConnections((error, count)=>{});

// 启动监听连接的服务器。 net.Server 可以是 TCP 或 IPC 服务器，这取决于它监听什么
// 最后一个参数 callback 将被添加为 'listening' 事件的监听器。
// 监听时最常见的错误之一是 EADDRINUSE。 当另一个服务器已经在监听请求的 port/path/handle 时会发生这种情况
// 当且仅当在第一次调用 server.listen() 期间出现错误或调用 server.close() 时，才能再次调用 server.listen() 方法。 否则，将抛出 ERR_SERVER_ALREADY_LISTEN 错误。
server.listen(
    {
        port: 3000,
        host: "0.0.0.0",
        backlog: 511, // backlog 参数来指定待处理连接队列的最大长度。 实际长度将由操作系统通过 sysctl 设置确定，例如 Linux 上的 tcp_max_syn_backlog 和 somaxconn。 此参数的默认值为 511（不是 512）。
        path: "", // 如果指定了 port，则将被忽略。 请参阅标识 IPC 连接的路径 (Unix 域)。
        exclusive: false, // 当 exclusive 为 true 时，句柄不共享，尝试共享端口会导致错误。
        readableAll: false, // 对于 IPC 服务器，使管道对所有用户都可读。 默认值: false。
        writableAll: false, // 对于 IPC 服务器，使管道对所有用户都可写。 默认值: false。
        ipv6Only: false, // 对于 TCP 服务器，将 ipv6Only 设置为 true 将禁用双栈支持，即绑定到主机 :: 不会绑定 0.0.0.0。 默认值: false。
    },
    () => {}
);

// handle <Object>
// backlog <number> server.listen() 函数的通用参数
// 启动服务器，监听已绑定到端口、Unix 域套接字或 Windows 命名管道的给定 handle 上的连接。
// handle 对象可以是服务器、套接字（任何具有底层 _handle 成员的对象），也可以是具有有效文件描述符的 fd 成员的对象。
// Windows 上不支持监听文件描述符。
server.listen({}, 1, () => {});
```
