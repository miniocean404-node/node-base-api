# Duplex 双工流、Transform 转换流
## 简介
1. 双工流是同时实现 Readable 和 Writable 接口的流。
    Duplex 流的示例包括：
     * TCP 套接字
     * 压缩流
     * 加密流
2. 转换流是 Duplex 流，其中输出以某种方式与输入相关。 与所有 Duplex 流一样，Transform 流实现了 Readable 和 Writable 接口。
   Transform 流的示例包括：
     * 压缩流
     * 加密流
## 转换流
```js
// 销毁流，并可选择地触发 'error' 事件。 在此调用之后，转换流将释放任何内部资源。 
// 实现者不应覆盖此方法，而应实现 readable._destroy()。 Transform 的 _destroy() 的默认实现也会触发 'close'，除非 emitClose 设置为 false。
// 返回: <this>
transform.destroy(new Error('转换流错误'))
```
