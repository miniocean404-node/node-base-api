# TLS Socket 方法

```js
// 返回操作系统报告的底层套接字的绑定 address、地址 family 名称和 port：{ port: 12346, family: 'IPv4', address: '127.0.0.1' }。
socket.address();

// 禁用此 TLSSocket 实例的 TLS 重新协商。 一旦调用，则尝试重新协商将在 TLSSocket 上触发 'error' 事件
socket.disableRenegotiation();

// 返回表示本地证书的对象。 返回的对象有一些与证书字段对应的属性。
// 有关证书结构的示例，请参见 tls.TLSSocket.getPeerCertificate()。
// 如果没有本地证书，则将返回空对象。 如果套接字被销毁，则返回 null。
socket.getCertificate();

// name <string> 密码套件的 OpenSSL 名称。
// standardName <string> 密码套件的 IETF 名称。
// version <string> 此密码套件支持的最低 TLS 协议版本。
const info = socket.getCipher();

// 返回一个对象，表示客户端连接上完美前向保密中临时密钥交换的参数的类型、名称和大小。
// 当密钥交换不是短暂的时，则它返回空对象。
// 因为这仅在客户端套接字上受支持；如果在服务器套接字上调用，则返回 null。
// 支持的类型是 'DH' 和 'ECDH'。 name 属性仅在类型为 'ECDH' 时可用。
const info1 = socket.getEphemeralKeyInfo();

// 返回: <Buffer> | <undefined> 作为 SSL/TLS 握手的一部分已发送到套接字的最新 Finished 消息，如果尚未发送 Finished 消息，则为 undefined。
// 由于 Finished 消息是完整握手的消息摘要（对于 TLS 1.0 总共有 192 位，对于 SSL 3.0 则更多），当不需要或不需要 SSL/TLS 提供的身份验证时，它们可用于外部身份验证程序不够。
// 对应于 OpenSSL 中的 SSL_get_finished 例程，可用于实现 RFC 5929 中的 tls-unique 通道绑定。
const buffer1 = socket.getFinished();

// 返回代表对等方证书的对象。 如果对端没有提供证书，则将返回空对象。 如果套接字被销毁，则返回 null。
// 如果请求完整的证书链，则每个证书都将包含一个 issuerCertificate 属性，其中包含代表其颁发者证书的对象。
// detailed <boolean> 如果为 true，则包含完整的证书链，否则仅包含对等方的证书。
// 返回: <Object> 证书对象。
socket.getPeerCertificate(true);

// 返回: <Buffer> | <undefined> 作为 SSL/TLS 握手的一部分，预期或实际已从套接字接收到的最新 Finished 消息，如果到目前为止还没有 Finished 消息，则为 undefined。
// 由于 Finished 消息是完整握手的消息摘要（对于 TLS 1.0 总共有 192 位，对于 SSL 3.0 则更多），当不需要或不需要 SSL/TLS 提供的身份验证时，它们可用于外部身份验证程序不够。
// 对应于 OpenSSL 中的 SSL_get_peer_finished 例程，可用于实现 RFC 5929 中的 tls-unique 通道绑定。
socket.getPeerFinished();

// 返回包含当前连接的协商 SSL/TLS 协议版本的字符串。 对于尚未完成握手过程的已连接套接字，将返回值 'unknown'。 服务器套接字或断开的客户端套接字将返回值 null。
// 协议版本为：
// 'SSLv3'
// 'TLSv1'
// 'TLSv1.1'
// 'TLSv1.2'
// 'TLSv1.3'
socket.getProtocol();

// 如果没有协商会话，则返回 TLS 会话数据或 undefined。 在客户端，可以将数据提供给 tls.connect() 的 session 选项来恢复连接。 在服务器上，它可能对调试有用。
// getSession() 仅适用于 TLSv1.2 及以下版本。 对于 TLSv1.3，应用程序必须使用 'session' 事件（它也适用于 TLSv1.2 及更低版本）。
socket.getSession();

// 返回: <Array> 服务器和客户端之间共享的签名算法列表，按优先级降序排列。
socket.getSharedSigalgs();

// 密钥材料用于验证以防止网络协议中的不同类型的攻击，例如在 IEEE 802.1X 的规范中。
// length <number> 从密钥材料中检索的字节数
// label <string> 特定于应用程序的标签，通常是来自 IANA 出口商标签注册 的值。
// context <Buffer> 可选地提供上下文。
// 返回: <Buffer> 请求的密钥材料字节
socket.exportKeyingMaterial(128, "client finished", Buffer.from(""));

// 对于客户端，如果可用，则返回 TLS 会话票证，或 undefined。 对于服务器，总是返回 undefined。
// 它可能对调试有用。
socket.getTLSTicket();

// 返回: <boolean> 如果会话被重用则为 true，否则为 false。
socket.isSessionReused();



// tlsSocket.renegotiate() 方法启动 TLS 重新协商过程。 当完成后，callback 函数将传入一个参数，该参数是 Error（如果请求失败）或 null。
// 此方法可用于在建立安全连接后请求对等方的证书。
// 当作为服务器运行时，套接字将在 handshakeTimeout 超时后销毁并出现错误。
// 对于 TLSv1.3，无法发起重协商，协议不支持。
// 返回: <boolean> 如果重新协商已启动则为 true，否则为 false。
socket.renegotiate(
  {
    rejectUnauthorized: true, // 如果不是 false，则服务器证书将根据提供的 CA 列表进行验证。 如果验证失败，则会触发 'error' 事件；err.code 包含 OpenSSL 错误代码。 默认值: true。
  },
  // 如果 renegotiate() 返回 true，则回调将绑定到 'secure' 事件。
  // 如果 renegotiate() 返回 false, 则 callback 将在下一个滴答中被调用并出错, 除非 tlsSocket 已被销毁, 在这种情况下根本不会调用 callback。
  (err) => {}
);

// 设置最大 TLS 片段大小。 如果设置限制成功，则返回 true；否则返回 false。
// 较小的片段大小减少了客户端的缓冲延迟：较大的片段由 TLS 层缓冲，直到接收到整个片段并验证其完整性；大片段可以跨越多次往返，并且由于数据包丢失或重新排序，它们的处理可能会延迟。
// 但是，较小的片段会增加额外的 TLS 成帧字节和 CPU 开销，这可能会降低整体服务器吞吐量。
// 最大 TLS 片段大小。 最大值为 16384。 默认值: 16384。
socket.setMaxSendFragment(16384);
```
