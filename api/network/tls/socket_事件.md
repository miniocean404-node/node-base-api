# TLSSocket 类

## 初始化
```js
// 现有的 TCP 套接字构造新的 tls.TLSSocket 对象。
const socket = tls.TLSSocket(net.Socket, {
  isServer: false, // SSL/TLS 协议是不对称的，TLSSockets 必须知道它们是作为服务器还是客户端运行。 如果 true TLS 套接字将被实例化为服务器。 默认值: false。
  socketserver: net.Server, // net.Server 实例。
  requestCert: true, //  如果 true TLS 请求客户端证书
  requestOCSP: true, // 如果为 true, 则指定将 OCSP 状态请求扩展添加到客户端 hello 并在建立安全通信之前在套接字上触发 'OCSPResponse' 事件

  rejectUnauthorized: true, // 如果不是 false，则服务器将拒绝任何未经提供的 CA 列表授权的连接。 此选项仅在 requestCert 为 true 时有效。 默认值: true。
  // <string[]> | <Buffer[]> | <TypedArray[]> | <DataView[]> | <Buffer> | <TypedArray> | <DataView> 字符串数组、
  // Buffer、或 TypedArray、或 DataView、或包含支持的 ALPN 协议的单个 Buffer 或 TypedArray 或 DataView。 
  // Buffer 的格式应该是 [len][name][len][name]...，例如 0x05hello0x05world，其中第一个字节是下一个协议名称的长度。 
  // 传入数组通常要简单得多，例如 ['hello', 'world']。 （协议应按优先级排序。）
  ALPNProtocols: [],
  // 如果客户端支持 SNI TLS 扩展，将调用的函数。 
  // 调用时将传入两个参数：servername 和 callback。 callback 是错误优先的回调，
  // 它有两个可选参数：error 和 ctx。 ctx 是 SecureContext 实例（如果提供）。 
  // tls.createSecureContext() 可用于获得正确的 SecureContext。 
  // 如果使用非真的 ctx 参数调用 callback，则将使用服务器的默认安全上下文。 
  // 如果未提供 SNICallback，则将使用具有高级 API 的默认回调（见下文）
  SNICallback: (servername,cb)=>{},
  // TLS 会话的 Buffer 实例。
  session:Buffer.from(''),
  // 使用 tls.createSecureContext() 创建的 TLS 上下文对象。 如果 secureContext 未提供，则将通过将整个 options 对象传给 tls.createSecureContext() 来创建。
  secureContext:tls.createSecureContext(),
  // ...: 如果缺少 secureContext 选项，则使用 tls.createSecureContext() 选项。 否则，它们将被忽略。
});

// line <Buffer> ASCII 文本行，采用 NSS SSLKEYLOGFILE 格式。
// 当套接字生成或接收密钥材料时，keylog 事件在 tls.TLSSocket 上触发。 该密钥材料可以存储用于调试，因为它允许对捕获的 TLS 流量进行解密。 它可能会在握手完成之前或之后多次触发。
socket.on("keylog", () => {});

// 当客户端发送证书状态请求,且设置了 requestOCSP 选项时会触发 'OCSPRequest' 事件

socket.on("OCSPRequest", (response) => {
  // response <Buffer> 服务器的 OCSP 响应
  // response 是来自服务器 CA 的数字签名对象，其中包含有关服务器证书吊销状态的信息。
});

// 在新连接的握手过程成功完成后触发。
// 无论服务器的证书是否被授权，都会调用监听回调。 客户端有责任检查 tlsSocket.authorized 属性以确定服务器证书是否由指定的 CA 之一签名。
// 如果为 tlsSocket.authorized === false，则可以通过检查 tlsSocket.authorizationError 属性来发现错误。
// 如果使用了 ALPN，可以检查 tlsSocket.alpnProtocol 属性来确定协商的协议。
socket.on("secureConnection", (tlsSocket) => {});

// 1. 当新会话或 TLS 票证可用时，则客户端 tls.TLSSocket 上会触发 'session' 事件。
// 这可能会也可能不会在握手完成之前发生，具体取决于协商的 TLS 协议版本。 该事件未在服务器上触发，或者未创建新会话，
// 例如，当连接恢复时。 对于某些 TLS 协议版本，事件可能会多次发出，在这种情况下，所有会话都可以用于恢复
// 2. 在客户端，可以将 session 提供给 tls.connect() 的 session 选项来恢复连接。
// 3. 对于 TLSv1.2 及以下版本，握手完成后可以调用 tls.TLSSocket.getSession()。
// 4. 对于 TLSv1.3，协议只允许基于票证的恢复，发送多张票证，直到握手完成后才发送票证。
// 所以需要等待 'session' 事件才能得到可恢复的会话。 应用程序应该使用 'session' 事件而不是 getSession() 来确保它们适用于所有 TLS 版本。
// 只希望获得或使用一个会话的应用程序应该只监听此事件一次：
// tlsSocket.once('session', (session) => {
//     // 会话可以立即或稍后使用。
//     tls.connect({
//         session: session,
//         // 其他连接选项...
//     });
// });
socket.once("session", (session) => {});
```
