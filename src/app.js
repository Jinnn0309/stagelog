const { getUserInfo, setUserInfo, clearUserInfo } = require('./utils/auth')
const { getRecords } = require('./services/storageService')

App({
  globalData: {
    user: null,
    theme: 'light',
    systemInfo: null
  },

  onLaunch() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'test-env-id', // 临时环境ID，请替换为实际环境ID
        traceUser: true,
      })
      console.log('云开发初始化成功')
    }

    // 获取系统信息
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res
        // 检查是否支持暗黑模式
        if (res.theme) {
          this.globalData.theme = res.theme
        }
      }
    })

    // 恢复用户状态
    const user = getUserInfo()
    if (user) {
      this.globalData.user = user
    }

    // 恢复主题设置
    const theme = wx.getStorageSync('stagelog_theme') || 'light'
    this.globalData.theme = theme
    
    // 监听系统主题变化
    wx.onThemeChange(({ theme }) => {
      this.globalData.theme = theme
    })
  },

  onShow() {
    // 应用显示时检查登录状态
    if (!this.globalData.user) {
      const user = getUserInfo()
      if (user) {
        this.globalData.user = user
      }
    }
  },

  // 获取当前用户信息
  getUser() {
    return this.globalData.user
  },

  // 设置用户信息
  setUser(user) {
    this.globalData.user = user
    setUserInfo(user)
  },

  // 清除用户信息
  clearUser() {
    this.globalData.user = null
    clearUserInfo()
  },

  // 获取主题
  getTheme() {
    return this.globalData.theme
  },

  // 设置主题
  setTheme(theme) {
    this.globalData.theme = theme
    wx.setStorageSync('stagelog_theme', theme)
  }
})