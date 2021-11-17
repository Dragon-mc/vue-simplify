import { camelize } from "../../utils"

export function parseStyle(value, isStatic = false) {
  const styleMap = {}
  const styles = value.split(';')
  styles.forEach((style) => {
    if (style.trim()) {
      const split = style.split(':')
      styleMap[camelize(split[0].trim())] = isStatic ? JSON.stringify(split[1].trim()) : split[1].trim()
    }
  })
  return styleMap
}
