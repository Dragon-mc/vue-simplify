// 创建虚拟dom
export function createElement(tag, datas, children) {
  const el = {
    type: 1,
    tag,
    datas,
    // 过滤children，可能存在undefined
    // flat操作，在_l渲染后返回的是列表，会让children形成嵌套
    children: children.filter(v => v).flat()
  }
  if (datas.attrs && typeof datas.attrs.key !== 'undefined') {
    el.key = datas.attrs.key
    delete datas.attrs.key
  }
  return el
}

// 创建文本虚拟dom
export function createTextElement(text) {
  return {
    type: 2,
    text
  }
}