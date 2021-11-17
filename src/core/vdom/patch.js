import { render } from './render'
import { replaceEle, isSameNode } from './tools'
import { updateChildren } from './updateChildren'
import { updateAttrs } from './updateAttrs'
import { updateClass } from './updateClass'
import { updateEvent } from './updateEvent'

/**
 * 
 * @param {Vnode | Element} preVnode 
 * @param {Vnode} vnode 
 * patch原则，只对比同级，如果当前层级不同则直接拆除换新
 */
export function patch(preVnode, vnode) {
  if (preVnode instanceof Element) {
    // 如果preVnode是元素，则是第一次patch，相当于挂载vnode到真实dom上
    const ele = render(vnode)
    // 直接替换掉preVnode
    replaceEle(ele, preVnode)
  } else {
    // 否则才进行diff，此时两个节点均为vnode
    if (isSameNode(preVnode, vnode)) {
      // 如果进行patch，需要将旧vnode的ele赋值到新vnode的ele，代表已经对节点patch过
      vnode.ele = preVnode.ele
      // 如果是相似标签，则进行深度diff
      if (vnode.type === 1) {
        // 如果是元素节点，则需要比较子节点
        updateChildren(preVnode, vnode)
        // 比较属性attrs
        updateAttrs(preVnode, vnode)
        // 比较类名class
        updateClass(preVnode, vnode)
        // 比较事件变化
        updateEvent(preVnode, vnode)
      } else if (vnode.type === 2) {
        // 如果是文本，需要比较文本内容
        if (preVnode.text !== vnode.text) {
          // 如果文本内容不同，则进行修正
          preVnode.ele.textContent = vnode.text
        }
      }
    } else {
      // 如果节点类型不同、key不同、标签不同，则直接拆除换新
      const ele = render(vnode)
      replaceEle(ele, preVnode.ele)
    }
  }
}