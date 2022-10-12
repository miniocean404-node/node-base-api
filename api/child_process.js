// 1. child_process.spawn() 方法异步衍生子进程，不会阻塞 Node.js 事件循环。 child_process.spawnSync() 函数以同步方式提供等效的功能，其会阻塞事件循环，直到衍生的进程退出或终止。
// 2. 如果脚本文件名包含空格，则需要加上引号 例如：'"my script.cmd"'
// 3. 衍生类型
// child_process.exec(): 衍生 shell 并在该 shell 中运行命令，完成后将 stdout 和 stderr 传给回调函数。可以指定可选的 callback 函数，其在子进程终止时调用。
// child_process.execFile(): 与 child_process.exec() 类似，不同之处在于，默认情况下，它直接衍生命令，而不先衍生 shell。（只能在非 Windows 平台执行，因为 Windows 需要终端）
// child_process.fork(): 衍生新的 Node.js 进程并使用建立的 IPC 通信通道（其允许在父子进程之间发送消息）调用指定的模块。
import child_process from "child_process";

const common = {
  cwd: process.cwd(),
  env: process.env,
  encoding: "utf-8", // 默认情况下，Node.js 会将输出解码为 UTF-8 并将字符串传给回调。 encoding 选项可用于指定用于解码标准输出和标准错误的输出的字符编码。
  shell: "/bin/sh", // 用于执行命令的 shell。默认值: Unix 上是 '/bin/sh'，Windows 上是 process.env.ComSpec
  timeout: 0, // 如果 timeout 大于 0，则如果子进程运行时间超过 timeout 毫秒，父进程将发送由 killSignal 属性（默认为 'SIGTERM'）标识的信号
  maxBuffer: 1024 * 1024, // 标准输出或标准错误上允许的最大数据量（以字节为单位）。 如果超过，则子进程将终止并截断任何输出
  killSignal: "SIGTERM",
  // uid: 0, // 进程的用户标识
  // gid: 0, // 进程的群组标识
  windowsHide: true, // 是否隐藏 Windows 终端
};

// 不替换现有进程，而是使用 shell 来执行命令。
// util.promisify() 版本被调用，则其将为具有 stdout 和 stderr 属性的 Object {child:ChildProcess, stdout , stderr}
const child4 = child_process.exec(
  "pwd",
  { ...common },
  (error, stdout, stderr) => {
    // error.code 是退出信号
    // error.signal 将是终止进程的信号
  }
);

const child3 = child_process.execFile(
  "node",
  ["--version"],
  {
    ...common,
    windowsVerbatimArguments: false, // 在 Windows 上不为参数加上引号或转义。 在 Unix 上被忽略。 默认值: false
    shell: false, // 如果是 true，则在 shell 内运行 command。 在 Unix 上使用 '/bin/sh'，在 Windows 上使用 process.env.ComSpec。 可以将不同的 shell 指定为字符串。
  },
  (error, stdout, stderr) => {}
);

// 返回的 ChildProcess 将有额外的内置通信通道，允许消息在父进程和子进程之间来回传递。 详见 subprocess.send()。
const child1 = child_process.fork("api/assets.js", ["1", "2"], {
  ...common,
  // 1. true,子进程可以在父进程退出后继续运行
  // 当使用 detached 选项启动长时间运行的进程时，进程在父进程退出后不会一直在后台运行，除非提供了未连接到父进程的 stdio 配置。 如果继承了父进程的 stdio，则子进程将保持与控制终端的连接
  // 2. false 父进程将等待分离的子进程退出。
  // 父进程独立退出：为了防止父进程等待给定的 subprocess 退出，则使用 subprocess.unref() 方法
  // 这样做会使父进程的事件循环不将子进程包括在其引用计数中，从而允许父进程独立于子进程退出，除非在子进程和父进程之间建立了 IPC 通道。
  detached: false,
  execPath: "", // 用于创建子进程的可执行文件,在子进程上使用环境变量 NODE_CHANNEL_FD 标识的文件描述符与父进程通信
  execArgv: process.execArgv, // 传给可执行文件的字符串参数列表
  serialization: "json", // 指定用于在进程之间发送消息的序列化类型。 可能的值为 'json' 和 'advanced' (http://nodejs.cn/api-v12/child_process.html#child_process_advanced_serialization)
  silent: false, // 如果为 true，则子进程的标准输入、标准输出和标准错误将通过管道传输到父进程，否则它们将从父进程继承，options.stdio (http://nodejs.cn/api-v12/child_process.html#child_process_options_stdio)
  stdio: [0, 1, 2, "ipc"], // 提供此选项时，它会覆盖 silent。 如果使用数组变体，则它必须恰好包含一个值为 'ipc' 的条目，
  windowsVerbatimArguments: false, // Windows 上不为参数加上引号或转义 ,Unix 上被忽略
});

