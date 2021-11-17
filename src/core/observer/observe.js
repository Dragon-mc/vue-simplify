import Observer from './Observer.js'

export default function observe(val) {
  if (typeof val !== 'object' || val === null) {
    // 如果观察的值不是对象
    return
  }
  let ob
  if (val.hasOwnProperty('__ob__')) {
    ob = val.__ob__
  } else {
    ob = new Observer(val)
  }
  return ob
}
