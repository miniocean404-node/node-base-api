# 文件

## 打开文件
```js
// mode 设置文件模式（权限和粘滞位），但前提是文件已创建。 在 Windows 上，只能操作写入权限；请参阅
// 在 Windows 上预留了一些字符（< > : " / \ | ? *），如命名文件、路径和命名空间所记录。 在 NTFS 下，如果文件名包含冒号，则 Node.js 将打开文件系统流，如此 MSDN 页面所述。
// 基于 fs.open() 的函数也表现出这种行为：fs.writeFile()、fs.readFile() 等。
fs.open("./api", "r", 0o666, (err, fd) => {
  // // 通过任何其他 fs 操作对当前正在使用的任何文件描述符 (fd) 调用 fs.close()，则可能会导致未定义的行为。
  // // fd 文件描述符: fs.open 获得
  fs.close(fd, (err) => {});
});
```

## 读取文件

```js
// 读取文件内容
// fs.readFile() 函数缓冲整个文件。 为了最小化内存成本，在可能的情况下优先通过 fs.createReadStream() 进行流式传输。
fs.readFile("/etc/passwd", { encoding: "utf-8", flag: "r" }, (err, data) => {
    if (err) throw err;
    console.log(data);
});

// 从fd指定的文件中读取数据。
// 如果文件未被并发修改，则当读取的字节数为零时到达文件末尾
fs.read(
  1,
  {
    buffer: Buffer.from("test"), // Buffer.alloc(16384)
    position: null, // position 是从文件开头应该读取数据的偏移量。 如果 typeof position !== 'number'，则从当前位置读取数据。
    offset: 0, // 偏移量
    length: 10, // 默认：buffer.length
  },
  (err, bytesRead, buffer) => {
    console.log(bytesRead, buffer);
  }
);

// 从 fd 指定的文件中读取并使用 readv() 写入 ArrayBufferView 数组
// bytesRead 是从文件中读取的字节数。
fs.readv(1, [], 0, (err, bytesRead, buffers) => {});
```

## 文件内容写入

```js
// 将 <Buffer> | <TypedArray> | <DataView> 写入文件
// offset 确定要写入的缓冲区部分
// length 是整数，指定要写入的字节数。
// position 指从文件开头数据应被写入的偏移量
// bytesWritten 指定从 buffer 写入的字节数
// 在同一个文件上多次使用 fs.write() 而不等待回调是不安全的。 对于这种情况，建议使用 fs.createWriteStream()。
fs.write(1, Buffer.from("text"), 0, 10, 1, (err, written, buffer) => {});
// 将 string 写入 fd 指定的文件。
// 在 Windows 上，如果文件描述符连接到控制台（例如 fd == 1 或 stdout），则默认情况下无论使用何种编码，都无法正确呈现包含非 ASCII 字符的字符串。
// 通过使用 chcp 65001 命令更改激活的代码页，可以将控制台配置为可正确呈现 UTF-8。 有关更多详细信息，请参阅 chcp 文档。
fs.write(1, "text", 1, "utf-8", (err, written, buffer) => {});

// 当 file 是文件名时，将数据异步地写入文件，如果文件已存在则替换该文件。 data 可以是字符串或缓冲区。
// 当 file 是文件描述符时，其行为类似于直接调用 fs.write()（推荐）。 请参阅以下有关使用文件描述符的说明。
// 将 fs.writeFile() 与文件描述符一起使用
// 在文件描述符的情况下，文件不会被替换！ 数据不一定写入文件的开头，文件的原始数据可以保留在新写入的数据之前和/或之后。
// 例如，如果连续调用 fs.writeFile() 两次，首先写入字符串 'Hello'，然后写入字符串 ', World'，该文件将包含 'Hello, World'，并且可能包含文件的一些原始数据（这取决于原始文件的大小和文件描述符的位置）。
// 如果使用文件名而不是描述符，则文件将保证仅包含 ', World'。
fs.writeFile(
  "1.txt" || "fd",
  "<string> | <Buffer> | <TypedArray> | <DataView>",
  { encoding: "utf8", mode: 0o777, flag: "w" },
  (err) => {}
);

// 使用 writev() 将 ArrayBufferView 数组写入 fd 指定的文件。
// position 是该数据应写入的文件开头的偏移量。
// 在同一个文件上多次使用 fs.writev() 而不等待回调是不安全的。 对于这种情况，请使用 fs.createWriteStream()。
// 在 Linux 上，以追加模式打开文件时，位置写入不起作用。 内核会忽略位置参数，并始终将数据追加到文件末尾。
fs.writev(1, [], 1, (err, bytesWritten, buffers) => {});
```

## 文件内容追加
```js
// 异步地将数据追加到文件，如果该文件尚不存在，则创建该文件。
fs.appendFile(
  "1.txt",
  Buffer.from("111"),
  {
    encoding: "base64",
    mode: 0o666,
    flag: "a",
  },
  (err) => {}
);

// 如果文件描述符引用的文件大于 len 个字节，则文件中将仅保留前 len 个字节。
// 如果文件先前小于 len 个字节，则将其扩展，并且扩展部分将使用空字节（'\0'）填充：
fs.ftruncate(1, 4, (err) => {});

// 截断文件
fs.truncate("1.txt", 10, () => {});

// 请求将打开的文件描述符的所有数据刷新到存储设备。具体实现与操作系统和设备相关(同步数据)
fs.fsync(1, (err) => {});
```

## 重命名

```js
// 重命名
// 将 oldPath 处的文件异步重命名为作为 newPath 提供的路径名。 如果 newPath 已经存在，则它将被覆盖。 如果 newPath 是目录，则会引发错误。
fs.rename("./1.txt", "./2.txt", (err) => {});
```

## 复制文件

```js
// 异步地将 src 复制到 dest。 默认情况下，如果 dest 已经存在，则会被覆盖。 除了可能的异常之外，没有给回调函数提供任何参数。
// 如果在打开目标文件进行写入后发生错误，Node.js 将尝试删除目标文件。
// Node.js 不保证复制操作的原子性。
// mode:用于指定复制操作的行为
// fs.constants.COPYFILE_EXCL: 如果 dest 已经存在，则复制操作将失败。
// fs.constants.COPYFILE_FICLONE: 复制操作将尝试创建写时复制引用链接。 如果平台不支持写时复制，则使用后备复制机制。
// fs.constants.COPYFILE_FICLONE_FORCE: 复制操作将尝试创建写时复制引用链接。 如果平台不支持写时复制，则该操作将失败。
fs.copyFile("./1.txt", "./2.txt", 0, () => {});
```

## 删除文件

```js
// 删除文件
fs.unlink('1.txt',(err)=>{})
```

## 文件权限

```js
// 测试用户对 path 指定的文件或目录的权限。 如果任何可访问性检查失败，则错误参数将是 Error 对象。
// 可以创建由两个或多个值的按位或组成的掩码（例如 fs.constants.W_OK | fs.constants.R_OK）
// 在调用 fs.open()、fs.readFile() 或 fs.writeFile() 之前，不要使用 fs.access() 检查文件的可访问性。 这样做会引入竞争条件，因为其他进程可能会在两次调用之间更改文件的状态。
// 从是否 err 中判断这些文件访问常量是否是正确的

fs.access("./index.js", fs.constants.F_OK, (err) => {});
```
