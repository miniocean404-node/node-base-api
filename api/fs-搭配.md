# 简介

同步版本：
```js
import { promises as fsS } from "fs"; // fs promise 版本
```

### 文件路径
api 中参数相对路径将相对于通过调用 process.cwd() 确定的当前工作目录进行解析。
buffer 可作为路径 Buffer.from('/open/some/file.txt')

### 优化
UV_THREADPOOL_SIZE 环境变量可修改线程池进行优化

### 文件描述符
在 POSIX 系统上，对于每个进程，内核维护一个当前打开的文件和资源表。 每个打开的文件都分配了一个简单的数字标识符，称为文件描述符。
在系统级，所有文件系统操作都使用这些文件描述符来识别和跟踪每个特定文件。
Windows 系统使用不同但概念上相似的机制来跟踪资源。

# 目录
```js
// 目录 Dir 目录条目 Dirent
const dir = await fsS.opendir("./api");

// 打开目录路径
dir.path;

// 一个个读取
dir.read((err, dirEnt) => {
  // 文件名
  dirEnt.name;

  // 如果是系统目录 则为 true
  dirEnt.isDirectory();

  // 是文件 则为 true
  dirEnt.isFile();

  // 如果是块设备 则为 true
  dirEnt.isBlockDevice();

  // 如果是字符设备 则为 true
  dirEnt.isCharacterDevice();

  // 是先进先出 (FIFO) 管道 则为 true
  dirEnt.isFIFO();

  // 是套接字，则返回 true
  dirEnt.isSocket();

  // 是符号链接，则返回 true。
  dirEnt.isSymbolicLink();
});

// 异步地关闭目录的底层资源句柄。 后续读取将导致错误。
// for await (const dirent of dir) 将所有读取完 Promise 自动关闭
await dir.close((err) => {});

// for await (const dirent of dir) {
// dirent 目录中每个文件
// }
```

# watch
### watch 同步调用

```js
const ac = new AbortController();
// 根据操作系统支持，可能不提供 filename 参数。 如果提供了 filename，如果 fs.watch()
// 在其 encoding 选项设置为 'buffer' 的情况下被调用，它将作为 Buffer 提供，否则 filename 将是 UTF-8 字符串。
const watcherS = fsS.watch("./api", {
  // encoding: "buffer", // 同步不能为 buffer
  signal: ac.signal, // 中断信号
  recursive: true, // 递归
  persistent: true, // 持续监控
});

setTimeout(() => ac.abort(), 5000);

try {
  for await (const event of watcherS) {
    const { filename, eventType } = event;
    // console.log(filename, eventType);
  }
} catch (err) {
  if (err.name !== "AbortError") throw err;
}

```

### watch 异步调用
```js
const watcher = fs.watch(
  "./api",
  {
    encoding: "utf-8", // 同步不能为 buffer
    recursive: false, // 递归
    persistent: true, // 持续监控
  },
  (eventType, filename) => {
    console.log(eventType);
    // close 监视器停止监视变化时触发,fs.FSWatcher 对象在事件句柄中不再可用
    // error 在监视文件时发生错误时触发。 出错的 fs.FSWatcher 对象在事件句柄中不再可用
    // watcher.close(); 停止监视给定 fs.FSWatcher 上的更改。 一旦停止，就关闭了终端
    // watcher.close();

    //  不需要 Node.js 事件循环保持活动状态
    watcher.unref();

    // Node.js 事件循环保持活动状态
    watcher.ref();
  }
);
```

### watchFile 
```js
const watcherFile = fs.watchFile("./index.js", {}, (currStats, prevStats) => {
  console.log(currStats, prevStats);
   watcherFile.unref();
   watcherFile.ref();
});
```

# 读取流 createReadStream

