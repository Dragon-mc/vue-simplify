import { nexttick } from '../utils/nexttick'

const queue = [],
  hasWatcher = new Set()
let waiting = false,
  flushing = false

export function queueWatcher(watcher) {
  if (!flushing) {
    if (!hasWatcher.has(watcher.uid)) {
      hasWatcher.add(watcher.uid)
      // 加入队列
      queue.push(watcher)
      // 如果还没有开启队列，则开启
      if (!waiting) {
        waiting = true
        nexttick(flushSchedulerQueue)
      }
    }
  }
}

function flushSchedulerQueue() {
  // 排序watcher
  queue.sort((a, b) => a.uid - b.uid)
  flushing = true
  const flushQueue = queue.slice()

  queue.length = 0
  hasWatcher.clear()
  waiting = false
  flushing = false

  for (let i = 0; i < flushQueue.length; i++) {
    flushQueue[i].run()
  }
}