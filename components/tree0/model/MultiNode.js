/**
 * Created by haolongfei on 2016/11/4.
 */
function checkParent (parent, i) {
  let children = parent.children
  let isAll = true
  let hasChecked = false
  children.forEach((child) => {
    let s = child.items[ i ]
    isAll = isAll && s.checked
    if (s.checked || s.halfChecked) {
      hasChecked = true
    }
  })
  parent.items[ i ].halfChecked = isAll ? false : hasChecked
  parent.setChecked(i, isAll, false, true)
}

export default class Node {
  constructor (options) {
    this.expanded = true
    this.data = null
    this.text = ''
    this.value = ''
    this.items = [ {
      checked: false,
      disabled: false,
      halfChecked: false,
      text: '',
      value: ''
    }, {
      checked: false,
      disabled: false,
      halfChecked: false,
      text: '',
      value: ''
    } ]
    this.parent = null
    for (let name in options) {
      if (options.hasOwnProperty(name)) {
        if (name === 'items') {
          // 初始化联动
          if (options.items[ 1 ].checked) {
            options.items[ 0 ].checked = true
            options.items[ 0 ].disabled = true
          }
          this.items.forEach((i, index) => {
            Object.assign(i, options.items[ index ])
          })
        } else {
          this[ name ] = options[ name ]
        }
      }
    }
    this.isLeaf = false
    this.level = -1
    this.children = []
    this.path = ''
    if (this.parent) {
      this.path = this.parent.path + '/' + this.value
    } else {
      this.path = this.value
    }

    if (this.data) {
      this.setData(this.data, options.items)
      this.isLeaf = false
    } else {
      this.isLeaf = true
    }
    // 判断选中状态, 和禁用状态
    this.children.length && this.items.forEach((i, index) => {
      if (!i.checked) {
        let isAll = true
        let hasChecked = false
        this.children.forEach((child) => {
          let s = child.items[ index ]
          isAll = isAll && s.checked
          if (s.checked || s.halfChecked) {
            hasChecked = true
          }
        })
        i.checked = isAll
        i.halfChecked = isAll ? false : hasChecked
      }
      if (!i.disabled) {
        for (let child of this.children) {
          let s = child.items[ index ]
          if (s.disabled) {
            i.disabled = true
            break
          }
        }
      }
    })

    // 建立读和写之间的联动
    let writeChecked = this.items[ 1 ].checked
    let self = this
    Object.defineProperty(this.items[ 1 ], 'checked', {
      get () {
        return writeChecked
      },
      set (val) {
        if (val) {
          writeChecked = true
          self.setChecked(0, true, true)
          if (!self.items[0].disabled) {
            self.setDisabled(0, true)
          }
        } else {
          writeChecked = false
          if (self.items[0].disabled && !self.children.find(i => i.items[0].disabled)) {
            self.setDisabled(0, false)
          }
        }
      }
    })
  }

  toggleExpanded () {
    this.expanded = !this.expanded
  }

  findNode (path) {
    let segs = path.split('/')
    let node = this
    for (let seg of segs) {
      node = node.children.find((n) => +seg === +n.value)
      if (!node) {
        return null
      }
    }
    return node
  }

  setChecked (i, value, deep = true, up = true) {
    let item = this.items[ i ]
    item.checked = (value === true)
    if (deep) { // 手动设置时，将状态设置为false
      item.halfChecked = false
    }
    let vm = {}
    for (let key in this) {
      if (this.hasOwnProperty(key)) {
        vm[key] = this[key]
      }
    }
    if (deep) { // 向下递归
      this.children.forEach((node) => {
        node.setChecked(i, value, true, false)
      })
    }
    if (this.parent && up) { // 向上递归
      checkParent(this.parent, i)
    }
  }

  setAllChecked (value, deep) {
    this._setItems('checked', value === true)
    if (deep) {
      this.children.forEach((node) => {
        node.setAllChecked(value, true)
      })
    }
    if (this.parent && (this.parent.items.reduce((pre, i) => pre && i.disabled, true) !== value)) {
      let len = this.items.length
      for (let i = 0; i < len; i++) {
        checkParent(this.parent, i)
      }
    }
  }

  /**
   * 禁用本节点，子节点和父节点
   * @param i
   * @param value
   * @param deep
   */
  setDisabled (i, value, deep) { // disabled parent and children
    this.items[ i ].disabled = (value === true)
    if (deep) {
      this.children.forEach((node) => {
        node.setDisabled(i, value, true)
      })
    }
    if (this.parent) {
      let item = this.parent.items[ i ]
      if ((value && item.disabled === false) ||
        (!value && !this.parent.children.find(j => j.items[i].disabled))) {
        this.parent.setDisabled(i, value)
      }
    }
  }

  setAllDisabled (value, deep) {
    this._setItems('disabled', value === true)
    if (deep) {
      this.children.forEach((node) => {
        node.setAllDisabled(value, true)
      })
    }
    if (this.parent && (this.parent.items.reduce((pre, i) => pre && i.disabled, true) !== value)) {
      this.parent.setAllDisabled(value)
    }
  }

  _setItems (key, value) {
    this.items.forEach(i => {
      if (key in i) {
        i[ key ] = value
      }
    })
  }

  getChecked (i) {
    let list = []
    if (this.children.length) {
      this.children.forEach((node) => {
        list = list.concat(node.getChecked(i))
      })
    } else {
      this.items[ i ].checked && list.push({
        text: this.text,
        value: this.value,
        path: this.path
      })
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
        items: this.items,
        path: this.path
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
      items: this.items,
      isLeaf: this.isLeaf
    })
    if (this.children.length) {
      this.children.forEach((node) => {
        list = list.concat(node.getAllNodes())
      })
    }
    return list
  }

  /**
   * 设定初始值： checked,disabled属性
   * @param data
   * @param items
   */
  setData (data, items) {
    if (Array.isArray(data)) {
      data.forEach(d => {
        d.items.forEach((item, i) => {
          if (items && items[ i ].checked) {
            item.checked = true
          }
          if (items && items[ i ].disabled) {
            item.disabled = true
          }
        })
        d.parent = this
        this.insertChild(d)
      })
    }
  }

  insertChild (d) {
    let node = new Node(d)
    this.children.push(node)
  }
}
