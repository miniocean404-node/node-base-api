# net

## 注意
创建的连接中使用 path 参数的是 ipc 连接，端口的是 tcp 连接

## 方法
```js
// 测试输入是否为 IP 地址。 对于无效字符串返回 0，对于 IP 版本 4 的地址返回 4，对于 IP 版本 6 的地址返回 6。
net.isIP('')

// 如果输入是版本 4 的 IP 地址，则返回 true，否则返回 false。
net.isIPv4('')

// 如果输入是版本 6 的 IP 地址，则返回 true，否则返回 false。
net.isIPv6('')
```
