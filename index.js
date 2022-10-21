const https = require("https");

const agent = https.Agent({
  maxCachedSessions: 100, // TLS 缓存会话的最大数量。 使用 0 禁用 TLS 会话缓存。 默认值: 100。
  servername: "", // 要发送到服务器的服务器名称指示扩展的值。 使用空字符串 '' 禁用发送扩展名。 默认值: 目标服务器的主机名，除非使用 IP 地址指定目标服务器，在这种情况下，默认为 ''（无扩展名）。
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
