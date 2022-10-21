# DNS

## 构造
```js
// 域名系统请求的独立解析器,可以使用 dns 模块中的以下方法：
// resolver.getServers()
// resolver.resolve()
// resolver.resolve4()
// resolver.resolve6()
// resolver.resolveAny()
// resolver.resolveCname()
// resolver.resolveMx()
// resolver.resolveNaptr()
// resolver.resolveNs()
// resolver.resolvePtr()
// resolver.resolveSoa()
// resolver.resolveSrv()
// resolver.resolveTxt()
// resolver.reverse()
// resolver.setServers()
// timeout <integer> 查询超时（以毫秒为单位），或 -1 使用默认超时。
const resolver = new dns.Resolver({ timeout: -1 });
resolver.setServers(["223.5.5.5"]);

// 取消此解析器进行的所有未完成的域名系统查询。 相应的回调将被调用，错误码为 ECANCELLED
// resolver.cancel();

resolver.resolve4("www.baidu.com", (err, addresses) => {});

```

## 方法
```js
// 使用操作系统工具来执行名称解析。
// dns 模块中的所有其他函数都连接到实际的域名系统服务器以执行名称解析。 它们将始终使用网络来执行域名系统查询
dns.lookup(
  "www.baidu.com",
  {
    family: 0, // 地址类型，必须是 4、6 或 0。 值 0 表示同时返回 IPv4 和 IPv6 地址。 默认值: 0。
    // dns.ADDRCONFIG: 将返回的地址类型限制为系统上配置的非环回地址类型。 例如，仅当当前系统至少配置了一个 IPv4 地址时，才会返回 IPv4 地址。
    // dns.V4MAPPED: 如果指定了 IPv6 族，但未找到 IPv6 地址，则返回 IPv4 映射的 IPv6 地址。 某些操作系统（例如 FreeBSD 10.1）不支持它。
    // dns.ALL: 如果指定了 dns.V4MAPPED，则返回解析的 IPv6 地址以及 IPv4 映射的 IPv6 地址。
    hints: dns.ADDRCONFIG | dns.ALL,
    all: false, // 当为 true 时，回调返回数组中所有已解析的地址。 否则，返回单个地址。 默认值: false。
    verbatim: false, // 当为 true 时，回调按照 DNS 解析器返回的顺序接收 IPv4 和 IPv6 地址。 当为 false 时，IPv4 地址位于 IPv6 地址之前。 默认值: 当前为 false
  },
  (err, address, family) => {}
);

// 当前配置为用于 DNS 解析。 如果使用自定义端口，则字符串将包含端口部分
// 电脑配置的 DNS
dns.getServers();

// 操作系统的底层 getnameinfo 实现将给定的 address 和 port 解析为主机名和服务
dns.lookupService("127.0.0.1", 80, (err, hostname, service) => {});

// 使用域名系统协议将主机名（例如 'nodejs.org'）解析为资源记录数组。
// callback 函数有参数 (err, records)。 当成功时，records 将是资源记录数组。 个别结果的类型和结构因 rrtype 而异：
// 'A'	IPv4 地址（默认）	<string>	dns.resolve4()
// 'AAAA'	IPv6 地址	<string>	dns.resolve6()
// 'ANY'	任何记录	<Object>	dns.resolveAny()
// 'CNAME'	规范名称记录	<string>	dns.resolveCname()
// 'MX' 	邮件交换记录	<Object>	dns.resolveMx()
// 'NAPTR'	名称授权指针记录	<Object>	dns.resolveNaptr()
// 'NS'	    名称服务器记录	<string>	dns.resolveNs()
// 'PTR'	指针记录	<string>	dns.resolvePtr()
// 'SOA'	起始规范记录	<Object>	dns.resolveSoa()
// 'SRV'	服务记录	<Object>	dns.resolveSrv()
// 'TXT'	文本记录	<string[]>	dns.resolveTxt()
dns.resolve("127.0.0.1", "A", (err, records) => {});
dns.resolveAny("www.baidu.com", (err, ret) => {
  // ret :
  // 'A'	address/ttl
  // 'AAAA'	address/ttl
  // 'CNAME'	value
  // 'MX'	指向 dns.resolveMx()
  // 'NAPTR'	指向 dns.resolveNaptr()
  // 'NS'	value
  // 'PTR'	value
  // 'SOA'	指向 dns.resolveSoa()
  // 'SRV'	指向 dns.resolveSrv()
  // 'TXT'	此类型的记录包含名为 entries 的数组属性，它指向 dns.resolveTxt()，例如 { entries: ['...'], type: 'TXT' }
});

// 使用域名系统协议为 hostname 解析 IPv4 地址（A 记录）
// ttl <boolean> 检索每条记录的生存时间值 (TTL)。 当为 true 时，回调接收 { address: '1.2.3.4', ttl: 60 } 对象数组而不是字符串数组，TTL 以秒表示。
dns.resolve4("127.0.0.1", { ttl: true }, (err, addresses) => {});
dns.resolve6("127.0.0.1", { ttl: true }, (err, addresses) => {});

// 使用域名系统协议为 hostname 解析 CNAME 记录。
dns.resolveCname("www.baidu.com", (err, addresses) => {});

// 使用域名系统协议解析 hostname 的邮件交换记录（MX 记录）。 传给 callback 函数的 addresses 参数将包含其中包含 priority 和 exchange 属性（例如 [{priority: 10, exchange: 'mx.example.com'}, ...]）的对象数组。
dns.resolveMx("www.baidu.com", (err, addresses) => {});

// 使用域名系统协议为 hostname 解析基于正则表达式的记录（NAPTR 记录）
// addresses 参数将包含具有以下属性的对象数组:
// {
//     flags: 's',
//         service: 'SIP+D2U',
//     regexp: '',
//     replacement: '_sip._udp.example.com',
//     order: 30,
//     preference: 100
// }
dns.resolveNaptr("www.baidu.com", (err, addresses) => {});

// 使用域名系统协议为 hostname 解析名称服务器记录（NS 记录）。 传给 callback 函数的 addresses 参数将包含可用于 hostname（例如 ['ns1.example.com', 'ns2.example.com']）的名称服务器记录数组。
dns.resolveNs("www.baidu.com", (err, addresses) => {});

// 使用域名系统协议解析 hostname 的指针记录（PTR 记录）addresses 参数将是包含回复记录的字符串数组。
dns.resolvePtr("www.baidu.com", (err, addresses) => {});

// 使用域名系统协议来解析 hostname 的起始规范记录（SOA 记录）。 传给 callback 函数的 address 参数将是具有以下属性的对象：
// {
//     nsname: 'ns.example.com',
//     hostmaster: 'root.example.com',
//     serial: 2013101809,
//     refresh: 10000,
//     retry: 2400,
//     expire: 604800,
//     minttl: 3600
// }
dns.resolveSoa("www.baidu.com", (err, addresses) => {});

// 使用域名系统协议解析 hostname 的服务记录（SRV 记录）。 传给 callback 函数的 addresses 参数将是具有以下属性的对象数组：
// {
//     priority: 10,
//     weight: 5,
//     port: 21223,
//     name: 'service.example.com'
// }
dns.resolveSrv("www.baidu.com", (err, addresses) => {});

// 使用域名系统协议为 hostname 解析文本查询（TXT 记录）。 传给 callback 函数的 records 参数是可用于 hostname（例如 [ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]）的文本记录的二维数组。
dns.resolveTxt("www.baidu.com", (err) => {});

// 执行反向域名系统查询，将 IPv4 或 IPv6 地址解析为主机名数组
dns.reverse("127.0.0.1", (err, hostnames) => {});

// 设置执行 DNS 解析时要使用的服务器的 IP 地址和端口。 servers 参数是 RFC 5952 格式的地址数组。 如果端口是 IANA 默认 DNS 端口 (53)
// 在进行域名系统查询时不得调用 dns.setServers() 方法。
// 此方法的工作方式与 resolve.conf 非常相似。如果尝试使用提供的第一个服务器进行解析导致 NOTFOUND(没有找到) 错误，则 resolve() 方法将不会尝试使用提供的后续服务器进行解析。
// 仅当较早的域名系统服务器超时或导致其他错误时，才会使用后备域名系统服务器。
dns.setServers([
  "4.4.4.4",
  "[2001:4860:4860::8888]",
  "4.4.4.4:1053",
  "[2001:4860:4860::8888]:1053",
]);
```
