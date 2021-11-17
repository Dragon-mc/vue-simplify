const onReg = /(^v-on:|^@)/

export function parseOn(el, attr, value) {
  const match = attr.match(onReg)
  if (match) {
    const event = attr.slice(match[1].length)
    addHandler(el, event, value)
    // 删除属性
    delete el.attrsMap[attr]
  }
}

export function addHandler(el, name, value) {
  !el.events && (el.events = [])
  el.events.push({
    name: name,
    exp: value
  })
}