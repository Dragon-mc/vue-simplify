import { addProp } from './parseBind'
import { addHandler } from './parseOn'

/**
 * 处理指令
 * v-for
 * v-if v-else-if v-else
 * v-show
 */
export function parseDirective(el, attr, value) {
  // 先从属性map中删除
  delete el.attrsMap[attr]
  // 得到指令的名字，v-for -> for
  attr = attr.slice(2)
  const strategy = directiveMap[attr]
  strategy && strategy(el, value)
}

const forReg = /^\s*(.+)\s+(?:in|of)\s+([^\s]+)\s*$/
const trimBracket = /^\(|\)$/g
const aliasReg = /^([^,]+)(?:,(.+))?(?:,(.+))?$/
const directiveMap = {
  for: function parseFor(el, exp) {
    // 分解表达式
    const match = exp.match(forReg)
    if (match) {
      el.for = match[2]
      let alia = match[1].trim()
      alia = alia.replace(trimBracket, '').trim()
      const aliaMatch = alia.match(aliasReg)
      el.alias = aliaMatch[1].trim()
      if (aliaMatch[2]) {
        el.iterator1 = aliaMatch[2].trim()
      }
      if (aliaMatch[3]) {
        el.iterrator2 = aliaMatch[3].trim()
      }
    } else {
      throw new SyntaxError(`The expression "${exp}" is wrong in v-for`)
    }
  },
  // 解析if，将当前元素加入ifConditions条件中
  if: function parseIf(el, exp) {
    if (!el.ifConditions) el.ifConditions = []
    el.ifConditions.push({
      exp,
      block: el
    })
  },
  // 解析else-if，将条件加入到之前ifConditions中即可，并在父ast中删除此ast
  'else-if': function parseElseIf(el, exp) {
    // 找到元素在父亲中的位置
    const parentChildren = el.parent.children
    const idx = parentChildren.indexOf(el)
    // 如果有else-if指令的元素是父亲的第一个子元素
    // 或者它的上一个节点元素不是if指令，则指令使用错误
    const preSibiling = findPre(parentChildren, idx)
    if (!preSibiling || !preSibiling.ifConditions) {
      throw new SyntaxError(`v-else-if must be used after v-if`)
    }
    // 加入到ifConditions条件中用于渲染
    preSibiling.ifConditions.push({
      exp,
      block: el
    })
    // 从父ast中删除本身
    parentChildren.splice(idx, 1)
  },
  // 解析else，与else-if基本一致
  else: function parseElse(el) {
    const parentChildren = el.parent.children
    const idx = parentChildren.indexOf(el)
    const preSibiling = findPre(parentChildren, idx)
    if (!preSibiling || !preSibiling.ifConditions) {
      throw new SyntaxError(`v-else must be used after v-if or v-else-if`)
    }
    preSibiling.ifConditions.push({
      exp: 'true',
      block: el
    })
    parentChildren.splice(idx, 1)
  },
  // 处理show
  show: function parseShow(el, value) {
    // 添加用于渲染的表达式即可
    el.show = value
  },
  model: function parseModel(el, value) {
    // 添加value属性
    addProp(el, 'value', value)
    // 添加input监听，并对应改变value属性
    addHandler(el, 'input', `function(e){` +
      `${value}=e.target.value` +
    `}`)
  },
  // text
  text: function parseText(el, value) {
    addProp(el, 'innerText', value)
  },
  // html
  html: function parseHtml(el, value) {
    addProp(el, 'innerHTML', value)
  }
}


function findPre(els, index) {
  let sibiling = null
  for (let i = index - 1; i >= 0; i--) {
    if (els[i].type === 1) {
      sibiling = els[i]
      break
    }
  }
  return sibiling
}