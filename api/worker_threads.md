# 线程

## 简介 
工作线程对于执行 CPU 密集型的 JavaScript 操作很有用。 它们对 I/O 密集型工作帮助不大。 Node.js 内置的异步 I/O 操作比工作线程更高效。
与 child_process 或 cluster 不同(进程)，worker_threads 可以共享内存。 它们通过传输 ArrayBuffer 实例或共享 SharedArrayBuffer 实例来实现。

## Worker
### 创建
```js
if (isMainThread) {
    // 创建线程执行文件
    const work = new Worker(path.join(process.cwd(), "index.js"), {
        env: SHARE_ENV, // 如果设置，则指定工作线程内 process.env 的初始值。 作为特殊值，worker.SHARE_ENV 可用于指定父线程和子线程应该共享它们的环境变量；在这种情况下，对一个线程的 process.env 对象的更改也会影响另一个线程。 默认值: process.env。
        argv: ["test1", "test2"], // 将被字符串化并附加到工作线程中的 process.argv 的参数列表。 这与 workerData 非常相似，但这些值将在全局 process.argv 上可用，就像它们作为命令行选项传给脚本一样。
        eval: false, // 如果为 true 就将第一个参数解析为 脚本执行
        execArgv: process.execArgv, // 传给工作线程的 node CLI 选项的列表。 不支持 V8 选项（如 --max-old-space-size）和影响进程的选项（如 --title）。 如果设置，则这将在工作线程内部提供为 process.execArgv。 默认情况下，选项将从父线程继承。
        stdin: false, // true，则 worker.stdin 将提供其内容将在工作线程中显示为 process.stdin 的可写流。 默认情况下，不提供任何数据。
        stdout: false, // true，则 worker.stdout 将不会自动通过管道传输到父线程中的 process.stdout。
        stderr: false, // true，则 worker.stderr 将不会自动通过管道传输到父线程中的 process.stderr。
        workerData: "我是 workDate", // 任何将被克隆并作为 require('worker_threads').workerData 可用的 JavaScript 值。 克隆将按照 HTML 结构化克隆算法中的描述进行，如果无法克隆对象（例如，因为它包含 function），则会抛出错误
        trackUnmanagedFds: false, // true，则工作线程将跟踪通过 fs.open() 和 fs.close() 管理的原始文件描述符，并在工作线程退出时关闭它们，类似于网络套接字或通过 FileHandle API 管理的文件描述符等其他资源。 此选项会被所有嵌套的 Worker 自动继承。 默认值: false.
        transferList: null, // 如果在 workerData 中传入了一个或多个类似 MessagePort 的对象，则这些条目需要 transferList，否则将抛出 ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST。 有关详细信息，请参阅 port.postMessage()。
        resourceLimits: {
            maxOldGenerationSizeMb: 48, // 主堆的最大大小 (以 MB 为单位)。
            maxYoungGenerationSizeMb: 2048, // 最近创建的对象的最大堆空间大小。
            codeRangeSizeMb: 0, // 用于生成代码的预分配内存范围的大小。
            stackSizeMb: 4, // 线程的默认最大堆栈大小。 较小的值可能会导致工作线程实例无法使用。 默认值: 4
        },
    });
}
```
### 事件
```js
// 是否是主线程内（node 没开启线程前的线程）
if (isMainThread) {
  // 如果工作线程抛出未捕获的异常，则会触发 'error' 事件。 在这种情况下，工作线程将被终止。
  work.on("error", () => {});

  // 一旦工作线程停止，则会触发 'exit' 事件。 如果工作线程通过调用 process.exit() 退出，则 exitCode 参数将是传入的退出码。 如果工作线程被终止，则 exitCode 参数将为 1
  // 这是任何 Worker 实例触发的最终事件。
  work.on("exit", (exitCode) => {});

  // 当反序列化消息失败时，则会触发 'messageerror' 事件。
  work.on("messageerror", (error) => {});

  // 当工作线程开始执行 JavaScript 代码时，则会触发 'online' 事件。
  work.on("online", (error) => {});

  work.once("message", (message) => {
    console.log(message);
  });
}
```
### API
```js
  work.postMessage("我是主线程传递的数据");

  // 返回: <Promise> 对包含 V8 堆快照的可读流的 promise
  // 如果工作线程不再运行（这可能发生在 'exit' 事件触发之前），则返回的 Promise 将立即被使用 ERR_WORKER_NOT_RUNNING 错误拒绝。
  work.getHeapSnapshot();

  // 如果这是事件系统中唯一的活动句柄，则在工作线程上调用 unref() 将允许线程退出。 如果工作线程已经 unref()，则再次调用 unref() 将无效。
  work.unref();

  // 与 unref() 相反，如果它是唯一剩下的活动句柄（默认行为），则在先前 unref() 的工作线程上调用 ref() 将不会让程序退出。 如果工作线程是 ref() 的，则再次调用 ref() 将不起作用。
  work.ref();

  // 为此工作线程提供了一组 JS 引擎资源约束。 如果将 resourceLimits 选项传给 Worker 构造函数，则这与其值匹配。
  // 如果工作线程已经停止，则返回值是空对象。
  work.resourceLimits;

  // 这是包含工作线程内写入 process.stderr 的数据的可读流。 如果 stderr: true 没有传给 Worker 构造函数，则数据将通过管道传输到父线程的 process.stderr 流
  work.stderr;

  // 如果将 stdin: true 传给 Worker 构造函数，则这是可写流。 写入此流的数据将在工作线程中作为 process.stdin 可用。
  work.stdin;

  // 这是包含工作线程内写入 process.stdout 的数据的可读流。 如果 stdout: true 没有传给 Worker 构造函数，则数据将通过管道传输到父线程的 process.stdout 流。
  work.stdout;

  // 引用线程的整数标识符。 在工作线程内部，它作为 require('worker_threads').threadId 可用。 此值对于单个进程中的每个 Worker 实例都是唯一的
  work.threadId;

  // 尽快停止工作线程中的所有 JavaScript 执行。 返回在触发 'exit' 事件时履行退出码的 Promise。
  work.terminate();
```
### Worker 内
```js
if (!isMainThread) {
    parentPort.once("message", (message) => {
        console.log(`我是父线程传递过来的消息${message}`);
        parentPort.postMessage("我是创建的线程");
    });

    // 如果在主线程中使用此，则其值为空对象
    // 这个值与主线程创建的限制一致
    resourceLimits;

    // 线程 id
    threadId;

    // 创建线城时传递的参数的副本
    workerData;
}
```


