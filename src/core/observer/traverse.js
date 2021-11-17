// 用于标识某个对象是否被遍历过
const seenObj = new Set()

export function traverse(val) {
  _traverse(val, seenObj)
  seenObj.clear()
}

function _traverse(val, seen) {
  const isArr = Array.isArray(val)
  // 如果是冻结对象，或者不是对象，就不需要深度观察了
  if (Object.isFrozen(val) || (!isArr && typeof val !== 'object') || val === null) {
    return
  }
  if (val.__ob__) {
    // 如果是被定义了依赖的对象，则进行深度依赖收集
    const depId = val.__ob__.dep.uid
    if (seen.has(depId)) {
      // 如果该对象本轮已经收集过
      return
    }
    seen.add(depId)
  }
  if (isArr) {
    for (let i = 0, l = val.length; i < l; i++) {
      _traverse(val[i], seen)
    }
  } else {
    const keys = Object.keys(val)
    let i = keys.length
    while (i--) {
      _traverse(val[keys[i]], seen)
    }
  }
}