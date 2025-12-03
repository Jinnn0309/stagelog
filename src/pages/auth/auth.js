// 登录页面
const app = getApp()
const { setUserInfo } = require('../../utils/auth')

Page({
  data: {
    isLogin: true,
    username: '',
    theme: ''
  },

  onLoad(options) {
    // 获取主题
    this.setData({
      theme: app.getTheme()
    })
  },

  // 输入框获取焦点
  onInputFocus() {
    // 当输入框获得焦点时，placeholder会自动隐藏
  },

  // 输入框失去焦点
  onInputBlur() {
    // 当输入框失去焦点时，如果内容为空，placeholder会重新显示
  },

  // 用户名输入
  onUsernameInput(e) {
    this.setData({
      username: e.detail.value
    })
  },

  // 切换登录/注册模式
  onSwitchMode() {
    this.setData({
      isLogin: !this.data.isLogin
    })
  },

  // 提交登录
  onSubmit() {
    const { username } = this.data
    
    if (!username.trim()) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      })
      return
    }

    // 保存用户信息
    const user = {
      username: username.trim(),
      isLoggedIn: true
    }

    setUserInfo(user)
    app.setUser(user)

    wx.showToast({
      title: '登录成功',
      icon: 'success'
    })

    // 跳转到首页
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/home/home'
      })
    }, 1500)
  },

  // 监听主题变化
  onThemeChange() {
    this.setData({
      theme: app.getTheme()
    })
  }
})