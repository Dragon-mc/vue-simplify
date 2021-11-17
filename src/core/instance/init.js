import observe from '../observer/observe'
import { createElement,createTextElement } from '../createElement'
import { renderList } from '../../compiler/helper/renderList'
import { toString } from '../../utils'
import { renderClass } from '../../compiler/helper/renderClass'
import Watcher from '../observer/Watcher'
import Dep from '../observer/Dep'

export function initState(vm, options) {
  // 挂载渲染函数需要使用的助手函数
  installRenderHelper(vm.constructor.prototype)
  // options初始化
  initMethods(vm, options.methods)
  initData(vm, options.data)
  initComputed(vm, options.computed)
  initWatch(vm, options.watch)
}

function initMethods(vm, methods) {
  if (!methods || typeof methods !== 'object' || methods === null) return
  for (let key in methods) {
    if (vm.hasOwnProperty(key)) {
      console.warn(`method key "${key}" has exsited`)
    }
    vm[key] = typeof methods[key] === 'function' ? methods[key].bind(vm) : () => {}
  }
}

function initData(vm, data) {
  const finalData =
    typeof data === 'function'
      ? data()
      : typeof data !== 'object' || data === null
      ? {}
      : data
  for (let key in finalData) {
    if (vm.hasOwnProperty(key)) {
      console.warn(`data key "${key}" has exsited`)
    }
    proxyVm(vm, key, '_data')
  }
  observe(data)
  vm._data = data
}

const computedOptions = { lazy: true }
const noop = () => {}
function initComputed(vm, computed) {
  if (!computed) return
  const watcher = vm._computedWatchers = Object.create(null)
  for (let key in computed) {
    let val = computed[key]
    if (vm.hasOwnProperty(key)) {
      console.warn(`computed key "${key}" has exsited`)
    }
    const getter = typeof val === 'function' ? val : val.get
    watcher[key] = new Watcher(vm, getter || noop, noop, computedOptions)
    defineComputed(vm, key, val)
  }
}

const computedDescriptor = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}
function defineComputed(vm, key, val) {
  if (typeof val === 'function') {
    computedDescriptor.get = createComputedGetter(key)
    computedDescriptor.set = noop
  } else {
    computedDescriptor.get = val && val.get && typeof val.get === 'function' ? val.get : noop
    computedDescriptor.set = val && val.set && typeof val.set === 'function' ? val.set : noop
  }
  Object.defineProperty(vm, key, computedDescriptor)
}

function createComputedGetter(key) {
  return function computedGetter() {
    // 此时this就是vm，因为访问此属性是从vm访问到的
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        // dirty为true，说明computed的值还没有计算过或值已经被更新
        watcher.evaluate()
      }
      if (Dep.target) {
        // target存在，说明在访问computed时，正在依赖收集的过程中
        // 那说明computed作为了其他watcher的依赖，那么应该收集所有当前computed的依赖
        watcher.depend()
      }
      return watcher.value
    }
  }
}

function initWatch(vm, watch) {
  if (!watch) return
  for (let key in watch) {
    // 用户定义的watch行为
    // 三种格式，字符串，对象，函数
    const def = watch[key]
    if (Array.isArray(def)) {
      for (let i = 0; i < def.length; i++) {
        createWatcher(vm, key, def[i])
      }
    } else {
      createWatcher(vm, key, def)
    }
  }
}

export function createWatcher(vm, expOfFn, cb, options) {
  options = options || {}
  if (typeof cb === 'string') {
    // 如果是字符串，则使用methods中定义的方法
    cb = vm[cb]
  } else if (typeof cb === 'object' && cb !== null) {
    // 如果是对象，则handler属性就是回调，其余为为配置参数
    options = cb
    cb = cb.handler
  }
  if (!cb || typeof cb !== 'function') {
    throw new Error(`cannot find function of watch definition`)
  }
  return vm.$watch(expOfFn, cb, options)
}

function proxyVm(vm, key, proxyedObj) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[proxyedObj][key]
    },
    set(val) {
      vm[proxyedObj][key] = val
    },
    enumerable: true
  })
}

export function installRenderHelper(target) {
  target._c = createElement,
  target._v = createTextElement,
  target._l = renderList,
  target._s = toString,
  target._class = renderClass
}
