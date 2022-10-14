# 目录

## 创建

```js
// 异步地创建目录。
// 当 path 是已存在的目录时，调用 fs.mkdir() 仅在 recursive 为 false 时才导致错误。
fs.mkdir("./test/test", { recursive: true, mode: 0o777 }, (err, path) => {});

// 创建唯一的临时目录。
// 生成六个随机字符，附加在所需的 prefix 后面以创建唯一的临时目录。
// 由于平台的不一致，请避免在 prefix 中尾随 X 字符。 某些平台，尤其是 BSD，可能返回六个以上的随机字符，并将 prefix 中的尾随 X 字符替换为随机字符。
fs.mkdtemp(path.join(os.tmpdir()), { encoding: "utf-8" }, (err, folder) => {
    console.log(folder);
});
```

## 打开文件夹
```js
// 创建 fs.Dir，其中包含用于从目录读取和清理目录的所有进一步的函数。
// encoding 选项设置在打开目录和随后的读取操作时 path 的编码。
fs.opendir("./api", { encoding: "utf-8", bufferSize: 32 }, () => {});
```

## 读取
```js
// 读取目录的内容。回调函数获得两个参数(err, files)，其中files是目录中除'之外的文件名的数组。
// encoding属性的对象，该属性指定传递给回调的文件名使用的字符编码。如果编码设置为'buffer'，则返回的文件名将作为< buffer >对象传递。
// 如果选项。withFileTypes被设置为true，文件数组将包含<fs。Dirent >对象
fs.readdir(
    "./1.txt",
    {
        encoding: "utf-8",
        withFileTypes: false,
    },
    (err, files) => {
        console.log(files);
    }
);



// 目录 Dir 目录条目 Dirent
const dir = await fsS.opendir("./api");

// 打开目录路径
dir.path;

// 一个个读取
dir.read((err, dirEnt) => {
});

// 异步地关闭目录的底层资源句柄。 后续读取将导致错误。
// for await (const dirent of dir) 将所有读取完 Promise 自动关闭
await dir.close((err) => {});

// for await (const dirent of dir) {
// dirent 目录中每个文件
// }
```
