# tty
process.stdout.isTTY 属性的值是否为 true

## ReadStream 类
代表终端的可读端。 在正常情况下，process.stdin 将是 Node.js 进程中唯一的 tty.ReadStream 实例，应该没有理由创建额外的实例

```js
// 如果终端当前配置为作为原始设备运行，则为 true。 默认为 false。
process.stdin.isRaw;

// 对于 tty.ReadStream 实例，始终为 true
process.stdin.isTTY;

// 如果为 true，则将 tty.ReadStream 配置为作为原始设备运行。 如果为 false，则将 tty.ReadStream 配置为在其默认模式下运行。 readStream.isRaw 属性将设置为结果模式
// 返回: <this> 读取流实例。
// 允许配置 tty.ReadStream，使其作为原始设备运行。
// 当在原始模式下时，输入总是逐个字符可用，不包括修饰符。 此外，终端对字符的所有特殊处理都被禁用，包括回显输入字符。
process.stdin.setRawMode(false)
```

## WriteStream 类
process.stdout 和 process.stderr 将是为 Node.js 进程创建的唯一的 tty.WriteStream 实例，应该没有理由创建额外的实例

### 属性
```js
// 终端当前具有的列数。 每当触发 'resize' 事件时，则会更新此属性。
process.stdout.columns;

// 终端当前具有的行数。 每当触发 'resize' 事件时，则会更新此属性
process.stdout.rows;

// boolean 值，始终为 true。
process.stdout.isTTY;
```

### 事件
```js
// 每当 writeStream.columns 或 writeStream.rows 属性发生更改时，则会触发 'resize' 事件。 当调用时，没有参数传给监听器回调。
process.stdout.on("resize", () => {
  console.log("screen size has changed!");
  console.log(`${process.stdout.columns}x${process.stdout.rows}`);
});
```

### 终端光标位置，屏幕操作
```js
// 返回终端窗口的尺寸。数组的类型为[列, 行]
process.stdout.getWindowSize();

// x,y 指定光标位置
// 返回: <boolean> 如果流希望调用代码在继续写入其他数据之前等待 'drain' 事件被触发，则为 false；否则为 true。
process.stdout.cursorTo(0, 0);

// 相对于当前位置移动光标
// 相对 x 相对 y
// 返回: <boolean> 如果流希望调用代码在继续写入其他数据之前等待 'drain' 事件被触发，则为 false；否则为 true。
process.stdout.moveCursor(10, 20, () => {});

// dir <number>
// -1: 从光标向左
// 1: 从光标向右
// 0: 整行
// 返回: <boolean> 如果流希望调用代码在继续写入其他数据之前等待 'drain' 事件被触发，则为 false；否则为 true
process.stdout.clearLine(0, () => {});

// 从当前光标向下清除此 WriteStream。
// 返回: <boolean> 如果流希望调用代码在继续写入其他数据之前等待 'drain' 事件被触发，则为 false；否则为 true。
process.stdout.clearScreenDown(() => {});
```

### 终端颜色
```js
// 参数1：包含要检查的环境变量的对象。 这使得模拟特定终端的使用成为可能。 默认值: process.env
// 返回
// 1 表示支持 2 种颜色，
// 4 表示支持 16 种颜色，
// 8 表示支持 256 种颜色，
// 24 表示支持 16,777,216 种颜色。
// 使用此来确定终端支持的颜色。 由于终端颜色的性质，可能出现误报或漏报。 这取决于进程信息和环境变量，这些可能与使用的终端有关。 可以传入 env 对象来模拟特定终端的使用。 这对于检查特定环境设置的行为方式很有用。

// 要强制实施特定的颜色支持，则使用以下环境设置之一。
// 2 种颜色：FORCE_COLOR = 0（禁用颜色）
// 16 种颜色：FORCE_COLOR = 1
// 256 种颜色：FORCE_COLOR = 2
// 16,777,216 种颜色：FORCE_COLOR = 3
// 使用 NO_COLOR 和 NODE_DISABLE_COLORS 环境变量也可以禁用颜色支持。
process.stdout.getColorDepth(process.env);

// 终端支持的颜色数量是否超过参数的值
// count <integer> 请求的颜色数量（最小为 2）。 默认值: 16.
// env <Object> 包含要检查的环境变量的对象。 这使得模拟特定终端的使用成为可能。 默认值: process.env。
// 返回: <boolean>
process.stdout.hasColors(16, process.env);
```

### 其他
```js
// 参数1：fd
// 指定 fd 是否与 终端关联，包括每当 fd 不是非负整数时
tty.isatty(1);
```
