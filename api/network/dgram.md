# Dgram 数据报

## 事件
```js
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
```

## 方法
```js
// 对于 UDP 套接字，使 dgram.Socket 在命名的 port 和可选的 address 上监听数据报消息。
// 同时指定 'listening' 事件监听器并将 callback 传给 socket.bind() 方法无害但不是很有用。
// 绑定的数据报套接字使 Node.js 进程保持运行以接收数据报消息。
// 如果绑定失败，则生成 'error' 事件。 在极少数情况下（例如，尝试与关闭的套接字绑定），可能会抛出 Error。
udp4.bind(
    {
        // 如果未指定 port 或 0，则操作系统将尝试绑定到随机端口。
        port: 41234,
        // 未指定 address，则操作系统将尝试监听所有地址。 一旦绑定完成，则会触发 'listening' 事件并调用可选的 callback 函数。
        address: "127.0.0.0",
        // 当将 dgram.Socket 对象与 cluster 模块一起使用时会使用该属性。
        // 当 exclusive 设置为 false（默认）时，集群工作进程将使用相同的底层套接字句柄，允许共享连接处理职责。
        // 但是，当 exclusive 为 true 时，则句柄未共享，尝试共享端口会导致错误。
        exclusive: false,
        // 当设置了大于 0 的 fd 时，则将使用给定的文件描述符环绕现有的套接字。 在这种情况下，port 和 address 的属性将被忽略。
        fd: null,
    },
    () => {}
);

// 关闭底层套接字并停止监听其上的数据。 如果提供回调，则将其添加为 'close' 事件的监听器
udp4.close(() => {});

// 将 dgram.Socket 关联到远程地址和端口。 此句柄发送的每条消息都会自动发送到该目标。
// 此外，套接字将只接收来自该远程对等方的消息。
// 尝试在已连接的套接字上调用 connect() 将导致 ERR_SOCKET_DGRAM_IS_CONNECTED 异常。
// 如果未提供 address，则默认使用 '127.0.0.1'（适用于 udp4 套接字）或 '::1'（适用于 udp6 套接字）。
// 一旦连接完成，就会触发 'connect' 事件并调用可选的 callback 函数。 如果失败，则调用 callback，或者触发 'error' 事件。
udp4.connect(41234, "127.0.0.1", () => {
    // 当连接完成或出错时调用。
});

// 将连接的 dgram.Socket 与其远程地址分离的同步函数。 尝试在未绑定或已断开连接的套接字上调用 disconnect() 将导致 ERR_SOCKET_DGRAM_NOT_CONNECTED 异常。
udp4.disconnect();

// 返回包含套接字地址信息的对象。 对于 UDP 套接字，此对象将包含 address、family 和 port 属性。
// 如果在未绑定的套接字上调用此方法将抛出 EBADF
udp4.address();

// 使用 IP_ADD_MEMBERSHIP 套接字选项告诉内核在给定的 multicastAddress 和 multicastInterface 上加入多播组。
// 如果未指定 multicastInterface 参数，则操作系统将选择一个接口并为其添加成员资格。
// 要为每个可用接口添加成员资格，则多次调用 addMembership，每个接口一次。
// 当在未绑定的套接字上调用时，则此方法将隐式地绑定到随机端口，监听所有接口。
// 当在多个 cluster 工作进程共享 UDP 套接字时，则必须只调用一次 socket.addMembership() 函数，否则会发生 EADDRINUSE 错误
// multicastAddress <string>
// multicastInterface <string>
udp4.addMembership("224.0.0.114", "224.0.0.114");

// 指示内核使用 IP_DROP_MEMBERSHIP 套接字选项离开 multicastAddress 处的多播组。 当套接字关闭或进程终止时，内核会自动调用此方法，因此大多数应用程序永远没有理由调用此方法。
// 如果未指定 multicastInterface，则操作系统将尝试删除所有有效接口上的成员资格。
udp4.dropMembership("224.0.0.114", "224.0.0.114");

// 告诉内核在给定的 sourceAddress 和 groupAddress 上加入特定于源的多播频道，使用 multicastInterface 和 IP_ADD_SOURCE_MEMBERSHIP 套接字选项。
// 如果未指定 multicastInterface 参数，则操作系统将选择一个接口并为其添加成员资格。
// 要为每个可用接口添加成员资格，则多次调用 socket.addSourceSpecificMembership()，每个接口一次。
// 当在未绑定的套接字上调用时，则此方法将隐式地绑定到随机端口，监听所有接口。
// sourceAddress <string>
// groupAddress <string>
// multicastInterface <string>
udp4.addSourceSpecificMembership("224.0.0.114", "224.0.0.114", "224.0.0.114");

// 指示内核使用 IP_DROP_SOURCE_MEMBERSHIP 套接字选项在给定的 sourceAddress 和 groupAddress 处保留特定于源的多播通道。 当套接字关闭或进程终止时，内核会自动调用此方法，因此大多数应用程序永远没有理由调用此方法。
// 如果未指定 multicastInterface，则操作系统将尝试删除所有有效接口上的成员资格。
udp4.dropSourceSpecificMembership("224.0.0.114", "224.0.0.114", "224.0.0.114");

// 如果在未绑定的套接字上调用此方法将抛出 ERR_SOCKET_BUFFER_SIZE。
// 返回: <number> SO_RCVBUF 套接字接收缓冲区大小（以字节为单位）
udp4.getRecvBufferSize();

// 如果在未绑定的套接字上调用此方法将抛出 ERR_SOCKET_BUFFER_SIZE。
// 返回: <number> SO_SNDBUF 套接字发送缓冲区大小（以字节为单位）。
udp4.getSendBufferSize();

// 默认情况下，只要套接字处于打开状态，则绑定套接字将导致它阻止 Node.js 进程退出。
// socket.unref() 方法可用于从保持 Node.js 进程处于活动状态的引用计数中排除套接字。
// socket.ref() 方法将套接字添加回引用计数并恢复默认行为。
// socket.ref() 方法返回对套接字的引用，因此可以链接调用。
udp4.ref();

// socket.unref() 方法可用于将套接字从保持 Node.js 进程处于活动状态的引用计数中排除,即使套接字仍在监听，也允许进程退出。
udp4.unref();

// 返回包含远程端点的 address、family 和 port 的对象。 如果套接字未连接，则此方法将抛出 ERR_SOCKET_DGRAM_NOT_CONNECTED 异常。
udp4.remoteAddress();

// 在套接字上广播数据报。 对于无连接套接字，则必须指定目标 port 和 address。 另一方面，已连接的套接字将使用其关联的远程端点，因此不得设置 port 和 address 参数。
// msg 参数包含要发送的消息。 根据其类型，可以应用不同的行为。 如果 msg 是 Buffer、任何 TypedArray 或 DataView，则 offset 和 length 分别指定消息开始的 Buffer 中的偏移量和消息中的字节数。 如果 msg 是 String，则会自动转换为 'utf8' 编码的 Buffer。 对于包含多字节字符的消息，offset 和 length 将根据字节长度而不是字符位置进行计算。 如果 msg 是数组，则不能指定 offset 和 length。
// address 参数是字符串。 如果 address 的值是主机名，则会使用 DNS 解析主机地址。 如果未提供 address 或其他错误，则默认情况下将使用 '127.0.0.1'（用于 udp4 套接字）或 '::1'（用于 udp6 套接字）。
// 如果套接字之前没有绑定过对 bind 的调用，则该套接字会被分配随机端口号并绑定到“所有接口”地址（'0.0.0.0' 用于 udp4 套接字，'::0' 用于 udp6 套接字。）
// 可以指定可选的 callback 函数作为报告 DNS 错误或确定何时可以安全地重用 buf 对象的一种方式。 DNS 查找延迟了 Node.js 事件循环的至少一滴答的发送时间。
// 确定数据报已发送的唯一方法是使用 callback。 如果发生错误并给出 callback，则错误将作为第一个参数传给 callback。 如果未给出 callback，则错误将作为 socket 对象上的 'error' 事件触发。
// 偏移量和长度是可选的，但如果使用任何一个，则必须都设置。 仅当第一个参数是 Buffer、TypedArray 或 DataView 时才支持它们。
// 如果在未绑定的套接字上调用此方法将抛出 ERR_SOCKET_BAD_PORT。
// 关于 UDP 数据报大小的说明#
//      IPv4/v6 数据报的最大大小取决于 MTU（最大传输单元）和 Payload Length 字段大小。
//      Payload Length 字段是 16 位宽，这意味着正常的有效载荷不能超过 64K 八位字节，包括互联网标头和数据（65,507 字节 = 65,535 − 8 字节 UDP 标头 − 20 字节 IP 标头）；这对于环回接口通常是正确的，但是如此长的数据报消息对于大多数主机和网络来说是不切实际的。
//      MTU 是给定链路层技术可以支持数据报消息的最大尺寸。 对于任何链接，IPv4 要求至少 MTU 为 68 个八位字节，而建议 IPv4 的 MTU 为 576（通常建议为拨号类型应用程序的 MTU），无论它们是完整的还是分段的。
//      对于 IPv6，最小 MTU 是 1280 个八位字节。 但是，强制的最小片段重组缓冲区大小是 1500 个八位字节。 68 个八位字节的值非常小，因为大多数当前的链路层技术，如以太网，最小 MTU 为 1500。
//      不可能事先知道数据包可能通过的每个链路的 MTU。 发送大于接收方 MTU 的数据报将不起作用，因为数据包将被悄悄丢弃，而不会通知源数据未到达其预期接收方。
udp4.send("", 0, 10, 80, "127.0.0.1", (error, bytes) => {});

// 本节中对范围的所有引用均指 IPv6 区域索引，由 RFC 4007 定义。 以字符串形式，具有作用域索引的 IP 写成 'IP%scope'，其中作用域是接口名称或接口编号。
// 将套接字的默认传出多播接口设置为选定接口或返回系统接口选择。 multicastInterface 必须是来自套接字家族的 IP 的有效字符串表示形式。
// 对于 IPv4 套接字，这应该是为所需物理接口配置的 IP。 在套接字上发送到多播的所有数据包都将在最近成功使用此调用确定的接口上发送。
// 对于 IPv6 套接字，multicastInterface 应包括范围来指示接口，如以下示例中所示。
// 在 IPv6 中，单个 send 调用也可以在地址中使用显式范围，因此只有发送到多播地址而未指定显式范围的数据包才会受到最近成功使用此调用的影响。
// 调用的结果
//      对未准备好发送或不再打开的套接字的调用可能会抛出 Not running Error。
//      如果无法将 multicastInterface 解析为 IP，则抛出 EINVAL System Error。
//      在 IPv4 上，如果 multicastInterface 是有效地址但与任何接口都不匹配，或者如果地址与系列不匹配，则抛出 System Error，例如 EADDRNOTAVAIL 或 EPROTONOSUP。
//      在 IPv6 上，大多数指定或省略范围的错误将导致套接字继续使用（或返回）系统的默认接口选择。
//      套接字地址族的任何地址（IPv4 '0.0.0.0' 或 IPv6 '::'）可用于将套接字默认传出接口的控制权返回给系统，以便将来使用多播数据包。
udp4.setMulticastInterface("::%eth1"); // IPv6
udp4.setMulticastInterface("10.0.0.2"); // IPv4

// 设置或清除 IP_MULTICAST_LOOP 套接字选项。 当设置为 true 时，本地接口也会收到多播数据包。
udp4.setMulticastLoopback(true);

// 设置或清除 SO_BROADCAST 套接字选项。 当设置为 true 时，UDP 数据包可能会被发送到本地接口的广播地址。
udp4.setBroadcast(true);

// 设置 IP_MULTICAST_TTL 套接字选项。 虽然 TTL 通常代表 "生存时间"，但在此上下文中，它指定了允许数据包通过的 IP 跃点数，特别是对于多播流量。
// 转发数据包的每个路由器或网关都会递减 TTL。 如果 TTL 被路由器递减为 0，则不会转发。
// ttl 参数可以是 0 到 255 之间。 大多数系统上的默认值为 1。
udp4.setMulticastTTL(1);

// 设置 SO_RCVBUF 套接字选项。 设置最大套接字接收缓冲区（以字节为单位）。
udp4.setRecvBufferSize(10);

// 设置 SO_SNDBUF 套接字选项。 设置最大套接字发送缓冲区（以字节为单位）。
udp4.setSendBufferSize(10);

// 设置 IP_TTL 套接字选项。 虽然 TTL 通常代表"生存时间"，但在此上下文中，它指定了允许数据包通过的 IP 跃点数。
// 转发数据包的每个路由器或网关都会递减 TTL。 如果 TTL 被路由器递减为 0，则不会转发。 更改 TTL 值通常用于网络探测或多播。
// ttl 参数可以是 1 到 255 之间。 大多数系统的默认值为 64。
udp4.setTTL(64);
```
