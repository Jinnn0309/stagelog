// 演出列表组件
Component({
  properties: {
    filter: {
      type: String,
      value: 'all' // 'towatch' | 'watched' | 'all'
    },
    showEmpty: {
      type: Boolean,
      value: true
    },
    showActions: {
      type: Boolean,
      value: true
    }
  },

  data: {
    records: [],
    filteredRecords: [],
    theme: ''
  },

  lifetimes: {
    attached() {
      console.log('show-list组件attached，加载记录')
      this.loadRecords()
    }
  },

  pageLifetimes: {
    show() {
      console.log('show-list组件show，重新加载记录')
      this.loadRecords()
    }
  },

  methods: {
    // 加载记录
    loadRecords() {
      const { getRecords } = require('../services/storageService')
      const app = getApp()
      
      const records = getRecords()
      console.log('show-list加载记录总数:', records.length)
      const filteredRecords = this.filterRecords(records)
      console.log('show-list过滤后记录数:', filteredRecords.length)
      
      this.setData({
        records,
        filteredRecords,
        theme: app.getTheme()
      })
    },

    // 过滤记录
    filterRecords(records) {
      const { filter } = this.properties
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      switch (filter) {
        case 'towatch':
          return records.filter(record => {
            const recordDate = new Date(record.date)
            recordDate.setHours(0, 0, 0, 0)
            return recordDate >= today
          }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        
        case 'watched':
          return records.filter(record => {
            const recordDate = new Date(record.date)
            recordDate.setHours(0, 0, 0, 0)
            return recordDate < today
          }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        
        default:
          return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      }
    },

    // 点击记录
    onRecordTap(e) {
      const { id } = e.currentTarget.dataset
      this.triggerEvent('select', { id })
    },

    // 编辑记录
    onEditRecord(e) {
      // 微信小程序中使用catchtap替代bindtap来阻止冒泡
      const { id } = e.currentTarget.dataset
      console.log('编辑按钮点击，记录ID:', id)
      // 使用更明确的事件触发方式
      this.triggerEvent('edit', {
        bubbles: false,
        composed: false,
        detail: { id }
      })
    },

    // 删除记录
    onDeleteRecord(e) {
      // 微信小程序中使用catchtap替代bindtap来阻止冒泡
      const { id } = e.currentTarget.dataset
      console.log('删除按钮点击，记录ID:', id)
      // 使用更明确的事件触发方式
      this.triggerEvent('delete', {
        bubbles: false,
        composed: false,
        detail: { id }
      })
    },

    // 格式化价格
    formatPrice(price) {
      if (!price || price === 0) return '--'
      return `¥${Number(price).toFixed(2)}`
    },

    // 格式化日期
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    }
  }
})