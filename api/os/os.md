# os

## 常量

```js
// 用于错误码、进程信号等的常用操作系统特定常量。
// http://nodejs.cn/api-v12/os.html#os_os_constants_1
os.constants;
```

## 目录、信息、平台
```js
// 操作系统特定的行尾标记。
// POSIX 上是 \n
// Windows 上是 \r\n
os.EOL;

// 编译 Node.js 二进制文件的 CPU 的字节序的字符串。
// 可能的值是大端序的 'BE' 和小端序的 'LE'。
os.endianness();

// 返回当前用户的主目录的字符串路径。
// 在 POSIX 上，它使用 $HOME 环境变量（如果已定义）。 否则，它使用有效的 UID 来查找用户的主目录。
// 在 Windows 上，它使用 USERPROFILE (C:\Users\ta) 环境变量（如果已定义）。 否则，它使用当前用户的配置文件目录的路径。
os.homedir();

// 返回操作系统默认的临时文件的目录
// C:\Users\ta\AppData\Local\Temp
os.tmpdir();

// 返回有关当前有效用户的信息。 在 POSIX 平台上，这通常是密码文件的子集。
// 返回的对象包括 username、uid、gid、shell 和 homedir。 在 Windows 上，uid 和 gid 字段是 -1，而 shell 是 null。 homedir:C:\\Users\\ta
// os.userInfo() 返回的 homedir 的值由操作系统提供。 这与 os.homedir() 的结果不同，后者在回退到操作系统响应之前查询主目录的环境变量。
// 如果用户没有 username 或 homedir，则抛出 SystemError。
os.userInfo({ encoding: "utf-8" });

// 标识操作系统平台的字符串。
// 'aix'、'darwin'、'freebsd'、'linux'、'openbsd'、'sunos' 和 'win32'。
// 返回值相当于 process.platform。
// 如果 Node.js 是在安卓操作系统上构建的，则也可能返回值 'android'。
os.platform();

// 返回的操作系统名称。
// Linux 上返回 'Linux'
// macOS 上返回 'Darwin'
// Windows 上返回 'Windows_NT'。
os.type();

// 主机名 例如：MiniOcean404-Y900P
os.hostname();

// 操作系统内核版本
// 例如：Windows 10 Home China
os.version();

// 以秒为单位返回系统正常运行时间。
os.uptime();
```

## 网络
```js
// 返回包含已分配网络地址的网络接口的对象。
// 返回对象上的每个键都标识一个网络接口。 关联的值是每个对象描述一个分配的网络地址的对象数组。
// 分配的网络地址对象上可用的属性包括：
//  address <string> 分配的 IPv4 或 IPv6 地址
//  netmask <string> IPv4 或 IPv6 网络掩码
//  family <string> 网络类型 IPv4 或 IPv6
//  mac <string> 网络接口的 MAC 地址
//  internal <boolean> 如果网络接口是不能远程访问的环回或类似接口，则为 true；否则为 false
//  scopeid <number> 数字的 IPv6 范围 ID（仅在 family 为 IPv6 时指定）
//  cidr <string> 使用 CIDR 表示法的路由前缀分配的 IPv4 或 IPv6 地址。 如果 netmask 无效，则此属性设置为 null。
// ip: Windows 为 WLAN 下的 ipv4、Mac 为 eth0 下的 ipv4
os.networkInterfaces();
```

## 内存、性能负载、CPU
```js
// 以整数形式返回系统内存总量（以字节为单位）
os.totalmem();

// 整数形式返回空闲的系统内存量（以字节为单位）
os.freemem();

// 操作系统 CPU 架构。 可能的值为 'arm'、'arm64'、'ia32'、'mips'、'mipsel'、'ppc'、'ppc64'、's390'、's390x'、'x32' 和 'x64'。
// 值相当于 process.arch。
os.arch();

// 返回包含有关每个逻辑 CPU 内核的信息的对象数组。
// model <string>
// speed <number> （以兆赫为单位）
// times <Object>
//  user <number> CPU 在用户模式下花费的毫秒数。
//  nice <number> CPU 在良好模式下花费的毫秒数。
//  sys <number> CPU 在系统模式下花费的毫秒数。
//  idle <number> CPU 在空闲模式下花费的毫秒数。
//  irq <number> CPU 在中断请求模式下花费的毫秒数。
os.cpus();

// 返回包含 1、5 和 15 分钟平均负载的数组。
// 平均负载是操作系统计算的系统活动量度，并表示为小数。
// 平均负载是 Unix 特有的概念。 在 Windows 上，返回值始终为 [0, 0, 0]。
os.loadavg();
```

## 进程权重
```js
// pid 要为其检索调度优先级的进程 ID。 Default 0
// 返回由 pid 指定的进程的调度优先级。 如果未提供 pid 或为 0，则返回当前进程的优先级
os.getPriority(0);

// 尝试为 pid 指定的进程设置调度优先级。
// pid <integer> 要为其设置调度优先级的进程 ID。 Default 0。
// priority <integer> 分配给进程的调度优先级。
// priority 输入必须是 -20（高优先级）和 19（低优先级）之间的整数。
// 由于 Unix 优先级和 Windows 优先级之间的差异，priority 映射到 os.constants.priority 中的六个优先级常量之一。
// 当检索进程优先级时，此范围映射可能会导致返回值在 Windows 上略有不同。 为避免混淆，请将 priority 设置为优先级常量之一。
// 在 Windows 上，将优先级设置为 PRIORITY_HIGHEST 需要提升用户权限。 否则设置的优先级将被静默地降低到 PRIORITY_HIGH。
os.setPriority(0, os.constants.priority.PRIORITY_HIGHEST);
```

## 其他 
```js
// TODO 感觉没用
// 以字符串形式返回操作系统。
// 在 POSIX 系统上，操作系统版本是通过调用 uname(3) 来确定的。 在 Windows 上，使用 GetVersionExW()。
os.release();
```
