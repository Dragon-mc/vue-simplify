import { parseHtml } from './parseHtml'
import { createMap } from '../utils'
import { parseDirective } from './tools/parseDirective'
import { parseBind } from './tools/parseBind'
import { parseOn } from './tools/parseOn'
import { parseStyle } from './tools/parseStyle'
import { parseClass } from './tools/parseClass'
import { propKey } from './tools/parseBind'

const unaryMap = createMap('br, hr, img, input, param, meta, link')
const musthechReg = /\{\{(.+?)\}\}/g

function listToMap(list) {
  const map = {}
  for (let i in list) {
    map[list[i][0]] = list[i][1]
  }
  return map
}

function createAst(tag, attrsList, parent) {
  return {
    // 1为元素，2为表达式，3为普通文本
    type: 1,
    tag,
    attrsMap: listToMap(attrsList),
    attrsList,
    parent,
    children: []
  }
}

function closeElement(el) {
  el.attrsList.forEach(v => {
    let attr = v[0], value = v[1]
    // 处理所有指令
    if (attr.indexOf('v-') === 0) {
      parseDirective(el, attr, value)
    }
    // 处理属性绑定
    else if (attr.indexOf('v-bind:') === 0 || attr.indexOf(':') === 0) {
      parseBind(el, attr, value)
    }
    // 处理事件绑定
    else if (attr.indexOf('v-on:') === 0 || attr.indexOf('@') === 0) {
      parseOn(el, attr, value)
    }
    // 单独处理style
    else if (attr === 'style') {
      delete el.attrsMap[attr]
      el.staticStyle = parseStyle(value, true)
    } else if (attr === 'class') {
      delete el.attrsMap[attr]
      parseClass(el, value)
    } else {
      // 其他静态属性转为静态字符串
      if (propKey[attr]) {
        // 如果是prop，即dom元素自身的属性，添加进入propsMap
        !el.propsMap && (el.propsMap = {})
        el.propsMap[attr] = JSON.stringify(el.attrsMap[attr])
        delete el.attrsMap[attr]
      } else {
        el.attrsMap[attr] = JSON.stringify(el.attrsMap[attr])
      }
    }
  })
}

export function parse(template) {
  let currentParent = null,
    root = null,
    stack = []

  function popStack() {
    const pre = stack.pop()
    currentParent = stack.length ? stack[stack.length - 1] : null
    return pre
  }

  parseHtml(template, {
    start(tagName, attrsList, unary) {
      const ele = createAst(tagName, attrsList, currentParent, unary)
      stack.push(ele)
      if (currentParent) {
        currentParent.children.push(ele)
      } else {
        root = ele
      }
      currentParent = ele
    },
    end(tagName) {
      // 闭合标签之前清空所有单标签
      while (unaryMap[currentParent.tag]) {
        closeElement(currentParent)
        popStack()
      }
      // 如果清空标签后，栈为空或栈顶标签与tagName不匹配，则词法错误
      if (!currentParent || currentParent.tag !== tagName) {
        throw new SyntaxError(`The tag "${tagName}" cannot find property tag`)
      }
      // 正确闭合当前标签
      const ele = popStack()
      // 处理正确闭合的ast
      closeElement(ele)
    },
    chars(text) {
      // 遇到文本后应该闭合前面所有单标签
      while (unaryMap[currentParent.tag]) {
        closeElement(currentParent)
        popStack()
      }
      const children = currentParent.children
      let match, last = 0, res = []
      if (!children.length && text === ' ') {
        // 如果出现的第一个子节点时空白，则不会加入该空白符为子节点
        text = ''
      } else {
        // 处理表达式
        musthechReg.lastIndex = 0
        while (match = musthechReg.exec(text)) {
          const preText = text.slice(last, match.index)
          preText && res.push(JSON.stringify(preText))
          res.push(`_s(${match[1].trim()})`)
          last = match.index + match[0].length
        }
        if (last && last < text.length) {
          res.push(JSON.stringify(text.slice(last)))
        }
      }

      if (text && text !== ' ') {
        let child
        if (res.length) {
          child = {
            type: 2,
            exp: res.join('+')
          }
        } else {
          child = {
            type: 3,
            text: JSON.stringify(text)
          }
        }

        if (child) {
          children.push(child)
        }
      }
    }
  })

  return root
}