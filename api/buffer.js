// 编码格式
// utf8:当将 Buffer 解码为不完全包含有效 UTF-8 数据的字符串时，则 Unicode 替换字符 U+FFFD � 将用于表示这些错误。
// utf16le:与 'utf8' 不同，字符串中的每个字符都将使用 2 或 4 个字节进行编码。 Node.js 仅支持 UTF-16 的小端序变体
// latin1:代表 ISO-8859-1,此字符编码仅支持 U+0000 至 U+00FF 的 Unicode 字符。 每个字符都使用单个字节进行编码。 不符合该范围的字符将被截断并映射到该范围内的字符。
// base64: Base64 编码。 当从字符串创建 Buffer 时，此编码还将正确接受 RFC 4648，第 5 节中指定的 "URL 和文件名安全字母表"。 base64 编码的字符串中包含的空白字符（例如空格、制表符和换行符）会被忽略。
// hex: 将每个字节编码为两个十六进制字符。 当解码仅包含有效十六进制字符的字符串时，可能会发生数据截断。
// 还支持以下旧版字符编码：
// ascii: 仅适用于 7 位 ASCII 数据。 当将字符串编码为 Buffer 时，这等效于使用 'latin1'。 当将 Buffer 解码为字符串时，使用此编码将在解码为 'latin1' 之前额外取消设置每个字节的最高位。 通常，没有理由使用此编码，因为在编码或解码纯 ASCII 文本时，'utf8'（或者，如果已知数据始终是纯 ASCII，则为 'latin1'）将是更好的选择。 它仅用于旧版兼容性。
// binary: 'latin1' 的别名。 有关此主题的更多背景信息，请参阅二进制字符串。 此编码的名称很容易让人误解，因为这里列出的所有编码都在字符串和二进制数据之间进行转换。 对于字符串和 Buffer 之间的转换，通常 'utf-8' 是正确的选择。
// ucs2: 'utf16le' 的别名。 UCS-2 过去指的是 UTF-16 的一种变体，它不支持代码点大于 U+FFFF 的字符。 在 Node.js 中，始终支持这些代码点。

// 手动分配 buffer 内存，不会使用预先分配的 buffer 池
import * as buffer from "buffer";

const buf1 = Buffer.alloc(10, 3, "base64");

// 用于池的预分配内部 Buffer 实例的大小（以字节为单位）。 该值可以修改
Buffer.poolSize;

// buffer 的字节数
buf1.length;
// buffer 底层 ArrayBuffer 对象
buf1.buffer;
// buffer 底层 ArrayBuffer 对象的 byteOffset
buf1.byteOffset;
// 返回迭代器 index value
buf1.entries();
// 返回 buffer 的 index
buf1.keys();
// 返回 buffer 的 value
buf1.values();
// buffer 的 json 表示形式，Buffer.from() 接受从此方法返回的格式的对象。
buf1.toJSON();
// 根据 encoding 中指定的字符编码将 buf 解码为字符串。 start 和 end 可以传入仅解码 buf 的子集
// 如果 encoding 是 'utf8' 并且输入中的字节序列不是有效的 UTF-8，则每个无效字节都将替换为替换字符 U+FFFD。
buf1.toString("utf8", 0, 3);
// 根据 encoding 中的字符编码将 string 写入 buf 的 offset 处。 length 参数是要写入的字节数（写入的字节数不会超过 buf.length - offset）。
// 如果 buf 没有足够的空间来容纳整个字符串，则只会写入 string 的一部分。 但是，不会写入部分编码的字符。
buf1.write("str", 0, 2, "utf8");

// 使用 Buffer.alloc() 来用零初始化 Buffer 实例
// Buffer 模块预先分配了大小为 Buffer.poolSize 的内部 Buffer 实例作为池，用于快速分配使用 Buffer.allocUnsafe()、Buffer.from(array)、Buffer.concat() 创建的新 Buffer 实例，
// 仅当 size 小于或等于 Buffer.poolSize >> 1（Buffer.poolSize 除以二再向下取整）时才使用弃用的 new Buffer(size) 构造函数。
const buf2 = Buffer.allocUnsafe(10);

