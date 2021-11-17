const spaceReg = /\s+/

// 将class转换为键值对map
export function parseClass(el, value) {
  const map = {}
  const all = value.split(spaceReg)
  all.forEach(cls => {
    map[cls] = true
  })
  el.staticClass = map
}