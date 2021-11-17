import { initState, createWatcher } from './init'
import { complieToFunction } from '../../compiler/compileToFunction'
import { patch } from '../vdom/patch'
import Watcher from '../observer/Watcher'
import { nexttick } from '../utils/nexttick'
import { pushTarget, popTarget } from '../observer/Dep'

export function Mvvm(options) {
  if (!(this instanceof Mvvm)) {
    return new Mvvm(options)
  }
  this._init(options)
}

Mvvm.prototype = {
  constructor: Mvvm,
  _init: function (options) {
    const vm = this
    this.$options = options
    callHook(vm, 'beforeCreate')

    initState(this, options)
    callHook(vm, 'created')

    callHook(vm, 'beforeMount')
    // 初始化完数据后，挂载虚拟dom
    this.$mount(this)
    callHook(vm, 'mounted')
    
  },
  $mount: function (vm) {
    const options = vm.$options
    if (!options.render) {
      // 如果没有渲染函数，则进行创建
      let template = ''
      if (options.el) {
        const el = document.querySelector(options.el)
        vm.$el = el
        if (el) {
          template = el.outerHTML
        }
      }
      if (!template && options.template) {
        // 如果有template选项，则直接使用
        template = options.template
      }
      options.render = complieToFunction(template)
    }
    return mountComponent(vm)
  },
  _update: function (vnode) {
    const vm = this
    const preVnode = vm._vnode
    vm._vnode = vnode
    if (!preVnode) {
      patch(vm.$el, vnode)
    } else {
      patch(preVnode, vnode)
    }
  },
  _render: function () {
    const vm = this
    const render = vm.$options.render
    return render.call(vm)
  },
  $watch: function (expOrFn, cb, options) {
    const vm = this
    if (typeof expOrFn === 'object' && expOrFn !== null) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immiediate) {
      pushTarget()
      cb.call(vm)
      popTarget()
    }
    
    return function unWatch() {
      watcher.teardown()
    }
  }
}

Mvvm.prototype.$nexttick = nexttick

export function callHook(vm, hook) {
  vm.$options[hook] && vm.$options[hook].call(vm)
}

function mountComponent(vm) {
  let updateComponent
  updateComponent = function () {
    vm._update(vm._render())
  }

  // 创建渲染函数Watcher
  vm._watcher = new Watcher(vm, updateComponent, () => {})

  return vm
}