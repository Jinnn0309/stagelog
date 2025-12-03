// 设置页面
const app = getApp()
const { isLoggedIn, clearUserInfo } = require('../../utils/auth')
const { getRecords } = require('../../services/storageService')

Page({
  data: {
    user: null,
    theme: '',
    records: [],
    badges: [],
    totalShows: 0,
    totalSpent: 0
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

    this.loadBadges()
  },

  onShow() {
    this.setData({
      user: app.getUser(),
      theme: app.getTheme()
    })
    this.loadBadges()
  },

  // 加载徽章数据
  loadBadges() {
    const records = getRecords()
    const watchedRecords = records.filter(r => r.status === 'watched')
    const totalSpent = records.reduce((sum, r) => sum + r.price, 0)

    const badges = [
      {
        id: 'first',
        name: '初入剧场',
        desc: '记录第1部剧',
        earned: watchedRecords.length >= 1,
        icon: '🎫',
        color: 'blue'
      },
      {
        id: 'fan',
        name: '资深剧迷',
        desc: '看过10部剧',
        earned: watchedRecords.length >= 10,
        icon: '⭐',
        color: 'orange'
      },
      {
        id: 'rich',
        name: '黄金座席',
        desc: '消费超2000元',
        earned: totalSpent >= 2000,
        icon: '👑',
        color: 'yellow'
      },
      {
        id: 'night',
        name: '夜猫子',
        desc: '看22点后剧目',
        earned: records.some(r => {
          const hour = parseInt(r.time.split(':')[0])
          return hour >= 22
        }),
        icon: '🌙',
        color: 'purple'
      },
      {
        id: 'early',
        name: '早鸟',
        desc: '记录未来剧目',
        earned: records.some(r => r.status === 'towatch'),
        icon: '⚡',
        color: 'green'
      }
    ]

    this.setData({
      badges,
      records: watchedRecords,
      totalShows: watchedRecords.length,
      totalSpent
    })
  },

  // 切换主题
  onToggleTheme() {
    const newTheme = this.data.theme === 'light' ? 'dark' : 'light'
    this.setData({
      theme: newTheme
    })
    app.setTheme(newTheme)
    
    wx.showToast({
      title: newTheme === 'dark' ? '暗黑模式' : '亮色模式',
      icon: 'success'
    })
  },

  // 退出登录
  onLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 清除用户信息
          clearUserInfo()
          app.clearUser()
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })

          // 跳转到登录页
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/auth/auth'
            })
          }, 1500)
        }
      }
    })
  },

  // 分享应用
  onShareAppMessage() {
    return {
      title: 'StageLog - 我的剧场日记',
      path: '/pages/home/home'
    }
  }
})