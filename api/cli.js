// 要在终端中将本文档作为手册页查看，则运行 man node。
// 所有选项，包括 V8 选项，都允许用破折号 (-) 或下划线 (_) 分隔单词。例如，--pending-deprecation 等价于 --pending_deprecation。
// - 别名，-- 参数

// 概要
// node [options] [V8 options] [script.js | -e "script" | -] [--] [arguments]
// node inspect [script.js | -e "script" | <host>:<port>] …
//    node --v8-options

// 1. --abort-on-uncaught-exception
// 中止而不是退出会导致使用调试器（例如 lldb、gdb 和 mdb）生成用于事后分析的核心文件
// 如果传入了此标志，则该行为仍然可以设置为不通过 process.setUncaughtExceptionCaptureCallback() 中止（以及通过使用使用它的 domain 模块）

// 2. --completion-bash
// 为 Node.js 打印可源代码的 bash 完成脚本。
// node --completion-bash > node_bash_completion

// 3. --conditions=condition
// 诊断目录：默认为当前工作目录。
// 影响默认输出目录：
// --cpu-prof-dir cpu 分析目录
// --heap-prof-dir 堆分析文件目录
// --redirect-warnings 将进程警告写入给定文件而不是打印到标准错误。 如果文件不存在则创建，如果存在则追加。 如果在尝试将警告写入文件时发生错误，则警告将改为写入标准错误

// 4. --disable-proto=mode
// 禁用原型链

// 5. --disallow-code-generation-from-strings
// 从字符串生成代码的 eval 和 new Function 等内置语言功能抛出异常。 这不会影响 Node.js vm 模块。

// 6. --enable-fips
// 在启动时启用符合 FIPS 的加密。
// fips: 是NIST所发布的针对密码模块的安全需求标准

// 7. --enable-source-maps
// 启用对堆栈跟踪的实验性 Source Map v3 支持。
// 设置 --enable-source-maps 标志时Error.prepareStackTrace忽略并且覆盖 Error.prepareStackTrace

// 8. --experimental-import-meta-resolve
// 启用实验性 import.meta.resolve() 支持

// 9. --experimental-json-modules
// 为 ES 模块加载器启用实验性 JSON 支持。

// 10. --experimental-loader=module
// module 可以是文件路径，也可以是 ECMAScript 模块名称

// 11. --experimental-policy
// 使用指定的文件作为安全策略。

// 12. --experimental-repl-await
// 在交互式解释器中启用实验性的顶层 await 关键字支持。

// 13. --experimental-specifier-resolution=mode
// 设置解析 ES 模块说明符的解析算法。 有效选项为 explicit 和 node。
// 默认为 explicit，需要提供模块的完整路径

// 14. --experimental-vm-modules
// 在 vm 模块中启用实验性 ES 模块支持。

// 15. --experimental-wasi-unstable-preview1
// 启用实验性 WebAssembly 系统接口 (WASI) 支持。

// 16. --experimental-wasm-modules
// 启用实验性 WebAssembly 模块。

// 17. --force-context-aware
// 禁用加载不是上下文感知的原生插件。
// 启用实验性 WebAssembly 模块支持。

// 18. --force-fips
// 在启动时强制执行符合 FIPS 的加密。 （不能从脚本代码中禁用。）（与 --enable-fips 要求相同。）

// 19. --heapsnapshot-signal=signal
// 启用信号句柄，当接收到指定的信号时，它会导致 Node.js 进程写入堆转储。 signal 必须是有效的信号名称。 默认禁用。

// 20. --http-parser=library
// 默认值是llhttp，legacy 已经弃用

// 21. --http-server-default-timeout=milliseconds
// 覆盖 http、https 和 http2 服务器套接字超时的默认值。将该值设置为 0 将禁用服务器套接字超时。除非提供，否则 http 服务器套接字会在 120 秒（2 分钟）后超时。超时的编程设置优先于通过此标志设置的值

// 22. --icu-data-dir=file
// 指定 ICU 数据加载路径。 （覆盖 NODE_ICU_DATA。）

// 23. --input-type=type
// 这将 Node.js 配置为将字符串输入解释为 CommonJS 或 ES 模块。 字符串输入是通过 --eval、--print 或 STDIN 输入的。
// 有效值为 "commonjs" 和 "module"。 默认为 "commonjs"。

