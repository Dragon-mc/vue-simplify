export function renderList(val, render) {
  let arr
  if (Array.isArray(val) || typeof val === 'string') {
    // 数组则直接遍历
    arr = new Array(val.length)
    for (let i = 0; i < val.length; i++) {
      arr[i] = render(val[i], i)
    }
  } else if (typeof val === 'number') {
    // 如果是数字则遍历数字的次数
    arr = new Array(val)
    for (let i = 0; i < val; i++) {
      arr[i] = render(i + 1, i)
    }
  } else if (typeof val === 'object' && val !== null) {
    const keys = Object.keys(val)
    arr = new Array(keys.length)
    for (let i = 0; i < keys.length; i++) {
      arr[i] = render(val[keys[i]], keys[i], i)
    }
  }
  
  if (typeof arr === 'undefined') {
    arr = []
  }
  return arr
}