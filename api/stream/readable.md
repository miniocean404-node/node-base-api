# 可写流

## 简介
1. Readable 流以两种模式之一有效地运行：流动和暂停。 这些模式与对象模式是分开的。 Readable 流可以处于或不处于对象模式，无论其是处于流动模式还是暂停模式。
   * 在流动模式下，数据会自动从底层系统读取，并通过 EventEmitter 接口使用事件尽快提供给应用程序。
   * 在暂停模式下，必须显式调用 stream.read() 方法以从流中读取数据块。
2. 所有的 Readable 流都以暂停模式开始，但可以通过以下方式之一切换到流动模式
   * 添加 'data' 事件句柄。
   * 调用 `stream.resume()` 方法。
   * 调用 `stream.pipe()` 方法将数据发送到 Writable。
3. Readable 可以使用以下方法之一切换回暂停模式：
   * 如果没有管道目标，则通过调用 `stream.pause()` 方法。
   * 如果有管道目标，则删除所有管道目标。 可以通过调用 `stream.unpipe()` 方法删除多个管道目标。
4. 要记住的重要概念是，在提供消费或忽略该数据的机制之前，Readable 不会产生数据。 如果消费机制被禁用或移除，则 Readable 将尝试停止产生数据。
5. 出于向后兼容性的原因，删除 'data' 事件句柄不会自动暂停流。 此外，如果有管道目标，则调用 stream.pause() 将不能保证一旦这些目标排空并要求更多数据，流将保持暂停状态。
6. 如果 Readable 切换到流动模式并且没有消费者可用于处理数据，则数据将被丢失。 例如，当调用 readable.resume() 方法而没有绑定到 'data' 事件的监听器时，或者当从流中删除 'data' 事件句柄时，就会发生这种情况。
7. 添加 'readable' 事件句柄会自动使流停止流动，并且必须通过 readable.read() 来消费数据。 如果删除了 'readable' 事件句柄，则如果有 'data' 事件句柄，流将再次开始流动。
8. 每个 Readable 都处于三种可能的状态之一：
   * readable.readableFlowing === null 
   * readable.readableFlowing === false 
   * readable.readableFlowing === true
   1. 当 readable.readableFlowing 为 null 时，则不提供消费流数据的机制。 因此，流不会生成数据。 
   在此状态下，为 'data' 事件绑定监听器、调用 readable.pipe() 方法、或调用 readable.resume() 方法会将 readable.readableFlowing 切换到 true，从而使 Readable 在生成数据时开始主动触发事件。、
   2. 调用readable.pause()、readable.unpipe()、或者接收背压都会导致 readable.readableFlowing 被设置为 false，暂时停止事件的流动，但不会停止数据的生成。 
   在此状态下，为 'data' 事件绑定监听器不会将 readable.readableFlowing 切换到 true。
9. 切忌使用多种方式消费单一流中的数据。 具体来说，使用 on('data')、on('readable')、pipe() 或异步迭代器的组合可能会导致不直观的行为。
10. 建议大多数用户使用 readable.pipe() 方法，因为它已被实施以提供使用流数据的最简单方法。 
    需要对数据传输和生成进行更细粒度控制的开发者可以使用 EventEmitter 和 `readable.on('readable')/readable.read()` 或 `readable.pause()/readable.resume()` API。
## 初始化
```js
const rs = stream.Readable({
  highWaterMark: 16384, // 在停止从底层资源读取之前存储在内部缓冲区中的最大字节数
  encoding: null, // 如果指定，则缓冲区将使用指定的编码解码为字符串
  objectMode: false, // 此流是否应表现为对象流。 这意味着 stream.read(n) 返回单个值而不是大小为 n 的 Buffer
  read: () => {}, // stream._read() 方法的实现。
  destroy: () => {}, //  stream._destroy() 方法的实现。
  autoDestroy: false, //  此流是否应在结束后自动调用自身的 .destroy()。 默认值: false。
});
```

