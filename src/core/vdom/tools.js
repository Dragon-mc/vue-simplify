/**
 *
 * @param {Element} newEle
 * @param {Element} oldEle
 * 替换元素
 */
export function replaceEle(newEle, oldEle) {
  oldEle.parentNode.insertBefore(newEle, oldEle)
  oldEle.parentNode.removeChild(oldEle)
}

/**
 * 
 * @param {Element} newEle 
 * @param {Element} refer 
 * 将节点插入某个节点之前
 */
export function insertBefore(newEle, refer, parent = null) {
  (parent || refer.parentNode).insertBefore(newEle, refer)
}

/**
 * 
 * @param {Element} newEle 
 * @param {Element} refer 
 * 将节点插入某个节点之后
 */
const spaceReg = /^[\s\n]*$/
export function insertAfter(newEle, refer) {
  // 找到参照节点的下一个
  let next = refer.nextSibling
  // 只选择元素节点，或者内容不是空白和换行符的文本节点
  while (next && next.nodeType !== Element.ELEMENT_NODE || (next.nodeType === Element.TEXT_NODE && spaceReg.test(next.textContent))) {
    next = next.nextSibling
  }
  refer.parentNode.insertBefore(newEle, next)
}

/**
 * 
 * @param {Element} ele 
 * 移除某个元素
 */
export function removeEle(ele) {
  ele.parentNode.removeChild(ele)
}

/**
 *
 * @param {Vnode} oldVnode
 * @param {Vnode} newVnode
 * 两个虚拟dom是否相似，即tag、key、type相同
 */
export function isSameNode(oldVnode, newVnode) {
  return (
    oldVnode.tag === newVnode.tag &&
    oldVnode.type === newVnode.type &&
    oldVnode.key === newVnode.key
  )
}
