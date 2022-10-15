# 字符串解码

```js
import { StringDecoder } from "string_decoder";

const decoder = new StringDecoder("utf8");

// 返回已解码的字符串，确保从返回的字符串中省略 Buffer、TypedArray 或 DataView 末尾中 [任何不完整的多字节字符，并将其存储在内部缓冲区中]，
// 以备下次调用 stringDecoder.write() 或 stringDecoder.end() 时使用。
decoder.write(Buffer.from([0xc2, 0xa2]));

// 以字符串形式返回存储在内部缓冲区中的任何剩余的输入。 表示不完整的 UTF-8 和 UTF-16 字符的字节将被替换为适合字符编码的替换字符
// 如果提供了 buffer 参数，则在返回剩余的输入之前执行对 stringDecoder.write() 的最后一次调用
decoder.end(Buffer.from([0xe2, 0xa2]));
```
