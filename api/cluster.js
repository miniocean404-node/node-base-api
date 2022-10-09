import cluster from 'cluster'
import http from 'http'
import os from 'os'
import { getIp } from '../utils/ip.js'

if (cluster.isPrimary) {
  console.log('主线程 pid', process.pid)

  cluster.on('exit', (worker, code, signal) => {
    console.log('集群退出监听', worker, code, signal)
  })

  for (const iterator in cluster.workers) {
    console.log(iterator)
  }

  //   http.createServer((req, res) => res.end('hello')).listen(3000)
}

// 创建子进程
if (cluster.isPrimary) {
  const cpu = os.cpus().length

  for (let cItem = 0; cItem < cpu; cItem++) {
    const worker = cluster.fork()

    worker.on('listening', () => {
      console.log('子进程监听')
    })

    worker.on('disconnect', () => {
      console.log('子进程断开')
    })

    worker.on('exit', (code, signal) => {
      console.log(`子进程 退出监听 ${code || signal}}`)
    })

    worker.on('message', (msg) => {
      if (msg.id === 1) {
        // cluster.workers[msg.id].kill()
      }
    })

    // console.log(cluster.workers)
  }
}

if (cluster.isWorker) {
  http.createServer((req, res) => res.end('hello')).listen(3000)
  const ip = getIp()

  console.log(`子进程 pid ${process.pid},  子进程 workers 中 id: ${cluster.worker.id} 服务启动于: http://${ip}:3000`)

  cluster.worker.send({ id: cluster.worker.id, msg: 'test' })
}
