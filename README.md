# vue-simplify
a simple implementation fro vue.js

## 关于实现内容
### 模板编译
1. 实现基本的模板遍历，能解析简单的标签组合，以及一些常见的单标签
2. 并未实现错误检测，以及一些标签自动补全等

### 渲染函数
1. 可以从ast生成渲染函数，但未做optimize操作

### 关于指令实现
1. v-if v-else-if v-else
2. v-show
3. v-for
4. v-model
5. v-text
6. v-html

### 实例初始化
可以使用的options选项如下
1. el
2. template
3. data
4. computed
5. methods
6. watch

当然实现得非常简陋，里面会有非常多bug，作为一个学习过程，但是其中的整体流程大致就是这样
从 模板编译->渲染函数->实例初始化->最终挂载真实dom
