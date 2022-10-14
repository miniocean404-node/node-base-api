# 真实路径

```js
// 通过解析 .、.. 和符号链接异步地计算规范路径名。
// 如果 path 解析为套接字或管道，则该函数将返回该对象的系统相关名称。
fs.realpath("./1.txt", { encoding: "utf-8" }, (err, resolvedPath) => {});

// 仅支持可以转换为 UTF8 字符串的路径。
// 在 Linux 上，将 Node.js 与 musl libc 链接时，必须将 procfs 文件系统挂载在 /proc 上，此函数才能起作用。 Glibc 没有此限制。
fs.realpath.native("./1.txt", { encoding: "utf-8" }, (err, resolvedPath) => {});
```
