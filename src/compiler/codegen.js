import { parseStyle } from './tools/parseStyle'

export function codegen(ast) {
  console.log(ast)
  const code = gen(ast)
  const codeWrapper = `with(this){return ${code}}`
  return codeWrapper
}

function gen(ast) {
  if (ast.type === 1) {
    if (ast.for && !ast.hasFor) {
      ast.hasFor = true
      return `_l(${ast.for}, ${genForFunc(ast)})`
    } else if (ast.ifConditions && !ast.hasIf) {
      ast.hasIf = true
      return genIf(ast.ifConditions)
    } else if (ast.show) {
      ast.staticStyle.display = `(${ast.show}?'block':'none')`
    }

    return `_c('${ast.tag}', ${genDatas(ast)}, ${genChildren(ast)})`
  } else {
    // 创建文本节点
    return `_v(${ast.type === 2 ? ast.exp : ast.text})`
  }
}

function genDatas(ast) {
  return `{` +
    `${genDatasKey('attrs', ast.attrsMap, ast.attrs)}` +
    `${genDatasKey('domProps', ast.propsMap, ast.props)}` +
    `${genStyle(ast.staticStyle, ast.styleBinding)}` +
    `${genEvent(ast.events)}` +
    `${genClass(ast.staticClass, ast.classBinding)}` +
  `}`
}
function genDatasKey(dataKey, staticAttrs, attrs) {
  let finalAttrs = []
  for (let key in staticAttrs) {
    finalAttrs.push({ name: key, exp: staticAttrs[key] })
  }
  finalAttrs = finalAttrs.concat(attrs || [])
  if (!finalAttrs.length) {
    return ''
  }
  return `${dataKey}:{${finalAttrs.map((v) => `${v.name}:${v.exp}`).join(',')}},`
}

const removeBracket = /^\{|\}$/g
function genStyle(staticStyle, styleBinding) {
  if (!styleBinding) styleBinding = ''
  if (!staticStyle) staticStyle = {}
  styleBinding = styleBinding.replace(removeBracket, '')
  const styles = parseStyle(styleBinding)
  Object.assign(staticStyle, styles)
  const styleList = []
  for (let key in staticStyle) {
    styleList.push([key, staticStyle[key]])
  }
  if (!styleList.length) {
    return ''
  }
  return `style:{${styleList.map((v) => `${v[0]}:${v[1]}`).join(',')}},`
}
function genEvent(events) {
  if (events && events.length) {
    return `on:{${events.map((v) => `${v.name}:${v.exp}`).join(',')}},`
  }
  return ''
}

function genClass(staticClass, classBinding) {
  if (!staticClass && !classBinding) {
    return ''
  }
  return `class: ${`_class(${JSON.stringify(staticClass)},${classBinding})`},`
}

// 生成v-for所需的函数
function genForFunc(ast) {
  return `(function(${ast.alias}${ast.iterator1 ? `,${ast.iterator1}` : ''}${
    ast.iterator2 ? `,${ast.iterator2}` : ''
  }){` +
    `with(this){return ${gen(ast)}}` +
  `}).bind(this)`
}

// 生成v-if v-else-if v-else的函数
function genIf(ifConditions) {
  return `${ifConditions
    .map((v) => `${v.exp}?${gen(v.block)}`)
    .join(':')}:undefined`
}

// a ? ablock :
//   b ? bblock :
//     c ? cblock : undefined

function genChildren(ast) {
  if (ast.children) {
    return `[${ast.children
      .map((v) => gen(v))
      .filter((v) => v)
      .join(',')}]`
  }
}
