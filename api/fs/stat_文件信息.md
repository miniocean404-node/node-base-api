# 文件信息

## 格式
```text
true
Stats {
  dev: 16777220, // 包含文件的设备的数字标识符。
  mode: 16877, // 描述文件类型和模式的位字段。
  nlink: 3, // 文件存在的硬链接数。
  uid: 501, // 拥有文件的用户的数字用户标识符 (
  gid: 20, // 拥有文件的群组的数字群组标识符
  rdev: 0, // 如果文件代表设备，则为数字设备标识符。
  blksize: 4096, // i/o 操作的文件系统块大小。
  ino: 14214262, // 文件的文件系统特定的索引节点编号。
  size: 96, // 文件的大小（以字节为单位）。
  blocks: 0, // 为此文件分配的块数。
  atimeMs: 1561174653071.963, // 指示最后一次访问此文件的时间戳，
  mtimeMs: 1561174614583.3518, // 指示最后一次修改此文件的时间戳，
  ctimeMs: 1561174626623.5366, // 指示最后一次更改文件状态的时间戳，
  birthtimeMs: 1561174126937.2893, // 指示此文件创建时间的时间戳，
  atime: 2019-06-22T03:37:33.072Z,
  mtime: 2019-06-22T03:36:54.583Z,
  ctime: 2019-06-22T03:37:06.624Z,
  birthtime: 2019-06-22T03:28:46.937Z
}
```

```js
// 不推荐在调用 fs.open()、fs.readFile() 或 fs.writeFile() 之前使用 fs.stat() 检查文件是否存在。 而是，用户代码应该直接打开/读取/写入文件，并在文件不可用时处理引发的错误。
// 要检查文件是否存在而不对其进行操作，建议使用 fs.access()。
fs.stat("./1.txt", { bigint: false }, (err, stats) => {
    // 文件名
    stats.name;

    // 如果是系统目录 则为 true
    stats.isDirectory();

    // 是文件 则为 true
    stats.isFile();

    // 如果是块设备 则为 true
    stats.isBlockDevice();

    // 如果是字符设备 则为 true
    stats.isCharacterDevice();

    // 是先进先出 (FIFO) 管道 则为 true
    stats.isFIFO();

    // 是套接字，则返回 true
    stats.isSocket();

    // 是符号链接，则返回 true。
    stats.isSymbolicLink();
});

// fd 查看文件的 stat
fs.fstat(
  1,
  {
    // 是否使用 bigint 展示、操作更精细的数据
    bigint: false,
  },
  (err, stats) => {
    console.log(stats);
  }
);

// lstat() 与 stat() 相同，除了如果 path 是符号链接，则被统计的是链接本身，而不是它引用的文件。
fs.lstat("1.txt", { bigint: false }, (err, stats) => {});
```
