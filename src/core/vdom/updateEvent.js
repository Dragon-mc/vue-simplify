export function updateEvent(oldVnode, newVnode) {
  let oldEvent = oldVnode.datas.on,
    newEvent = newVnode.datas.on,
    newEle = newVnode.ele

  // 移除所有新事件中已经删除的事件
  for (let key in oldEvent) {
    if (newEvent && !newEvent[key]) {
      newEle.removeEventListener(key, oldEvent[key])
    }
  }
  // 绑定旧事件中不存在的事件
  for (let key in newEvent) {
    if (oldEvent && !oldEvent[key]) {
      newEle.addEventListener(key, newEvent[key])
    }
  }
}