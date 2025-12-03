// 日历页面
const app = getApp()
const { isLoggedIn } = require('../../utils/auth')
const { getRecords } = require('../../services/storageService')
const { formatDate } = require('../../utils/common')

Page({
  data: {
    user: null,
    theme: '',
    currentDate: new Date(),
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth(),
    records: [],
    calendarDays: [],
    weekDays: ['日', '一', '二', '三', '四', '五', '六'],
    monthStats: {
      totalShows: 0,
      totalSpent: 0
    }
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

    this.loadRecords()
    this.generateCalendar()
  },

  onShow() {
    this.loadRecords()
    this.generateCalendar()
  },

  // 加载记录
  loadRecords() {
    const records = getRecords()
    this.setData({
      records: records.filter(r => r.status === 'watched')
    })
    this.calculateMonthStats()
  },

  // 计算当月统计
  calculateMonthStats() {
    const { currentYear, currentMonth, records } = this.data
    const monthRecords = records.filter(r => {
      const d = new Date(r.date)
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth
    })

    this.setData({
      monthStats: {
        totalShows: monthRecords.length,
        totalSpent: monthRecords.reduce((sum, r) => sum + r.price, 0)
      }
    })
  },

  // 生成日历数据
  generateCalendar() {
    const { currentYear, currentMonth, records } = this.data
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    
    const calendarDays = []

    // 添加空白天数
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push({
        day: '',
        isCurrentMonth: false,
        records: []
      })
    }

    // 添加当月天数
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = formatDate(new Date(currentYear, currentMonth, i))
      const dayRecords = records.filter(r => r.date === dateStr)
      
      calendarDays.push({
        day: i,
        isCurrentMonth: true,
        dateStr,
        records: dayRecords,
        hasRecord: dayRecords.length > 0,
        primaryRecord: dayRecords[0] || null,
        multipleRecords: dayRecords.length > 1
      })
    }

    this.setData({
      calendarDays,
      currentDate: new Date(currentYear, currentMonth, 1)
    })
  },

  // 上一个月
  onPrevMonth() {
    let { currentYear, currentMonth } = this.data
    currentMonth--
    if (currentMonth < 0) {
      currentMonth = 11
      currentYear--
    }
    
    this.setData({
      currentYear,
      currentMonth
    })
    
    this.generateCalendar()
    this.calculateMonthStats()
  },

  // 下一个月
  onNextMonth() {
    let { currentYear, currentMonth } = this.data
    currentMonth++
    if (currentMonth > 11) {
      currentMonth = 0
      currentYear++
    }
    
    this.setData({
      currentYear,
      currentMonth
    })
    
    this.generateCalendar()
    this.calculateMonthStats()
  },

  // 点击日历天
  onDayTap(e) {
    const { day, dateStr, hasRecord } = e.currentTarget.dataset
    if (!hasRecord || !dateStr) return

    // 可以在这里显示当天的演出详情
    const { records } = this.data
    const dayRecords = records.filter(r => r.date === dateStr)
    
    if (dayRecords.length > 0) {
      const record = dayRecords[0]
      wx.navigateTo({
        url: `/pages/form/form?id=${record.id}&mode=view`
      })
    }
  },

  // 格式化月份显示
  formatMonth() {
    const { currentYear, currentMonth } = this.data
    return `${currentYear}.${String(currentMonth + 1).padStart(2, '0')}`
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadRecords()
    this.generateCalendar()
    wx.stopPullDownRefresh()
  },

  // 分享
  onShareAppMessage() {
    return {
      title: 'StageLog - 剧场日历',
      path: '/pages/calendar/calendar'
    }
  }
})