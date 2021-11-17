export function updateAttrs(oldVnode, newVnode) {
  const oldAttrs = oldVnode.datas.attrs,
    newAttrs = newVnode.datas.attrs,
    newEle = newVnode.ele
  
  // 首先删除旧attr中不在新attr中的属性
  for (let key in oldAttrs) {
    if (newAttrs && !newAttrs[key]) {
      newEle.removeAttribute(key)
    }
  }
  // 之后重新设置所有新列表中的属性即可
  for (let key in newAttrs) {
    newEle.setAttribute(key, newAttrs[key])
  }

  // 对比prop
  const oldProps = oldVnode.datas.domProps,
    newProps = newVnode.datas.domProps
  
  for (let key in oldProps) {
    if (newProps && !newProps[key]) {
      newEle[key] = ''
    }
  }
  for (let key in newProps) {
    newEle[key] = newProps[key]
  }
}