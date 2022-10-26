// 域名表示格式：当前域长度 + 当前域内容 +  当前域长度 + 当前域内容 + 当前域长度 + 当前域内容 + 0
// 例子: 长度 04 内容(63 6f 64 65) 长度 0c 内容(64 61 76 69 6e 63 69 6d)
const dgram = require("dgram");

function parseHost(msg) {
  let length = msg.readUInt8(0);

  let offset = 1;
  let host = "";

  while (length !== 0) {
    const content = msg.subarray(offset, offset + length);

    host += content.toString();

    // 设置下一个的位置
    offset += length;
    length = msg.readUInt8(offset);
    offset += 1;

    if (length !== 0) host += ".";
  }
  return host;
}

// 创建一个新的 UDP 发送给域名服务器 然后转发给对应的软件
function forward(msg, rinfo, server) {
  const client = dgram.createSocket("udp4");
  client.on("error", (err) => {
    console.log(`client error:\n${err.stack}`);
    client.close();
  });

  client.on("message", (fbMsg, fbRinfo) => {
    server.send(
      fbMsg,
      rinfo.port,
      rinfo.address,
      (err) => err && console.log(err)
    );

    client.close();
  });

  // 向阿里 DNS 发起请求
  client.send(msg, 53, "223.5.5.5", (err) => {
    if (err) {
      console.log(err);
      client.close();
    }
  });
}

// 将 src 的内容复制到 dst 上
function copyBuffer(content, offset, result) {
  for (let i = 0; i < content.length; ++i) {
    result.writeUInt8(content.readUInt8(i), offset + i);
  }
}

// 自定义 IP 并将 DNS 格式的消息返回
function customResolve(msg, rinfo, server) {
  const queryInfo = msg.subarray(12);
  const response = Buffer.alloc(28 + queryInfo.length);
  let offset = 0;

  // Transaction ID 0-2
  const id = msg.subarray(0, 2);
  copyBuffer(id, 0, response);
  offset += id.length;

  // BE 大端序
  // Flags
  response.writeUInt16BE(0x8180, offset);
  offset += 2;

  // Questions
  response.writeUInt16BE(1, offset);
  offset += 2;

  // Answer RRs
  response.writeUInt16BE(1, offset);
  offset += 2;

  // Authority RRs & Additional RRs
  response.writeUInt32BE(0, offset);
  offset += 4;
  copyBuffer(queryInfo, offset, response);
  offset += queryInfo.length;

  // offset to domain name
  response.writeUInt16BE(0xc00c, offset);
  offset += 2;
  const typeAndClass = msg.subarray(msg.length - 4);
  copyBuffer(typeAndClass, offset, response);
  offset += typeAndClass.length;

  // TTL, in seconds
  response.writeUInt32BE(600, offset);
  offset += 4;

  // Length of IP
  response.writeUInt16BE(4, offset);
  offset += 2;

  "11.22.33.44".split(".").forEach((value) => {
    response.writeUInt8(parseInt(value), offset);
    offset += 1;
  });

  // 发送给 对应的软件解析到的 IP
  server.send(response, rinfo.port, rinfo.address, (err) => {
    if (err) {
      console.log(err);
      server.close();
    }
  });
}

exports.customResolve = customResolve;
exports.parseHost = parseHost;
exports.forward = forward;
