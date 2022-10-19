const dgram = require("api/network/dgram");
const udp4 = dgram.createSocket("udp4");

// 'connect' 事件在套接字关联到远程地址作为成功的 connect() 调用的结果之后触发。
udp4.on("connect", () => {});

// rinfo <Object> 远程地址信息。
//  address <string> 发送者地址。
//  family <string> 地址族（'IPv4' 或 'IPv6'）。
//  port <number> 发送者端口。
//  size <number> 消息大小。
// 如果传入数据包的源地址是 IPv6 链路本地地址，则将接口名称添加到 address。 例如，在 en0 接口上接收的数据包可能将地址字段设置为 'fe80::2618:1234:ab11:3b9c%en0'，其中 '%en0' 是作为区域 ID 后缀的接口名称。
udp4.on("message", (msg, info) => {
  console.log(
    `dgram got: ${msg} from ${info.address}:${info.port} size:${info.size} type:${info.family}`
  );
});

// 一旦 dgram.Socket 可寻址并且可以接收数据，则会触发 'listening' 事件。 这会在 socket.bind() 中显式地发生，或者在第一次使用 socket.send() 发送数据时隐式地发生。
// 直到 dgram.Socket 正在监听，底层系统资源不存在，则调用 socket.address() 和 socket.setTTL() 等将失败。
udp4.on("listening", () => {
  const address = udp4.address();
  console.log(`dgram listening ${address.address}:${address.port}`);
});

udp4.on("error", (err) => {
  console.log(`dgram error:\n${err.stack}`);
  udp4.close(() => {});
});

// 在使用 close() 关闭套接字后会触发 'close' 事件。 一旦触发，则此套接字上将不会触发新的 'message' 事件。
udp4.on("close", () => {});

udp4.bind(
  {
    port: 41234,
    address: "0.0.0.0",
    // fd: // 当设置了大于 0 的 fd 时，则将使用给定的文件描述符环绕现有的套接字。 在这种情况下，port 和 address 的属性将被忽略。
    exclusive: false, // 当 exclusive 设置为 false（默认）时，集群工作进程将使用相同的底层套接字句柄，允许共享连接处理职责。 但是，当 exclusive 为 true 时，则句柄未共享，尝试共享端口会导致错误。
  },
  () => {
    udp4.address();
  }
);

// 将 dgram.Socket 关联到远程地址和端口。 此句柄发送的每条消息都会自动发送到该目标。
// 此外，套接字将只接收来自该远程对等方的消息。 尝试在已连接的套接字上调用 connect() 将导致 ERR_SOCKET_DGRAM_IS_CONNECTED 异常。
// 如果未提供 address，则默认使用 '127.0.0.1'（适用于 udp4 套接字）或 '::1'（适用于 udp6 套接字）。
// 一旦连接完成，就会触发 'connect' 事件并调用可选的 callback 函数。 如果失败，则调用 callback，或者触发 'error' 事件
udp4.connect(41235, "127.0.0.1", () => {
  // 当连接完成或出错时调用。
});

// 将连接的 dgram.Socket 与其远程地址分离的同步函数
// 尝试在未绑定或已断开连接的套接字上调用 disconnect() 将导致 ERR_SOCKET_DGRAM_NOT_CONNECTED 异常
udp4.disconnect();