// 24. --inspect-brk[=[host:]port]
// 在 host:port 上激活检查器并在用户脚本开始时中断。 默认 host:port 为 127.0.0.1:9229

// 25. --inspect-port=[host:]port
// 在 host:port 上激活检查器 不中断 在通过发送 SIGUSR1 信号激活检查器时很有用。
// 默认主机是 127.0.0.1。

// 26. --inspect-publish-uid=stderr,http
// 指定检查器网络套接字网址的暴露方式。
// 默认情况下，检查器网络套接字网址在标准错误和 http://host:port/json/list 上的 /json/list 端点下可用。

// 27. --insecure-http-parser
// 使用接受无效 HTTP 标头的不安全 HTTP 解析器。 这可能允许与不一致的 HTTP 实现的互操作性。 它还可能允许请求走私和其他依赖于接受无效标头的 HTTP 攻击。
// 避免使用此选项。

// 28. --jitless
// 禁用可执行内存的运行时分配。 出于安全原因，某些平台可能需要这样做。 在其他平台上也可以减少攻击面，但性能影响可能比较严重。

// 29. --max-http-header-size=size
// 指定 HTTP 标头的最大大小（以字节为单位）。 默认为 8KB。

// 30. --no-deprecation
// 静默弃用警告。

// 31. --no-force-async-hooks-checks
// 禁用 async_hooks 的运行时检查。 当启用 async_hooks 时，这些仍然会动态启用。

// 32. --no-warnings
// 静默所有进程警告（包括弃用的）。

// 33. --openssl-config=file
// 在启动时加载 OpenSSL 配置文件。 除其他用途外，如果 Node.js 是使用 ./configure --openssl-fips 构建的，则可用于启用符合 FIPS 的加密。

// 34. --pending-deprecation
// 触发挂起的弃用警告。
// 待弃用用于提供一种选择性的"早期警告"机制，开发者可以利用该机制来检测弃用的 API 的使用情况。

// 35. --preserve-symlinks
// 指示模块加载器在解析和缓存模块时保留符号链接。
// 默认情况下，当 Node.js 从符号链接到不同磁盘位置的路径加载模块时，Node.js 将取消引用该链接并使用模块的实际磁盘“真实路径”作为既是标识符又是定位其他依赖模块的根路径。
// 在大多数情况下，这种默认行为是可以接受的。 但是，当使用符号链接的对等依赖项时，如下例所示，如果 moduleA 尝试要求 moduleB 作为对等依赖项，则默认行为会引发异常：
// {appDir}
//  ├── app
//  │   ├── index.js
//  │   └── node_modules
//  │       ├── moduleA -> {appDir}/moduleA 引用 appDir 后又引用
//  │       └── moduleB
//  │           ├── index.js
//  │           └── package.json
//  └── moduleA
//      ├── index.js
//      └── package.json
// 但是请注意，使用 --preserve-symlinks 会产生其他副作用。 具体来说，如果这些模块是从依赖树中的多个位置链接的，那么符号链接的原生模块可能无法加载（Node.js 会将它们视为两个单独的模块，并会尝试多次加载该模块，从而导致异常被抛出）
// --preserve-symlinks 标志不适用于允许 node --preserve-symlinks node_module/.bin/<foo> 工作的主模块。 要对主模块应用相同的行为，也请使用 --preserve-symlinks-main。

// 36. --preserve-symlinks-main
// 指示模块加载器在解析和缓存主模块 (require.main) 时保留符号链接。
// 此标志的存在是为了让主模块可以选择加入 --preserve-symlinks 为所有其他导入提供的相同行为；但是，它们是单独的标志，以便与旧的 Node.js 版本向后兼容。

// 37. --prof
// 生成 V8 分析器输出。

// 38. --prof-process
// 处理使用 V8 选项 --prof 生成的 V8 分析器输出。

// 39. --redirect-warnings=file
// 将进程警告写入给定文件而不是打印到标准错误。 如果文件不存在则创建，如果存在则追加。 如果在尝试将警告写入文件时发生错误，则警告将改为写入标准错误

// 40. --report-compact
// 以紧凑的单行 JSON 格式编写报告，与专为人类使用而设计的默认多行格式相比，日志处理系统更易于使用。

