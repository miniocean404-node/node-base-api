# 路径

## 平台常量
```js
// 提供特定于平台的路径定界符
// ; 用于 Windows
// : 用于 POSIX
// 例如 windows 的环境变量 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'
path.delimiter;

// 提供特定于平台的路径片段分隔符：
// Windows 上是 \
// POSIX 上是 /
path.sep;
```

## 拼接
```js
// 可传递 相对目录
// path.join() 方法使用特定于平台的分隔符作为定界符将所有给定的 path 片段连接在一起，然后规范化生成的路径。
// 如果连接的路径字符串是零长度字符串，则将返回 '.'，表示当前工作目录。
path.join("/foo", "bar", "baz/asdf", "quux", "..");

// 将路径或路径片段的序列解析为绝对路径。
// 如果有绝对路径则以其为开头，后面拼接，否则 则使用当前工作目录 拼接 其参数。
// 如果没有参数则为 当前工作路径
// 零长度的 path 片段被忽略。 生成的路径被规范化，并删除尾部斜杠。
path.resolve("wwwroot", "/static_files/png/", "../gif/image.gif");
```

## 获取判断
```js
// 返回路径中的文件名
// 第二个参数是后缀，可选，填写后获取的文件名没有后缀
path.posix.basename("/foo/bar/baz/asdf/quux.html", ".html");

// 返回路径中的目录名
path.posix.dirname("/foo/bar/baz/asdf/quux.html");

// 返回后缀名
// "."返回 . ".index.md"返回 .md
path.extname("index.html");

// 第一个路径相对于第二个路径的 相对路径
path.relative("/data/orandea/test/aaa", "/data/impl/bbb");

// 确定 path 是否为绝对路径。
path.isAbsolute("/foo/bar/baz/asdf/quux.html");

// 仅在 Windows 系统上，返回给定 path 的等效命名空间前缀路径。
// \\?\ 可以告诉 Windows api禁用所有字符串解析，并将后面的字符串直接发送到文件系统。
// https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file#namespaces
path.toNamespacedPath("D:\\soft-dev\\code")
```

### 注意
```js
// 在 POSIX 和 Windows 上使用 path.basename() 可能会产生不同的结果
// 在 POSIX 上：
path.basename("C:\\temp\\file.html"); // 返回: 'C:\\temp\\file.html'

// 在 Windows 上：
path.basename("C:\\temp\\file.html"); // 返回: 'file.html'

// 当使用 Windows 文件路径时，若要在任何操作系统上获得一致的结果，则使用 path.win32
path.win32.basename("C:\\temp\\file.html");

// 当使用 POSIX 文件路径时，若要在任何操作系统上获得一致的结果，则使用 path.posix
path.posix.basename("/tmp/myfile.html");
```

## 格式化、解析
```js
// path.format() 方法从对象返回路径字符串
// 如果提供 pathObject.dir，则忽略 pathObject.root
// 如果 pathObject.base 存在，则忽略 pathObject.ext 和 pathObject.name
path.format({
  root: "/ignored",
  dir: "/home/user/dir",
  base: "file.txt",
  name: "file1",
  ext: ".txt1",
});

// 将路径解析为各个部分
path.parse("/home/user/dir/file.txt");
```

## 规范化

```js
// path.normalize() 方法规范化给定的 path，解析 '..' 和 '.' 片段。(将路径里的 '..' '.' 解析为正确路径)
// 当找到多个连续的路径片段分隔符（例如 POSIX 上的 / 和 Windows 上的 \ 或 /）时，
// 则它们将被平台特定路径片段分隔符（POSIX 上的 / 和 Windows 上的 \）的单个实例替换。 保留尾随的分隔符。
path.normalize("/foo/bar//baz/asdf/quux/..");
```
