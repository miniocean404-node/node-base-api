# ESM
不常用总结

## 属性
```js
// 模块的绝对的 file: URL。
import.meta
```

## data: 导入
data: URL 支持使用以下 MIME 类型导入：

text/javascript 用于 ES 模块
application/json 用于 JSON
application/wasm 用于 Wasm
data: URL 只为内置模块解析裸说明符和绝对说明符。 解析相对说明符不起作用，因为 data: 不是特殊协议。 例如，尝试从 data:text/javascript,import "./foo"; 加载 ./foo 无法解析，因为 data: URL 没有相对解析的概念。 正在使用的 data: URL 示例是：
```js
import 'data:text/javascript,console.log("hello!");';
import _ from 'data:application/json,"world!"';
```

## ES 模块和 CommonJS 之间的差异
1. 没有 require, exports, module.exports, __filename, __dirname, require.resolve
    ```js
    // filename 和 dirname es使用方式
    import * as url from "url";
    import { dirname } from 'path';
    
    url.fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename);
    ```
2. require总是将它引用的文件视为CommonJS。无论require在CommonJS环境中以传统方式使用，还是在ES模块环境中使用module. createrequire()，都适用。
要将ES模块包含到CommonJS中，请使用import()
```js
import('cjs')
```

## 加载 https
在当前的 Node.js 中，不支持以 https:// 开头的说明符。 
下面的加载器注册钩子以启用对此类说明符的基本支持。
虽然这似乎是对 Node.js 核心功能的重大改进，但实际使用这个加载器有很大的缺点：性能比从磁盘加载文件慢得多，没有缓存，也没有安全性。
使用前面的加载器，运行 node --experimental-loader ./https-loader.mjs ./main.mjs 会在 main.mjs 中的 URL 处按照模块打印当前版本的 CoffeeScript。
```js
// main.mjs
import { VERSION } from 'https://coffeescript.org/browser-compiler-modern/coffeescript.js';
```

## 转译器加载器
可以使用 transformSource 钩子将 Node.js 无法理解的格式的源转换为 JavaScript。 但是，在调用该钩子之前，其他钩子需要告诉 Node.js 不要在未知文件类型上抛出错误；并告诉 Node.js 如何加载这种新文件类型。
这比在运行 Node.js 之前转译源文件的性能要低；转译加载器应该只用于开发和测试目的。
```js
export function transformSource(source, context, defaultTransformSource) {
  const { url, format } = context;

  if (extensionsRegex.test(url)) {
    return {
      source: CoffeeScript.compile(source, { bare: true })
    };
  }

  // 让 Node.js 处理所有其他来源。
  return defaultTransformSource(source, context, defaultTransformSource);
}
```
