import { parse } from './parse'
import { codegen } from './codegen'
import { codeToRenderFunc } from './codeToRenderFunc'

export function complieToFunction(template) {
  const ast = parse(template)
  const code = codegen(ast)

  return codeToRenderFunc(code)
}