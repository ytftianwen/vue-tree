<template>
  <section class="container">
    <tree :data="data" :default-keys="defaultKeys"></tree>
  </section>
</template>

<script>
import tree from '../components/tree/index.vue'
export default {
  components: {
    tree
  },
  data () {
    return {
      data0: [{
        content: '一级', // 要显示的文本
        value: 1, // 唯一值
        parent: null, // 根节点该属性为空
        checked: false, // 选中转态
        disabled: false, // 禁用转态
        showSign: true // 展示收起/展开按钮
      }, {
        content: '二级',
        value: 11,
        parent: 1, // 父节点为value值为1的节点
        checked: false,
        disabled: false
      }, {
        content: '三级',
        value: 111,
        parent: 11, // 父节点为value值为1的节点
        checked: false,
        disabled: false
      }],
      defaultKeys: [],
      data: [{
        key: 1,
        content: '一级1',
        children: [{
          key: 4,
          content: '二级1-1'
        }]
      }]
    }
  },
  created () {
  }
}
</script>
<style>
  .container {
    margin: 20px;
  }
</style>