// 41. --report-dir=directory, report-directory=directory
// 生成报告的位置。

// 42. --report-filename=filename
// 将写入报告的文件的名称。

// 43. --report-on-fatalerror
// 使报告能够在导致应用程序终止的致命错误（Node.js 运行时中的内部错误，例如内存不足）时触发。 用于检查各种诊断数据元素，例如堆、堆栈、事件循环状态、资源消耗等 推断致命错误。

// 44. --report-on-signal
// 在接收到正在运行的 Node.js 进程的指定（或预定义）信号时生成报告。 触发报告的信号通过 --report-signal 指定。

// 45. --report-signal=signal
// 设置或重置报告生成信号（Windows 不支持）。 默认信号为 SIGUSR2。

// 46. --report-uncaught-exception
// 启用对未捕获的异常生成报告。 在结合原生堆栈和其他运行时环境数据检查 JavaScript 堆栈时很有用。

// 47. --throw-deprecation
// 为弃用抛出错误。

// 48. --title=title
// 在启动时设置 process.title。

// 49. --tls-cipher-list=list
// 指定替代的默认 TLS 密码列表。 需要使用加密支持构建 Node.js（默认）。

// 50. --tls-keylog=file
// 将 TLS 密钥材料记录到文件中。 密钥材料为 NSS SSLKEYLOGFILE 格式，可被软件（如 Wireshark）用于解密 TLS 流量。

// 51. --tls-max-v1.2 --tls-max-v1.3
// 将 tls.DEFAULT_MAX_VERSION 设置为 'TLSv1.2'。

// 52. --tls-min-v1.0 --tls-min-v1.1 --tls-min-v1.2 --tls-min-v1.3
// 将默认的 tls.DEFAULT_MIN_VERSION 设置为 'TLSv1'。 用于与旧的 TLS 客户端或服务器兼容。

// 56. --trace-deprecation
// 打印弃用的堆栈跟踪。

// 57. --trace-event-categories
// 使用 --trace-events-enabled 启用跟踪事件跟踪时应跟踪的逗号分隔的类别列表。

// 58. --trace-event-file-pattern
// 指定跟踪事件数据文件路径的模板字符串，它支持 ${rotation} 和 ${pid}。

// 59. --trace-events-enabled
// 启用跟踪事件跟踪信息的收集。

// 60. --trace-exit
// 每当主动退出环境时打印堆栈跟踪，即调用 process.exit()。

// 61. --trace-sigint
// 在 SIGINT 上打印堆栈跟踪。

// 62. --trace-sync-io
// 在第一轮事件循环后检测到同步 I/O 时打印堆栈跟踪。

// 63. --trace-tls
// 将 TLS 数据包跟踪信息打印到 stderr。 这可用于调试 TLS 连接问题。

// 64. --trace-uncaught
// 打印未捕获异常的堆栈跟踪；通常，打印与创建 Error 相关的堆栈跟踪，而这使得 Node.js 也打印与抛出值相关的堆栈跟踪（不需要是 Error 实例）
// 启用此选项可能会对垃圾回收行为产生负面影响。

// 65. --trace-warnings
// 打印进程警告的堆栈跟踪（包括弃用）。

// 66. --track-heap-objects
// 跟踪堆快照的堆对象分配。

// 67. --unhandled-rejections=mode
// 默认情况下，如果未使用 unhandledRejection 钩子，则所有未处理的拒绝都会触发警告以及第一个未处理的拒绝的弃用警告。
// 使用此标志可以改变发生未经处理的拒绝时应该发生的事情。
// strict: 上升未处理的拒绝作为未捕获的异常。
// warn: 始终触发警告，无论是否设置了 unhandledRejection 钩子，但不打印弃用警告。
// none: 静默所有警告。

// 68. --use-bundled-ca, --use-openssl-ca
// 使用当前 Node.js 版本提供的捆绑 Mozilla CA 存储或使用 OpenSSL 的默认 CA 存储。 在构建时可以选择默认存储。
// Node.js 提供的捆绑 CA 存储是 Mozilla CA 存储的快照，在发布时已修复。 它在所有支持的平台上都是相同的。
// 使用 OpenSSL 存储允许对存储进行外部修改。 对于大多数 Linux 和 BSD 发行版，这个存储是由发行版维护者和系统管理员维护的。 OpenSSL CA 存储位置取决于 OpenSSL 库的配置，但这可以在运行时使用环境变量进行更改。
// 参见 SSL_CERT_DIR 和 SSL_CERT_FILE。

