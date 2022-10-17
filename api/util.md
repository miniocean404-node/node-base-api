# util 工具

## 类型判断
```js
// util.types 包含多个类型判断方法 ，并且直接调用 C++ ，不检查原型
util.types
```

## 打印对象 inspect
```js
const inspect = util.inspect(
  { a: 1 },
  {
    showHidden: false, // true，则 object 的不可枚举符号和属性包含在格式化的结果中。 WeakMap 和 WeakSet 条目以及用户定义的原型属性（不包括方法属性）也包括在内。 默认值: false。
    depth: 2, // 格式化 object 时递归的次数。 要递归到最大调用堆栈大小，则传入 Infinity 或 null。默认值: 2。
    colors: false, // true，则输出的样式为 ANSI 颜色代码。 颜色是可自定义的。 参阅自定义 util.inspect 颜色。默认值: false。
    customInspect: true, // 是否调用 类 中的 [util.inspect.custom](depth, opts) {} 函数
    showProxy: false, // 是否展示 Proxy 中的 target 和 handler 对象
    maxArrayLength: 100, // 格式化时要包含的 Array、TypedArray、WeakMap 和 WeakSet 元素的最大数量。 设置为 null 或 Infinity 则显示所有元素。 设置为 0 或负数则不显示任何元素。 默认值: 100。
    maxStringLength: Infinity, // 包含的最大字符数。 设置为 null 或 Infinity 则显示所有元素。 设置为 0 或负数则不显示字符。
    breakLength: 80, // 输入值在多行中拆分的长度。 设置为 Infinity 则将输入格式化为单行（与设置为 true 或任何数字 >= 1 的 compact 组合）。 默认值: 80。
    // 将此设置为 false 会导致每个对象的键显示在新行上。 它还会向比 breakLength 长的文本添加新行。
    // 如果设置为数字，则只要所有属性都适合 breakLength，则最多 n 个内部元素将合并在一行中。 短数组元素也组合在一起。
    // 无论 breakLength 大小如何，文本都不会减少到 16 个字符以下。 有关更多信息，请参阅下面的示例。 默认值: 3。
    compact: 3,
    sorted: true, // true 或函数，则对象的所有属性以及 Set 和 Map 条目都将在结果字符串中排序。 如果设置为 true，则使用默认的排序。 如果设置为函数，则用作比较函数。
    getters: false, // true，则检查获取器。 如果设置为 'get'，则只检查没有相应设置器的获取器。 如果设置为 'set'，则只检查具有相应设置器的获取器。 这可能会导致副作用，具体取决于获取器函数。 默认值: false。
  }
);

// 自定义 util.inspect 的颜色
// 可通过 util.inspect.styles 和 util.inspect.colors 属性全局地自定义
util.inspect.styles, util.inspect.colors;

// 全局修改 util.inspect 默认选项
util.inspect.defaultOptions.maxArrayLength = 100;
```

## 格式化字符串

```js
// %s: String 将用于转换除 BigInt、Object 和 -0 之外的所有值。 BigInt 值将用 n 表示，没有用户定义的 toString 函数的对象使用具有选项 { depth: 0, colors: false, compact: 3 } 的 util.inspect() 进行检查。
// %d: Number 将用于转换除 BigInt 和 Symbol 之外的所有值。
// %i: parseInt(value, 10) 用于除 BigInt 和 Symbol 之外的所有值。
// %f: parseFloat(value) 用于除 Symbol 之外的所有值。
// %j: JSON。 如果参数包含循环引用，则替换为字符串 '[Circular]'。
// %o: Object. 类似于具有选项 { showHidden: true, showProxy: true } 的 util.inspect()。 这将显示完整的对象，包括不可枚举的属性和代理。
// %O: Object. 类似于没有选项的 util.inspect()。 这将显示完整的对象，但不包括不可枚举的属性和代理。
// %c: CSS. 此说明符被忽略，将跳过任何传入的 CSS。
// %%: 单个百分号 ('%')。 这不消费参数。
const formatStr = util.format(
  "格式化字符串: 1：%s、2.数字：%d、3.整数：%i、4.浮点数：%f、5.JSON：%j、6.对象：%o|%O、7.%号：%%",
  "字符串",
  100,
  1,
  1.1,
  JSON.stringify({ a: 1 }),
  { a: 1 },
  { a: 1 }
);

// 与 util.format() 相同，不同之处在于它接受 inspectOptions 参数，该参数指定传给 util.inspect() 的选项。
const formatStr1 = util.formatWithOptions({ colors: true }, "对象: %o", {
  a: 1,
});
```

