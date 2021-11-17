import Dep from "./Dep.js"
import observe from "./observe.js"
export default function defineReactive (obj, key, val) {
  val = val || obj[key]
  let dep = new Dep()
  let childOb = observe(val)
  let property = Object.getOwnPropertyDescriptor(obj, key)
  let getter = property && property.get
  let setter = property && property.set
  
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: false,
    get: function reactiveGetter() {
      let value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter(newVal) {
      let value = getter ? getter.call(obj) : val
      // 如果值未改变
      if (newVal === value) {
        return
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = observe(newVal)
      dep.notify()
    }
  })
}

function dependArray (value) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}