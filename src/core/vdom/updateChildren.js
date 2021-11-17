import { patch } from './patch'
import { isSameNode, insertBefore, insertAfter, removeEle } from './tools'
import { render } from './render'

/**
 * 
 * @param {Vnode} oldVnode 
 * @param {Vnode} newVnode 
 * 子节点diff算法
 * 对比顺序：新前旧前 -> 新后旧后 -> 新后旧前 -> 新前旧后
 * 如果都未命中，则直接在旧列表中查找，未查找到相似元素才新建
 */
export function updateChildren(oldVnode, newVnode) {
  let newStartIdx = 0,
    newEndIdx = newVnode.children.length - 1,
    oldStartIdx = 0,
    oldEndIdx = oldVnode.children.length - 1,
    newStartChild = newVnode.children[newStartIdx],
    newEndChild = newVnode.children[newEndIdx],
    oldStartChild = oldVnode.children[oldStartIdx],
    oldEndChild = oldVnode.children[oldEndIdx],
    // 用于在旧列表查找的map
    oldKeyMap = null
  
  // 只有当两个列表都没有扫描完的时候才继续遍历
  while (newStartIdx <= newEndIdx && oldStartIdx <= oldEndIdx) {
    if (isSameNode(oldStartChild, newStartChild)) {
      // 新前旧前命中，无需替换，深度对比即可
      patch(oldStartChild, newStartChild)
      oldStartIdx++
      newStartIdx++
      oldStartChild = oldVnode.children[oldStartIdx]
      newStartChild = newVnode.children[newStartIdx]
    } else if (isSameNode(oldEndChild, newEndChild)) {
      // 新后旧后命中，也无需替换，深度对比即可
      patch(oldEndChild, newEndChild)
      oldEndIdx--
      newEndIdx--
      oldEndChild = oldVnode.children[oldEndIdx]
      newEndChild = newVnode.children[newEndIdx]
    } else if (isSameNode(oldStartChild, newEndChild)) {
      // 新后旧前命中，则说明元素被向后调整了，将旧前移动到旧后之后
      patch(oldStartChild, newEndChild)
      insertAfter(oldStartChild.ele, oldEndChild.ele)
      oldStartIdx++
      newEndIdx--
      oldStartChild = oldVnode.children[oldStartIdx]
      newEndChild = newVnode.children[newEndIdx]
    } else if (isSameNode(oldEndChild, newStartChild)) {
      // 新前旧后命中，说明元素被向前调整了，将旧后移动到旧前之前
      patch(oldEndChild, newStartChild)
      insertBefore(oldEndChild.ele, oldStartChild.ele)
      oldEndIdx--
      newStartIdx++
      oldEndChild = oldVnode.children[oldEndIdx]
      newStartChild = newVnode.children[newStartIdx]
    } else {
      // 如果都未命中，则在旧列表中查找当前遍历到的新前元素
      if (!oldKeyMap) {
        // 第一次出现未命中，对map进行初始化，将旧前旧后之间的元素加入映射中
        for (let i = oldStartIdx; i <= oldEndIdx; i++) {
          oldKeyMap[oldVnode.children[i].key] = oldVnode.children[i]
        }
      }
      // 元素查找
      const findInOld = oldKeyMap[newStartChild.key]
      if (findInOld) {
        // 如果找到了元素，则进行元素调整，并比较（调整到旧前之前）
        patch(findInOld, newStartChild)
        insertBefore(findInOld.ele, oldStartChild.ele)
        // 需要对找到的元素进行标记，说明已经比较过
        findInOld._patched = true
        // 并且从映射map中删除
        delete oldKeyMap[newStartChild.key]
      } else {
        // 如果没有找到，就需要新建新前元素，并插入到旧前之前即可
        insertBefore(render(newStartChild), oldStartChild.ele)
      }
      newStartIdx++
      newStartChild = newVnode.children[newStartIdx]
    }
  }

  // 如果新列表还有元素，说明是新插入的元素
  if (newStartIdx <= newEndIdx) {
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      // 插入到末尾即可
      const existOld = oldStartChild || oldEndChild
      existOld.ele.parentNode.appendChild(render(newVnode.children[i]))
    }
  }
  // 如果旧列表还有元素，说明是已经被删除的元素
  if (oldStartIdx <= oldEndIdx) {
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      const child = oldVnode.children[i]
      // 只移除没有被patch过的，即那些真正未被使用的
      !child._patched && removeEle(child.ele)
    }
  }
}