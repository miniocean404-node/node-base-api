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
```
