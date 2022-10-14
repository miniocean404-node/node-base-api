# watch

## 注意事项
监听器回调有两个参数 (eventType, filename)。 eventType 是 'rename' 或 'change'，filename 是触发事件的文件的名称。
filename: 仅在 Linux、macOS、Windows 和 AIX 上支持在回调中提供 filename 参数。 即使在支持的平台上，也不能保证始终提供 filename。 因此，不要假设回调中总是提供 filename 参数，如果它为 null，则有一些回退逻辑。

fs.watch API 跨平台并非 100% 一致，并且在某些情况下不可用。

递归选项仅在 macOS 和 Windows 上受支持。

在 Windows 上，如果监视目录被移动或重命名，则不会触发任何事件。 删除监视目录时报 EPERM 错误。

## watch 同步调用
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

## watch 异步调用
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

## watchFile
```js
const watcherFile = fs.watchFile(
    "./index.js",
    {
        bigint: false, // 是否使用 bigint 数据
        persistent: true, // 是否持续监控
        interval: 5007, // 重复周，指示应该轮询目标的频率（以毫秒为单位）
    },
    // 这些统计对象是 fs.Stat 的实例。
    (currStats, prevStats) => {
        console.log(currStats, prevStats);
        watcherFile.unref();
        watcherFile.ref();
    }
);
```

## 停止监视
```js
// 停止监视 filename 的变化。 如果指定了 listener，则仅删除该特定监听器。 否则，所有监听器都将被删除，从而有效地停止监视 filename。
// 使用未被监视的文件名调用 fs.unwatchFile() 是空操作，而不是错误。
// 使用 fs.watch() 比 fs.watchFile() 和 fs.unwatchFile() 更高效。 应尽可能使用 fs.watch() 而不是 fs.watchFile() 和 fs.unwatchFile()。
fs.unwatchFile("1.txt", () => {});
```