## 属性
```js
// 在调用 readable.destroy() 之后是 true。
rs.destroyed;

// 是否可读 可调用 rs.read
rs.readable;

// 可读流的编码
rs.readableEncoding;

// 当触发 'end' 事件时变为 true。
rs.readableEnded;

// 此属性反映了 Readable 流的当前状态
rs.readableFlowing;

// 返回构造此 Readable 时传入的 highWaterMark 的值
rs.readableHighWaterMark;

// 包含队列中准备读取的字节数（或对象数）
rs.readableLength;

// 是否是 ObjectMode 模式
rs.readableObjectMode;
```

## 事件
```js
// 当流及其任何底层资源（例如文件描述符）已关闭时，则会触发 'close' 事件
// 如果 Readable 流是使用 emitClose 选项创建的，则始终会触发 'close' 事件。
rs.on("close", () => {});

// chunk <Buffer> | <string> | <any> 数据块。 对于不在对象模式下操作的流，块将是字符串或 Buffer。 对于处于对象模式的流，块可以是除 null 之外的任何 JavaScript 值。
// 1. 每当流将数据块的所有权移交给消费者时，则会触发 'data' 事件。 每当通过调用 readable.pipe()、readable.resume()、或通过将监听器回调绑定到 'data' 事件而将流切换到流动模式时，就会发生这种情况。
// 每当调用 readable.read() 方法并且可以返回数据块时，也会触发 'data' 事件。
// 2. 将 'data' 事件监听器绑定到尚未显式暂停的流，则会将流切换到流动模式。 数据将在可用时立即传入
// 3. 如果使用 readable.setEncoding() 方法为流指定了默认编码，则监听器回调将把数据块作为字符串传入；否则数据将作为 Buffer 传入。
rs.on("data", () => {});

// 当流中没有更多数据可供消费时，则会触发 'end' 事件。
// 除非数据被完全地消费，否则不会触发 'end' 事件。 这可以通过将流切换到流动模式来实现，或者通过重复调用 stream.read() 直到所有数据都被消费完。
rs.on("end", () => {});

// 由于底层内部故障而无法生成数据，或者当流实现尝试推送无效数据块时，可能会发生这种情况
rs.on("error", (error) => {});

// 1. 当有可从流中读取的数据时，则会触发 'readable' 事件。 在某些情况下，为 'readable' 事件绑定监听器会导致一些数据被读入内部缓冲区。
// 2. 'readable' 事件表明流有新的信息：新的数据可用或已到达流末尾。 在前一种情况下，stream.read() 将返回可用的数据。 在后一种情况下，stream.read() 将返回 null
// 3. 如果同时使用 'readable' 和 'data'，则 'readable' 优先控制流，即只有在调用 stream.read() 时才会触发 'data'。readableFlowing 属性将变为 false。
// 如果在移除 'readable' 时有 'data' 个监听器，则流将开始流动，即 'data' 事件将在不调用 .resume() 的情况下触发。
rs.on("readable", () => {});

// 当调用 stream.resume() 并且 readableFlowing 不是 true 时，则会触发 'resume' 事件
rs.on("resume", () => {});
```

