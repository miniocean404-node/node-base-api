const { Console } = console;

const myConsole = Console({
  stdout: process.stdout,
  stderr: process.stderr,
  ignoreErrors: true, // 写入底层流时忽略错误。 默认值: true
  colorMode: "auto", // true 开启着色 设置为 'auto' 使颜色支持取决于 isTTY 属性的值和 getColorDepth() 在相应流上返回的值。 如果同时设置了 inspectOptions.colors，则无法使用此选项。 默认值: 'auto'。
  // inspectOptions // 指定传给 util.inspect() 的选项。
  groupIndentation: 2, // 缩进距离 用于 group
});

// 默认 default , 计数参数 id 的调用次数 ，countReset 重置
myConsole.count("default");
myConsole.countReset();

myConsole.dir(
  {},
  {
    showHidden: true, // true，则对象的不可枚举和符号属性也将显示。 默认值: false。
    depth: null, // 在格式化对象时递归多少次。 这对于检查大型复杂对象很有用。 要使其无限递归，则传入 null。 默认值: 2
    colors: true, // 如果为 true，则输出将使用 ANSI 颜色代码进行样式设置。 颜色可自定义；请参阅自定义 util.inspect() 颜色。
  }
);

// 将后续行的缩进增加 groupIndentation 长度的空格。 group 会开启缩进 groupEnd 关闭缩进
myConsole.group("参数1", "参数2");
myConsole.log("缩进");

myConsole.table(
  [
    { a: 1, b: "Y" },
    { a: "Z", b: 2 },
  ],
  ["a"] // 从参数 1 中摘除需要打印的属性
);

// 计算执行时间
myConsole.time("time");
myConsole.timeLog("time", { show: "time 中间执行时候的一次 time 日志" });
myConsole.timeEnd("time");

// 调用栈信息
myConsole.trace("trace", "参数");

// 检查器日志
// 除非在检查器中使用，否则此方法不会显示任何内容。 console.profile() 方法启动带有可选标签的 JavaScript CPU 配置文件，直到调用 console.profileEnd()。 然后将配置文件添加到检查器的配置文件面板中。
console.profile("MyLabel");
console.profileEnd("MyLabel");

// 检查器时间戳
console.timeStamp("label");
