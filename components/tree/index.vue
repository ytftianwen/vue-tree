<template>
  <div v-if="!multi">
    <div v-for="node in root.children">
      <fui-tree :node="node"></fui-tree>
    </div>
  </div>
  <div v-else>
    <tree-multi v-if="multi"></tree-multi>
  </div>
</template>
<script>
  import fuiTree from './tree/tree.vue'
  import treeMulti from './tree-multi/tree-multi.vue'
  import Node from './model/Node'
  import NodeMulti from './model/NodeMulti'
  import {parseData} from './model/utils'

  console.log('tree----', fuiTree)
  export default {
    name: 'tree',
    components: {
      fuiTree,
      treeMulti
    },
    props: {
      multi: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        required: true
      },
      key: [String, Number],
      defaultCheckedKey: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data () {
      return {
        root: null
      }
    },
    methods: {
      init () {
        console.log(Node, NodeMulti)
        let data = parseData(this.data)
        if (!this.multi) {
          console.log('data-----===', data)
          this.root = new Node(data)
        }
      }
    },
    created () {
      this.init()
    }
  }
</script>
