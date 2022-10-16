# URL 类

## 属性
```js
const url = new URL(
    "/foo",
    "protocol://username:password:hostname:port/pathname/pathname?key=value&key1=value1#hash"
);

// 获取和设置序列化的网址。
// 相当于调用 url.toString()。
// 将此属性的值设置为新值相当于使用 new URL(value) 创建新的 URL 对象。 URL 对象的每个属性都将被修改。
url.href;
url.toString();
url.toJSON();

// protocol
url.protocol;

// username
url.username;

// password
url.password;

// protocol://hostname
url.origin;

// hostname:port
url.host;

// hostname
url.hostname;

// port
url.port;

// pathname/pathname
url.pathname;

// ?key=value&key1=value1
url.search;

// URLSearchParams 获取编码后的参数
// ?key=value&key1=value1
url.searchParams;

// # 后边部分
url.hash;
```

## 方法 
```js
// domain 的 Punycode ASCII 序列化。
// 打印 xn--espaol-zwa.com
url.domainToASCII("español.com");

// domain 的 Unicode 序列化。
url.domainToUnicode("xn--espaol-zwa.com");

// 要转换为路径的文件网址字符串或网址对象
// 返回: <string> 完全解析的特定于平台的 Node.js 文件路径。
url.fileURLToPath("file:///C:/path/");

// 转换为文件网址
// 在转换为文件网址时正确编码网址控制字符
url.pathToFileURL(__filename);

// 格式化网址，删除不需要的参数
url.format(myURL, {
    fragment: false, // 是否包含 hash
    unicode: true, // true 就不使用 asscl 编码
    auth: false, // 是否还需要 username,password
    search: false, // 是否包含 ? 后边的查询条件
});
```

# URLSearchParams 类
URLSearchParams 接口和 querystring 模块具有相似的用途，但 querystring 模块的用途更通用，因为它允许自定义的分隔符（& 和 =）。 
换句话说，URLSearchParams 类 纯粹是为网址查询字符串而设计。

## 基本使用
```js
// 前导 '?'（如果存在）将被忽略
const params = new URLSearchParams("?user=abc&query=xyz");

// 与 querystring 模块不同，不允许以数组值的形式出现重复的键。 数组使用 array.toString() 字符串化，它简单地用逗号连接所有数组元素。
const params1 = new URLSearchParams({
  user: "abc",
  query: ["first", "second"],
});

// 支持任何可迭代的对象 包括 yield ，set
const params2 = new URLSearchParams([
  ["user", "abc"],
  ["query", "first"],
  ["query", "second"],
]);
```

## 设置
```js
// 将新的名称-值对追加到查询字符串。
params.append("key", "value");

// 如果存在任何名称为 name 的预先存在的名称-值对，则将第一个此类对的值设置为 value 并删除所有其他名称。 如果没有，则将名称-值对追加到查询字符串。
params.set("key", "value");
```

## 删除 
```js
// 删除名称为 name 的所有名称-值对。
params.delete("key");
```

## 获取
```js
const [key, value] = params.entries();

const [key1] = params.keys();

const [value1] = params.values();

// fn <Function> 为查询中的每个名称-值对调用
// thisArg <Object> 在调用 fn 时用作 this 值
params.forEach((value, key, searchParams) => {}, this);

params.get("key");
// 返回名称为 name 的所有名称-值对的值。 如果没有这样的对，则返回空数组。
params.getAll("key");
```

## 其他
```js
// 如果至少有一个名称-值对的名称为 name，则返回 true。
params.has("key");

// 按名称对所有现有的名称-值对进行就地排序。 排序是使用稳定排序算法完成的，因此保留了具有相同名称的名称-值对之间的相对顺序。
// 该方法尤其可用于增加缓存命中。
params.sort();

// 返回序列化为字符串的搜索参数，必要时使用百分比编码的字符
params.toString();
```
