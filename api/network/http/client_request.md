# 请求类

## 事件触发顺序
1. 在成功的请求中，将按以下顺序触发以下事件：
    'socket'
    'response'
    res 对象上的 'data'，任意次数（如果响应正文为空，则根本不会触发 'data'，例如，在大多数重定向中）
    res 对象上的 'end'
    'close'

2. 在连接错误的情况下，将触发以下事件：

    'socket'
    'error'
    'close'

3. 如果在连接成功之前调用 req.abort()，则将按以下顺序触发以下事件：
    'socket'
    （在此处调用 req.abort()）
    'abort'
    使用具有消息 'Error: socket hang up' 和代码 'ECONNRESET' 的错误的 'error'
    'close'

4. 如果在收到响应之后调用 req.abort()，则将按以下顺序触发以下事件：
   'socket'
   'response'
   res 对象上的 'data'，任意次数
   （在此处调用 req.abort()）
   'abort'
   res 对象上的 'aborted'
   'close'
   res 对象上的 'end'
   res 对象上的 'close'
   设置 timeout 选项或使用 setTimeout() 函数将不会中止请求或执行除添加 'timeout' 事件外的任何操作。

## 初始化
```js
// 如果同时指定了 url 和 options，则合并对象，options 属性优先
// 调用了 req.end()。 使用 http.request() 必须始终调用 req.end() 来表示请求的结束 - 即使没有数据写入请求正文。
// 如果在请求期间遇到任何错误（无论是 DNS 解析、TCP 级别错误还是实际的 HTTP 解析错误），都会在返回的请求对象上触发 'error' 事件。 与所有 'error' 事件一样，如果没有注册监听器，则会抛出错误。
// 有一些特殊的标头需要注意。
// 发送 'Connection: keep-alive' 将通知 Node.js，服务器的连接应该持续到下一个请求。
// 发送 'Content-Length' 标头将禁用默认的分块编码。
// 发送 'Expect' 标头将立即发送请求头。 通常，当发送 'Expect: 100-continue' 时，应该设置超时和 'continue' 事件的监听器。 有关更多信息，请参阅 RFC 2616 第 8.2.3 节。
// 发送授权标头将覆盖使用 auth 选项来计算基本身份验证。
const req = http.request(
  "", // url 可以是字符串或 URL 对象,如果 url 是字符串，则会自动使用 new URL() 解析。 如果是 URL 对象，则会自动转换为普通的 options 对象
  {
    // <http.Agent> | <boolean> 控制 Agent 的行为。 可能的值：
    //     undefined（默认）: 为此主机和端口使用 http.globalAgent。
    //     Agent 对象: 显式使用传入的 Agent。
    //     false: 使用具有默认值的新 Agent。
    agent: false,
    auth: "", // 本身份验证，即 'user:password' 计算授权标头
    // 当不使用 agent 选项时，生成用于请求的套接字/流的函数。 这可用于避免创建自定义 Agent 类只是为了覆盖默认的 createConnection 函数。 有关详细信息，请参阅 agent.createConnection()。 任何 Duplex 流都是有效的返回值
    createConnection: () => {},
    defaultPort: undefined, // 协议的默认端口。 默认值: 如果使用 Agent 则为 agent.defaultPort，否则为 undefined。
    family: 4, // 解析 host 或 hostname 时要使用的 IP 地址族。 有效值为 4 或 6。 当未指定时，则将使用 IP v4 和 v6。
    headers: {}, //  包含请求头的对象。
    host: "localhost", // 要向其发出请求的服务器的域名或 IP 地址。 默认值: 'localhost'。
    hostname: "localhost", // host 的别名。 为了支持 url.parse()，如果同时指定了 host 和 hostname，则将使用 hostname
    insecureHTTPParser: false, // 使用不安全的 HTTP 解析器，当为 true 时接受无效的 HTTP 标头。 应避免使用不安全的解析器。
    localAddress: "localhost", // 用于绑定网络连接的本地接口。
    lookup: dns.lookup, // 自定义查找函数。 默认值: dns.lookup().
    method: "GET",
    path: "/", // 请求的路径。 应包括查询字符串（如果有）。 例如 '/index.html?page=12'。 当请求路径包含非法字符时抛出异常。 目前，只有空格被拒绝，但将来可能会改变。 默认值: '/'。
    port: 80, // 远程服务器的端口。 默认值: 如果有设置则为 defaultPort，否则为 80。
    protocol: "http:", // 要使用的协议。 默认值: 'http:'。
    setHost: true, //  指定是否自动添加 Host 标头。 默认为 true。
    socketPath: "", // Unix 域套接字（如果指定了 host 或 port 之一，则不能使用，因为其指定了 TCP 套接字）
    timeout: 1000, // 指定套接字超时的数值（以毫秒为单位）。 这将在连接套接字之前设置超时。
  },
  // 可选的 callback 参数将被添加为 'response' 事件的单次监听器。
  () => {}
);

// 与 http.request() 相同的 options，但 method 始终设置为 GET
// 此方法与 http.request() 的唯一区别在于，它将方法设置为 GET 并自动调用 req.end()
http.get("", {}, () => {});
```

