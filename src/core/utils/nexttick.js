const queue = []
let pending = false

let asyncFunc
if (typeof Promise !== 'undefined') {
  const p = Promise.resolve()
  asyncFunc = () => {
    p.then(flushCallbacks)
  }
} else {
  asyncFunc = () => {
    setTimeout(flushCallbacks)
  }
}

export function nexttick(fn, ctx) {
  let _resolve
  if (typeof fn !== 'function') {
    new Promise(resolve => _resolve = resolve)
  }
  queue.push(() => {
    if (fn) {
      fn.call(ctx)
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    asyncFunc()
  }
}

function flushCallbacks() {
  const tempQueue = queue.slice()
  for (let i = 0; i < tempQueue.length; i++) {
    tempQueue[i]()
  }
  pending = false
}