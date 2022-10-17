# VM 虚拟机

## 简介
vm 模块允许在 V8 虚拟机上下文中编译和运行代码
vm 模块不是安全的机制。 不要使用它来运行不受信任的代码。
JavaScript 代码可以立即编译并运行，也可以编译、保存并稍后运行。
常见的用例是在不同的 V8 上下文中运行代码。 这意味着被调用的代码与调用代码具有不同的全局对象。

## 创建预编译脚本
```js
const script = new vm.Script(code, {
  filename: "evalmachine.<anonymous>", // 指定此脚本生成的堆栈跟踪中使用的文件名 默认值: 'evalmachine.<anonymous>'。如果 options 是字符串，则指定文件名。
  lineOffset: 0, // 生成的堆栈跟踪中显示的行号偏移量。 默认值: 0。
  columnOffset: 0,
  // 为所提供的源提供可选的代码缓存数据位置 是 Buffer 或 TypedArray 或 DataView 类型
  cachedData: Buffer.from("1"),
});
```
### 预编译脚本辅助函数
```js
// 当 true 且没有 cachedData 存在时，则 V8 将尝试为 code 生成代码缓存数据。 当成功后，会生成带有 V8 代码缓存数据的 Buffer 并存储在返回的 vm.Script 实例的 cachedData 属性中
const cacheWithoutX = script.createCachedData();

// contextObject 将是 vm 全局对象，保留其所有现有属性，但也具有任何标准全局对象具有的内置对象和函数。 在 vm 模块运行的脚本之外，全局变量将保持不变。
// 当方法 vm.createContext() 被调用时，contextObject 参数，在内部与 V8 上下文的新实例相关联。 
// 这个 V8 上下文使用 vm 模块的方法提供了 code 运行，它可以在隔离的全局环境中运行。 创建 V8 上下文并将其与 contextObject 相关联的过程就是本文档所指的“上下文隔离化”对象。
const createContext = vm.createContext(context, {
  name: "VM Context i",
  origin: "", // 对应于新创建的用于显示目的的上下文的来源。 来源的格式应该像 URL，但只有协议、主机和端口（如果需要），就像 URL 对象的 url.origin 属性的值。 最值得注意的是，该字符串应省略尾部斜杠，因为它表示路径。 默认值: ''
  codeGeneration: {
    strings: true,
    wasm: true,
  },
});

// 是否是 vm.createContext 创建的上下文
const isContext = vm.isContext(createContext);
```
### 预编译脚本下的执行
```js
// 在给定的 contextifiedObject 中运行 vm.Script 对象包含的编译代码并返回结果。 运行代码无权访问本地作用域
// 返回: <any> 脚本中执行的最后一条语句的结果。
script.runInContext(vm.createContext(context), {
    displayErrors: true, // 当为 true 时，如果编译 code 时出现 Error，则导致错误的代码行会附加到堆栈跟踪中。 默认值: true。
    timeout: 1, // 指定终止执行前执行 code 的毫秒数。 如果执行终止，则将抛出 Error。 此值必须是严格的正整数。
    breakOnSigint: false, // 如果执行终止，则将抛出 Error
});

// 对给定的 contextObject 进行上下文隔离化，在创建的上下文中运行 vm.Script 对象包含的编译代码，并返回结果。 运行代码无权访问本地作用域。
// 返回: <any> 脚本中执行的最后一条语句的结果。
script.runInNewContext(context2, {
  displayErrors: true, // 当为 true 时，如果编译 code 时出现 Error，则导致错误的代码行会附加到堆栈跟踪中。 默认值: true。
  timeout: 1000, // 指定终止执行前执行 code 的毫秒数。 如果执行终止，则将抛出 Error。 此值必须是严格的正整数。
  breakOnSigint: false, // 如果执行终止，则将抛出 Error
  contextName: "context1", // 新创建的上下文的可读名称。 默认值: 'VM Context i', 其中 i 是创建的上下文的升序数字索引。
  contextOrigin: "", // 对应于新创建的用于显示目的的上下文的来源。 来源的格式应该像 URL，但只有协议、主机和端口（如果需要），就像 URL 对象的 url.origin 属性的值。 最值得注意的是，该字符串应省略尾部斜杠，因为它表示路径。 默认值: ''。
  contextCodeGeneration: {
    strings: true, // 如果设置为 false，则任何对 eval 或函数构造函数（Function、GeneratorFunction 等）的调用都将抛出 EvalError。 默认值: true
    wasm: true, // 如果设置为 false，则任何编译 WebAssembly 模块的尝试都将抛出 WebAssembly.CompileError。
  },
});

// 在当前 global 对象的上下文中运行 vm.Script 包含的编译代码。 运行代码无权访问本地作用域，但确实有访问当前 global 对象的权限。
// 返回: <any> 脚本中执行的最后一条语句的结果。
script.runInThisContext({
    displayErrors: true, // 当为 true 时，如果编译 code 时出现 Error，则导致错误的代码行会附加到堆栈跟踪中。 默认值: true。
    timeout: 1, // 指定终止执行前执行 code 的毫秒数。 如果执行终止，则将抛出 Error。 此值必须是严格的正整数。
    breakOnSigint: false, // 如果执行终止，则将抛出 Error
});
```

