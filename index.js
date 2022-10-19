const http = require("http");
const dns = require("dns");
const req = http.request("");

// 当请求被客户端中止时触发。 此事件仅在第一次调用 abort() 时触发。
req.on("abort", () => {});
