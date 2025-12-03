// 首页
const app = getApp()
const { isLoggedIn } = require('../../utils/auth')
const { getRecords } = require('../../services/storageService')

Page({
  data: {
    user: null,
    activeTab: 'towatch', // 'towatch' | 'watched'
    theme: '',
    showList: [],
    toWatchCount: 0,
    watchedCount: 0
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

    this.loadShowList()
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadShowList()
    
    // 更新用户信息
    this.setData({
      user: app.getUser(),
      theme: app.getTheme()
    })
    
    console.log('首页显示，当前记录数量:', this.data.showList.length)
  },

  // 加载演出列表
  loadShowList() {
    const allRecords = getRecords()
    console.log('首页loadShowList，总记录数:', allRecords.length)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 分离待看和已看
    const toWatch = []
    const watched = []

    allRecords.forEach(record => {
      const recordDate = new Date(record.date)
      recordDate.setHours(0, 0, 0, 0)

      if (recordDate >= today) {
        toWatch.push(record)
      } else {
        watched.push(record)
      }
    })

    // 排序
    toWatch.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    watched.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // 根据当前标签显示对应列表
    const showList = this.data.activeTab === 'towatch' ? toWatch : watched

    console.log('首页设置showList，记录数:', showList.length)
    this.setData({
      showList,
      toWatchCount: toWatch.length,
      watchedCount: watched.length
    })
  },

  // 切换标签
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      activeTab: tab
    })
    this.loadShowList()
  },

  // 点击记录项
  onRecordTap(e) {
    const { id } = e.detail
    console.log('首页收到点击事件，记录ID:', id)
    
    // 表单页面是tabBar页面，需要使用switchTab而不是navigateTo
    wx.switchTab({
      url: '/pages/form/form',
      success: () => {
        console.log('switchTab成功')
        // 使用全局变量传递查看参数
        const viewParams = { id, mode: 'view' }
        getApp().globalData = { ...getApp().globalData, viewParams }
        console.log('查看参数已设置到globalData:', viewParams)
      },
      fail: (err) => {
        console.error('switchTab失败:', err)
      }
    })
  },

  // 编辑记录
  onEditRecord(e) {
    const { id } = e.detail
    console.log('首页收到编辑事件，记录ID:', id)
    const url = `/pages/form/form?id=${id}&mode=edit`
    console.log('导航URL:', url)
    
    // 表单页面是tabBar页面，需要使用switchTab而不是navigateTo
    wx.switchTab({
      url: '/pages/form/form',
      success: () => {
        console.log('switchTab成功')
        // 使用全局变量传递编辑参数
        const editParams = { id, mode: 'edit' }
        getApp().globalData = { ...getApp().globalData, editParams }
        console.log('编辑参数已设置到globalData:', editParams)
      },
      fail: (err) => {
        console.error('switchTab失败:', err)
      }
    })
  },

  // 删除记录
  onDeleteRecord(e) {
    const { id } = e.detail
    console.log('首页收到删除事件，记录ID:', id)
    const { deleteRecord } = require('../../services/storageService')
    const { showToast, showConfirm } = require('../../utils/common')

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          console.log('用户确认删除，开始执行删除操作')
          if (deleteRecord(id)) {
            console.log('删除操作成功，刷新列表')
            showToast('删除成功', 'success')
            
            // 强制刷新页面数据
            this.setData({
              showList: []
            })
            
            // 延迟刷新确保数据更新
            setTimeout(() => {
              this.loadShowList()
            }, 200)
          } else {
            console.log('删除操作失败')
            showToast('删除失败', 'error')
          }
        }
      }
    })
  },

  // 添加新记录
  onAddRecord() {
    wx.navigateTo({
      url: '/pages/form/form'
    })
  },

  // 监听主题变化
  onThemeChange() {
    this.setData({
      theme: app.getTheme()
    })
  },

  // 分享
  onShareAppMessage() {
    return {
      title: 'StageLog - 我的剧场日记',
      path: '/pages/home/home'
    }
  }
})