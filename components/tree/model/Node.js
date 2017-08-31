export default class Node {
  constructor (options, isSingle = false) {
    this.expanded = true
    this.checked = false
    this.halfChecked = false
    this.disabled = false
    this.isLeaf = false
    this.text = ''
    this.value = ''
    this.parent = null
    this.data = null

    // 节点赋值
    for (let name in options) {
      if (options.hasOwnProperty(name)) {
        this[ name ] = options[ name ]
      }
    }

    // 内部属性
    this.level = -1
    this.children = []
    this.path = ''
    this.isSingleSelect = isSingle

    // 判定节点的路径
    if (this.parent) {
      this.path = this.parent.path + '/' + this.value
    } else {
      this.path = this.value
    }

    // 递归的设置下一级节点
    if (this.data) {
      this.setData(this.data, options)
      this.isLeaf = false
    } else {
      this.isLeaf = true
    }

    // 检测子节点是否全部选中
    if (!this.isSingleSelect && this.children.length) {
      let isAll = true
      let hasChecked = false
      this.children.forEach((child) => {
        isAll = isAll && child.checked
        if (child.checked || child.halfChecked) {
          hasChecked = true
        }
      })
      this.checked = isAll
      this.halfChecked = isAll ? false : hasChecked
    }
  }

  toggleExpanded () {
    this.expanded = !this.expanded
  }

  findNode (path) {
    let segs = path.split('/')
    let node = this
    // console.info(node.children)
    for (let seg of segs) {
      node = node.children.find((n) => +seg === +n.value)
      if (!node) {
        return null
      }
    }
    return node
  }

  setChecked (value, deep = true, up = true) {
    this.checked = (value === true)
    if (!this.isSingleSelect) {
      if (deep) { // checkParent中设置了该属性，不用再设置
        this.halfChecked = false
      }
      if (deep) {
        this.children.forEach((node) => {
          node.setChecked(value, true, false)
        })
      }
      if (this.parent && up) {
        this.checkParent(this.parent)
      }
    }
  }
  checkParent (parent) {
    let children = parent.children
    let isAll = true
    let hasChecked = false
    children.forEach(child => {
      isAll = isAll && child.checked
      if (child.checked || child.halfChecked) {
        hasChecked = true
      }
    })
    parent.halfChecked = isAll ? false : hasChecked
    parent.setChecked(isAll, false, true)
  }
  resetNodeExcept (node) {
    if (node !== this) {
      this.checked = false
    }
    this.children.forEach((i) => {
      i.resetNodeExcept(node)
    })
  }

  getChecked () {
    let list = []
    if ((!this.isSingleSelect || !this.checked) && this.children.length) {
      for (let node of this.children) {
        list = list.concat(node.getChecked())
        if (this.isSingleSelect && list.length) {
          break
        }
      }
    } else {
      this.checked && list.push(this)
    }
    return list
  }

  getLeafs () {
    let list = []
    if (this.children.length) {
      this.children.forEach((node) => {
        list = list.concat(node.getLeafs())
      })
    } else {
      list.push({
        text: this.text,
        value: this.value,
        path: this.path,
        checked: this.checked,
        disabled: this.disabled,
        halfChecked: this.halfChecked
      })
    }
    return list
  }

  getAllNodes () {
    let list = []
    list.push({
      text: this.text,
      value: this.value,
      path: this.path,
      checked: this.checked,
      disabled: this.disabled,
      halfChecked: this.halfChecked,
      isLeaf: this.isLeaf
    })
    if (this.children.length) {
      this.children.forEach((node) => {
        list = list.concat(node.getAllNodes())
      })
    }
    return list
  }

  setDisabled (value, deep) { // disabled parent and children
    this.disabled = (value === true)
    if (deep) {
      this.children.forEach((node) => {
        node.setDisabled(value, true)
      })
    }
    if (this.parent && (this.parent.disabled !== value)) {
      this.parent.setDisabled(value)
    }
  }

  setData (data, options) {
    console.log('node data----', data)
    if (Array.isArray(data)) {
      data.forEach((d) => {
        if (!this.isSingleSelect && options.checked) {
          d.checked = true
        }
        if (options.disabled) {
          d.disabled = true
        } else {
          if (d.disabled) {
            this.setDisabled(true)
          }
        }
        d.parent = this
        this.insertChild(d)
      })
    }
  }

  insertChild (d) {
    let node = new Node(d, this.isSingleSelect)
    this.children.push(node)
  }

  toJSON () {
    let obj = {}
    for (let key in this) {
      if (typeof this[ key ] === 'function' || ([ 'parent', 'data', 'children' ].includes(key))) {
        break
      } else {
        obj[ key ] = this[ key ]
      }
    }
    return obj
  }
}
