import { Mvvm } from './core/instance'

const vm = new Mvvm({
  el: '#app',
  data: {
    variable: 'v1',
    var2: 'v2',
    list: [1, 2, 3, 4, 5],
    title: 'render-func',
    isShow: true,
    firstName: 'w',
    lastName: 'fy',
    deepObj: {
      a: {
        b: '123',
      },
    },
    htmlText: '<div>v-html</div>',
    text: '<div>v-text</div>'
    // comp1: '11'
  },
  computed: {
    comp1() {
      return this.firstName + this.lastName
    },
    comp2() {
      return this.comp1 + this.title
    },
  },
  methods: {
    handleClick() {
      // this.var2 = 'change'
      // console.log('click11' + this.var2)
      // this.$nexttick(() => {
      //   console.log(document.getElementById('change').innerHTML)
      // })
      this.firstName = 'hhh'
      this.lastName = '+lkwg'
      this.var2 = 'change'
      this.deepObj = '333'
      console.log('hhh')
    },
    watchHandler(newV, oldV) {
      this.title = 'new title'
      console.log(newV, oldV)
      console.log('deep change')
    },
  },
  watch: {
    deepObj: 'watchHandler',
    title() {
      this.variable = 'variable change'
      console.log('title change')
    },
    variable() {
      console.log('var change')
    }
  },
})

console.log(vm)
