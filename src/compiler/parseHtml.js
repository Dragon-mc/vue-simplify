const startOpen = /^<([^\s>\/]+[0-9]?)/
const startClose = /^\s*(\/)?>/
const endTag = /^<\/([^\s>]+)\s*>/
const attrReg = /\s*([^=\s>]+)(?:="([^>]*?)")?/
const textReg = /[^><]*/
const whitespaceRE = /[ \f\t\r\n]+/g

export function parseHtml(html, options) {
  html = html.trim()
  while (html) {
    if (html.indexOf('<') === 0) {
      const comment = html.indexOf('<!--')
      if (comment === 0) {
        const commentEnd = html.indexOf('-->')
        if (commentEnd >= 4) {
          // 可以找到符合注释结尾条件的标记，不渲染注释，直接跳过
          advance(commentEnd + 3)
          continue
        }
      }

      const match = html.match(startOpen)
      if (match) {
        const tagName = match[1]
        advance(match[0].length)
        // 匹配属性
        let attr, end, attrsList = []
        while (!(end = html.match(startClose)) && (attr = html.match(attrReg))) {
          advance(attr[0].length)
          attrsList.push([attr[1], attr[2]])
        }
        if (end) {
          // 开始标签结尾
          let unary = !!end[1]
          advance(end[0].length)
          options.start && options.start(tagName, attrsList, unary)
        }
        continue
      }

      const endMatch = html.match(endTag)
      if (endMatch) {
        advance(endMatch[0].length)
        const tagName = endMatch[1]
        options.end && options.end(tagName)
        continue
      }
    }

    // 处理文本节点等
    const textMatch = html.match(textReg)
    if (textMatch) {
      advance(textMatch[0].length)
      let text = textMatch[0].replace(whitespaceRE, ' ')
      if (text) {
        options.chars && options.chars(text)
      }
    }
  }

  function advance(step) {
    html = html.slice(step)
  }
}