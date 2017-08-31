/**
 * Created by haolongfei on 2016/12/30.
 */
import template from './view.html'

export default {
  name: 'ui-multi-node',
  template,
  props: {
    node: {
      required: true
    },
    showSign: {
      type: Boolean,
      default: false
    },
    showCheckbox: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {}
  },
  methods: {
    expandToggle () {
      this.node.toggleExpanded()
    },
    checkToggle (index) {
      this.node.setChecked(index, !this.node.items[ index ].checked, true)
      this.$dispatch('select', this.node)
    },
    select (nodeList) {
      if (Array.isArray(nodeList)) {
        nodeList.push(this.node)
      } else {
        nodeList = [ nodeList, this.node ]
      }
      this.$dispatch('select', nodeList)
    }
  },
  created () {
  }
}
