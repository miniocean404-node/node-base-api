# HTTP

## 常量
```js
// 所有标准 HTTP 响应状态代码的集合，以及每个的简短描述。
http.STATUS_CODES;
// 解析器支持的 HTTP 方法列表。
http.METHODS;

// Agent 的全局实例，用作所有 HTTP 客户端请求的默认值。
http.globalAgent

// 只读属性，指定 HTTP 标头的最大允许大小（以字节为单位）。 默认为 8KB。 可使用 --max-http-header-size 命令行选项进行配置。
http.maxHeaderSize
```
