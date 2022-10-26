const dgram = require("dgram");
const dns = require("dns");
const { parseHost, forward, customResolve } = require("./utils");

// 创建 dgram.Socket 对象。 一旦创建了套接字，则调用 socket.bind() 将指示套接字开始监听数据报消息。
// 当 address 和 port 没有传给 socket.bind() 时，则该方法会将套接字绑定到随机端口上的“所有接口”地址（它对 udp4 和 udp6 套接字都做正确的事情）
const udp4 = dgram.createSocket(
  {
    type: "udp4",
    reuseAddr: false, // 当 true socket.bind() 将重用该地址时，即使另一个进程已经在其上绑定了套接字。 默认值: false。
    ipv6Only: false, // 将 ipv6Only 设置为 true 将禁用双栈支持，即绑定到地址 :: 不会使 0.0.0.0 被绑定。 默认值: false。
    recvBufferSize: 1000, // 接收的套接字最大值
    sendBufferSize: 1000, // 发送的套接字最大值
    lookup: dns.lookup,
  },
  // message 的监听器
  () => {}
);

udp4.bind(
  {
    port: 53, // DNS 默认端口
    address: "localhost",
    exclusive: false,
  },
  // listening 监听器
  () => {}
);

udp4.on("listening", () => {
  const { address, port } = udp4.address();
  console.log(`server listening ${address}:${port}`);
});

udp4.on("message", (msg, rinfo) => {
  // rinfo <Object> 远程地址信息。
  //  address <string> 发送者地址。
  //  family <string> 地址族（'IPv4' 或 'IPv6'）。
  //  port <number> 发送者端口。
  //  size <number> 消息大小。

  // 截取 问题查询区域 从 12 开始
  const host = parseHost(msg.subarray(12));
  console.log(msg.subarray(12), msg);
  // nslookup 输入 baidu.com 得到结果
  if (/guangguangguang/.test(host)) {
    customResolve(msg, rinfo, udp4);
  } else {
    forward(msg, rinfo, udp4);
  }
});

udp4.on("error", (err) => {
  console.log(`dns 错误 ${err}`);
});
