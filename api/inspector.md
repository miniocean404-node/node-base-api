# 调试器
知乎文章：https://zhuanlan.zhihu.com/p/396463046
## 本地调试

1. 9229端口是Node.js默认选择的端口
2. 执行完命令后在浏览器打开开发者工具，菜单栏多了一个调试Node.js的按钮
3. =0.0.0.0:9229 可省略
```shell
node --inspect-brk 文件.js=0.0.0.0:9229
```

## 远程调试
但很多时候我们可能需要远程调试。比如我在一台云服务器上部署以上服务器代码。然后执行下方命令，由于不是在本地服务，所以需要另外方式启动调试

```text
devtools://devtools/bundled/js_app.html?experiments=true&v8only=true&ws=host:port/path

例如：devtools://devtools/bundled/js_app.html?experiments=true&v8only=true&ws=0.0.0.0:8888/5957465b-7f5a-4fe1-b5fb-74ee80da1931
```

```shell
node --inspect-brk=0.0.0.0:8888 httpServer.js
```

### 自动探测
1. 在浏览器 url 输入框输入下方命令，会看到 devices 
2. 点击configure按钮，在弹出的弹框里输入你远程服务器的地址
3. 等待 target 中的 inspect
4. 这时候我们点击inspect按钮、Open dedicated DevTools for Node按钮或者打开新tab的开发者工具，就可以开始调试。而且还可以调试Node.js的原生js模块。
```text
chrome://inspect/#devices
```


## API
### 启动
```js
// 激活检查器。 相当于 node --inspect=[[host:]port]，但可以在 node 启动后以编程方式完成。
// 如果等待为 true，则将阻塞直到客户端连接到检查端口并且流量控制已传给调试器客户端
inspector.open(9229, "0.0.0.0", true);

// 等待链接调试器，如果 inspector.open() 第三个参数 wait 为 false 并且 没有启动在 server 上，则运行后直接消失 无法在浏览器监控到，需要此 api
// 阻塞直到客户端（现有或稍后连接）发送 Runtime.runIfWaitingForDebugger 命令。
inspector.waitForDebugger();

// 关闭调试器
inspector.close()
```

### 辅助 API
```js
// 返回调试器的网址
inspector.url();

// 向远程调试器控制台发送消息
inspector.console.log("我是测试消息");
```

### 与调试器交流及事件监听
```js
// 用于向 V8 调试器后端发送消息并接收消息响应和通知
const session = new inspector.Session();

// 将会话连接到调试器后端。
session.connect();

// 当接收到来自 V8 调试器的任何通知时触发
session.on("inspectorNotification", (message) => console.log(message.method));

// 当接收到调试器通知其方法字段设置为 <inspector-protocol-method> 值时触发。
// <inspector-protocol-method> 是浏览器的 ws 协议消息传递事件
// 监听 'Debugger.paused' 并在程序执行暂停时（例如通过断点）打印程序暂停的原因：
session.on("Debugger.paused", ({ params }) => {
  console.log(params.hitBreakpoints);
});

// 向调试器后端(backend)发布消息。 callback 将在接收到响应时收到通知。 callback 是接受两个可选参数（错误和特定于消息的结果）的函数。
session.post("Runtime.evaluate", { expression: "2 + 2" }, (error, { result }) =>
  console.log(result)
);


// 将会话连接到主线程调试器后端。 如果没有在 worker 线程上调用此 API，则会抛出异常。
session.connectToMainThread();

// 立即关闭会话。 所有挂起的消息回调都将使用错误调用。 需要调用 session.connect() 才能再次发送消息。
// 重新连接的会话将丢失所有调试器状态，例如启用的代理或配置的断点。
session.disconnect()
```
### 举例
堆分析
```js
session.on("HeapProfiler.addHeapSnapshotChunk", (m) => {
  console.log(m.params.chunk);
});

session.post("HeapProfiler.takeHeapSnapshot", null, (err, r) => {
  console.log("HeapProfiler.takeHeapSnapshot done:", err, r);
  session.disconnect();
  // fs.closeSync(fd);
});
```

CPU 分析器
```js
const inspector = require('inspector');
const fs = require('fs');
const session = new inspector.Session();
session.connect();

session.post('Profiler.enable', () => {
  session.post('Profiler.start', () => {
    // 在此处调用测量中的业务逻辑...

    // 一段时间之后...
    session.post('Profiler.stop', (err, { profile }) => {
      // 将分析文件写入磁盘、上传等
      if (!err) {
        fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
      }
    });
  });
});
```
