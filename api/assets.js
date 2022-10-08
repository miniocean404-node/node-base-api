// http://nodejs.cn/api-v12/assert.html#assertvalue-message

import assert from "assert";

// 生成 AssertionError(断言错误)，以便稍后比较错误信息：
const assertionError = new assert.AssertionError({
  actual: 1, // 实际
  expected: 2, // 期待
  operator: "strictEqual", // 操作
});

// 验证错误的输出：
try {
  assert.strictEqual(1, 2);
} catch (err) {
  assert(err instanceof assert.AssertionError);
  assert.strictEqual(err.message, assertionError.message);
  assert.strictEqual(err.name, "AssertionError");
  assert.strictEqual(err.actual, assertionError.actual);
  assert.strictEqual(err.expected, assertionError.expected);
  assert.strictEqual(err.code, assertionError.code);
  assert.strictEqual(err.operator, assertionError.operator);
  assert.strictEqual(err.generatedMessage, assertionError.generatedMessage);
}

assert(true, "断言false时提醒，== 断言");

// deepEqual 弃用
assert.strictEqual("1", "1", "不相等时候断言错误");
assert.notDeepEqual(1, 2, "两个值相等");

// deepStrictEqual 比较详情：
// 使用 Object.is() 使用的 SameValue 比较来比较原始值
// 对象的类型标签，自有属性，对象的 [[Prototype]] 使用严格相等比较进行比较
// Object 属性是无序比较的。
// 也比较了可枚举的自有 Symbol 属性。
// Map 键和 Set 项是无序比较的。
// Error 名称和消息总是被比较，即使它们不是可枚举的属性。
// 对象封装器作为对象和未封装的值进行比较。
// 当双方不同或双方遇到循环引用时，则递归停止。
// WeakMap 和 WeakSet 的比较不依赖于它们的值。
assert.deepStrictEqual({ a: 1 }, { a: 1 }, "两个值不一致时提示");
// 与 assert.deepStrictEqual 相反
assert.notDeepStrictEqual({ a: 2 }, { a: 1 }, "两个值一致时提示");

// 检查正则有匹配项时断言错误
assert.doesNotMatch("I will pass", /不会匹配/gims, "正则匹配时候报错");
// 检查正则没有匹配项时断言错误
assert.match("I will fail", /fail/);

// 不是 promise 且 promise 拒绝时断言错误
assert.doesNotReject(Promise.resolve(1), SyntaxError).then();
// 不是 promise 且 promise 不是拒绝时断言错误
assert.rejects(Promise.reject("1")).then();

// 函数抛出异常时断言错误
// 第二个值为正则且异常和正则匹配则断言错误
assert.doesNotThrow(() => {}, TypeError, "抛出了异常");
assert.doesNotThrow(
  () => "抛出 new throw new TypeError 且和正则相同",
  /错误值/,
  "抛出了异常"
);
// 抛出的错误 和 第二个参数不一致，或者和错误消息和二个参数正则不匹配 则 断言错误
assert.throws(() => {
  throw new TypeError();
}, /TypeError/);

// 直接断言错误，展示提示
// assert.fail("错误");
// 值不为真时错误
assert.ok(1, "值是否为真");

// 如果 value 不是 undefined 或 null，则断言错误
assert.ifError(null);
