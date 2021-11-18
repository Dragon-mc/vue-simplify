import { nexttick } from '../utils/nexttick'

const queue = [],
  hasWatcher = new Set()
let waiting = false,
  flushing = false,
  // 用于标识当前清空队列中遍历到的Watcher队列索引
  index

export function queueWatcher(watcher) {
  if (flushing) {
    // 会进入这里的原因在于，在调用watcher的过程中，这个watcher的回调又改变了某些值，导致其他watcher被对应的dep通知
    // 如果是队列正在清空的过程，则将当前watcher插入到id按升序尽量靠前的位置
    // 利用二分定位到最后一个小于目标id的watcher_id索引
    let l = index, r = queue.length - 1, mid, id = watcher.uid
    while (l < r) {
      mid = l + r + 1 >> 1
      if (queue[mid].uid < id) {
        l = mid
      } else {
        r = mid - 1
      }
    }
    // 此时l和r就是最后一个小于当前id的最后一个watcher
    // 如果没有小于当前id的watcher，那么l和r就是最左边的那个watcher，即index索引遍历到的watcher
    queue.splice(l + 1, 0, watcher)
  } else {
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

  for (index = 0; index < queue.length; index++) {
    const watcher = queue[index]
    watcher.run()
    // 当前watcher执行完后，将标识释放
    hasWatcher.delete(watcher.uid)
  }

  resetQueue()
}

function resetQueue() {
  queue.length = 0
  hasWatcher.clear()
  waiting = false
  flushing = false
}