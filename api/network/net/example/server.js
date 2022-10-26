const net = require("net");

// TCP 服务端

const server = net.createServer(
  {
    allowHalfOpen: false,
    pauseOnConnect: false,
  },
  // connect 事件
  (client_socket) => {}
);

server.listen(
  {
    port: 8128,
    host: "127.0.0.1",
    backlog: 511, // backlog 参数来指定待处理连接队列的最大长度。 实际长度将由操作系统通过 sysctl(系统) 设置确定，例如 Linux 上的 tcp_max_syn_backlog 和 somaxconn。 此参数的默认值为 511（不是 512）。
    // path: "", // 如果指定了 port，则将被忽略。 请参阅标识 IPC 连接的路径 (Unix 域)。
    exclusive: true, // 当 exclusive 为 true 时，句柄不共享，尝试共享端口会导致错误。
    readableAll: false, // 对于 IPC 服务器，使管道对所有用户都可读。 默认值: false。
    writableAll: false, // 对于 IPC 服务器，使管道对所有用户都可写。 默认值: false。
    ipv6Only: false, // 对于 TCP 服务器，将 ipv6Only 设置为 true 将禁用双栈支持，即绑定到主机 :: 不会绑定 0.0.0.0。 默认值: false。
  },
  // listening 事件
  () => {}
);

// 在调用 server.listen() 后绑定服务器时触发。
server.on("listening", () => {
  const info = server.address();
  console.log(`TCP 服务 ${info.address}:${info.port}`);
});

// 建立新连接时触发。 socket.是 net.Socket 的实例。
server.on("connection", (client_sock) => {
  const { remoteAddress, remotePort } = client_sock;
  console.log("客户端请求来了", "ip:", remoteAddress, "port", remotePort);

  client_sock.setEncoding("utf-8");
  // 接收到客户端的数据，调用这个函数
  client_sock.on("data", (data) => {
    console.log(`客户端数据: ${data}`);
  });

  // 向客户端响应
  client_sock.write("拜拜", () => {
    client_sock.end();
  });
});

// 发生错误时触发。 与 net.Socket 不同，除非手动调用 server.close()，否则 'close' 事件不会在此事件之后直接触发。
server.on("error", (err) => {});

// 服务器关闭时触发。
server.on("close", () => {
  // console.log("服务端关闭了");
});