## MessageChannel
```js
if (isMainThread) {
  const { port1, port2 } = new MessageChannel();

  // 从 port1 发送 总是为克隆，并将对象标记为不共享。 如果 object 出现在 port.postMessage() 调用的传输列表中，则它将被忽略。
  // 特别是，这对于可以克隆而不是传输的对象，以及被发送方的其他对象使用的对象来说是有意义的。 例如，Node.js 用这个标记了它用于 Buffer 池的 ArrayBuffer。
  // 此操作无法撤消。浏览器中没有与此 API 等效的 API。
  const pooledBuffer = new ArrayBuffer(8);
  markAsUntransferable(pooledBuffer);

  // 1. 将 MessagePort 传输到不同的 vm 上下文 原始的 port 对象将无法使用，返回的 MessagePort 实例将取而代之。(将 port 传递到新的 vm 上下文中)
  // 2. 返回的 MessagePort 将是目标上下文中的对象，并将继承自其全局 Object 类。 传给 port.onmessage() 监听器的对象也将在目标上下文中创建并从其全局 Object 类继承。
  // 3. 但是，创建的 MessagePort 将不再继承 EventEmitter，只能使用 port.onmessage() 来接收使用它的事件。
  const context = { a: 1 };
  vm.createContext(context);
  const newPort = moveMessagePortToContext(port1, context);

  // 接收 port2 消息
  const port1Data = receiveMessageOnPort(port2);

  // 此事件的监听器将收到传给 postMessage() 的 value 参数的副本，并且没有其他参数
  // 被 receiveMessageOnPort 读取后没有反应
  port2.on("message", (message) => {
    console.log(message);
  });

  // 当反序列化消息失败时，则会触发 'messageerror' 事件。
  port2.on("messageerror", (message) => {
    console.log(message);
  });

  // 一旦通道的任一侧断开连接，则会触发 'close' 事件。
  port2.on("close", () => {
    console.log("port1 关闭");
  });

  // 向该通道的接收端发送 JavaScript 值。 value 将以与 HTML 结构化克隆算法兼容的方式传输

  port1.postMessage(
    // 因为对象克隆使用结构化克隆算法，不可枚举的属性、属性访问器和对象原型不会被保留。 特别是，Buffer 对象将在接收方读取为普通的 Uint8Array。
    // HTML 结构化克隆算法与 JSON 的显着区别是：
    // value 可能包含循环引用。
    // value 可能包含内置 JS 类型的实例，例如 RegExp、BigInt、Map、Set 等。
    // value 可能包含类型化数组，都使用 ArrayBuffer 和 SharedArrayBuffer。
    // value 可能包含 WebAssembly.Module 实例。
    { a: "1" },
    // 共享数据列表：
    // transferList 可能是 ArrayBuffer、MessagePort 和 FileHandle 对象的列表。
    // 传输后，它们将不再能在通道的发送端使用（即使它们不包含在 value 中） 与子进程不同，当前不支持传输句柄，例如网络套接字。
    // 如果 value 包含 SharedArrayBuffer 实例，则可以从任一线程访问这些实例。 它们不能在 transferList 中列出 (共享数据)
    // value 可能仍然包含不在 transferList 中的 ArrayBuffer 实例；在这种情况下，底层内存被复制而不是移动 （不在 transferList 复制数据）
    // 使用 Buffer.alloc() 或 Buffer.allocUnsafeSlow() 创建的 Buffer 实例的 ArrayBuffer 始终可以传输，但这样做会使那些 ArrayBuffer 的所有其他现有视图无法使用。
    []
  );

  // 禁止在连接的任一端进一步发送消息。
  // 'close' 事件将在作为通道一部分的两个 MessagePort 实例上触发。
  port1.close();

  // 如果这是事件系统中唯一的活动句柄，则在端口上调用 unref() 将允许线程退出。 如果端口已经 unref()，则再次调用 unref() 将无效。
  // 如果使用 .on('message') 绑定或删除监听器，则端口将根据事件的监听器是否存在自动进行 ref() 和 unref()。
  port1.unref();

  // 如果它是唯一剩下的活动句柄（默认行为），则在以前的 unref() 的端口上调用 ref() 不会让程序退出。 如果端口是 ref() 的，则再次调用 ref() 将无效。
  port1.ref();

  // 开始在此 MessagePort 上接收消息。
  // 当将此端口用作事件触发器时，一旦绑定了 'message' 监听器，则就会自动调用它。
  // 此方法与 Web MessagePort API 相同。 在 Node.js 中，只有在没有事件监听器时才用于忽略消息。 Node.js 在处理 .onmessage 方面也有分歧。 设置它会自动调用 .start()，但取消设置它会让消息排队直到设置新的句柄或端口被丢弃。
  port1.start();
}
```
传输 TypedArray 和 Buffer 时的注意事项
```js
// 使用传输列表传输 ArrayBuffer 时必须非常小心，因为这样做会导致共享同一个 ArrayBuffer 的所有 TypedArray 和 Buffer 实例变得不可用。
  const ab = new ArrayBuffer(10);

  const u1 = new Uint8Array(ab);
  const u2 = new Uint16Array(ab);

  console.log(u2.length); // 打印 5

  port.postMessage(u1, [u1.buffer]);

  console.log(u2.length); // 打印 0
```
