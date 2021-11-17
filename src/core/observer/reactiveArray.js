let arrayMethods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'reverse',
  'sort'
]

let arrayProto = Array.prototype
let reactiveArray = Object.create(arrayProto)

arrayMethods.forEach(method => {
  let original = arrayProto[method]
  Object.defineProperty(reactiveArray, method, {
    enumerable: true,
    configurable: false,
    value: function () {
      let inserted
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = arrayProto.slice.call(arguments)
          break
        case 'splice':
          inserted = arrayProto.slice.call(arguments, 2)
      }
      let result = original.apply(this, arrayProto.slice.call(arguments))
      let ob = this.__ob__
      // 对数组新加入的数据进行观察
      if (inserted) {
        ob.observeArray(inserted)
      }
      console.log(ob)
      ob.dep.notify()
      return result
    }
  })
})

export default reactiveArray
