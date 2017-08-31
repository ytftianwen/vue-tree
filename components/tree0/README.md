### 树组件
1. 参数说明
    - **data** 数据
    数据格式如下（平行结构）：
    
    ```
        // tree类型
         [{
            text: '一级', // 要显示的文本 
            value: 1,  // 唯一值
            parent: null, // 根节点该属性为空
            checked: false, // 选中转态
            diabled: false, // 禁用转态
            showSign: true // 展示收起/展开按钮
         }, {
              text: '二级',
              value: 11,
              parent: 1, // 父节点为value值为1的节点
              checked: false,
              diabled: false
         }, ...]

         // multiTree 类型
         [{
             text: '一级', // 要显示的文本
             value: 1,  // 唯一值
             parent: null, // 根节点该属性为空
             items: [{text:'读', value: '0', checked: false, diabled: false},
                     {text:'写', value: '1'}, ...] // 一个节点中的多种状态，如读、写或其他的
             showSign: true
         }, {
               text: '二级',
               value: 11,
               parent: 1, // 父节点为value值为1的节点
               items: [{text:'读', value: '0', checked: false, diabled: false}, ...]
          }, ...]
    ```
    - **options**  配置选项
       showSign // 默认false，展示收起/展开按钮，在节点中配置的优先级更高
       showCheckbox // 默认true, 是否可选
       type // 支持'tree' | 'multiTree'两种类型，默认'tree'
       isSingleSelect // 默认false, 是否是单选
2.  事件
       node-click事件：每次点击的时候触发，回调函数fn(list), list为点击的节点冒泡到根节点的所有节点
       node-select事件：每次选择的时候触发，回调函数fn(list), list为选择的叶子节点 (初始的时候默认触发)
3. 使用方法
    - html

        ```
        <fui-tree :data="list" :showSign="true" @node-select="select" @node-click="click"></fui-tree>
        ```
