import { createMap } from "../../utils"

export const propKey = createMap('value,innerHTML,outerHTML,innerText,outerText')
const bindReg = /(^v-bind:|^:)/

// 无filter
export function parseBind(el, attr, value) {
  const match = attr.match(bindReg)
  if (value) delete el.attrsMap[attr]
  if (match) {
    attr = attr.slice(match[1].length)
    if (attr === 'class') {
      el.classBinding = value
    } else if (attr === 'style') {
      el.styleBinding = value
    } else {
      if (propKey[attr]) {
        addProp(el, attr, value)
      } else {
        addAttr(el, attr, value)
      }
    }
  }
}

export function addAttr(el, attr, value) {
  // 添加之前，如果之前有静态的属性，则删除静态的属性
  delete el.attrsMap[attr]
  !el.attrs && (el.attrs = [])
  el.attrs.push({
    name: attr,
    exp: value
  })
}

export function addProp(el, prop, value) {
  delete el.attrsMap[prop]
  !el.props && (el.props = [])
  el.props.push({
    name: prop,
    exp: value
  })
}