## 事件
```js
// 当请求被客户端中止时触发。 此事件仅在第一次调用 abort() 时触发。
req.on("abort", () => {});

// 每次服务器使用 CONNECT 方法响应请求时触发。 如果未监听此事件，则接收 CONNECT 方法的客户端将关闭其连接。
// 除非用户指定 <net.Socket> 以外的套接字类型，否则此事件保证传入 <net.Socket> 类（<stream.Duplex> 的子类）的实例。
req.on("connect", (response, socket, head) => {});

// 当服务器发送 '100 Continue' HTTP 响应时触发，通常是因为请求包含 'Expect: 100-continue'。 这是客户端应该发送请求正文的指令
// 100-continue用于客户端在发送POST数据给服务器前，征询服务器情况，看服务器是否处理POST的数据，如果不处理，客户端则不上传POST数据，如果处理，则POST上传数据
req.on("continue", () => {});

// info <Object>
// httpVersion <string>
// httpVersionMajor <integer>
// httpVersionMinor <integer>
// statusCode <integer>
// statusMessage <string>
// headers <Object>
// rawHeaders <string[]>
// 当服务器发送 1xx 中间响应（不包括 101 升级）时触发。 此事件的监听器将接收一个对象，其中包含 HTTP 版本、状态码、状态消息、键值标头对象和带有原始标头名称及其各自值的数组
req.on("information", (info) => {});

// 每次服务器响应升级请求时触发。 如果未监听此事件且响应状态码为 101 Switching Protocols，则接收升级标头的客户端将关闭其连接。
// 除非用户指定 <net.Socket> 以外的套接字类型，否则此事件保证传入 <net.Socket> 类（<stream.Duplex> 的子类）的实例。
req.on("upgrade", (response, socket, head) => {});

// 对此请求的响应时触发。 此事件仅触发一次
req.on("response", () => {});

// 除非用户指定 <net.Socket> 以外的套接字类型，否则此事件保证传入 <net.Socket> 类（<stream.Duplex> 的子类）的实例。
req.on("socket", (socket) => {});

// 当底层套接字因不活动而超时时触发。 这仅通知套接字已空闲。 必须手动中止请求。
req.on("timeout", () => {});
```

## 属性
```js
// 限制最大响应头计数。 如果设置为 0，则不会应用任何限制 默认：2000
req.maxHeadersCount;

// 请求的路径。
req.path;

req.method;

req.host;

req.protocol;

// 请求是否通过重用的套接字发送。
// 当通过启用保持活动的代理发送请求时，可能会重用底层套接字。 但是如果服务器在不幸的时间关闭连接，客户端可能会遇到 'ECONNRESET' 错误。
req.reusedSocket;

// 如果请求已中止，则 request.aborted 属性将为 true
req.aborted;

// socket
// 对底层套接字的引用。 通常用户不会想要访问这个属性。 特别是，由于协议解析器附加到套接字的方式，套接字将不会触发 'readable' 事件
req.connection;

// 对底层套接字的引用。 通常用户不会想要访问这个属性。 特别是，由于协议解析器附加到套接字的方式，套接字将不会触发 'readable' 事件。
req.socket;

// 如果所有数据都已在 'finish' 事件触发之前立即刷新到底层系统，则为 true。
req.writableFinished;
```

## 方法
```js
// 读取请求的标头。 该名称不区分大小写。 返回值的类型取决于提供给 request.setHeader() 的参数。
req.getHeaders();

// 删除已定义到标头对象中的标头。
req.removeHeader("Content-Type");

req.setHeader("key", "value");

// 一旦套接字被分配给这个请求并被连接，则 socket.setTimeout() 将被调用。
// timeout <number> 请求超时前的毫秒数。
// callback <Function> 发生超时时要调用的可选函数。 与绑定到 'timeout' 事件相同。
req.setTimeout(10000, () => {});

// 发送一块正文。
// encoding 参数是可选的，仅当 chunk 是字符串时才适用。 默认为 'utf8'。
// callback 参数是可选的，将在刷新此数据块时调用，但前提是该块非空。
// 如果整个数据被成功刷新到内核缓冲区，则返回 true。 如果所有或部分数据在用户内存中排队，则返回 false。 当缓冲区再次空闲时，则将触发 'drain'。
// 当使用空字符串或缓冲区调用 write 函数时，则什么都不做并等待更多输入。
const isWrite = req.write("", "utf-8", () => {});

// 完成发送请求。 如果正文的任何部分未发送，则会将它们刷新到流中。 如果请求被分块，则将发送终止的 '0\r\n\r\n'。
// 如果指定了 data，则相当于调用 request.write(data, encoding) 后跟 request.end(callback)。
// 如果指定了 callback，则将在请求流完成时调用。
req.end("", "utf-8", () => {});

// 销毁 也可中断请求
req.destroy();

// 出于效率原因，Node.js 通常会缓冲请求头，直到调用 request.end() 或写入第一块请求数据。 然后尝试将请求头和数据打包到单个 TCP 数据包中。
// 这通常是需要的（节省了 TCP 往返），但是当第一个数据直到可能很晚才发送时才需要。 request.flushHeaders() 绕过优化并启动请求
req.flushHeaders();

// 一旦套接字被分配给这个请求并被连接，则 socket.setNoDelay() 将被调用。
req.setNoDelay(true);

// enable <boolean>
// initialDelay <number>
// 一旦套接字被分配给这个请求并被连接，则 socket.setKeepAlive() 将被调用。
req.setSocketKeepAlive(true, 1);
```

