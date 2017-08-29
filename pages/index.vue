<template>
  <section class="container">
    <tree :data="data" :root-data="data" :default-checked-keys="defaultCheckedKeys"></tree>
  </section>
</template>

<script>
import tree from '~/components/tree.vue'

export default {
  components: {
    tree
  },
  data () {
    return {
      data: {
        id: 1,
        content: '一级 1',
        children: [{
          id: 4,
          content: '二级1-1',
          children: [{
            id: 9,
            content: '三级1-1-1'
          }]
        }]
      },
      defaultCheckedKeys: [4]
    }
  }
}
</script>
<style>
  .container {
    margin: 20px;
  }
</style>
