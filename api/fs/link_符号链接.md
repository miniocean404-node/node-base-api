# 符号链接

## 创建

```js
// type 参数仅在 Windows 上可用，在其他平台上被忽略。 可以设置为 'dir'、'file' 或 'junction'。
// 如果未设置 type 参数，Node.js 将自动检测 target 类型并使用 'file' 或 'dir'。
// 如果 target 不存在，将使用 'file'。
// Windows 交接点要求目标路径是绝对路径。 使用 'junction' 时，target 参数将自动规范化为绝对路径
// 在 example 中创建符号链接 2.txt，其指向中的 1.txt：。
fs.symlink("1.txt", "./example/2.txt", "file", () => {});
```

## 读取
```js
// 读取路径引用的符号链接的内容。回调函数得到两个参数
fs.readlink("./1.txt", { encoding: "utf-8" }, (err, linkString) => {});
```

## 权限
```js
// 只在 Mac 可用 ，更改符号链接的权限。
fs.lchmod("1.txt", 0o666, () => {});
// 设置符号链接的所有者
fs.lchown("1.txt", 1, 1, () => {});

// 创建一个从existingPath到newPath的新链接。
fs.link("1.txt", "3.txt", (err) => {});
```
