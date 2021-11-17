export function codeToRenderFunc(code) {
  return new Function(code)
}