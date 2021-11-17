export function renderClass(staticClass, classBinding) {
  if (!staticClass) staticClass = {}
  if (Array.isArray(classBinding)) {
    for (let i = 0; i < classBinding.length; i++) {
      if (typeof classBinding[i] === 'string') {
        staticClass[classBinding[i]] = true
      } else {
        renderClass(staticClass, classBinding[i])
      }
    }
  } else if (typeof classBinding === 'object' && classBinding !== null) {
    const keys = Object.keys(classBinding)
    for (let i = 0; i < keys.length; i++) {
      staticClass[keys[i]] = classBinding[keys[i]]
    }
  }
  return staticClass
}