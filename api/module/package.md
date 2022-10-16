# package 包模块

## 双包 同时包含(CommonJS/ES 模块包)
http://nodejs.cn/api-v12/packages.html#dual-commonjses-module-packages

## package.json
```js
const package =  {
  "type": "module", // module 或 commonjs
  // <Object> | <string> | <string[]>
  // "exports" 中定义的所有路径必须是以 ./ 开头的相对文件 URL
  "exports":"./index.js",
  // 主包位置
  "main":"./index.js"
}
```

## 模块系统

### ES 模块 
当作为初始输入传给 node 时，或当 ES 模块代码中的 import 语句引用时，Node.js 会将以下视为ES 模块：
1. 以 .mjs 结尾的文件。
2. 当最近的父 package.json 文件包含值为 "type:module" 的顶层  字段时，以 .js 结尾的文件。
3. 字符串作为参数传入 --eval，或通过 STDIN 管道传输到 node，带有标志 --input-type=module。

### CommonJS 模块 
Node.js 会将以下视为 CommonJS 模块
1. 以 .cjs 结尾的文件。
2. 当最近的父 package.json 文件包含值为 "type:commonjs" 的顶层  字段时，以 .js 结尾的文件。
3. 字符串作为参数传入 --eval 或 --print，或通过 STDIN 管道传输到 node，带有标志 --input-type=commonjs。

## 模块加载器
### CommonJS
1. 它是完全同步的
2. 它负责处理require()调用
3. It is monkey patchable.
4. 它支持文件夹作为模块
5. 在解析一个说明符时，如果没有找到精确的匹配，它将尝试添加扩展名(.js， .json，最后是.node)，然后尝试将文件夹解析为模块
6. 它将. JSON视为JSON文本文件
7. .node文件被解释为用process.dlopen()加载的编译插件模块
8. 它将所有缺少.json或.node扩展名的文件视为JavaScript文本文件
9. 它不能用来加载ECMAScript模块(尽管可以从CommonJS模块加载ECMAScript模块)。当被用来加载非ECMAScript模块的JavaScript文本文件时，它会将其作为CommonJS模块加载.

### ECMAScript
1. 它是异步的
2. 它负责处理import语句和import()表达式
3. It is not monkey patchable, can be customized using loader hooks.
4. 它不支持文件夹作为模块，目录索引 ,必须完全指定.
5. 它不进行扩展搜索。当说明符是相对或绝对文件URL时，必须提供文件扩展名
6. 它可以加载JSON模块，但需要导入断言
7. 它只接受JavaScript文本文件的.js、.mjs和.cjs扩展名
8. 它可以用来加载JavaScript CommonJS模块。这些模块通过cjs-module-lexer进行传递，以尝试识别命名导出，如果可以通过静态分析确定命名导出，则可以使用命名导出。导入的CommonJS模块将其url转换为绝对路径，然后通过CommonJS模块加载器加载
```js

```
## 包的入口

建议在包的 package.json 文件中同时定义 "exports" 和 "main"
1. 在包的 package.json 文件中，有两个字段可以定义包的入口点："main" 和 "exports"。 所有版本的 Node.js 都支持 "main" 字段，但它的功能有限：它只定义了包的主要入口点。
2. "exports" 字段提供了 "main" 的替代方案，其中可以定义包主入口点，同时封装包，防止除 "exports" 中定义的入口点之外的任何其他入口点。 这种封装允许模块作者为他们的包定义一个公共接口。
3. 如果同时定义了 "exports" 和 "main"，则 "exports" 字段优先于 "main"。 "exports" 不特定于 ES 模块或 CommonJS；
如果 "exports" 存在，则 "main" 将被覆盖。 因此 "main" 不能用作 CommonJS 的后备，但它可以用作不支持 "exports" 字段的旧版 Node.js 的后备。
4. 条件导出可以在 "exports" 中用于为每个环境定义不同的包入口点，包括包是通过 require 还是通过 import 引用。 
例如：
```json
{
  "name": "my-mod",
  "exports": {
    ".": "./lib/index.js",
    "./lib": "./lib/index.js",
    "./lib/index": "./lib/index.js",
    "./lib/index.js": "./lib/index.js",
    "./feature": "./feature/index.js",
    "./feature/index.js": "./feature/index.js",
    "./package.json": "./package.json"
  }
}
```
```js
import { something } from 'my-mod'; // 从 ./lib/index.js 导入 "something"。
import { another } from 'a-package/lib'; // 从 ./lib/index.js 加载。
```
