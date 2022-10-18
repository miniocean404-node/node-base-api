# API 

## 关闭
```js
// Node.js 进程立即退出并生成一个核心文件。
process.abort();

// process.exit() 方法指示 Node.js 以 code 的退出状态同步终止进程。
// 默认值：0 || process.exitCode
// 直到所有 'exit' 事件监听器都被调用，Node.js 才会终止。
// 在 Worker 线程中，该函数停止当前线程而不是当前进程。
process.exit();

// 如果 Node.js 进程是使用 IPC 通道衍生（参见子进程和集群文档），则 process.disconnect() 方法将关闭通往父进程的 IPC 通道，一旦没有其他连接使其保持活动状态，则允许子进程正常退出。
process.disconnect();

// process.kill() 方法将 signal 发送到由 pid 标识的进程\
// 如果目标 pid 不存在，则此方法将抛出错误。 作为特殊情况，可以使用信号 0 来测试进程是否存在。 如果使用 pid 来杀死进程组，则 Windows 平台将抛出错误。
// 尽管此函数的名字是 process.kill()，但它实际上只是信号发送者，就像 kill 系统调用。 发送的信号可能会做其他事情而不是杀死目标进程。
process.kill(0, "SIGTERM");
```

## uncaughtException
```js
// 是否使用 setUncaughtExceptionCaptureCallback 设置回调
process.hasUncaughtExceptionCaptureCallback();
// 设置一个函数，当发生未捕获的异常时将调用该函数，该函数将接收异常值本身作为其第一个参数
// 如果设置了这样的函数，则不会触发 'uncaughtException' 事件。 如果 --abort-on-uncaught-exception 是从命令行传入的或通过 v8.setFlagsFromString() 设置的，则进程不会中止
// 要取消捕获功能，可以使用 process.setUncaughtExceptionCaptureCallback(null)。
process.setUncaughtExceptionCaptureCallback((err) => {});
```

## 其他
```js
// process.chdir() 方法更改 Node.js 进程的当前工作目录，
// 此特性在 Worker 线程中不可用
process.chdir(process.cwd());

// 将 callback 添加到"下一个滴答队列"。 在 JavaScript 堆栈上的当前操作运行完成之后，且在允许事件循环继续之前，此队列将被完全排空。
process.nextTick((params) => {
    console.log(params);
}, "nextTick 回调参数");

// 使用 IPC 通道衍生 Node.js，则可以使用 process.send() 方法向父进程发送消息。 消息将作为父对象 ChildProcess 对象上的 'message' 事件接收。
process.send(
    { msg: "message" },
    "net.server",
    {
        // 当传入 net.Socket 实例时可以使用的值。 当为 true 时，套接字在发送过程中保持打开状态。 默认值: false。
        keepOpen: false,
    },
    () => {}
);

// 检索 require.main 的方法。 不同之处在于，如果主模块在运行时发生更改，则 require.main 可能仍会引用更改发生前所需模块中的原始主模块
// package.json 中的 main
process.mainModule;

// 设置 Node.js 进程的文件模式创建掩码。 子进程从父进程继承掩码。
// 在 Worker 线程中，process.umask(mask) 会抛出异常。
process.umask(0o022);

// 主要用于加载 C++ 插件，除非特殊情况，否则不应直接使用。
process.dlopen(
    module,
    require.resolve("binding"),
    os.constants.dlopen.RTLD_NOW
);

// 触发自定义或特定于应用程序的进程警告
// 可在 warning 事件中获取到 option 的参数
// 如果警告 type 为 'DeprecationWarning'，则执行以下额外处理：
//  如果使用 --throw-deprecation 命令行标志，则弃用警告将作为异常抛出，而不是作为事件触发。
//  如果使用 --no-deprecation 命令行标志，则会取消弃用警告。
//  如果使用 --trace-deprecation 命令行标志，则弃用警告将与完整堆栈跟踪一起打印到 stderr。
process.emitWarning("string 或 Error", {
    type: "Warning", // 当 warning 是 String 时，type 是用于触发警告的 type 的名称。 默认值: 'Warning'
    code: "1", // 触发的警告实例的唯一标识符 就是 警告编号。
    ctor: process.emitWarning, // 当 warning 为 String 时，ctor 是可选函数，用于限制生成的堆栈跟踪。 默认值: process.emitWarning
    detail: "额外文本", // 要包含在错误中的额外文本。
});
```
