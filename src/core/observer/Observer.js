import Dep from './Dep.js'
import observe from './observe.js'
import defineReactive from './defineReactive.js'
import reactiveArray from './reactiveArray.js'

export default class Observer {
  constructor(value) {
    this.value = value
    this.dep = new Dep()
    // 定义__ob__
    Object.defineProperty(value, '__ob__', {
      value: this,
      configurable: true,
      enumerable: false,
      
    })
    if (Object.prototype.toString.call(value) === '[object Array]') {
      // 如果是数组，修改原型为reactiveArray
      Object.setPrototypeOf(value, reactiveArray)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  walk(obj) {
    let keys = Object.keys(obj)
    for (let i = 0, l = keys.length; i < l; i++) {
      defineReactive(obj, keys[i])
    }
  }

  observeArray(arr) {
    for (let i = 0, len = arr.length; i < len; i++) {
      observe(arr[i])
    }
  }
}
