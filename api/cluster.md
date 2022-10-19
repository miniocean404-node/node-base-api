
## 属性
```js
// 调度策略
// cluster.SCHED_RR 用于循环或 cluster.SCHED_NONE 将其留给操作系统。 这是全局的设置，一旦衍生第一个工作进程或调用 .setupMaster()（以先到者为准），就会有效地冻结。
// SCHED_RR 是除 Windows 之外的所有操作系统的默认值。 一旦 libuv 能够有效地分发 IOCP 句柄而不会导致大量性能损失，则 Windows 将更改为 SCHED_RR。
// cluster.schedulingPolicy 也可以通过 NODE_CLUSTER_SCHED_POLICY 环境变量设置。 有效值为 'rr' 和 'none'。
cluster.schedulingPolicy;

// 此对象不应手动更改或设置 默认全局设置
// execArgv <string[]> 传给 Node.js 可执行文件的字符串参数列表。 默认值: process.execArgv。
// exec <string> 工作进程文件的文件路径。 默认值: process.argv[1]。
// args <string[]> 传给工作进程的字符串参数。 默认值: process.argv.slice(2)。
// cwd <string> 工作进程的当前工作目录。 默认值: undefined （从父进程继承）。
// serialization <string> 指定用于在进程之间发送消息的序列化类型。 可能的值为 'json' 和 'advanced'。 有关更多详细信息，请参阅子进程的高级序列化。 默认值: false。
// silent <boolean> 是否将输出发送到父进程的标准输入输出。 默认值: false。
// stdio <Array> 配置衍生进程的标准输入输出。 由于集群模块依赖 IPC 来运行，因此此配置必须包含 'ipc' 条目。 提供此选项时，它会覆盖 silent。
// uid <number> 设置进程的用户标识。 （见 setuid(2)。）
// gid <number> 设置进程的群组标识。 （见 setgid(2)。）
// inspectPort <number> | <Function> 设置工作进程的检查器端口。 这可以是数字，也可以是不带参数并返回数字的函数。 默认情况下，每个工作进程都有自己的端口，从主进程的 process.debugPort 开始递增。
// windowsHide <boolean> 隐藏通常在 Windows 系统上创建的衍生进程控制台窗口。 默认值: false。
// 调用 .setupMaster()（或 .fork()）之后，此设置对象将包含设置，包括默认值。
cluster.settings;

// setupMaster 用于更改默认的 'fork' 行为。 调用后，设置将出现在 cluster.settings 中。
// 任何设置更改只会影响未来对 .fork() 的调用，而不会影响已经运行的工作进程。
// 唯一不能通过 .setupMaster() 设置的工作进程属性是传给 .fork() 的 env。
// 上述默认值仅适用于第一次调用；
cluster.setupPrimary(cluster.settings);
```

## 使用

