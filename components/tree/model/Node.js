export default class Node {
  constructor (options) {
    for (let v in options) {
      if (options.hasOwnProperty(v)) {
        this[v] = options[v]
      }
    }
    // 初始化的内部变量
    this.initCheckedNodes = []
    this.initAllCheckedKeys = []
    this._initData()
    //  set checked相关内部变量
    this._setCheckedRoot = {}
    this._setCheckedKeys = []
  }
  setChecked (key, status) {
    this._setCheckedNode(this.data, key)
    this._setCheckedKey(this._setCheckedRoot)
    this._setCheckedStatus(this.data, status)
    console.log('changed data...', JSON.stringify(this.data, null, 2))
  }
  _setCheckedNode (treeNodes, key) {
  //  查找点击checkbox的node节点
    if (!treeNodes || !treeNodes.length) return null
    for (let item of treeNodes) {
      console.log(item.key, key, item.key === key)
      if (item.key === key) {
        console.log('**', item)
        this._setCheckedRoot = [item]
        return
      }
      if (item.children && item.children.length) this._setCheckedNode(item.children, key)
    }
  }
  _setCheckedKey (nodes) {
    console.log('=========', nodes)
    if (!nodes || !nodes.length) return
    for (let item of nodes) {
      let child = item.children
      this._setCheckedKeys.push(item.key)
      if (child && child.length) this._setCheckedKey(child)
    }
  }
  _setCheckedStatus (treeNodes, status) {
    if (!treeNodes || !treeNodes.length) return
    for (let item of treeNodes) {
      item.checked = status
      if (item.children && item.children.length) this._setCheckedStatus(item.children, status)
    }
  }
  _initData () {
    this._findNode(this.data)
    this._findKeys(this.initCheckedNodes)
    this._initCheckedStatus(this.data)
  }
  _findNode (treeNodes) {
    if (!treeNodes || !treeNodes.length) return
    for (let item of treeNodes) {
      if (this.defaultKeys.includes(item.key)) this.initCheckedNodes.push(item)
      if (item.children && item.children.length) this._findNode(item.children)
    }
  }
  _findKeys (nodes) {
    if (!nodes || !nodes.length) return
    for (let item of nodes) {
      let child = item.children
      this.initAllCheckedKeys.push(item.key)
      if (child && child.length) this._findKeys(child)
    }
  }
  _initCheckedStatus (treeNodes) {
    if (!treeNodes || !treeNodes.length) return
    for (let item of treeNodes) {
      item.checked = false
      if (this.initAllCheckedKeys.includes(item.key)) item.checked = true
      if (item.children && item.children.length) this._initCheckedStatus(item.children)
    }
  }
}