## API
```js

// destination <stream.Writable> 写入数据的目标
// options <Object> 管道选项
// end <boolean> 当读取结束时结束写入。 默认值: true。
// 返回: <stream.Writable> 目标，如果它是 Duplex 或 Transform 流，则允许使用管道链
// 1. 默认情况下，当源 Readable 流触发 'end' 时，则在目标 Writable 流上调用 stream.end()，因此目标不再可写。 要禁用此默认行为，可以将 end 选项作为 false 传入，从而使目标流保持打开状态：
// 2. 有个重要的注意事项，如果 Readable 流在处理过程中触发错误，则 Writable 目标不会自动关闭。 如果发生错误，则需要手动关闭每个流以防止内存泄漏。
// 3. process.stderr 和 process.stdout Writable 流在 Node.js 进程退出之前永远不会关闭，无论指定的选项如何。
rs.pipe(fs.createWriteStream("file.txt"), {
   end: true, // 当读取结束时结束写入
});

// 分离先前使用 stream.pipe() 方法绑定的 Writable 流。
// destination <stream.Writable> 可选的要取消管道的特定流
// 返回: <this>
// 如果未指定 destination，则所有管道都将分离。
rs.unpipe();

// size <number> 用于指定要读取的数据量的可选参数。
// 返回: <string> | <Buffer> | <null> | <any>
// 1. 默认情况下，数据将作为 Buffer 对象返回，除非使用 readable.setEncoding() 方法指定了编码、或者流是在对象模式下操作。
// 2. 流已结束，在这种情况下，将返回内部缓冲区中剩余的所有数据。如果未指定 size 参数，则将返回内部缓冲区中包含的所有数据。
// 3. readable.read() 方法应该只在暂停模式下操作的 Readable 流上调用。 在流动模式下，会自动调用 readable.read()，直到内部缓冲区完全排空。
// 4. 每次调用 readable.read() 都会返回一个数据块或 null。 块不是串联的。 需要 while 循环来消费当前缓冲区中的所有数据。
// 当读取大文件时，.read() 可能会返回 null，到目前为止已经消费了所有缓冲的内容，但是还有更多的数据尚未缓冲。
// 在这种情况下，当缓冲区中有更多数据时，将触发新的 'readable' 事件。 最后，当没有更多数据时，则将触发 'end' 事件。
// 因此，要从 readable 读取文件的全部内容，必须跨越多个 'readable' 事件来收集块
// 5. 对象模式下的 Readable 流将始终从对 readable.read(size) 的调用返回单个条目，而不管 size 参数的值如何。
// 6. 如果 readable.read() 方法返回数据块，则还将触发 'data' 事件。
rs.read(10);

// 显式暂停的 Readable 流恢复触发 'data' 事件，将流切换到流动模式
// 如果有 'readable' 事件监听器，则 readable.resume() 方法不起作用。
// 返回: <this>
rs.resume();

// readable.isPaused() 方法返回 Readable 的当前运行状态。
rs.isPaused();

// readable.pause() 方法将导致处于流动模式的流停止触发 'data' 事件，切换出流动模式。 任何可用的数据都将保留在内部缓冲区中。
rs.pause();

// chunk <Buffer> | <Uint8Array> | <string> | <null> | <any> 要取消转移到读取队列的数据块。 对于不在对象模式下操作的流，chunk 必须是字符串、Buffer、Uint8Array、或 null。 对于对象模式的流，chunk 可以是任何 JavaScript 值。
// encoding <string> 字符串块的编码。 必须是有效的 Buffer 编码，例如 'utf8' 或 'ascii'。
// 1. 将 chunk 作为 null 传入信号流结束 (EOF)，其行为与 readable.push(null) 相同，之后无法写入更多数据。 EOF 信号放在缓冲区的末尾，任何缓冲的数据仍将被刷新。
// 2. readable.unshift() 方法将数据块推回内部缓冲区。 这在某些情况下很有用，其中流被代码消费，需要"取消消耗"它已经从源中提取的一定数量的数据，以便数据可以传给其他方。
// 3. 'end' 事件触发后不能调用 stream.unshift(chunk) 方法，否则会抛出运行时错误。
rs.unshift();

// 以完全消费流。
// 如果循环以 break 或 throw 终止，则流将被销毁。 换句话说，遍历流将完全消费流。 流将以大小等于 highWaterMark 选项的块读取。
// 在上面的代码示例中，如果文件的数据少于 64KB，则数据将位于单个块中，因为没有为 fs.createReadStream() 提供 highWaterMark 选项。
for await (const chunk of fs.createReadStream('file')) {}

// 销毁流 可选地触发 'error' 事件，并且触发 'close' 事件（除非 emitClose 设置为 false）。
// 在此调用之后，可读流将释放任何内部资源，随后对 push() 的调用将被忽略。 实现者不应覆盖此方法，而应实现 readable._destroy()。
rs.destroy(new Error("不可读"));

// 设置流编码
// 默认情况下，没有分配编码，流数据将作为 Buffer 对象返回。 设置编码会导致流数据作为指定编码的字符串而不是 Buffer 对象返回。
rs.setEncoding("utf-8");
```
