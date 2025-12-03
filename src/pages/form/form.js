// 表单页面
const app = getApp()
const { isLoggedIn } = require('../../utils/auth')
const { saveRecord, updateRecord, getRecordById } = require('../../services/storageService')
const { formatDate, showToast, generateId } = require('../../utils/common')
const { venuesData } = require('./venues')

Page({
  data: {
    user: null,
    theme: '',
    mode: 'create', // 'create' | 'edit' | 'view'
    recordId: null,
    formData: {
      title: '',
      date: formatDate(new Date(), 'YYYY-MM-DD'),
      time: '19:30',
      location: '',
      price: 0,
      cast: [],
      posterImage: '',
      seatImage: '',
      notes: ''
    },
    showSmartParser: false,
    smartText: '',
    ticketUrl: '',
    showLocationPicker: false,
    selectedCity: '上海',
    castInput: {
      role: '',
      actor: ''
    },
    cities: Object.keys(venuesData),
    venues: venuesData,
    showTimePicker: false
  },

  onLoad(options) {
    // 检查登录状态
    if (!isLoggedIn()) {
      wx.redirectTo({
        url: '/pages/auth/auth'
      })
      return
    }

    const { id, mode = 'create' } = options
    
    this.setData({
      user: app.getUser(),
      theme: app.getTheme(),
      mode,
      recordId: id
    })

    // 如果是编辑或查看模式，加载数据
    if (id && mode !== 'create') {
      this.loadRecord(id)
    }
  },

  onShow() {
    console.log('表单页面onShow，当前mode:', this.data.mode)
    
    // 检查是否有来自switchTab的编辑参数
    const editParams = app.globalData && app.globalData.editParams
    if (editParams) {
      console.log('从globalData获取编辑参数:', editParams)
      this.setData({
        mode: editParams.mode,
        recordId: editParams.id
      })
      
      // 如果是编辑或查看模式，加载数据
      if (editParams.id && editParams.mode !== 'create') {
        this.loadRecord(editParams.id)
      }
      
      // 清除编辑参数
      app.globalData.editParams = null
    }
    
    // 检查是否有来自switchTab的查看参数
    const viewParams = app.globalData && app.globalData.viewParams
    if (viewParams) {
      console.log('从globalData获取查看参数:', viewParams)
      this.setData({
        mode: viewParams.mode,
        recordId: viewParams.id
      })
      
      // 如果是查看模式，加载数据
      if (viewParams.id && viewParams.mode !== 'create') {
        this.loadRecord(viewParams.id)
      }
      
      // 清除查看参数
      app.globalData.viewParams = null
    }
    
    console.log('表单页面onShow结束，最终mode:', this.data.mode)
  },

  // 加载记录数据
  loadRecord(id) {
    const record = getRecordById(id)
    if (record) {
      this.setData({
        formData: {
          ...this.data.formData,
          ...record
        }
      })
    }
  },

  // 智能解析切换
  onToggleSmartParser() {
    this.setData({
      showSmartParser: !this.data.showSmartParser
    })
  },

  // 智能文本解析
  onParseSmartText() {
    const { smartText, formData } = this.data
    if (!smartText.trim()) return

    let newData = { ...formData }

    // 解析日期
    const dateMatch = smartText.match(/(\\d{4})[-年.](\\d{1,2})[-月.](\\d{1,2})/)
    if (dateMatch) {
      newData.date = `${dateMatch[1]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[3].padStart(2, '0')}`
    } else {
      const shortDate = smartText.match(/(\\d{1,2})月(\\d{1,2})日/)
      if (shortDate) {
        const year = new Date().getFullYear()
        newData.date = `${year}-${shortDate[1].padStart(2, '0')}-${shortDate[2].padStart(2, '0')}`
      }
    }

    // 解析时间
    const timeMatch = smartText.match(/(\\d{1,2}:\\d{2})/)
    if (timeMatch) {
      newData.time = timeMatch[1]
    }

    // 解析价格
    const priceMatch = smartText.match(/(?:票价|￥|¥)\\s*(\\d+)/)
    if (priceMatch) {
      newData.price = parseInt(priceMatch[1])
    }

    // 解析地点
    const locKeywords = ['大剧院', '文化广场', '艺术中心', '体育馆', '剧场']
    const parts = smartText.split(/[\\s\\n]+/)
    for (const part of parts) {
      if (locKeywords.some(k => part.includes(k))) {
        newData.location = part
        break
      }
    }

    newData.notes = smartText

    this.setData({
      formData: newData,
      showSmartParser: false,
      smartText: ''
    })

    showToast('解析成功', 'success')
  },

  // 输入框获取焦点
  onInputFocus() {
    // 当输入框获得焦点时，placeholder会自动隐藏
  },

  // 输入框失去焦点
  onInputBlur() {
    // 当输入框失去焦点时，如果内容为空，placeholder会重新显示
  },

  // 输入处理
  onInputChange(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    
    this.setData({
      [`formData.${field}`]: value
    })
  },

  // 数字输入处理
  onNumberInput(e) {
    const field = e.currentTarget.dataset.field
    const value = parseFloat(e.detail.value) || 0
    
    this.setData({
      [`formData.${field}`]: value
    })
  },

  // 日期选择处理
  onDateChange(e) {
    this.setData({
      'formData.date': e.detail.value
    })
  },

  // 时间选择处理
  onTimeChange(e) {
    this.setData({
      'formData.time': e.detail.value
    })
  },

  // 票务链接输入
  onTicketUrlInput(e) {
    this.setData({
      ticketUrl: e.detail.value
    })
  },

  // 解析票务链接
  onParseTicket() {
    const { ticketUrl } = this.data
    
    if (!ticketUrl.trim()) {
      showToast('请输入票务链接', 'none')
      return
    }

    // 模拟解析票务链接
    const parsedData = {
      title: '从票务链接解析的演出名称',
      date: '2025-12-15',
      time: '19:30',
      location: '从票务链接解析的剧院',
      price: 280
    }

    this.setData({
      'formData.title': parsedData.title,
      'formData.date': parsedData.date,
      'formData.time': parsedData.time,
      'formData.location': parsedData.location,
      'formData.price': parsedData.price,
      ticketUrl: ''
    })

    showToast('票务信息解析成功', 'success')
  },

  // 智能文本输入
  onSmartTextInput(e) {
    this.setData({
      smartText: e.detail.value
    })
  },

  // 地点选择器切换
  onToggleLocationPicker() {
    this.setData({
      showLocationPicker: !this.data.showLocationPicker
    })
  },

  // 选择城市
  onCitySelect(e) {
    const city = e.currentTarget.dataset.city
    this.setData({
      selectedCity: city
    })
  },

  // 选择场馆
  onVenueSelect(e) {
    const venue = e.currentTarget.dataset.venue
    this.setData({
      'formData.location': venue,
      showLocationPicker: false
    })
  },

  // 演职人员输入
  onCastInputChange(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    
    const castInput = this.data.castInput
    castInput[field] = value
    this.setData({
      castInput: castInput
    })
  },

  // 添加演职人员
  onAddCast() {
    const { castInput, formData } = this.data
    
    if (!castInput.actor.trim()) {
      showToast('请输入演员姓名', 'none')
      return
    }

    const newCast = [...(formData.cast || []), castInput]
    
    this.setData({
      'formData.cast': newCast,
      castInput: { role: '', actor: '' }
    })
  },

  // 删除演职人员
  onDeleteCast(e) {
    const index = e.currentTarget.dataset.index
    const { formData } = this.data
    
    const newCast = formData.cast.filter((_, i) => i !== index)
    
    this.setData({
      'formData.cast': newCast
    })
  },

  // 上传海报
  onUploadPoster() {
    this.chooseImage('posterImage')
  },

  // 上传座位图
  onUploadSeatImage() {
    this.chooseImage('seatImage')
  },

  // 选择图片
  chooseImage(field) {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        const formData = this.data.formData
        formData[field] = tempFilePath
        this.setData({
          formData: formData
        })
      }
    })
  },

  // 预览图片
  onPreviewImage(e) {
    const url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: [url],
      current: url
    })
  },

  // 删除图片
  onDeleteImage(e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [`formData.${field}`]: ''
    })
  },

  // 保存记录
  onSave() {
    const { formData, mode, recordId } = this.data
    
    // 验证必填字段
    if (!formData.title.trim()) {
      showToast('请输入演出名称', 'none')
      return
    }
    
    if (!formData.date) {
      showToast('请选择演出日期', 'none')
      return
    }

    // 判断状态
    const showDate = new Date(formData.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const status = showDate < today ? 'watched' : 'towatch'

    const recordToSave = {
      id: mode === 'edit' ? recordId : generateId(),
      title: formData.title.trim(),
      date: formData.date,
      time: formData.time || '',
      location: formData.location || '',
      price: Number(formData.price) || 0,
      cast: formData.cast || [],
      status,
      posterImage: formData.posterImage || '',
      seatImage: formData.seatImage || '',
      notes: formData.notes || ''
    }

    let success
    if (mode === 'edit') {
      success = updateRecord(recordToSave)
    } else {
      success = saveRecord(recordToSave)
    }

    if (success) {
      console.log('记录保存成功:', recordToSave)
      showToast(mode === 'edit' ? '更新成功' : '保存成功', 'success')
      
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/home/home'
        })
      }, 1500)
    } else {
      console.log('记录保存失败')
      showToast('操作失败', 'error')
    }
  },

  // 返回
  onBack() {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },

  // 分享
  onShareAppMessage() {
    return {
      title: 'StageLog - 记录演出',
      path: '/pages/form/form'
    }
  }
})