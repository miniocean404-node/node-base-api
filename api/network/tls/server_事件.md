# TLS 事件

```js
const server = new tls.Server();

// 此事件在建立新的 TCP 流时触发，在 TLS 握手开始之前。
// socket 通常是 net.Socket 类型的对象。 通常用户不会想访问这个事件。
// 此事件也可以由用户显式地触发以将连接注入 TLS 服务器。
server.on("connection", (socket) => {});

// 获取 SSL keylog 文件
// line <Buffer> ASCII 文本行，采用 NSS SSLKEYLOGFILE 格式。
// tlsSocket <tls.TLSSocket> 生成它的 tls.TLSSocket 实例。
// keylog 事件在生成或通过与此服务器的连接接收密钥材料时触发（通常在握手完成之前，但不一定）。
// 该密钥材料可以存储用于调试，因为它允许对捕获的 TLS 流量进行解密。 它可以为每个套接字多次触发。
server.on("keylog", (line, tlsSocket) => {});

// 创建新的 TLS 会话时触发 'newSession' 事件。 这可用于在外部存储中存储会话。 数据应该提供给 'resumeSession' 回调。
// 监听此事件只会对添加事件监听器后建立的连接有影响。
// sessionId <Buffer> TLS 会话标识符
// sessionData <Buffer> TLS 会话数据
// callback <Function> 回调函数不带参数，必须调用这些参数才能通过安全连接发送或接收数据。
server.on("newSession", (sessionId, sessionData, callback) => {});

// 当客户端请求恢复之前的 TLS 会话时，则会触发 'resumeSession' 事件
// sessionId <Buffer> TLS 会话标识符
//  callback <Function> 恢复前一个会话时要调用的回调函数：callback([err[, sessionData]])
//      err <Error>
//      sessionData <Buffer>
// 以下说明恢复 TLS 会话：
// const tlsSessionStore = {};
// server.on('newSession', (id, data, cb) => {
//     tlsSessionStore[id.toString('hex')] = data;
//     cb();
// });
// server.on('resumeSession', (id, cb) => {
//     cb(null, tlsSessionStore[id.toString('hex')] || null);
// });
server.on("resumeSession", (sessionId, callback) => {});

// 当客户端发送证书状态请求时会触发 'OCSPRequest' 事件
// certificate <Buffer> 服务器证书
// issuer <Buffer> 发行人证书
// callback <Function> 必须调用的回调函数来提供 OCSP 请求的结果。
// 1. 可以解析服务器当前的证书，获取 OCSP URL 和证书 ID；获取 OCSP 响应后，
// 再调用 callback(null, resp)，其中 resp 是包含 OCSP 响应的 Buffer 实例。
// certificate 和 issuer 都是主证书和颁发者证书的 Buffer DER 表示。 这些可用于获取 OCSP 证书 ID 和 OCSP 端点 URL。
// 2. 或者，可以调用 callback(null, null)，表示没有 OCSP 响应。
// 3. 调用 callback(err) 将导致调用 socket.destroy(err)。
// 4. OCSP 请求的典型流程如下：
// 客户端连接到服务器并发送 'OCSPRequest'（通过 ClientHello 中的状态信息扩展）。
// 服务器收到请求并触发 'OCSPRequest' 事件，如果已注册则调用监听器。
// 服务器从 certificate 或 issuer 中提取 OCSP URL，并向 CA 执行 OCSP 请求。
// 服务器从 CA 接收 'OCSPResponse' 并通过 callback 参数将其发送回客户端
// 客户端验证响应并销毁套接字或执行握手。
// 如果证书是自签名证书或颁发者不在根证书列表中，则 issuer 可以是 null。 （在建立 TLS 连接时可以通过 ca 选项提供颁发者。）
// 5. 监听此事件只会对添加事件监听器后建立的连接有影响。
// 6. 像 asn1.js 这样的 npm 模块可用于解析证书。
server.on("OCSPRequest", (certificate, issuer, callback) => {});

// 在新连接的握手过程成功完成后触发。
// 1. tlsSocket.authorized 属性是一个 boolean，指示客户端是否已通过服务器提供的证书颁发机构之一进行验证。 如果 tlsSocket.authorized 为 false，
// 则设置 socket.authorizationError 来描述授权失败的方式。 根据 TLS 服务器的设置，可能仍会接受未经授权的连接。
// 2. tlsSocket.alpnProtocol 属性是包含所选 ALPN 协议的字符串。 当 ALPN 没有选择协议时，则 tlsSocket.alpnProtocol 等于 false。
// 3. tlsSocket.servername 属性是包含通过 SNI 请求的服务器名称的字符串。
server.on('secureConnection',(tlsSocket)=>{})

// 在建立安全连接之前发生错误时会触发 'tlsClientError' 事件。
// exception <Error> 描述错误的 Error 对象
// tlsSocket <tls.TLSSocket> 错误源自的 tls.TLSSocket 实例
server.on('tlsClientError',(err, tlsSocket)=>{})
```