```js
import cluster from "cluster";
import http from "api/network/http/http";
import os from "os";

if (cluster.isPrimary) {
    console.log("主线程 pid", process.pid);

    // 当新的工作进程被衍生时，则集群模块将触发 'fork' 事件
    cluster.on("fork", (worker) => {
    });

    // 当集群主进程接收到来自任何工作进程的消息时触发。
    cluster.on("message", (worker, message, handle) => {
    });

    // 衍生新的工作进程之后，工作进程应该使用在线消息进行响应。 当主进程接收到在线消息时，它将触发此事件。 'fork' 和 'online' 的区别在于主进程衍生工作进程时触发衍生，而 'online' 在工作进程运行时触发。
    cluster.on("online", () => {
    });

    // 存储活动工作进程对象的哈希，以 id 字段为键。 使循环遍历所有工作进程变得容易。 它仅在主进程中可用
    // 在工作进程断开连接并退出后，工作进程会从 cluster.workers 中删除。 这两个事件之间的顺序无法预先确定。
    // 但是，可以保证从 cluster.workers 列表中的删除发生在最后一个 'disconnect' 或 'exit' 事件触发之前。
    for (const iterator in cluster.workers) {
        console.log(iterator);
    }

    //   http.createServer((req, res) => res.end('hello')).listen(3000)

    // 从工作线程调用 listen() 后，当服务器上触发 'listening' 事件时，则主进程中的 cluster 事件也将触发 'listening' 事件。
    cluster.on("listening", (worker, address) => {
        // address 对象包含以下连接属性：address、port 和 addressType
        // addressType 是以下之一：
        // 4 (TCPv4)
        // 6 (TCPv6)
        // -1 (Unix 域套接字)
        // 'udp4' or 'udp6' (UDP v4 或 v6)
    });

    cluster.on("exit", (worker, code, signal) => {
        console.log("集群退出监听", worker, code, signal);
    });

    // 在工作进程 IPC 通道断开连接后触发。 当工作进程正常退出、被杀死、或手动断开连接（例如使用 worker.disconnect()）时，可能会发生这种情况
    cluster.on("disconnect", (worker) => {
        console.log(`工作进程${worker.id}已经断开链接`);
    });
}

// 创建子进程
if (cluster.isPrimary) {
    const cpu = os.cpus().length;

    for (let cItem = 0; cItem < cpu; cItem++) {
        // cluster.fork() 可以通过 IPC 与父进程通信并且来回传递服务器句柄。
        const worker = cluster.fork({NODE_ENV: "dev"});

        // 工作进程在线
        worker.on("online", () => {
        });

        worker.on("listening", (address) => {
            // 每个新的工作进程都被赋予了自己唯一的 id
            worker.id;

            // 如果工作进程通过其 IPC 通道连接到其主进程，则此函数返回 true，否则返回 false。
            worker.isConnected();

            console.log(`子进程监听 ${address}`);
        });

        // 也可以使用 process.on('message')
        worker.on("message", (message, handle) => {
            if (message.id === 1) {
                // 默认值: 'SIGTERM'
                // 在工作进程中，它通过断开通道来完成，然后以代码 0 退出,由于 kill() 尝试正常断开工作进程，因此很容易无限期地等待断开连接完成
                // 如果不需要正常的断开连接行为，则使用 worker.process.kill() 此方法别名为 worker.destroy()。
                cluster.workers[message.id].kill("SIGTERM");

                // 所有工作进程都是使用 child_process.fork() 创建，此函数返回的对象存储为 .process。 在工作进程中，存储了全局的 process
                worker.process;
            }
        });

        // 此事件与 child_process.fork() 提供的相同
        // 在工作进程中，也可以使用 process.on('error')
        worker.on("error", () => {
            console.log("子进程错误");
        });

        worker.on("disconnect", () => {
            console.log("子进程断开");
        });

        worker.on("exit", (code, signal) => {
            console.log(`子进程 退出监听 ${code || signal}}`);

            // 如果工作进程已终止（由于退出或收到信号），则此函数返回 true。 否则，它返回 false。
            worker.isDead();

            // 如果工作进程由于 .kill() 或 .disconnect() 退出，则此属性为 true。 如果工作进程以任何其他方式退出，则为 false。 如果工作进程没有退出，则为 undefined。
            if (worker.exitedAfterDisconnect === true) {
                console.log("Oh, it was just voluntary – no need to worry");
            }
        });

        // console.log(cluster.workers)
    }
}

if (cluster.isWorker) {
    // 对当前工作进程对象的引用。 在主进程中不可用
    cluster.worker;

    http.createServer((req, res) => res.end("hello")).listen(3000);

    console.log(
        `子进程 pid ${process.pid},  子进程 workers 中 id: ${cluster.worker.id} 服务启动于: http://localhost:3000`
    );

    cluster.worker.send(
        {id: cluster.worker.id, msg: "test"},
        // sendHandle
        // {keepOpen:false} // 当传入 net.Socket 实例时可以使用的值。 当为 true 时，套接字在发送过程中保持打开状态。 默认值: false。
        () => {
        }
    );
}

```
