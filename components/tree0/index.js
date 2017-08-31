/**
 * Created by haolongfei on 2016/12/30.
 */
import uiSingleNode from './singleNode'
import uiMultiNode from './mutilNode'
import Node from './model/Node.js'
import MultiNode from './model/MultiNode.js'
import template from './view.html'
import style from './style.less'

export default{
  name: 'fuiTree',
  template,
  props: {
    data: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      default: 'tree'
    },
    showSign: {
      type: Boolean,
      default: false
    },
    showCheckbox: {
      type: Boolean,
      default: true
    },
    isSingleSelect: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      style,
      root: null,
      selectList: []
    }
  },
  watch: {
    data () {
      this.init()
    }
  },
  methods: {
    init () {
      let data = transData(this.data)
      let selectList = []
      if (this.type === 'tree') {
        this.root = new Node(data, this.isSingleSelect)
        selectList = this.root.getChecked()
      } else {
        this.root = new MultiNode(data)
        selectList = this.root.getLeafs()
      }
      this.$dispatch('node-select', selectList)
    },
    select (nodeList) {
      if (!Array.isArray(nodeList)) {
        nodeList = [ nodeList ]
      }
      if (this.type === 'tree') {
        let clickNode = nodeList[0]
        this.$dispatch('node-click', nodeList.reverse().map(i => {
          return i
        }))
        if (this.isSingleSelect) {
          this.root.resetNodeExcept(clickNode)
        } else {
          this.$dispatch('node-select', this.getCheckedNodes())
        }
      } else {
        this.$dispatch('node-click', nodeList.reverse().map(i => {
          return {
            path: i.path,
            items: i.items
          }
        }))
      }
      this.$dispatch('node-leaf', this.getLeafs())
      this.$dispatch('node-all', this.getAllNodes())
    },
    /**
     * 对外方法,设置节点的属性
     * 支持：
     * setNode(path, params) params为一个对象
     * setNode(path, key, value)
     */
    setNode (path, ...data) {
      let node = this.root.findNode(path)
      let obj = {}
      if (!data.length) {
        throw Error('参数错误')
      }
      if (data.length === 1) {
        Object.prototype.toString.call(data[ 0 ]) &&
        (obj = data[ 0 ])
      } else {
        obj[ data[ 0 ] ] = data[ 1 ]
      }
      if (node) {
        for (let key in obj) {
          if (key === 'checked') {
            if (this.type === 'tree') {
              node.setChecked(obj.checked, true)
            } else {
              node.setAllChecked(obj.checked, true)
            }
          } else if (key === 'disabled') {
            if (this.type === 'tree') {
              node.setDisabled(obj.disabled, true)
            } else {
              node.setAllDisabled(obj.disabled, true)
            }
          } else {
            node.hasOwnProperty(key) && (node.key = obj[ key ])
          }
        }
      }
    },
    /**
     * 对外方法,获取选中的节点
     */
    getCheckedNodes () {
      return this.root.getChecked()
    },
    /**
     * 对外方法,获取叶子节点
     */
    getLeafs () {
      return this.root.getLeafs()
    },
    /**
     * 对外方法,获取所有节点的信息
     */
    getAllNodes () {
      return this.root.getAllNodes().slice(1)
    }
  },
  created () {
    this.init()
  },
  components: {
    uiSingleNode,
    uiMultiNode
  },
  install (Vue, envConfig) {
    Vue.component(this.name, this)
  }
}
// [{parent: null, text: '', value: ''}]
function transData (origin) {
  let root = {}
  lineToTree(origin, root)
  return root
}

function lineToTree (data, parent) {
  let children = findChildren(data, parent)
  if (children.length) {
    parent.data = children
    children.forEach(i => {
      lineToTree(data, i)
    })
  }
}

function findChildren (data, parent) {
  let res = []
  if (parent.value === undefined) {
    data.forEach(i => {
      if (i.parent === null || i.parent === undefined || i.parent === '') {
        res.push(Object.assign({}, i))
      }
    })
  } else {
    data.forEach(i => {
      if (i.parent === parent.value) {
        res.push(Object.assign({}, i))
      }
    })
  }
  return res
}