// 69. --use-largepages=mode
// 在启动时将 Node.js 静态代码重新映射到大内存页面。 如果目标系统支持，则将导致 Node.js 静态代码移动到 2 MiB 页而不是 4 KiB 页。
// 以下值对 mode 有效：
// off: 不会尝试映射。 这是默认值。
// on: 如果操作系统支持，则将尝试映射。 映射失败将被忽略，并且将向标准错误打印消息。
// silent: 如果操作系统支持，则将尝试映射。 映射失败将被忽略，并且不会被报告。

// 70. --v8-options
// 打印 V8 命令行选项

// 71. --v8-pool-size=num
// 设置 V8 的线程池大小，用于分配后台作业。
// 如果设置为 0，则 V8 将根据在线处理器的数量选择合适大小的线程池。
// 如果提供的值大于 V8 的最大值，则选择最大值。

// 72. --zero-fill-buffers
// 自动零填充所有新分配的 Buffer 和 SlowBuffer 实例。

// 73. -c, --check
// 语法检查脚本而不执行。

// 74. -e, --eval "script"
// 将以下参数作为 JavaScript 评估。 交互式解释器中预定义的模块也可以在 script 中使用。
// 在 Windows 上，使用 cmd.exe 单引号将无法正常工作，因为它只能识别双 " 进行引用。 在 Powershell 或 Git bash 中，' 和 " 都可用。

// 75. -h, --help
// 此选项的输出不如本文档详细。

// 76. -i, --interactive
// 即使标准输入似乎不是终端，也会打开交互式解释器。

// 77. -p, --print "script"
// 与 -e 相同，但打印结果。

// 78. -r, --require module
// 在启动时预加载指定的模块。
// 遵循 require() 的模块解析规则。 module 可以是文件路径，也可以是 node 模块名称。

// 79. -v, --version
// 打印 node 的版本。

// 环境变量
// NODE_DEBUG=module[,…]
// ',' 分隔的应该打印调试信息的核心模块的列表。

// NODE_DEBUG_NATIVE=module[,…]
// ',' 分隔的应打印调试信息的核心 C++ 模块的列表。

// NODE_DISABLE_COLORS=1
// 当设置时，颜色将不会在交互式解释器中使用。

// NODE_EXTRA_CA_CERTS=file
// 当设置时，众所周知的 "root" CA（如 VeriSign）将使用 file 中的额外证书进行扩展。 该文件应包含一个或多个 PEM 格式的可信证书。 如果文件丢失或格式不正确，则将使用 process.emitWarning() 触发消息消息（一次），否则将忽略任何错误。
// 当为 TLS 或 HTTPS 客户端或服务器显式指定 ca 选项属性时，则既不会使用众所周知的证书，也不会使用额外的证书。
// 当 node 作为 setuid root 运行或设置了 Linux 文件功能时，则将忽略此环境变量。

// NODE_ICU_DATA=file
// ICU (Intl 对象) 数据的数据路径。 在使用 small-icu 支持编译时将扩展链接数据。

// NODE_NO_WARNINGS=1
// 当设置为 1 时，则静默进程警告。

// NODE_OPTIONS=options...

// NODE_PATH=path[:…]
// ':' 分隔的目录列表，以模块搜索路径为前缀。
// 在 Windows 上，这是 ';' 分隔的列表。

// NODE_PENDING_DEPRECATION=1
// 当设置为 1 时，触发挂起的弃用警告。
// 待弃用用于提供一种选择性的"早期警告"机制，开发者可以利用该机制来检测弃用的 API 的使用情况。

// NODE_PENDING_PIPE_INSTANCES=instances
// 设置管道服务器等待连接时挂起的管道实例句柄数。 此设置仅适用于 Windows。

// NODE_PRESERVE_SYMLINKS=1
// 当设置为 1 时，指示模块加载器在解析和缓存模块时保留符号链接。

