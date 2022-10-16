# readline Cli工具

# Interface 类
readline.Interface 类的实例是使用 readline.createInterface() 方法构造的。 每个实例都与单个 input 可读流和单个 output 可写流相关联。 output 流用于打印到达并从 input 流中读取的用户输入的提示。
## 创建及简单使用
```js
const rl = readline.createInterface({
  input: process.stdin, // 输入流
  output: process.stdout, // 输出流
  completer: (line, cb) => {
    // 如果 completer 函数接受两个参数，则可以异步地调用它：
    const completions = ".help .error .exit .quit .q".split(" ");
    const hits = completions.filter((c) => c.startsWith(line));
    // 如果没有找到，则显示所有补全
    return [hits.length ? hits : completions, line];

    // 如果是异步
    // callback(null, [['123'], linePartial]);
  }, // 可选的用于制表符自动补全的函数。
  terminal: true, //  如果 input 和 output 流应该被视为终端，并且写入了 ANSI/VT100 转义码，则为 true。 默认值: 在实例化时检查 output 流上的 isTTY。
  historySize: 30, // 保留的最大历史行数。 要禁用历史记录，则将此值设置为 0。 仅当 terminal 由用户或内部的 output 检查设置为 true 时，此选项才有意义，否则历史缓存机制根本不会初始化。
  prompt: "->", // 要使用的提示字符串。 默认值: '> '
  // 如果 \r 和 \n 之间的延迟超过 crlfDelay 毫秒，则 \r 和 \n 都将被视为单独的行尾输入。
  // crlfDelay 将被强制为不小于 100 的数字。 它可以设置为 Infinity，在这种情况下，\r 后跟 \n 将始终被视为单个换行符（这对于具有 \r\n 行分隔符的文件读取可能是合理的）。 默认值: 100。
  crlfDelay: 100,
  removeHistoryDuplicates: false, // 则当添加到历史列表的新输入行与旧输入行重复时，这将从列表中删除旧行
  escapeCodeTimeout: 500, // readline 将等待字符的时长（当以毫秒为单位读取不明确的键序列时，既可以使用目前读取的输入形成完整的键序列，又可以采用额外的输入来完成更长的键序列）
});

rl.question("问题? ", (answer) => {
    console.log(`回答: ${answer}`);

    rl.close();
});
```

## 属性
```js
// node 正在处理的当前输入数据。
// 这可用于从 TTY 流中收集输入以检索迄今为止（在 line 事件触发之前）已处理的当前值。 一旦触发 line 事件，则此属性将是空字符串。
// 请注意，如果 rl.cursor 也不受控制，则在实例运行时修改该值可能会产生意想不到的后果。
rl.line;

// 相对于 rl.line 的光标位置
rl.cursor;
```

## 事件

名词解释：
SIGCONT: 发送以指示操作系统继续暂停的进程
SIGTSTP: 发送给进程以请求停止
SIGINT: 在用户键入INTR字符(通常是Ctrl-C)时发出，用于通知前台进程组终止进程
```js
// 发生以下情况之一时会触发 'close' 事件：
// rl.close() 方法被调用，readline.Interface 实例释放了 input 和 output 流；
// input 流接收到它的 'end' 事件；
rl.on("close", () => {});

// 每当 input 流接收到行尾输入（\n、\r 或 \r\n）时，则会触发 'line' 事件
rl.on("line", () => {});

// 消费 readline.Interface 中的字符
// 输入流中的错误不会被转发。
// 如果循环以 break、throw 或 return 终止，则将调用 rl.close()。 换句话说，迭代 readline.Interface 将始终完全消费输入流
// 性能无法与传统的 'line' 事件 API 相提并论。 对于性能敏感的应用程序，请改用 'line'。
for await (const line of rl) {
    console.log(line);
    // 逐行读取输入中的每一行
    // 都将在此处作为 `line` 连续可用。
}

// 发生以下情况之一时会触发 'pause' 事件：
// 调用 rl.pause() input 流已暂停。
// input 流没有暂停并接收 'SIGCONT' 事件(系统请求不想暂停了)
rl.on("pause", () => {});

// 调用 rl.resume()
// 每当 input 流恢复时，则会触发 'resume' 事件。
rl.on("resume", () => {});

// 需要开启 readline.emitKeypressEvents(process.stdin, rl);
rl.on("keypress", () => {});

// 如果 input 流接收到 SIGTSTP 时没有注册 'SIGTSTP' 事件监听器，则 Node.js 进程将被发送到后台。
// 当使用 fg(1p) 恢复程序时，则将触发 'pause' 和 'SIGCONT' 事件。 这些可用于恢复 input 流。
// 如果 input 在进程发送到后台之前暂停，则不会触发 'pause' 和 'SIGCONT' 事件。
rl.on("SIGTSTP", () => {
    // 这将覆盖 SIGTSTP
    // 并且阻止程序进入后台。
    console.log("Caught SIGTSTP.");
});

// 如果 input 流在 SIGTSTP(系统请求不想暂停了) 请求之前暂停，则不会触发此事件
rl.on("SIGCONT", () => {
    // `prompt` 会自动恢复流
    rl.prompt();
});

// 如果在 input 流接收到 SIGINT( Ctrl-C了 ) 时没有注册 'SIGINT' 事件监听器，则将触发 'pause' 事件。
rl.on("SIGINT", () => {
    rl.question("您确定要退出吗? ", (answer) => {
        if (answer.match(/^y(es)?$/i)) rl.pause();
    });
});
```