// 使用 buf.fill(0) 用零初始化此类 Buffer 实例
// 如果 size 大于 buffer.constants.MAX_LENGTH 或小于 0，则抛出 ERR_INVALID_OPT_VALUE
const buf3 = Buffer.allocUnsafeSlow(10);

// 当 string 为 Buffer/DataView/TypedArray/ArrayBuffer/SharedArrayBuffer 时，返回 .byteLength 报告的字节长度。
const buf4 = Buffer.byteLength("11", "utf-8");

// 返回新的 Buffer，它是将 list 中的所有 Buffer 实例连接在一起的结果
const buf5 = Buffer.concat([buf1, buf2], buf1.length + buf2.length);

// 相当于调用 buf1.compare(buf2)
const result = buf1.compare(buf2);

// 使用 0 – 255 范围内的字节 array 分配新的 Buffer。 该范围之外的数组条目将被截断 , 2,3参数为 指定了 arrayBuffer 中将由 Buffer 共享的内存范围
// 如果第一个参数是 arrayBuffer 那么将使用这个对象 ，如果是 buffer 则直接进行复制
// 第一个参数可以是对象，会调用 valueOf
const buf6 = Buffer.from([0, 0, 0], 0, 2);
// 创建包含 string 的新 Buffer。 encoding 参数标识将 string 转换为字节时要使用的字符编码
const buf7 = Buffer.from("7468697320697320612074c3a97374", "hex");

// 判断是否是 buffer
Buffer.isBuffer(buf1);

// buffer 的编码格式
Buffer.isEncoding("utf-8");

// 从参数 1 中的 0 的位置复制到 buf1 的4-10的位置
buf1.copy(Buffer.from([1, 2]), 0, 4, 10);

// 两个值是否有完全相同的 buffer
buf1.equals(buf1);

// 值，跳过的字节数，结束位置（不包括），如果是参数1是字符串的编码
const buf8 = Buffer.allocUnsafe(10).fill("h");

// 是否包含：搜索的值，开始搜索的位置，值为字符串的编码形式
const isInclude = buf1.includes(buf1);

// 包含的索引值：搜索的值，开始搜索的位置，值为字符串的编码形式
const index = buf1.indexOf("is");

// 最后一次出现的 value：搜索的值，开始搜索的位置，值为字符串的编码形式
const index2 = buf1.lastIndexOf("is");

// 返回新的 Buffer，其引用与原始缓冲区相同的内存，但由 start 和 end 索引进行偏移和裁剪。
const buf9 = buf1.subarray(0, 3);

// 返回新的 Buffer，其引用与原始缓冲区相同的内存，但由 start 和 end 索引进行偏移和裁剪。
const buf10 = buf1.slice(0, 3);

// 虽然 Buffer 对象可作为全局对象使用，但还有其他与 Buffer 相关的 API 仅可通过使用 require('buffer') 访问的 buffer 模块使用。
// 返回调用 buf.inspect() 时将返回的最大字节数。
// 默认值: 50
buffer.INSPECT_MAX_BYTES;

// buffer.constants.MAX_LENGTH 的别名。
// 单个 Buffer 实例允许的最大大小。
buffer.kMaxLength;

// 将给定的 Buffer 或 Uint8Array 实例从一种字符编码重新编码为另一种。 返回新的 Buffer 实例。
const buf11 = buffer.transcode(Buffer.from("€"), "utf8", "ascii");

// 常量
// 单个 Buffer 实例允许的最大大小。
buffer.constants.MAX_LENGTH;
// 单个 string 实例允许的最大长度。
buffer.constants.MAX_STRING_LENGTH;
