<template>
  <div>
    <div v-for="node in data">
      <fui-tree-node :tree-node="node"></fui-tree-node>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import fuiTreeNode from './tree/tree.vue'
  import Node from './model/Node'
  export default {
    name: 'tree',
    components: {
      fuiTreeNode
    },
    props: {
      data: Array,
      defaultKeys: Array
    },
    data () {
      return {
        bus: null
        // data2: []
      }
    },
    watch: {
      data: {
        deep: true,
        handler: function (val, oldVal) {
          debugger
          console.log('......')
        }
      }
    },
    computed: {
    },
    methods: {
      init () {
        let ops = {
          data: this.data,
          defaultKeys: this.defaultKeys
        }
        this.root = new Node(ops)
      }
    },
    created () {
      // Vue.set(this, 'data2', Object.assign([], this.data))
      this.bus = new Vue()
      this.init()
      console.log('origin data...', this.data, null, 2)
    }
  }
</script>
