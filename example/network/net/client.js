const net = require("net");

// TCP 客户端

// const info = server.address();

const client = net.connect({
  port: 8128,
  host: "127.0.0.1",
  localPort: 31234,
  localAddress: "127.0.0.1",
});

// 接收到数据时触发。 参数 data 将是 Buffer 或 String。 数据的编码由 client.setEncoding() 设置。
client.on("data", (data) => {
  console.log("服务端数据：", data.toString());
});

// 在解析主机名之后但在连接之前触发。 不适用于 Unix 套接字。
client.on("lookup", (err, address, family, host) => {});

// 当成功建立套接字连接时触发。 参见 net.createConnection()。
client.on("connect", () => {});

// 当套接字准备好使用时触发。'connect' 后立即触发。
client.on("ready", () => {
  client.write(`我是 ${client.address()}`, "utf-8", () => {});

  client.end();
});

// 当写缓冲区变空时触发。 可用于限制上传。
client.on("drain", () => {});

// 如果套接字因不活动而超时则触发。 这只是通知套接字已空闲。 用户必须手动关闭连接。
client.on("timeout", () => {});

// 发生错误时触发。 'close' 事件将在此事件之后直接调用。
client.on("error", (err) => {
  console.log("客户端错误:", err);
  client.destroy();
});

// 但是，如果 allowHalfOpen 设置为 true，套接字将不会自动将其可写端 end()，从而允许用户写入任意数量的数据。 用户必须显式调用 end() 来关闭连接（即发回一个 FIN 数据包）。
client.on("end", () => {
  console.log("客户端结束了");
});

// 一旦套接字完全关闭就触发。 参数 hadError 是布尔值，表示套接字是否由于传输错误而关闭。
client.on("close", (hadError) => {
  if (hadError) console.log("客户端有错误");

  console.log("客户端关闭了");

  client.destroy();
});
