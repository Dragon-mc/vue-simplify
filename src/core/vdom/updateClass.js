export function updateClass(oldVnode, newVnode) {
  let oldClass = oldVnode.datas.class,
    newClass = newVnode.datas.class,
    newEle = newVnode.ele

  // 删除所有不在新class，并在真正使用在元素中的类名
  for (let key in oldClass) {
    if (newClass && oldClass && !newClass[key] && oldClass[key]) {
      newEle.classList.remove(key)
    }
  }
  // 对新class进行更新
  for (let key in newClass) {
    let val = newClass[key]
    if (val && oldClass && !oldClass[key]) {
      // 如果新值为真，旧值不存在或者为false，则需要添加该类名
      newEle.classList.add(key)
    } else if (!val && oldClass && oldClass[key]) {
      // 如果新值为假值，旧值存在，则需要删除该类名
      newEle.classList.remove(key)
    }
  }
}