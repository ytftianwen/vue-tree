<template>
  <div class="fui-tree">
    <div class="fui-tree-content" :class="{'is-folder': isFolder}">
      <input type="checkbox" v-model="data.checked" @click.native.stop @change="handleCheckedChange"><span>{{data.content}}</span>
    </div>
    <div class="fui-tree-children">
      <tree-node v-for="child in data.children" :data="child" :root-data="rootData"></tree-node>
    </div>
  </div>

</template>
<script>
  export default {
    name: 'tree-node',
    props: {
      data: Object,
      rootData: Object
    },
    computed: {
      isFolder: function () {
        return this.data && this.data.children && this.data.children.length
      }
    },
    data () {
      return {}
    },
    methods: {
      handleCheckedChange () {
        console.log('------', this.rootData)
        this.$set(this.rootData, 'checked', this.data.checked)
      }
    }
  }
</script>
<style>
  .fui-tree {
    padding: 10px;
  }
  .fui-tree-content {
    height: 36px;
  }
  .fui-tree-children {
    padding-left: 20px;
  }
</style>


