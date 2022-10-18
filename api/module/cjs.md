# CJS
不常用总结

## 主模块
1. node 运行时，require.main 被设置为 module 全局变量
2. 如果通过 node foo.js 运行，则为 true，如果通过 require('./foo') 运行，则为 false
3. 通过查看 require.main.filename 就可以得到当前应用的入口点。
```js
require.main === module;
```

## 包管理器依赖
包可以相互依赖。 为了安装包 foo，可能需要安装包 bar 的特定版本。 bar 包本身可能存在依赖关系，在某些情况下，这些甚至可能发生冲突或形成循环依赖关系。
因为 Node.js 查找它加载的任何模块的 realpath（即，它解析符号链接）然后在 node_modules 文件夹中查找它们的依赖项，
```js
'/Users/user/Desktop/self-code/node-base-api/node_modules',
'/Users/user/Desktop/self-code/node_modules',
'/Users/user/Desktop/node_modules',
'/Users/user/node_modules',
'/Users/node_modules',
'/node_modules'
```

## 从 node_modules 目录加载
如果传给 require() 的模块标识符不是核心模块，是 node_modules 的包，那如果当前文件夹没有，则它移动到父目录，依此类推，直到到达文件系统的根目录。

## 从全局目录加载 node_modules
1. 如果它们在本地找不到，且NODE_PATH 环境变量设置为以冒号分隔的绝对路径列表，则 Node.js 将在这些路径中搜索模块
2. 在 Windows 上，NODE_PATH 由分号 (;) 而不是冒号分隔
3. 此外，Node.js 将在以下 GLOBAL_FOLDERS 列表中搜索：
1: $HOME/.node_modules
2: $HOME/.node_libraries
3: $PREFIX/lib/node
其中 $HOME 是用户的主目录，$PREFIX 是 Node.js 配置的 node_prefix。

## 模块导入封装
执行模块代码之前，Node.js 将使用如下所示的函数封装器对其进行封装：
```js
(function(exports, require, module, __filename, __dirname) {
// 模块代码实际存在于此处
});
```

## 模块作用域 (相当于全局变量)
1. __dirname 当前模块的目录名
2. __filename 当前模块的文件名。
3. exports module.exports 的引用，其输入更短。
4. module 对当前模块的引用
5. require(id)
   id <string> 模块名称或路径
   返回: <any> 导出的模块内容
6. require.cache 模块在需要时缓存在此对象中。 通过从此对象中删除键值，下一次 require 将重新加载模块。
7. require.main 对当前模块的引用(module)
8. require.resolve()
    ```js
    require.resolve("./index", {
        // 从中解析模块位置的路径。 如果存在，则使用这些路径而不是默认的解析路径
        // 除了 GLOBAL_FOLDERS（例如 $HOME/.node_modules，其总是被包含在内）。 这些路径中的每一个都用作模块解析算法的起点，这意味着从此位置检查 node_modules 层级。
        paths: [],
    });
    ```
9. require.resolve.paths(request)
    ```js
    // 正在检索其查找路径的模块路径
    require.resolve.paths("./")
    ```
   
## module 对象
在每个模块中，module 自由变量是对代表当前模块的对象的引用。 为方便起见，module.exports 也可通过 exports 模块全局访问
module 实际上不是全局的，而是每个模块本地的。

1. module.children 这个模块首次需要的对象。
2. module.exports 模块导入变量 和 exports 相等
3. module.filename 模块的完全解析文件名。
4. module.id 模块的标识符。 通常这是完全解析的文件名
5. module.loaded 模块是否已完成加载，或正在加载。
6. module.path 模块的目录名称。 这通常与 module.id 的 path.dirname() 相同。
7. module.paths 模块的搜索路径。
8. exports 不能直接赋值对象，对象会覆盖导出的所有值，可以赋值 exports.content 
