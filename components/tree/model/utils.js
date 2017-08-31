export const parseData = data => {
  let result = {}
  linToTree(data, result)
  return result
}
export const linToTree = (data, parent) => {
  let children = findChildren(data, parent)
  if (children.length) {
    parent.data = children
    children.forEach(i => {
      linToTree(data, i)
    })
  }
}
export const findChildren = (data, parent) => {
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

export class ParseTree {
  constructor (options) {
    //  内部属性
    this.treeLine = []
  }

  tree2Line (tree, treeKey = 'id', isRoot = true, root = null) {
    if (!tree || !tree.children) return this.treeLine
    let obj = {}
    for (let key in tree) {
      if (tree.hasOwnProperty(key) && key !== 'children') {
        obj[key] = tree[key]
      }
    }
    obj.parent = isRoot ? null : root[treeKey]
    this.treeLine.push(obj)
    for (let child of tree.children) {
      if (child && child.children) {
        this.tree2Line(child, treeKey, false, tree)
      } else if (child && !child.children) { // 最后一层
        child.parent = tree[treeKey]
        this.treeLine.push(child)
        return this.treeLine
      }
    }
  }

  line2Tree (data, value = 'id', parentId = 'parent') {
    let children = 'children'
    let valueMap = []
    let tree = []
    data.forEach(v => {
      valueMap[v[value]] = v
    })
    data.forEach(v => {
      let parent = valueMap[v[parentId]]
      if (parent) {
        !parent[children] && (parent[children] = [])
        parent[children].push(v)
      } else {
        tree.push(v)
      }
    })
    return tree
  }
}