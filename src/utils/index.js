export function createMap(str) {
  const list = str.split(',')
  const map = {}
  list.forEach(v => {
    map[v.trim()] = true
  })
  return map
}

export function cached(fn) {
  const cache = {}
  return function cachedFn(str) {
    const hit = cache[str]
    return (hit || (cache[str] = fn(str)))
  }
}

const camelReg = /-([a-z])/g
export const camelize = cached(function(str) {
  return str.replace(camelReg, (match, capture) => {
    return capture.toUpperCase()
  })
})

export function toString(val) {
  //将对象或者其他基本数据 变成一个 字符串
  return val == null
      ? ''
      : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}