## 函数 promise 及 callback 化
```js
// 将函数 promise 化
// 如果存在 original[util.promisify.custom] 属性，则 promisify 将返回其值
const promisify = util.promisify(fs.stat);
await promisify(".");
// 自定义的 promise 化函数
// 使用 util.promisify.custom 符号可以覆盖 util.promisify() 的返回值
const customFn = () => {};
customFn[util.promisify.custom] = (...arg) => {
  // arg 为 promisify 化的函数的参数
  // promisify 后将返回这个值
  return "";
};

// 参数为 async 函数（或返回 Promise 的函数）并返回遵循错误优先回调风格的函数
const cb = util.callbackify(async () => {
    // 当 Promise 使用 `null` 拒绝时，它会使用 Error 封装，
    // 原始值存储在 `reason` 中。
    return Promise.reject(null);
});
cb((err, result) => {});
```

## 错误提示、日志提示、废弃 API 提示
```js
// NODE_DEBUG=test,net,tls node index.js
// 返回：TEST 15215: 测试 123
// 如果 NODE_DEBUG 不存在 则不会输出任何内容
let debuglog = util.debuglog("test", (debug) => {
  // 可选函数
  // 参数：可用于用一个不同的函数替换日志函数
  debuglog = debug;
});
debuglog("测试 %d", 123);

// 用于提示函数废弃的 API
const deprecate = util.deprecate(() => {}, "废弃声明");
deprecate();

// 返回来自 Node.js API 的数字错误码的字符串名称。 错误码和错误名称之间的映射是平台相关的。 有关常见错误的名称，请参阅常见的系统错误
fs.access("file/that/does/not/exist", (err) => {
  const errName = util.getSystemErrorName(err.errno);
  console.error(errName); // ENOENT
});

const isDeepEQ = util.isDeepStrictEqual({ a: 1 }, { a: 1 });
```

## TextEncoder TextDecoder
```js
// 支持的编码： http://nodejs.cn/api-v12/util.html#whatwg-supported-encodings
const decoder = new TextDecoder(
  "gbk", // 默认值: 'utf-8'。
  {
    fatal: false, // 为 true 则发生的解码错误将导致抛出 则。 默认值: false。
    ignoreBOM: false, // 当 true 时，TextDecoder 将在解码结果中包含字节顺序标记。 当 false 时，字节顺序标记将从输出中删除。 此选项仅在 encoding 为 'utf-8'、'utf-16be' 或 'utf-16le' 时使用。 默认值: false。
  }
);

// 当前的编码集
decoder.encoding;
// true 发生的解码错误将导致抛出
decoder.fatal;
// 是否包含字节顺序标记
decoder.ignoreBOM;

// 解码 input 并返回字符串。
// 如果 options.stream 是 true，则在 input 末尾出现的任何不完整的字节序列(当前编码集不足以显示一个正确字符时)都会在内部缓冲并在下一次调用 textDecoder.decode() 后触发。
const buffer = Buffer.alloc(10, "我是中文");
const decodeStr = decoder.decode(buffer, {
  stream: false, // 如果需要额外的数据块，则为 true。 默认值: false。
});

// TextEncoder 的所有实例仅支持 UTF-8 编码
const encoder = new TextEncoder();
const encode = encoder.encode("编码字符");

// TextEncoder 实例支持的编码。
encoder.encoding;

// 将 文本 编码进 Uint8Array
// 返回:encodeInto
//  read <number> 读取的来源的 Unicode 代码单元。
//  written <number> 写入的目标的 UTF-8 字节。
// Uint8Array 的长度不足时 将阶段读取的字符
const arr = new Uint8Array(12);
const encodeInto = encoder.encodeInto("编码文本", arr);
```
