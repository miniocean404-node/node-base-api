# NodeJs 浏览器断点

1. Chrome 开发者工具尚不支持调试工作线程。 ndb 可用于调试它们。
2. 要中断应用程序代码的第一行，则传入 --inspect-brk
```powershell
node --inspect index.js
```

# NodeJs 解释器的断点调试 (不重要)

# 断点
将语句 debugger; 插入脚本的源代码，则将在代码中的该位置启用断点：
~~~
node inspect file
~~~

### 观察变量
可以在调试时监视表达式和变量值。 在每个断点上，监视器列表中的每个表达式都将在当前上下文中进行评估，并且立即显示在断点的源代码列表之前。
要开始监视表达式，则键入 watch('my_expression')。 命令 watchers 将打印活动的监视器。 要删除监视器，请键入 unwatch('my_expression')。

backtrace, bt: 打印当前执行帧的回溯

list(5): 列出脚本源代码的 5 行上下文（前后各 5 行）

watch(expr): 将表达式添加到监视列表

unwatch(expr): 从监视列表中删除表达式

watchers: 列出所有监视器及其值（在每个断点上自动列出）

repl: 打开调试器的交互式解释器，以在调试脚本的上下文中进行评估

exec expr: 在调试脚本的上下文中执行表达式

### 设置断点
setBreakpoint(), sb(): 在当前行上设置断点

setBreakpoint(line), sb(line): 在特定行上设置断点

setBreakpoint('fn()'), sb(...):

setBreakpoint('script.js', 1), sb(...): 在 script.js 的第一行上设置断点

clearBreakpoint('script.js', 1), cb(...): 清除 script.js 中第 1 行上的断点

```powershell
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/4e3db158-9791-4274-8909-914f7facf3bd
< For help, see: https://nodejs.org/en/docs/inspector
< Debugger attached.
Break on start in main.js:1
> 1 (function (exports, require, module, __filename, __dirname) { const mod = require('./mod.js');
2 mod.hello();
3 mod.hello();
debug> setBreakpoint('mod.js', 22)
```
### 控制

run: 运行脚本（在调试器启动时自动运行）

restart: 重启脚本

kill: 杀死脚本

### 杂

scripts: 列出所有加载的脚本

version: 显示 V8 的版本
