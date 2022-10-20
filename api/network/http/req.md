# 请求
IncomingMessage 对象由 http.Server 或 http.ClientRequest 创建

## 事件
```js
  // 当请求被中止时触发。
  req.on("aborted", () => {});

  // 表示底层连接已关闭。
  req.on("close", () => {});
```

## 属性
```js
  req.statusCode;

  // HTTP 响应状态消息
  req.statusMessage;

  req.url;

  req.method;

  // 标头名称和值的键值对。 标头名称是小写的
  // set-cookie 始终是数组。 重复项被添加到数组中。
  // 对于重复的 cookie 标头，其值使用 '; ' 连接。
  // 对于所有其他标头，其值使用 ', ' 连接。
  req.headers;

  // 键和值在同一个列表中。 它不是元组列表。 因此，偶数偏移是键值，奇数偏移是关联的值
  // 标头名称不小写，重复项不合并。
  req.rawHeaders;

  // 如果请求已中止，则 message.aborted 属性将为 true。
  req.aborted;

  // 如果已接收并成功解析完整的 HTTP 消息，则 message.complete 属性将为 true。
  // 此属性作为一种确定客户端或服务器是否在连接终止之前完全传输消息的方法特别有用：
  req.complete;

  // 在服务器请求的情况下，客户端发送的 HTTP 版本。 在客户端响应的情况下，连接到服务器的 HTTP 版本。 可能是 '1.1' 或 '1.0'。
  req.httpVersion;

  // '1.1'
  req.httpVersionMajor;

  // '1.0'
  req.httpVersionMinor;

  // 原始请求/响应尾标的键和值与收到的完全一样。 仅在 'end' 事件中填充
  req.rawTrailers;

  // 请求/响应尾标对象。 仅在 'end' 事件中填充
  req.trailers;

  // 是否销毁
  req.destroyed;
```

## 方法
```js
  // 设置套接字的超时
  // 调用 req.connection.setTimeout(msecs, callback)。
  req.setTimeout(10000, () => {});

  // 在接收到 IncomingMessage 的套接字上调用 destroy()。 如果提供了 error，则在套接字上触发 'error' 事件，并将 error 作为参数传给该事件的任何监听器
  req.destroy();
```
