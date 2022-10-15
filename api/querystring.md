# URL 编码解码、解析格式化

## 编码解码
```js
// URL 编码
qs.escape("http://nodejs.cn/api-v12/querystring.html#query-string");

// URL 解码
qs.unescape(
"http%3A%2F%2Fnodejs.cn%2Fapi-v12%2Fquerystring.html%23query-string"
);
```

## 解析格式化
```js
// url , 参数分隔符 ， 值相等符
qs.parse("http://nodejs.cn/api-v12/querystring.html?a=1&b=2", "&", "=", {
decodeURIComponent: qs.unescape, // 默认解码器
maxKeys: 1000, // 解析的最大键数。 指定 0 以删除键的计数限制。
});

qs.stringify({ foo: "bar", baz: ["qux", "quux"], corge: "" }, "&", "=", {
encodeURIComponent: qs.escape,
});
```
