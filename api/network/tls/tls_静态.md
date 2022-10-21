# TLS 

## 属性
```js
// 不可变的字符串数组，代表当前 Node.js 版本提供的捆绑 Mozilla CA 存储中的根证书（以 PEM 格式）。
// Node.js 提供的捆绑 CA 存储是 Mozilla CA 存储的快照，在发布时已修复。 它在所有支持的平台上都是相同的。
tls.rootCertificates;

// tls 服务器中用于 ECDH 密钥协议的默认曲线名称。 默认值为 'auto'。 请参阅 tls.createSecureContext() 了解更多信息。
tls.DEFAULT_ECDH_CURVE;

// <string> tls.createSecureContext() 的 maxVersion 选项的默认值。 它可以分配任何支持的 TLS 协议版本，'TLSv1.3'、'TLSv1.2'、'TLSv1.1' 或 'TLSv1'。 默认值: 'TLSv1.3',
// 除非使用 CLI 选项更改。 使用 --tls-max-v1.2 将默认设置为 'TLSv1.2'。 使用 --tls-max-v1.3 将默认设置为 'TLSv1.3'。
// 如果提供了多个选项，则使用最高的最大值。
tls.DEFAULT_MAX_VERSION;
tls.DEFAULT_MIN_VERSION;
```

