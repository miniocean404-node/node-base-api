# Agent 类
## 简介
客户端
1. Agent 负责管理 HTTP 客户端连接的持久性和重用。 它维护一个给定主机和端口的待处理请求队列，为每个请求重用单个套接字连接，直到队列为空，此时套接字要么被销毁，要么放入池中，在池中它会被再次用于请求到相同的主机和端口。 是销毁还是池化取决于 keepAlive 选项。
2. 池化的连接会为其启用 TCP Keep-Alive，但服务器可能仍会关闭空闲连接，在这种情况下，它们将从池中删除，并在为该主机和端口发出新的 HTTP 请求时建立新连接。 服务器也可能拒绝允许通过同一个连接的多个请求，在这种情况下，必须为每个请求重新建立连接，并且不能池化。 Agent 仍将向该服务器发出请求，但每个请求都将通过新连接发生。
3. 当客户端或服务器关闭连接时，它会从池中删除。 池中任何未使用的套接字都将被取消引用，(底层 socket.unref())当不再使用时则 destroy() Agent 实例，因为未使用的套接字会消耗操作系统资源
4. 当套接字触发 'close' 事件或 'agentRemove' 事件时,从代理池中删除
    ```js
    http.get(options, (res) => {
      // 做些事情
    }).on('socket', (socket) => {
      socket.emit('agentRemove');
    });
    ```
5. 代理也可用于单个请求。 通过提供 {agent: false} 作为 http.get() 或 http.request() 函数的选项，则单次使用的具有默认选项的 Agent 将用于客户端连接。
    ```js
    http.get({
      hostname: 'localhost',
      port: 80,
      path: '/',
      agent: false  // 仅为这个请求创建新代理，不重用代理
    }, (res) => {
      // 使用响应做些事情
    });
    ```
## 初始化
```js
const agent = new http.Agent({
  // HTTPS 还包含 tls 的部分属性
  maxCachedSessions: 100, // TLS 缓存会话的最大数量。 使用 0 禁用 TLS 会话缓存。 默认值: 100。
  servername: "", // 要发送到服务器的服务器名称指示扩展的值。 使用空字符串 '' 禁用发送扩展名。 默认值: 目标服务器的主机名，除非使用 IP 地址指定目标服务器，在这种情况下，默认为 ''（无扩展名）。
   
  // HTTP
  //  即使没有未完成的请求，也要保留套接字，这样它们就可以用于未来的请求，而无需重新建立 TCP 连接。
  //  不要与 Connection 标头的 keep-alive 值混淆。
  //  使用代理时总是发送 Connection: keep-alive 标头，除非显式指定了 Connection 标头或当 keepAlive 和 maxSockets 选项分别设置为 false 和 Infinity，在这种情况下将使用 Connection: close。
  //  默认值: false。
  keepAlive: true,
  // 当 keepAlive 选项为 false 或 undefined 时则忽略
  keepAliveMsecs: 1000,
  // 每个主机允许的最大套接字数量。 每个请求将使用新的套接字，直到达到最大值
  maxSockets: Infinity,
  // 所有主机总共允许的最大套接字数量。 每个请求将使用新的套接字，直到达到最大值
  maxTotalSockets: Infinity,
  // 在空闲状态下打开的最大套接字数量。
  maxFreeSockets: 256,
  // 选择下一个要使用的空闲套接字时应用的调度策略。 它可以是 'fifo' 或 'lifo'。
  // 两种调度策略的主要区别在于 'lifo' 选择最近使用的套接字，而 'fifo' 选择最近最少使用的套接字。 在每秒请求率较低的情况下，'lifo' 调度将降低选择可能因不活动而被服务器关闭的套接字的风险。
  // 在每秒请求率较高的情况下，'fifo' 调度将最大化打开套接字的数量，而 'lifo' 调度将保持尽可能低。
  scheduling: "fifo",
  // 这将在创建套接字时设置超时
  timeout: 1000,
});

// line <Buffer> ASCII 文本行，采用 NSS SSLKEYLOGFILE 格式。
// tlsSocket <tls.TLSSocket> 生成它的 tls.TLSSocket 实例。
// 当此代理管理的连接生成或接收密钥材料时（通常在握手完成之前，但不一定），则会触发 keylog 事件。 该密钥材料可以存储用于调试，因为它允许对捕获的 TLS 流量进行解密。 它可以为每个套接字多次触发。
https.globalAgent.on("keylog", (line, tlsSocket) => {});

// 生成用于 HTTP 请求的套接字/流
// 默认情况下，此函数与 net.createConnection() 相同。 但是，如果需要更大的灵活性，自定义代理可能会覆盖此方法
// 可以通过以下两种方式之一提供套接字/流：通过从此函数返回套接字/流，或将套接字/流传给 callback。
// 此方法保证返回 <net.Socket> 类（<stream.Duplex> 的子类）的实例，除非用户指定 <net.Socket> 以外的套接字类型。
agent.createConnection(
        {
           fd: 0,
           allowHalfOpen: false,
           readable: false,
           writable: false,
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
        },
        (err, stream) => {}
);
```

## 属性
```js
// 当启用 keepAlive 时，包含当前等待代理使用的套接字数组的对象
agent.freeSockets;

// 默认设置为 256。 对于启用了 keepAlive 的代理，这将设置在空闲状态下将保持打开的最大套接字数量。
agent.maxFreeSockets

// 默认设置为 Infinity。 确定代理可以为每个来源打开多少个并发套接字
agent.maxSockets

// 默认设置为 Infinity。 确定代理可以打开多少个并发套接字。 与 maxSockets 不同，此参数适用于所有来源
agent.maxTotalSockets

// 包含尚未分配给套接字的请求队列的对象。不要修改。
agent.requests

// 包含代理当前正在使用的套接字数组的对象。 不要修改。
agent.sockets
```

## 方法
```js
// 此方法可以被特定的 Agent 子类覆盖。 如果此方法返回假值，则套接字将被销毁，而不是将其持久化以供下一个请求使用。
// 当 socket 从请求中分离并且可以由 Agent 持久化时调用。 默认行为是：
// socket.setKeepAlive(true, this.keepAliveMsecs);
// socket.unref();
// return true;
agent.keepSocketAlive(socket);

// 当 socket 由于保持活动选项而持久化后附加到 request 时调用
agent.reuseSocket(socket, http.request());

// 获取一组请求选项的唯一名称，以确定是否可以重用连接。 对于 HTTP 代理，则这将返回 host:port:localAddress 或 host:port:localAddress:family。
// 对于 HTTPS 代理，则名称包括 CA、证书、密码和其他确定套接字可重用性的 HTTPS/TLS 特定选项。
agent.getName({
   host: "www.baidu.com", // 向其发出请求的服务器的域名或 IP 地址
   port: 80, // 远程服务器端口
   localAddress: "127.0.0.1", // 发出请求时绑定网络连接的本地接口
   family: 4,
});

// 销毁代理当前正在使用的所有套接字。
agent.destroy();
```