## VM 静态函数
### 试用数据
```js
// context 保存 vm 虚拟机运行后的结果
const context = { x: 2 };
const context2 = { x: 2 };
const code = "let x = 40; var y = 17;";
```
### 函数
```js
// 将给定的代码编译到提供的上下文中（如果没有提供上下文，则使用当前上下文），并返回它包装在具有给定 params 的函数中
// 返回函数
const fn = vm.compileFunction(code, [], {
  filename: "", // 指定此脚本生成的堆栈跟踪中使用的文件名。 默认值: '',
  lineOffset: 0, // 生成的堆栈跟踪中显示的行号偏移量。 默认值: 0。
  columnOffset: 0,
  cachedData: Buffer.from(""), // 为所提供的源提供可选的 Buffer 或 TypedArray 或 DataView，其中包含 V8 的代码缓存数据
  produceCachedData: false, // 指定是否产生新的缓存数据。 默认值: false。
  parsingContext: vm.createContext(context), // 应在其中编译所述函数的上下文隔离化的对象。
  contextExtensions: [], // 包含要在编译时应用的上下文扩展集合（包含当前作用域的对象）的数组
});

// 在给定的 contextifiedObject 中运行 vm.Script 对象包含的编译代码并返回结果。 运行代码无权访问本地作用域。
// vm 中运行的全局变量包含在 context 对象中
// 返回: <any> 脚本中执行的最后一条语句的结果。
vm.runInContext(
    code,
    // contextifiedObject 对象必须之前已经使用 vm.createContext() 方法上下文隔离化
    vm.createContext(context),
    {
        filename: "evalmachine.<anonymous>", // 指定此脚本生成的堆栈跟踪中使用的文件名。
        lineOffset: 0, // 生成的堆栈跟踪中显示的行号偏移量。 默认值: 0。
        columnOffset: 0,
        displayErrors: true, // 当为 true 时，如果编译 code 时出现 Error，则导致错误的代码行会附加到堆栈跟踪中。 默认值: true。
        timeout: 1, // 指定终止执行前执行 code 的毫秒数。 如果执行终止，则将抛出 Error。 此值必须是严格的正整数。
        breakOnSigint: false, // 如果执行终止，则将抛出 Error
    }
);

// 首先将给定的 contextObject 上下文化编译 code，在创建的上下文中运行它，然后返回结果。 运行代码无权访问本地作用域。
// 这个函数可以自动创建 隔离的上下文
vm.runInNewContext(code, context2, {
    filename: "evalmachine.<anonymous>", // 指定此脚本生成的堆栈跟踪中使用的文件名。
    lineOffset: 0, // 生成的堆栈跟踪中显示的行号偏移量。 默认值: 0。
    columnOffset: 0,
    displayErrors: true, // 当为 true 时，如果编译 code 时出现 Error，则导致错误的代码行会附加到堆栈跟踪中。 默认值: true。
    timeout: 1000, // 指定终止执行前执行 code 的毫秒数。 如果执行终止，则将抛出 Error。 此值必须是严格的正整数。
    breakOnSigint: false, // 如果执行终止，则将抛出 Error
    contextName: "context1", // 新创建的上下文的可读名称。 默认值: 'VM Context i', 其中 i 是创建的上下文的升序数字索引。
    contextOrigin: "", // 对应于新创建的用于显示目的的上下文的来源。 来源的格式应该像 URL，但只有协议、主机和端口（如果需要），就像 URL 对象的 url.origin 属性的值。 最值得注意的是，该字符串应省略尾部斜杠，因为它表示路径。 默认值: ''。
    contextCodeGeneration: {
        strings: true, // 如果设置为 false，则任何对 eval 或函数构造函数（Function、GeneratorFunction 等）的调用都将抛出 EvalError。 默认值: true
        wasm: true, // 如果设置为 false，则任何编译 WebAssembly 模块的尝试都将抛出 WebAssembly.CompileError。
    },
});

// 在当前 global 的上下文中运行它并返回结果。 运行代码无权访问局部作用域，但可以访问当前 global 对象。
// 返回: <any> 脚本中执行的最后一条语句的结果。
vm.runInThisContext(code, {
    filename: "evalmachine.<anonymous>", // 指定此脚本生成的堆栈跟踪中使用的文件名。
    lineOffset: 0, // 生成的堆栈跟踪中显示的行号偏移量。 默认值: 0。
    columnOffset: 0,
    displayErrors: true, // 当为 true 时，如果编译 code 时出现 Error，则导致错误的代码行会附加到堆栈跟踪中。 默认值: true。
    timeout: 1000, // 指定终止执行前执行 code 的毫秒数。 如果执行终止，则将抛出 Error。 此值必须是严格的正整数。
    breakOnSigint: false, // 如果执行终止，则将抛出 Error
});
```
