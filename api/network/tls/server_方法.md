# TLS 方法

```js
// 添加安全的上下文，如果客户端请求的 SNI 名称与提供的 hostname（或通配符）匹配，则将使用该上下文。
// hostname <string> SNI 主机名或通配符（例如 '*'）
// context <Object> 包含来自 tls.createSecureContext() options 参数（例如 key、cert、ca 等）的任何可能属性的对象。
server.addContext("*", tls.createSecureContext());

// 包含来自 tls.createSecureContext() options 参数（例如 key、cert、ca 等）的任何可能属性的对象。
server.setSecureContext(tls.createSecureContext());

// 返回操作系统报告的绑定地址、地址族名称和服务器端口
const info = server.address();

// 此函数异步地运行。 当服务器没有更多打开的连接时,阻止服务器接受新连接
server.close(() => {
    // 监听服务器实例的 'close' 事件。
});

// 返回会话票证密钥的 48 字节缓冲区
const buffer = server.getTicketKeys();

// 设置会话票证密钥。更改票证密钥仅对以后的服务器连接有效。 现有的或当前挂起的服务器连接将使用以前的键。
server.setTicketKeys(buffer);

// 启动服务器监听加密连接。 此方法与 net.Server 中的 server.listen() 相同
server.listen();
```
