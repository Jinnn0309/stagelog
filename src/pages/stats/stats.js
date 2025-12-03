// 统计页面
const app = getApp()
const { isLoggedIn } = require('../../utils/auth')
const { getRecords, getStatsForMonth, getStatsForYear, getStatsForDate } = require('../../services/storageService')
const { formatDate } = require('../../utils/common')

Page({
  data: {
    user: null,
    theme: '',
    timeRange: 'month', // 'day' | 'month' | 'year'
    currentDate: new Date(),
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth(),
    dateLabel: '',
    stats: {
      records: [],
      totalShows: 0,
      totalSpent: 0,
      uniqueShows: 0
    },
    locationData: [],
    pieData: []
  },

  onLoad() {
    // 检查登录状态
    if (!isLoggedIn()) {
      wx.redirectTo({
        url: '/pages/auth/auth'
      })
      return
    }

    this.setData({
      user: app.getUser(),
      theme: app.getTheme()
    })

    this.loadStats()
  },

  onShow() {
    this.loadStats()
  },

  // 加载统计数据
  loadStats() {
    const { timeRange, currentDate, currentYear, currentMonth } = this.data
    
    let stats
    if (timeRange === 'year') {
      stats = getStatsForYear(currentYear)
    } else if (timeRange === 'month') {
      stats = getStatsForMonth(currentYear, currentMonth)
    } else {
      stats = getStatsForDate(formatDate(currentDate))
    }

    const dateLabel = this.formatDateLabel()

    this.setData({
      stats,
      dateLabel
    })

    this.generateLocationData()
  },

  // 生成场馆数据
  generateLocationData() {
    const { records } = this.data.stats
    
    // 统计各场馆演出数量
    const locationMap = {}
    records.forEach(record => {
      const location = record.location || 'Unknown'
      locationMap[location] = (locationMap[location] || 0) + 1
    })

    // 转换为饼图数据
    const pieData = Object.keys(locationMap).map((location, index) => ({
      name: location,
      value: locationMap[location],
      color: this.getChartColor(index)
    }))

    this.setData({
      locationData: locationMap,
      pieData
    })
  },

  // 获取图表颜色
  getChartColor(index) {
    const colors = [
      '#ef4444', // red-500
      '#3b82f6', // blue-500
      '#10b981', // emerald-500
      '#f59e0b', // amber-500
      '#8b5cf6', // violet-500
      '#ec4899', // pink-500
      '#14b8a6', // teal-500
      '#f97316'  // orange-500
    ]
    return colors[index % colors.length]
  },

  // 切换时间范围
  onTimeRangeChange(e) {
    const timeRange = e.currentTarget.dataset.range
    const dateLabel = this.formatDateLabel()
    this.setData({
      timeRange,
      dateLabel
    })
    this.loadStats()
  },

  // 切换日期/月份/年份
  onPrevDate() {
    const { timeRange, currentDate, currentYear, currentMonth } = this.data
    
    if (timeRange === 'year') {
      this.setData({
        currentYear: currentYear - 1
      })
    } else if (timeRange === 'month') {
      const newDate = new Date(currentYear, currentMonth - 1, 1)
      this.setData({
        currentYear: newDate.getFullYear(),
        currentMonth: newDate.getMonth()
      })
    } else {
      const newDate = new Date(currentDate)
      newDate.setDate(newDate.getDate() - 1)
      this.setData({
        currentDate: newDate
      })
    }
    
    const dateLabel = this.formatDateLabel()
    this.setData({ dateLabel })
    this.loadStats()
  },

  onNextDate() {
    const { timeRange, currentDate, currentYear, currentMonth } = this.data
    
    if (timeRange === 'year') {
      this.setData({
        currentYear: currentYear + 1
      })
    } else if (timeRange === 'month') {
      const newDate = new Date(currentYear, currentMonth + 1, 1)
      this.setData({
        currentYear: newDate.getFullYear(),
        currentMonth: newDate.getMonth()
      })
    } else {
      const newDate = new Date(currentDate)
      newDate.setDate(newDate.getDate() + 1)
      this.setData({
        currentDate: newDate
      })
    }
    
    const dateLabel = this.formatDateLabel()
    this.setData({ dateLabel })
    this.loadStats()
  },

  // 格式化日期标签
  formatDateLabel() {
    const { timeRange, currentDate, currentYear, currentMonth } = this.data
    
    if (timeRange === 'year') {
      return `${currentYear}`
    } else if (timeRange === 'month') {
      return `${currentYear}.${String(currentMonth + 1).padStart(2, '0')}`
    } else {
      return `${currentMonth + 1}/${currentDate.getDate()}`
    }
  },

  // 点击记录
  onRecordTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/form/form?id=${id}&mode=view`
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadStats()
    wx.stopPullDownRefresh()
  },

  // 分享
  onShareAppMessage() {
    return {
      title: 'StageLog - 数据统计',
      path: '/pages/stats/stats'
    }
  }
})