const child2 = child_process.spawn("pwd", ["-L"], {
  ...common,
  argv0: "command", // 显式设置发送给子进程的 argv[0] 的值。 如果未指定，这将设置为 command
  stdio: [0, 1, 2],
  detached: false,
  serialization: "json",
  shell: false,
  windowsVerbatimArguments: false,
  windowsHide: false,
});

// 先关闭再退出 这与 'exit' 事件不同，因为多个进程可能共享相同的标准输入输出流。
// code:如果子进程自己退出，则为退出码 signal:终止子进程的信号
child2.on("close", (code, signal) => {});
// 当 'exit' 事件被触发时，子进程标准输入输出流可能仍处于打开状态。
// Node.js 为 SIGINT 和 SIGTERM 建立信号句柄，且 Node.js 进程不会因为收到这些信号而立即终止。 而是，Node.js 将执行一系列清理操作，然后重新触发已处理的信号。
child2.on("exit", (code, signal) => {});

// 'error' 事件在以下情况下触发：
// 1. 无法衍生该进程
// 2. 进程无法终止
// 3. 向子进程发送消息失败。
child2.on("error", () => {});

// message <Object> 解析的 JSON 对象或原始值。
// sendHandle <Handle> net.Socket 或 net.Server 对象、或未定义
child2.on("message", (message, sendHandle) => {});

// 调用父进程中的 subprocess.disconnect() 方法或子进程中的 process.disconnect() 方法后会触发 'disconnect' 事件。 断开连接后就不能再发送或接收消息，且 subprocess.connected 属性为 false。
child2.on("disconnect", () => {});

child2.channel; // 属性是对子进程的 IPC 通道的引用。 如果当前不存在 IPC 通道，则此属性为 undefined
child2.connected; // 指示是否仍然可以从子进程发送和接收消息。
child2.disconnect; // 方法 关闭父进程和子进程之间的 IPC 通道，一旦没有其他连接使其保持活动状态，则允许子进程正常退出。
child2.exitCode; // 进程的退出码。 如果子进程仍在运行，则该字段将为 null
const isKill = child2.kill("SIGHUP"); // 方法向子进程发送信号。 如果没有给定参数，则进程将被发送 'SIGTERM' 信号
child2.killed; // 使用 subprocess.kill() 成功发送信号给子进程后设置为 true。
child2.pid; // 子进程的进程号
child2.ref(); // subprocess.unref() 。后调用 subprocess.ref() 将为子进程恢复删除的引用计数，迫使父进程在退出之前等待子进程退出
child2.unref(); // 这样做会使父进程的事件循环不将子进程包括在其引用计数中，从而允许父进程独立于子进程退出，除非在子进程和父进程之间建立了 IPC 通道。
// child2.send(
//   {},
//   net.Socket
//   {
//     // 当传入 net.Socket 实例时可以使用的值。 当为 true 时，套接字在发送过程中保持打开状态
//     keepOpen: false,
//   },
//   () => {}
// );
child2.signalCode; // 信号号，没有为 null
child2.spawnargs; // 启动子进程时使用的命令行参数的完整列表
child2.spawnfile; // 启动的子进程的可执行文件名

// 子进程的 stderr 的 Readable Stream
// 子进程衍生时 stdio[2] 设置为 'pipe' 以外的任何值，则此将是 null。
// subprocess.stderr 是 subprocess.stdio[2] 的别名。 这两个属性将引用相同的值。
child2.stderr;
// 代表子进程的 stdout 的 Readable Stream。
// 如果子进程衍生时 stdio[1] 设置为 'pipe' 以外的任何值，则此将是 null。
// subprocess.stdout 是 subprocess.stdio[1] 的别名。 这两个属性将引用相同的值。
child2.stdout;
// 代表子进程的 stdin 的 Writable Stream。
// 如果子进程衍生时 stdio[0] 设置为 'pipe' 以外的任何值，则此将是 null。
// subprocess.stdin 是 subprocess.stdio[0] 的别名。 这两个属性将引用相同的值。
child2.stdin;
// subprocess.stdio[0]、subprocess.stdio[1] 和 subprocess.stdio[2] 也可分别用作 subprocess.stdin、subprocess.stdout 和 subprocess.stderr。
child2.stdio;