```js
const rs = fs.createReadStream("./index.js", {
  encoding: null, // encoding 可以是 Buffer 接受的任何一种。
  // 如果指定了 fd 并且 start 被省略或 undefined，则 fs.createReadStream() 从当前文件位置顺序读取。
  // 如果指定了 fd，则 ReadStream 将忽略 path 参数并使用指定的文件描述符。 这意味着不会触发 'open' 事件。 fd 应该是阻塞的；非阻塞 fd 应该传给 net.Socket。
  // 如果 fd 指向仅支持阻塞读取的字符设备（例如键盘或声卡），则读取操作不会在数据可用之前完成。 这可以防止进程退出和流自然关闭。将 emitClose 选项设置为 true 以更改此行为。
  fd: null,
  mode: 0o666, // 置文件模式（权限和粘滞位），但前提是文件已创建
  // 如果 autoClose 为 false，则即使出现错误，文件描述符也不会关闭。 关闭它并确保没有文件描述符泄漏是应用程序的责任。
  // 如果 autoClose 设置为 true（默认行为），则在 'error' 或 'end' 时，文件描述符将自动关闭。
  autoClose: true,
  emitClose: false,
  start: 0, // 开始位置
  end: Infinity, // 结束位置
  highWaterMark: 64 * 1024, // 读取时中间仓库最大存储限制 与可读流的 16 kb 默认 highWaterMark 不同，此方法返回的流的默认 highWaterMark 为 64 kb。
  fs: null, // fs 选项，可以覆盖 open、read 和 close 的相应 fs 实现。 提供 fs 选项时，需要覆盖 open、read 和 close。
});

rs.close();

rs.bytesRead; // 到目前为止已读取的字节数。
rs.path; // 流正在读取的文件的路径，如 fs.createReadStream() 的第一个参数中所指定。 如果 path 作为字符串传入，则 readStream.path 将是字符串。 如果 path 作为 Buffer 传入，则 readStream.path 将是 Buffer。
rs.pending; // 如果底层文件尚未打开，即在触发 'ready' 事件之前，则此属性为 true。
// 当 fs.ReadStream 的文件描述符被打开时触发
// ReadStream 使用的整数文件描述符。
rs.on("open", () => {});
// 当 fs.ReadStream 准备好使用时触发。'open' 后立即触发
rs.on("ready", () => {});
// 当 fs.ReadStream 的底层文件描述符已关闭时触发。
rs.on("close", () => {});
```

### flag 文件系统标志
以下标志在 flag 选项接受字符串的任何地方可用。
1. 'a': 打开文件进行追加。 如果文件不存在，则创建该文件。
2. 'ax': 类似于 'a' 但如果路径存在则失败。
3. 'a+': 打开文件进行读取和追加。 如果文件不存在，则创建该文件。
4. 'ax+': 类似于 'a+' 但如果路径存在则失败。
5. 'as': 以同步模式打开文件进行追加。 如果文件不存在，则创建该文件。
6. 'as+': 以同步模式打开文件进行读取和追加。 如果文件不存在，则创建该文件。
7. 'r': 打开文件进行读取。 如果文件不存在，则会发生异常。
8. 'r+': 打开文件进行读写。 如果文件不存在，则会发生异常。
9. 'rs+': 以同步模式打开文件进行读写。 指示操作系统绕过本地文件系统缓存。
这主要用于在 NFS 挂载上打开文件，因为它允许跳过可能过时的本地缓存。 它对 I/O 性能有非常实际的影响，因此除非需要，否则不建议使用此标志。
这不会将 fs.open() 或 fsPromises.open() 变成同步阻塞调用。 如果需要同步操作，应该使用类似 fs.openSync() 的东西。
10. 'w': 打开文件进行写入。 创建（如果它不存在）或截断（如果它存在）该文件。
11. 'wx': 类似于 'w' 但如果路径存在则失败。
12. 'w+': 打开文件进行读写。 创建（如果它不存在）或截断（如果它存在）该文件。
13. 'wx+': 类似于 'w+' 但如果路径存在则失败。

flag 也可以是 open(2) 记录的数字；常用的常量可从 fs.constants 获得。 在 Windows 上，标志会在适用的情况下转换为等效的标志，例如 O_WRONLY 至 FILE_GENERIC_WRITE，或 O_EXCL|O_CREAT 至 CREATE_NEW，为 CreateFileW 所接受。
如果路径已经存在，则独占标志 'x'（ open(2) 中的 O_EXCL 标志）会导致操作返回错误。 在 POSIX 上，如果路径是符号链接，即使链接指向不存在的路径，使用 O_EXCL 也会返回错误。

在 Linux 上，以追加模式打开文件时，位置写入不起作用。 内核会忽略位置参数，并始终将数据追加到文件末尾。
某些标志的行为是特定于平台的。 因此，在 macOS 和 Linux 上使用 'a+' 标志打开目录，如下例所示，将返回错误。 而在 Windows 和 FreeBSD 上，将返回文件描述符或 FileHandle。

在 Windows 上，使用 'w' 标志（通过 fs.open() 或 fs.writeFile() 或 fsPromises.open()）打开现有隐藏文件将失败并抛出 EPERM。 可以使用 'r+' 标志打开现有的隐藏文件进行写入。
调用 fs.ftruncate() 或 filehandle.truncate() 可用于重置文件内容。