## 方法
```js
// 验证证书 cert 颁发给 hostname。
// 可以通过提供替代函数作为传给 tls.connect() 的 options.checkServerIdentity 选项的一部分来覆盖此函数。 覆盖函数当然可以调用 tls.checkServerIdentity()，以增加通过额外验证完成的检查。
// 此函数仅在证书通过所有其他检查时才会调用，例如由受信任的 CA (options.ca) 颁发。
// 如果存在匹配的 uniformResourceIdentifier 主题替代名称，则 Node.js 的早期版本会错误地接受给定 hostname 的证书（请参阅 CVE-2021-44531）。 希望接受 uniformResourceIdentifier 主题替代名称的应用程序可以使用实现所需行为的自定义 options.checkServerIdentity 函数。
// hostname <string> 用于验证证书的主机名或 IP 地址。
// cert <Object> 证书对象代表对等方的证书。
// 返回 <Error> 对象，失败时用 reason、host 和 cert 填充它。 当成功时，返回 <undefined>。
tls.checkServerIdentity("127.0.0.1", {});

// 返回包含支持的 TLS 密码名称的数组。 由于历史原因，名称为小写，但必须大写才能在 tls.createSecureContext() 的 ciphers 选项中使用。
// 以 'tls_' 开头的密码名称适用于 TLSv1.3，所有其他密码均适用于 TLSv1.2 及以下。
tls.getCiphers();

// 返回: <tls.Server>
// 创建新的 tls.Server。 secureConnectionListener，如果提供，将自动设置为 'secureConnection' 事件的监听器。
// ticketKeys 选项在 cluster 模块工作器之间自动共享。
tls.createServer(
  {
    // <string[]> | <Buffer[]> | <TypedArray[]> | <DataView[]> | <Buffer> | <TypedArray> | <DataView> 字符串数组、
    // Buffer、或 TypedArray、或 DataView、或包含支持的 ALPN 协议的单个 Buffer 或 TypedArray 或 DataView。
    // Buffer 的格式应该是 [len][name][len][name]...，
    // 例如 0x05hello0x05world，其中第一个字节是下一个协议名称的长度。 传入数组通常要简单得多，例如 ['hello', 'world']。 （协议应按优先级排序。）
    ALPNProtocols: [],
    clientCertEngine: "", // 可以提供客户端证书的 OpenSSL 引擎的名称。
    enableTrace: false, //  如果为 true, 则 tls.TLSSocket.enableTrace() 将在新连接上调用。 建立安全连接后可以启用跟踪，但必须使用此选项来跟踪安全连接设置。 默认值: false。
    handshakeTimeout: 120000, //  如果 SSL/TLS 握手未在指定的毫秒数内完成，则中止连接。 每当握手超时时，tls.Server 对象上就会触发 'tlsClientError'。 默认值: 120000 120秒
    requestCert: false, //  如果为 true，则服务器将从连接的客户端请求证书并尝试验证该证书。
    rejectUnauthorized: true, // 如果不是 false，则服务器将拒绝任何未经提供的 CA 列表授权的连接。 此选项仅在 requestCert 为 true 时有效
    sessionTimeout: 300, // 服务器创建的 TLS 会话将无法恢复之前的秒数
    // 如果客户端支持 SNI TLS 扩展，将调用的函数。
    // 调用时将传入两个参数：servername 和 callback。
    // callback 是错误优先的回调，它有两个可选参数：error 和 ctx。 ctx 是 SecureContext 实例（如果提供）。 tls.createSecureContext() 可用于获得正确的 SecureContext。
    // 如果使用非真的 ctx 参数调用 callback，则将使用服务器的默认安全上下文。 如果未提供 SNICallback，则将使用具有高级 API 的默认回调（见下文）。
    SNICallback: (servername, cb) => {},
    ticketKeys: Buffer.from(""), // 48 字节的加密强伪随机数据
    // socket: <tls.TLSSocket> 此连接的服务器 tls.TLSSocket 实例。
    // identity: <string> 客户端发送的身份参数。
    // 返回: <Buffer> | <TypedArray> | <DataView> 预共享密钥必须是缓冲区或 null 才能停止协商过程。 返回的 PSK 必须与所选密码的摘要兼容。 当协商 TLS-PSK（预共享密钥）时，使用客户端提供的身份调用此函数。 如果返回值为 null，则协商过程将停止，并向对方发送 "unknown_psk_identity" 警告消息。 如果服务器希望隐藏 PSK 身份未知的事实，则回调必须提供一些随机数据作为 psk 以使连接失败并在协商完成之前出现 "decrypt_error"。 默认情况下禁用 PSK 密码，因此使用 TLS-PSK 需要使用 ciphers 选项明确指定密码套件。 可以在 RFC 4279 中找到更多信息。
    pskCallback(socket, identity) {},
    // 发送给客户端的可选提示，以帮助在 TLS-PSK 协商期间选择身份。 将在 TLS 1.3 中被忽略。设置 pskIdentityHint 失败时，'tlsClientError' 将与 'ERR_TLS_PSK_SET_IDENTIY_HINT_FAILED' 代码一起触发。
    pskIdentityHint: "",
    // ...: 可以提供任何 tls.createSecureContext() 选项。 对于服务器，通常需要身份选项（pfx、key/cert 或 pskCallback）。
    // ...: 可以提供任何 net.createServer() 选项。
  },
  (socket) => {}
);

// 返回: <tls.TLSSocket>
// 与 https API不同，tls.connect() 默认不启用 SNI（服务器名称指示）扩展，这可能会导致部分服务器返回错误证书或完全拒绝连接。 要启用 SNI，除了 host 之外，还要设置 servername 选项。
tls.connect(
    {
        // 如果为 true, 则 tls.TLSSocket.enableTrace() 将在新连接上调用。 建立安全连接后可以启用跟踪，但必须使用此选项来跟踪安全连接设置。 默认值: false。
        enableTrace: false,
        host: "localhost",
        port: 80,
        path: "", // 创建到路径的 Unix 套接字连接。 如果指定了此选项，则 host 和 port 将被忽略。
        // 在给定的套接字上建立安全连接而不是创建新的套接字。
        // 通常，这是 net.Socket 的实例，但允许任何 Duplex 流。
        // 如果指定了此选项，则 path、host 和 port 将被忽略，除了证书验证。
        // 通常，套接字在传给 tls.connect() 的时候就已经连接上了，但是可以稍后再连接。
        // socket 的连接/断开/销毁是用户的责任；调用 tls.connect() 不会导致调用 net.connect()。
        socket: new net.Socket(),
        allowHalfOpen: false, // 如果 allowHalfOpen 设置为 true，套接字将不会自动将其可写端 end()，从而允许用户写入任意数量的数据。 用户必须显式调用 end() 来关闭连接（即发回一个 FIN 数据包）
        rejectUnauthorized: true, // 如果不是 false，则服务器证书将根据提供的 CA 列表进行验证。 如果验证失败，则会触发 'error' 事件；err.code 包含 OpenSSL 错误代码。 默认 true
        // 提示：从服务器发送的 <string> 可选消息，以帮助客户端决定在协商期间使用哪个身份。 如果使用 TLS 1.3，则始终为 null。
        // 返回: <Object> 以 { psk: <Buffer|TypedArray|DataView>, identity: <string> } 或 null 形式停止协商过程。
        // psk 必须与所选密码的摘要兼容。 identity 必须使用 UTF-8 编码。 当协商 TLS-PSK（预共享密钥）时，此函数将使用服务器提供的可选标识 hint 或 null 调用，以防 TLS 1.3 中删除了 hint。
        // 有必要为连接提供自定义 tls.checkServerIdentity()，因为默认情况下会尝试根据证书检查服务器的主机名/IP，但这不适用于 PSK，因为不会存在证书。 可以在 RFC 4279 中找到更多信息。
        pskCallback(hint) {},
        // <string[]> | <Buffer[]> | <TypedArray[]> | <DataView[]> | <Buffer> | <TypedArray> | <DataView> 字符串数组、
        // Buffer、或 TypedArray、或 DataView、或包含支持的 ALPN 协议的单个 Buffer 或 TypedArray 或 DataView。
        // Buffer 的格式应该是 [len][name][len][name]...，例如 '\x08http/1.1\x08http/1.0'，其中 len 字节是下一个协议名称的长度。
        // 传入数组通常要简单得多，例如 ['http/1.1', 'http/1.0']。 列表中较早的协议比后面的有更高的优先级。
        ALPNProtocols: [],
        // SNI（服务器名称指示）TLS 扩展的服务器名称。 它是所连接主机的名称，必须是主机名，而不是 IP 地址。
        // 它可以被多宿主服务器用来选择正确的证书呈现给客户端，参见 SNICallback 选项到 tls.createServer()。
        servername: "",
        // 根据证书检查服务器的主机名（或显式设置时提供的 servername）时要使用的回调函数（而不是内置的 tls.checkServerIdentity() 函数）。 如果验证失败，则这应该返回 <Error>。 如果验证了 servername 和 cert，则该方法应该返回 undefined。
        checkServerIdentityL: (servername, cert) => {},
        session: Buffer.from(""), // Buffer 实例，包含 TLS 会话。
        minDHSize: 1024, // 接受 TLS 连接的 DH 参数的最小大小（以位为单位）。 当服务器提供大小小于 minDHSize 的 DH 参数时，则 TLS 连接被销毁并抛出错误。 默认值: 1024
        secureContext: tls.createSecureContext(), // 使用 tls.createSecureContext() 创建的 TLS 上下文对象。 如果 secureContext 未提供，则将通过将整个 options 对象传给 tls.createSecureContext() 来创建。
        // ...: 如果缺少 secureContext 选项，则使用 tls.createSecureContext() 选项，否则它们将被忽略。
        // ...: 尚未列出的任何 socket.connect() 选项。
    },
    // callback 函数，如果指定，则将被添加为 'secureConnect' 事件的监听器。
    () => {}
);

// unix 域设置
tls.connect("path", {}, () => {});

// tls.createServer() 将 honorCipherOrder 选项的默认值设置为 true，创建安全上下文的其他 API 未设置。
// tls.createServer() 使用从 process.argv 生成的 128 位截断 SHA1 哈希值作为 sessionIdContext 选项的默认值，其他创建安全上下文的 API 没有默认值。
// tls.createSecureContext() 方法创建了 SecureContext 对象。 它可用作几个 tls API 的参数，例如 tls.createServer() 和 server.addContext()，但没有公共方法。
// 使用证书的密码需要密钥。 key 或 pfx 都可以提供。
// 如果没有给出 ca 选项，则 Node.js 将默认使用 Mozilla 的公开信任的 CA 列表。
tls.createSecureContext({
    // 可选择覆盖受信任的 CA 证书。 默认是信任 Mozilla 策划的知名 CA。 当使用此选项明确指定 CA 时，Mozilla 的 CA 将被完全替换。
    // 该值可以是字符串、或 Buffer、或 Array 的字符串和/或 Buffer。 任何字符串或 Buffer 都可以包含多个连接在一起的 PEM CA。 对等方的证书必须可链接到服务器信任的 CA 才能对连接进行身份验证。
    // 当使用不可链接到知名 CA 的证书时，必须明确指定证书的 CA 为受信任的 CA，否则连接将无法通过身份验证。
    // 如果对等方使用的证书不匹配或链接到默认 CA 之一，则使用 ca 选项提供对等方证书可以匹配或链接到的 CA 证书。
    // 对于自签名证书，证书是自己的CA，必须提供。 对于 PEM 编码的证书，支持的类型是 "TRUSTED CERTIFICATE"、"X509 CERTIFICATE"、以及 "CERTIFICATE"。 另见 tls.rootCertificates。
    ca: "",

    // PEM 格式的证书链。 每个私钥应提供证书链。 每个证书链都应包含提供的私有 key 的 PEM 格式证书，然后是 PEM 格式的中间证书（如果有），按顺序排列，并且不包括根 CA（根 CA 必须是对等方预先知道的，参见 ca）。
    // 在提供多个证书链时，它们不必与 key 中的私钥顺序相同。 如果不提供中间证书，则对端将无法验证证书，握手将失败。
    cert: "",
    sigalgs: "", // 支持的签名算法的冒号分隔列表。 该列表可以包含摘要算法（SHA256、MD5 等）、公钥算法（RSA-PSS、ECDSA 等）、两者的组合（例如 'RSA+SHA384'）或 TLS v1.3 方案名称（例如 rsa_pss_pss_sha512）。 请参阅 OpenSSL 手册页 了解更多信息。
    ciphers: "", // 密码套件规范，替换默认值。 有关更多信息，请参阅修改默认密码套件。 可以通过 tls.getCiphers() 获得允许的密码。 密码名称必须大写，OpenSSL 才能接受它们。
    clientCertEngine: "", // 可以提供客户端证书的 OpenSSL 引擎的名称。
    crl: "", //  <string> | <string[]> | <Buffer> | <Buffer[]> PEM 格式的 CRL（证书吊销列表）。
    // <string> | <Buffer> Diffie-Hellman 参数，完美前向保密所需。 使用 openssl dhparam 创建参数。 密钥长度必须大于等于 1024 位，否则会报错。
    // 虽然 1024 位是允许的，但为了更强的安全性，请使用 2048 位或更大的位。 如果省略或无效，参数将被静默丢弃，DHE 密码将不可用。
    dhparam: "",
    // 描述命名曲线或以冒号分隔的曲线 NID 或名称列表的字符串，例如 P-521:P-384:P-256，用于 ECDH 密钥协议。
    // 设置为 auto 自动选择曲线。 使用 crypto.getCurves() 获取可用曲线名称的列表。
    // 在最近的版本中，openssl ecparam -list_curves 还将显示每个可用椭圆曲线的名称和描述。 默认值: tls.DEFAULT_ECDH_CURVE.
    ecdhCurve: tls.DEFAULT_ECDH_CURVE,
    // 尝试使用服务器的密码套件首选项而不是客户端的。 当为 true 时，导致 SSL_OP_CIPHER_SERVER_PREFERENCE 在 secureOptions 中被设置，请参阅 OpenSSL 选项了解更多信息。
    honorCipherOrder: false,
    // <string> | <string[]> | <Buffer> | <Buffer[]> | <Object[]> PEM 格式的私钥。
    // PEM 允许选择加密私钥。 加密的密钥将用 options.passphrase 解密。 使用不同算法的多个密钥可以作为未加密密钥字符串或缓冲区的数组提供，
    // 也可以作为 {pem: <string|buffer>[, passphrase: <string>]} 形式的对象数组提供。 对象形式只能出现在数组中。
    // object.passphrase 是可选的。 如果提供了加密的密钥，则将使用 object.passphrase 解密，否则使用 options.passphrase 解密。
    key: "",
    // 从中获取私钥的 OpenSSL 引擎的名称。 应与 privateKeyIdentifier 一起使用。
    privateKeyEngine: "",
    // 由 OpenSSL 引擎管理的私钥的标识符。 应与 privateKeyEngine 一起使用。 不应与 key 一起设置，因为这两个选项定义的私钥的方式不同。
    privateKeyIdentifier: "",
    maxVersion: tls.DEFAULT_MAX_VERSION,
    minVersion: tls.DEFAULT_MIN_VERSION,
    // 用于单个私钥和/或 PFX 的共享密码。
    passphrase: "",
    // <string> | <string[]> | <Buffer> | <Buffer[]> | <Object[]> PFX 或 PKCS12 编码的私钥和证书链。
    // pfx 是单独提供 key 和 cert 的替代方案。 PFX 通常是加密的，如果是的话，会用 passphrase 来解密。
    // 多个 PFX 可以作为未加密的 PFX 缓冲区数组或 {buf: <string|buffer>[, passphrase: <string>]} 形式的对象数组提供。
    // 对象形式只能出现在数组中。 object.passphrase 是可选的。 如果提供加密的 PFX 将使用 object.passphrase 解密，否则将使用 options.passphrase 解密。
    pfx: "",
    // <number> 可选地影响 OpenSSL 协议行为，这通常不是必需的。 如果有的话应该小心使用！ 值是 OpenSSL 选项中 SSL_OP_* 选项的数字位掩码。
    secureOptions: 0,
    // <string> 旧的机制选择使用的 TLS 协议版本，不支持独立控制最小和最大版本，也不支持将协议限制为 TLSv1.3。改用 minVersion 和 maxVersion。 可能的值被列为 SSL_METHODS，使用函数名称作为字符串。 例如，使用 'TLSv1_1_method' 强制使用 TLS 版本 1.1，或使用 'TLS_method' 允许任何 TLS 协议版本最高为 TLSv1.3。不建议使用低于 1.2 的 TLS 版本，但可能需要互操作性。 **默认:**无，见 minVersion。
    secureProtocol: "",
    // <string> 服务器使用不透明标识符来确保应用程序之间不共享会话状态。 客户端未使用。
    sessionIdContext: "",
    // <Buffer> 48 字节的加密强伪随机数据。
    ticketKeys: Buffer.from(""),
    // <number> 服务器创建的 TLS 会话将无法恢复之前的秒数。 请参阅会话恢复了解更多信息。 默认值: 300。
    sessionTimeout: 300,
});
```
