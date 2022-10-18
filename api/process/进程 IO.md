# 进程 IO
进程 IO 注意事项
process.stdout 和 process.stderr 在重要方面与其他 Node.js 流不同：
它们分别由 console.log() 和 console.error() 内部使用。
写操作可能是同步的，这取决于流连接到什么以及系统是Windows还是POSIX:
文件：在 Windows 和 POSIX 上是同步的
TTY（终端）: 在 Windows 上是异步的，在 POSIX 上是同步的
管道（和套接字）: 在 Windows 上是同步的，在 POSIX 上是异步的
这些行为部分是出于历史原因，因为更改它们会导致向后不兼容，但某些用户也期望它们。
同步写入避免了诸如使用 console.log() 或 console.error() 写入的输出意外交错的问题，或者如果在异步写入完成之前调用 process.exit() 则根本不写入。 有关详细信息，请参阅 process.exit()。
警告：同步写入会阻塞事件循环，直到写入完成。 在输出到文件的情况下，这几乎是瞬时的，但在高系统负载下，接收端没有读取管道，或者终端或文件系统缓慢，事件循环可能经常被阻塞并且时间长到足以对性能产生严重的负面影响。 这在写入交互式终端会话时可能不是问题，但在对流程输出流进行生产日志记录时要特别小心。
要检查流是否连接到 TTY 上下文，请检查 isTTY 属性。

```js
// 返回连接到 stderr (文件描述符 2) 的流。 它是 net.Socket（也就是 Duplex 流），除非文件描述符 2 指向文件，在这种情况下它是 Writable 流。
process.stderr;

// process.stderr 的底层文件描述符的值。 该值固定为 2。 在 Worker 线程中，该字段不存在。
process.stderr.fd;

// 返回连接到 stdin (文件描述符 0) 的流。 它是 net.Socket（也就是 Duplex 流），除非文件描述符 0 指向文件，在这种情况下它是 Readable 流
// 在“旧”流模式下，stdin 流默认是暂停的，所以必须调用 process.stdin.resume() 来读取它。 另请注意，调用 process.stdin.resume() 本身会将流切换到“旧”模式。
process.stdin;

// 是 process.stdin 的底层文件描述符的值。 该值固定为 0。 在 Worker 线程中，该字段不存在。
process.stdin.fd;

// 返回连接到 stdout (文件描述符 1) 的流。 它是 net.Socket（也就是 Duplex 流），除非文件描述符 1 指向文件，在这种情况下它是 Writable 流。
process.stdout;

// 是 process.stdout 的底层文件描述符的值。 该值固定为 1。 在 Worker 线程中，该字段不存在
process.stdout.fd;
```