// NODE_REDIRECT_WARNINGS=file
// 当设置时，进程警告将触发到给定文件而不是打印到标准错误 如果文件不存在则创建，如果存在则追加。
// 如果在尝试将警告写入文件时发生错误，则警告将改为写入标准错误。 这相当于使用 --redirect-warnings=file 命令行标志。

// NODE_REPL_HISTORY=file
// 用于存储持久的交互式解释器历史的文件路径。 默认路径是 ~/.node_repl_history，会被此变量覆盖。 将值设置为空字符串（'' 或 ' '）会禁用持久的交互式解释器历史记录。

// NODE_REPL_EXTERNAL_MODULE=file
// Node.js 模块的路径，该模块将代替内置交互式解释器加载。 将此值覆盖为空字符串 ('') ，则将使用内置的交互式解释器。

// NODE_TLS_REJECT_UNAUTHORIZED=value
// 如果 value 等于 '0'，则对 TLS 连接禁用证书验证。 这使得 TLS 和 HTTPS 不安全。 强烈建议不要使用此环境变量。

// NODE_V8_COVERAGE=dir
// 当设置时，Node.js 将开始将 V8 JavaScript 代码覆盖和源映射数据输出到作为参数提供的目录（覆盖信息以 JSON 格式写入带有 coverage 前缀的文件）。
// NODE_V8_COVERAGE 将自动传播到子进程，从而更容易检测调用 child_process.spawn() 系列函数的应用程序。 NODE_V8_COVERAGE 可以设置为空字符串，防止传播。

// OPENSSL_CONF=file
// 在启动时加载 OpenSSL 配置文件。 除其他用途外，如果 Node.js 是使用 ./configure --openssl-fips 构建的，则可用于启用符合 FIPS 的加密。

// SSL_CERT_DIR=dir
// 如果启用了 --use-openssl-ca，则将覆盖并设置包含受信任证书的 OpenSSL 目录。
// 注意，除非显式设置子环境，否则任何子进程都会继承此环境变量，如果它们使用 OpenSSL，可能会导致它们信任与节点相同的 CA。

// SSL_CERT_FILE=file
// 如果启用了 --use-openssl-ca，则将覆盖并设置包含受信任证书的 OpenSSL 文件。
// 注意，除非显式设置子环境，否则任何子进程都会继承此环境变量，如果它们使用 OpenSSL，可能会导致它们信任与节点相同的 CA。

// UV_THREADPOOL_SIZE=size
// 将 libuv 的线程池中使用的线程数设置为 size 个线程。
// Node.js 尽可能使用异步的系统 API，但在它们不存在的情况下，libuv 的线程池用于基于同步的系统 API 创建异步的 node API。 使用线程池的 Node.js API 有：
// 所有 fs API，除了文件监视器 API 和那些显式同步的
// 异步加密 API，例如 crypto.pbkdf2()、crypto.scrypt()、crypto.randomBytes()、crypto.randomFill()、crypto.generateKeyPair()
// dns.lookup()
// 所有 zlib API，除了那些显式同步的
// 因为 libuv 的线程池有固定的大小，这意味着如果这些 API 中的任何一个由于某种原因需要很长时间，则在 libuv 的线程池中运行的其他（看似无关的）API 的性能将会下降。 为了缓解此问题，潜在的解决方案是通过将 'UV_THREADPOOL_SIZE' 环境变量设置为大于 4（其当前默认值）的值来增加 libuv 线程池的大小。 有关更多信息，请参阅 libuv 线程池文档。

// 有用的 V8 选项
// V8 有自己的一组命令行选项。 任何提供给 node 的 V8 命令行选项都将传给 V8 来处理。 V8 的选项没有稳定性保证。 V8 团队本身并不认为它们是其正式 API 的一部分，并保留随时更改它们的权利。
// 同样，它们也不在 Node.js 稳定性保证范围内。 许多 V8 选项只对 V8 开发者有用。 尽管如此，有一小组 V8 选项广泛适用于 Node.js，它们记录在此处：
// --max-old-space-size=SIZE
// 设置 V8 旧内存部分的最大内存大小。 随着内存消耗接近极限，V8 会花更多的时间在垃圾回收上，以释放未使用的内存。
// 在具有 2GB 内存的机器上，考虑将其设置为 1536 (1.5GB) 以保留一些内存用于其他用途并避免交换。
