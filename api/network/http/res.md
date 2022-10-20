# 响应

## 事件
```js
  // 指示响应已完成，或其基础连接已提前终止(在响应完成之前)
  res.on("close", () => {});

  // 发送响应时触发。 更具体地说，当响应头和正文的最后一段已移交给操作系统以通过网络传输时，则将触发此事件。 这并不意味着客户端已收到任何东西
  res.on("finish", () => {});
```

## 属性
```js
  //  默认值: 200
  res.statusCode;

  // 此属性控制在标头刷新时将发送到客户端的状态消息。如果保留为 undefined，则将使用状态码的标准消息。
  res.statusMessage;

  // 对底层套接字的引用。 通常用户不会想要访问这个属性。 特别是，由于协议解析器附加到套接字的方式，套接字将不会触发 'readable' 事件。 在 response.end() 之后，该属性为空
  res.connection;

  // 对底层套接字的引用。 通常用户不会想要访问这个属性。 特别是，由于协议解析器附加到套接字的方式，套接字将不会触发 'readable' 事件。 在 response.end() 之后，该属性为空。
  res.socket;

  // 如果 response.end() 已被调用，则 response.finished 属性将为 true
  res.writableEnded;

  // 如果标头被发送，则为真，否则为假。
  res.headersSent;
  
  // 如果为真，则 Date 标头将自动生成并在响应中发送，如果它尚未出现在标头中。 默认为真。
  res.sendDate;
    
  // 如果所有数据都已在 'finish' 事件触发之前立即刷新到底层系统，则为 true
  res.writableFinished;
```


## 方法
```js
  // 此方法向响应添加 HTTP 尾随标头（标头，但位于消息末尾）。
  // 只有在响应使用分块编码时才会触发尾标； 如果不是（例如，如果请求是 HTTP/1.0），则它们将被静默丢弃。
  // HTTP 要求发送 Trailer 标头以发出尾标，其值中包含标头字段列表。 例如，
  res.writeHead(200, {
    "Content-Type": "text/plain",
    Trailer: "Content-MD5",
  });

  // 最后一个参数 headers 是响应头。 可选地给定人类可读的 statusMessage 作为第二个参数。
  // 此方法只能在消息上调用一次，并且必须在调用 response.end() 之前调用。
  // 如果在调用此之前调用了 response.write() 或 response.end()，则将计算隐式/可变的标头并调用此函数。
  // 当标头已使用 response.setHeader() 设置时，则它们将与任何传给 response.writeHead() 的标头合并，其中传给 response.writeHead() 的标头优先。
  res.writeHead(200, "", { "Content-Type": "text/plain" });
  
  res.addTrailers({ "Content-MD5": "7895bf4b8828b55ceaf47747b4bca667" });
  
  // 此方法向服务器发出信号，表明所有响应头和正文都已发送；该服务器应认为此消息已完成。 response.end() 方法必须在每个响应上调用。
  res.end("", "utf-8", () => {});

  // 如果此方法被调用且 response.writeHead() 还没被调用，则会切换到隐式的标头模式并刷新隐式的标头。
  // 在 http 模块中，当请求是 HEAD 请求时，响应正文会被省略。 同样，204 和 304 响应不得包含消息正文。
  // 当刷新数据块时将调用 callback。
  // 如果整个数据被成功刷新到内核缓冲区，则返回 true。 如果所有或部分数据在用户内存中排队，则返回 false。当缓冲区再次空闲时，则将触发 'drain'。
  const isWrite = res.write("", "utf-8", () => {});

  // 将套接字的超时值设置为 msecs。 如果提供了回调，则将其添加为响应对象上 'timeout' 事件的监听器。
  // 如果没有向请求、响应或服务器添加 'timeout' 监听器，则套接字在超时时会被销毁。 如果将句柄分配给请求、响应或服务器的 'timeout' 事件，则必须显式处理超时套接字。
  res.setTimeout(10000, () => {});
  
  // writable.cork() 方法强制所有写入的数据都缓存在内存中。 当调用 stream.uncork() 或 stream.end() 方法时，缓冲的数据将被刷新。
  // writable.cork() 的主要目的是适应将几个小块快速连续写入流的情况。
  // writable.cork() 不是立即将它们转发到底层目标，而是缓冲所有块，直到 writable.uncork() 被调用，
  // 如果存在，writable.uncork() 会将它们全部传给 writable._writev()。
  // 这可以防止在等待处理第一个小块时正在缓冲数据的行头阻塞情况。 但是，在不实现 writable._writev() 的情况下使用 writable.cork() 可能会对吞吐量产生不利影响。
  res.cork();
  
  res.uncork();
  
  
  // 向客户端发送 HTTP/1.1 100 Continue 消息，指示应发送请求正文
  res.writeContinue();
  
  // 向客户端发送 HTTP/1.1 102 Processing 消息，表示应发送请求正文。
  res.writeProcessing();


  // 刷新响应头
  res.flushHeaders();

  res.getHeader("Content-Type");

  // 返回包含当前传出标头的所有key
  res.getHeaderNames();

  // 返回当前传出标头的浅拷贝。 由于使用了浅拷贝，因此无需额外调用各种与标头相关的 http 模块方法即可更改数组值。 返回对象的键是标头名称，值是相应的标头值。 所有标头名称均为小写。
  // response.getHeaders() 方法返回的对象通常不是从 JavaScript Object 继承的原型。 这意味着典型的 Object 方法，例如 obj.toString()、obj.hasOwnProperty() 和其他方法没有定义并且不会起作用。
  res.getHeaders();

  // 是否有对应的标头
  res.hasHeader();

  // 删除排队等待隐式发送的标头
  res.removeHeader("Content-Encoding");

  // 如果该标头已经存在于待发送的标头中，则其值将被替换。 在此处使用字符串数组发送具有相同名称的多个标头。
  // 尝试设置包含无效字符的标头字段名称或值将导致抛出 TypeError。
  // response.writeHead() 的标头将与其合并
  // 如果调用了 response.writeHead() 方法而该方法没有被调用，则会直接将提供的标头值写入网络通道，而不进行内部缓存，标头的 response.getHeader() 不会产生预期的结果。 如果希望在将来可能进行检索和修改时逐步填充标头，则使用 response.setHeader() 而不是 response.writeHead()。
  res.setHeader("key", ["value", "value"]);
```