## TTY 恢复、暂停、关闭操作
```js
// readline.Interface 实例释放了 input 和 output 流。 当调用时，将触发 'close' 事件。
rl.close();

// 暂停 input 流，允许它稍后在必要时恢复
// 调用 rl.pause() 不会立即暂停其他由 readline.Interface 实例触发的事件（包括 'line'）。
rl.pause();

// 如果 input 流已暂停，则 rl.resume() 方法会恢复该流。
rl.resume();
```

## 提示、问题、写入
```js
// rl.question() 方法通过将 问题 写入 output 来显示 ，等待在 input 上提供用户输入，然后调用 callback 函数，将提供的输入作为第一个参数传入。
// 当调用时，如果 rl.question() 流已暂停，则 rl.question() 将恢复 input 流。
// 如果 readline.Interface 是在 output 设置为 null 或 undefined 的情况下创建的，则不会写入 query。
rl.question("问题", (answer) => {});

// 作用：提示信息
// rl.prompt() 方法将配置为 prompt 的 readline.Interface 实例写入 output 中的新行，以便为用户提供用于提供输入的新位置。
// 当调用时，如果 rl.prompt() 流已暂停，则 rl.prompt() 将恢复 input 流。
// 如果 readline.Interface 是在 output 设置为 null 或 undefined 的情况下创建的，则不会写入提示。
// preserveCursor <boolean> 如果为 true，则防止光标位置重置为 0。
rl.prompt(true);
// 设置了在调用 rl.prompt() 时将写入 output 的提示。
rl.setPrompt("prompt 提示");

// 会将 data 或由 key 标识的键序列写入 output
// 如果指定了 key(第二个参数)，则忽略 data。
// 当调用时，如果 rl.write() 流已暂停，则 rl.write() 将恢复 input 流。
// 如果 readline.Interface 是在 output 设置为 null 或 undefined 的情况下创建的，则不会写入 data 和 key。
rl.write("写入", { ctrl: true, name: "c", meta: true, shift: false });
```

## 终端清理
```js
// rows <number> 光标当前所在的提示行
// cols <number> 光标当前所在的屏幕列
// 返回光标相对于输入提示 + 字符串的实际位置。 长输入（换行）字符串以及多行提示都包含在计算中
rl.getCursorPos();

// stream <stream.Writable> 写入流
// dir <number>
// -1: 从光标向左
// 1: 从光标向右
// 0: 整行
// callback <Function> 操作完成后调用。
// 返回: <boolean> 如果 stream 希望调用代码在继续写入额外的数据之前等待 'drain' 事件被触发，则为 false；否则为 true。
readline.clearLine(process.stdout, 0);

// stream <stream.Writable>
// callback <Function> 操作完成后调用。
// 返回: <boolean> 如果 stream 希望调用代码在继续写入额外的数据之前等待 'drain' 事件被触发，则为 false；否则为 true。
// readline.clearScreenDown() 方法从光标的当前位置向下清除给定的 TTY 流。
readline.clearScreenDown(process.stdout, () => {});

// 将光标移动到给定的 TTY stream 中的指定位置。
// 返回: <boolean> 如果 stream 希望调用代码在继续写入额外的数据之前等待 'drain' 事件被触发，则为 false；否则为 true。
readline.cursorTo(process.stdout, 0, 0, () => {});

// 相对于它在给定的 TTY stream 中的当前位置移动光标。
// 返回: <boolean> 如果 stream 希望调用代码在继续写入额外的数据之前等待 'drain' 事件被触发，则为 false；否则为 true。
readline.moveCursor(process.stdout, 10, 10, () => {});

// 发射 keypress 事件
// readline.emitKeypressEvents() 方法使给定的可读流开始触发与接收到的输入相对应的 'keypress' 事件。
// 第二个参数可选，interface 指定 readline.Interface 实例，当检测到复制粘贴输入时禁用自动完成。
// 如果 stream 是 TTY，则它必须处于原始模式。
// 如果 input 是终端，则它会被其 input 上的任何逐行读取实例自动调用。 关闭 readline 实例不会阻止 input 触发 'keypress' 事件。
readline.emitKeypressEvents(process.stdin, rl);
```

## 终端快捷键
1. Ctrl+Shift+Backspace	删除行左	不适用于 Linux、Mac 和 Windows
2. Ctrl+Shift+Delete	删除行右	不适用 MAC
3. Ctrl+C	触发 SIGINT 或关闭逐行读取实例
4. Ctrl+H	删除左边
5. Ctrl+D	如果当前行为空或 EOF，则向右删除或关闭逐行读取实例  不适用于 Windows
6. Ctrl+U	从当前位置删除到行首
7. Ctrl+K	从当前位置删除到行尾
8. Ctrl+A	转到行首
9. Ctrl+E	转到行尾
10. Ctrl+B	后退一个字符
11. Ctrl+F	前进一个字符
12. Ctrl+L	清屏
13. Ctrl+N	下一个历史子项
14. Ctrl+P	上一个历史子项
15. Ctrl+Z	将正在运行的进程移到后台
16. Ctrl+W or Ctrl +Backspace	向后删除到单词边界 
17. Ctrl+Delete	向前删除到单词边界	
18. Ctrl+Left 左边的单词	Ctrl+Left arrow 不适用 MAC
19. Ctrl+Right arrow or Meta+F	右边的单词	Ctrl+Right 不适用 MAC
20. Meta+D or Meta +Delete	删除右边的单词	Meta+Delete 不适用 windows
21. Meta+Backspace	删除左边的单词	不适用 MAC
