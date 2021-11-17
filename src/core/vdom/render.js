import { toString } from "../../utils"

// 样式important等级
const importantReg = /!important$/

/**
 * 虚拟dom生成真实dom
 */
export function render(vnode) {
  let ele
  if (vnode.type === 1) {
    // 创建元素
    ele = document.createElement(vnode.tag)
    // 创建元素的子节点
    for (let i = 0; i < vnode.children.length; i++) {
      ele.appendChild(render(vnode.children[i]))
    }
    let key, val
    // 添加属性attr
    for (key in vnode.datas.attrs) {
      val = vnode.datas.attrs[key]
      ele.setAttribute(key, val)
    }
    // 添加prop
    for (key in vnode.datas.domProps) {
      val = vnode.datas.domProps[key]
      ele[key] = val
    }
    // 添加类名
    for (key in vnode.datas.class) {
      val = vnode.datas.class[key]
      // 类名的值为真值才添加
      val && ele.classList.add(key)
    }
    // 添加样式
    for (key in vnode.datas.style) {
      val = toString(vnode.datas.style[key])
      if (importantReg.test(val)) {
        // 如果存在important等级
        val = val.replace(importantReg, '').trim()
        ele.style.setProperty(key, val, 'important')
      } else {
        ele.style.setProperty(key, val)
      }
    }
    // 添加事件监听
    for (key in vnode.datas.on) {
      val = vnode.datas.on[key]
      ele.addEventListener(key, val)
    }
  } else if (vnode.type === 2) {
    ele = document.createTextNode(vnode.text)
  }
  if (ele) vnode.ele = ele
  return ele
}