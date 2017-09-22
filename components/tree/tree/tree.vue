<template>
    <div class="fui-tree">
      <div class="fui-tree__content">
        <input type="checkbox" v-model="treeNode.checked" @click.stop.native @change="checkboxChange"> <span>{{treeNode.content}}{{treeNode.checked}}</span>
      </div>
      <div class="fui-tree__children">
        <fui-tree-node v-for="childNode in treeNode.children" :tree-node="childNode"></fui-tree-node>
      </div>
    </div>
</template>
<script>
  import Vue from 'vue'
  import './tree.css'
  export default {
    name: 'fuiTreeNode',
    props: {
      treeNode: Object
    },
    data () {
      return {
      }
    },
    methods: {
      checkboxChange () {
        let childNodes = this.$children
        this.refreshChildNode(childNodes, this.treeNode.checked)
      },
      refreshParentNode (node) {
        if (node instanceof Vue && node.treeNode) {
          Vue.set(node.treeNode, 'checked', true)
          console.log({node})
          // node.$forceUpdate()
          this.refreshParentNode(node.$parent) // 递归更新父组件数据
        }
      }
    },
    created () {
      if (!this.treeNode.children || !this.treeNode.children.length) { // 从树的最底级向上渲染父级
        this.refreshParentNode(this)
      }
    }
  }
</script>
