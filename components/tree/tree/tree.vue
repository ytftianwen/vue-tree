<template>
    <div class="fui-tree">
      <div class="fui-tree__content">
        <input type="checkbox" v-model="node.checked" @click.stop.native @change="checkboxChange"> <span>{{node.content}}</span>
      </div>
      <div class="FUI-tree__children">
        <fui-tree v-for="node in node.children" :node="node"></fui-tree>
      </div>
    </div>
</template>
<script>
  export default {
    name: 'fuiTree',
    props: {
      node: Object
    },
    data () {
      return {
        msg: 'hello, vue'
      }
    },
    methods: {
      checkboxChange () {
        this.node.setChecked(this.node.checked, true)
      }
    },
    mounted () {
      console.log('node----', this.node)
    }
  }
</script>
