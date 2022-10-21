# TLS 属性

```js
// 返回未验证对等方证书的原因。 此属性仅在 tlsSocket.authorized === false 时设置。
socket.authorizationError;

// 如果对等证书由创建 tls.TLSSocket 实例时指定的 CA 之一签名，则返回 true，否则返回 false。
socket.authorized;

// 当启用后，TLS 数据包跟踪信息将写入 stderr。 这可用于调试 TLS 连接问题。
// 注意：输出的格式与 openssl s_client -trace 或 openssl s_server -trace 的输出相同。
// 虽然它是由 OpenSSL 的 SSL_trace() 函数生成的，但格式未记录，可以在不通知的情况下更改，不应依赖
socket.enableTrace();

// 总是返回 true。 这可用于将 TLS 套接字与常规 net.Socket 实例区分开来。
socket.encrypted;

// 返回本地 IP 地址的字符串表示形式。
socket.localAddress;

// 返回本地端口的数字表示。
socket.localPort;

// 返回远程 IP 地址的字符串表示形式。 例如，'74.125.127.100' 或 '2001:4860:a005::68'。
socket.remoteAddress;

// 返回远程 IP 族的字符串表示形式。 'IPv4' 或 'IPv6'。
socket.remoteFamily;

// 返回远程端口的数字表示。 例如，443。
socket.remotePort;
```
