# 报告

## 命令行使用
```shell
node --report-uncaught-exception --report-on-fatalerror --report-on-signal --report-signal=SIGUSR2  --report-filename=./report.json --report-directory=/home/nodeuser app.js
```
1. --report-uncaught-exception 启用对未捕获的异常生成报告。 当结合原生堆栈和其他运行时环境数据检查 JavaScript 堆栈时很有用。
2. --report-filename 将写入报告的文件的名称。
3. --report-on-signal
注意： Windows 不支持基于信号的报告生成。
允许在接收到正在运行的 Node.js 进程的指定（或预定义）信号时生成报告。 （有关如何修改触发报告的信号，请参见下文。）默认信号为 SIGUSR2。 
当需要从另一个程序触发报告时很有用。 应用程序监视器可以利用此特性定期收集报告并将丰富的内部运行时数据集绘制到其视图中。
一般情况下，不需要修改上报触发信号。 然而，如果 SIGUSR2 已经被用于其他目的，则此标志有助于改变报告生成的信号，并为上述目的保留 SIGUSR2 的原始含义。
4. --report-on-fatalerror 允许在导致应用程序终止的致命错误（Node.js 运行时中的内部错误，例如内存不足）时触发报告。 用于检查各种诊断数据元素，例如堆、堆栈、事件循环状态、资源消耗等 推断致命错误。
5. --report-compact 以紧凑的单行 JSON 格式编写报告，与为人类设计的默认多行格式相比，日志处理系统更容易使用。
6. --report-directory 生成报告的位置。默认为 Node.js 进程的当前工作目录。
7. --report-signal 设置或重置报告生成信号（Windows 不支持）。 默认信号为 SIGUSR2。


## API 触发
### 配置
```js
process.report.reportOnFatalError = false; // 当为 true 时，reportOnFatalError 触发致命错误的诊断报告。 默认为 false。
process.report.reportOnSignal = false; // 当为 true 时，reportOnSignal 触发信号的诊断报告。 Windows 不支持此。 默认为 false。
process.report.reportOnUncaughtException = true; // 为 true 时，reportOnUncaughtException 触发未捕获异常的诊断报告。 默认为 false。
process.report.signal = 'SIGQUIT'; // signal 指定将用于拦截外部触发器以生成报告的 POSIX 信号标识符 默认为 'SIGUSR2'。
```
### 触发
```js
// 参数可选，参数1，文件路径 | Error 对象，参数2 Error 对象
process.report.writeReport('./foo.json',err);

// 获取诊断报告在 js 输出
// 参数可选
const report = process.report.getReport(new Error('custom error'))
```

## Worker
Worker 线程可以像主线程一样创建报告。
