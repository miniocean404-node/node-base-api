### Node.js 提供的所有模块的名称列表。 可用于验证模块是否由第三方维护。
```js
import { builtinModules as builtin } from "module";
```

#### 是否是内置模块
```js
import { isBuiltin } from 'node:module';
isBuiltin('node:fs'); // true
isBuiltin('fs'); // true
```

### 创建 require 的函数
#### esm
```js
import { createRequire } from "module";
const require = createRequire(import.meta.url);
```
#### cjs
```js
const siblingModule = require("./sibling-module");
```

#### 更新 esm 函数中的 api
更新内置的 ES 模块的所有实时绑定，以匹配 CommonJS 导出的属性。 它不会在 ES 模块中添加或删除导出的名称。（不能添加、删除源模块中的 api）
```js
module.syncBuiltinESMExports()
```
