import { pushTarget, popTarget } from './Dep.js'
import { queueWatcher } from './scheduler'
import { traverse } from './traverse'

let uid = 1

export default class Watcher {
  constructor(target, expression, callback, options = {}) {
    this.uid = uid++
    // deps为目前已经收集的依赖
    this.deps = []
    this.hasDeps = new Set()
    // newDeps为本轮收集的新依赖
    this.newDeps = []
    this.hasNewDeps = new Set()
    this.getter = typeof expression === 'function' ? expression : parsePath(expression)
    this.target = target
    this.callback = callback
    // lazy与dirty用于computed的惰性求值
    this.lazy = !!options.lazy
    this.dirty = this.lazy
    this.sync = !!options.sync
    this.deep = !!options.deep
    this.user = !!options.user
    this.value = this.lazy ? undefined : this.get()
  }

  addDep(dep) {
    const id = dep.uid
    if (!this.hasNewDeps.has(id)) {
      // 本轮没有收集过依赖
      this.hasNewDeps.add(id)
      this.newDeps.push(dep)
      if (!this.hasDeps.has(id)) {
        // 并且依赖之前也没收集过
        dep.addSub(this)
      }
    }
  }

  update() {
    console.log('update:', this.uid)
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }

  run() {
    let oldValue = this.value
    let newValue = this.get()
    this.callback.call(this.target, newValue, oldValue)
  }

  get() {
    pushTarget(this)
    const vm = this.target
    let value
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      throw e
    } finally {
      this.value = value
      if (this.deep) {
        // 如果是用户定义的watch，并且配置了deep，则需要深度遍历对象收集依赖
        traverse(value)
      }
      popTarget()
      // 本轮收集结束后，清除没有关联的依赖
      this.clearupDeps()
    }
    return value
  }
  
  // 更新本轮收集结果
  clearupDeps() {
    // 清除已经不存在依赖的dep
    for (let i = 0; i < this.deps.length; i++) {
      const id = this.deps[i].uid
      // 当前遍历到的dep已经不再新一轮的依赖中，解除关联
      if (!this.hasNewDeps.has(id)) {
        this.deps[i].removeSub(this)
      }
    }
    let temp = this.deps
    this.deps = this.newDeps
    this.newDeps = temp
    this.newDeps.length = 0
    temp = this.hasDeps
    this.hasDeps = this.hasNewDeps
    this.hasNewDeps = temp
    this.hasNewDeps.clear()
  }

  evaluate() {
    this.value = this.get()
    this.dirty = false
  }

  depend() {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  teardown() {
    let i = this.deps.length
    while (i--) {
      this.deps[i].removeSub(this)
    }
  }
}

function parsePath(path) {
  let keys = path.split('.')
  return function () {
    let obj = this
    for (let i = 0, l = keys.length; i < l; i++) {
      if (!obj) return
      obj = obj[keys[i]]
    }
    return obj
  }
}
