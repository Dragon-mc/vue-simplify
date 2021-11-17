let uid = 1
export default class Dep {
  static target = null
  constructor() {
    this.uid = uid++
    this.subs = []
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  
  addSub(sub) {
    this.subs.push(sub)
  }

  removeSub(sub) {
    const idx = this.subs.indexOf(sub)
    this.subs.splice(idx, 1)
  }

  notify() {
    this.subs.forEach(watcher => {
      watcher.update()
    })
  }
}

const stack = []
export function pushTarget(watcher) {
  stack.push(Dep.target)
  Dep.target = watcher
}
export function popTarget() {
  Dep.target = stack.pop()
}