// 通用工具函数

/**
 * 格式化日期
 * @param {String|Date} date 日期
 * @param {String} format 格式 'YYYY-MM-DD', 'MM/DD', 'YYYY年MM月DD日'
 * @returns {String} 格式化后的日期字符串
 */
const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')

  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`
    case 'MM/DD':
      return `${month}/${day}`
    case 'YYYY年MM月DD日':
      return `${year}年${month}月${day}日`
    case 'YYYY.MM':
      return `${year}.${month}`
    case 'HH:MM':
      return `${hour}:${minute}`
    default:
      return `${year}-${month}-${day}`
  }
}

/**
 * 格式化价格
 * @param {Number} price 价格
 * @returns {String} 格式化后的价格字符串
 */
const formatPrice = (price) => {
  if (!price || price === 0) return '--'
  return `¥${Number(price).toFixed(2)}`
}

/**
 * 获取月份的第一天和最后一天
 * @param {Number} year 年份
 * @param {Number} month 月份 (0-11)
 * @returns {Object} 包含第一天和最后一天的对象
 */
const getMonthRange = (year, month) => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  return {
    firstDay: formatDate(firstDay),
    lastDay: formatDate(lastDay),
    firstDayDate: firstDay,
    lastDayDate: lastDay
  }
}

/**
 * 比较日期
 * @param {String|Date} date1 日期1
 * @param {String|Date} date2 日期2
 * @returns {Number} -1(date1<date2), 0(date1=date2), 1(date1>date2)
 */
const compareDate = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  
  if (d1 < d2) return -1
  if (d1 > d2) return 1
  return 0
}

/**
 * 检查日期是否为今天
 * @param {String|Date} date 日期
 * @returns {Boolean} 是否为今天
 */
const isToday = (date) => {
  const today = new Date()
  const checkDate = new Date(date)
  return formatDate(today) === formatDate(checkDate)
}

/**
 * 检查日期是否为过去的日期
 * @param {String|Date} date 日期
 * @returns {Boolean} 是否为过去的日期
 */
const isPast = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)
  return checkDate < today
}

/**
 * 检查日期是否为未来的日期
 * @param {String|Date} date 日期
 * @returns {Boolean} 是否为未来的日期
 */
const isFuture = (date) => {
  return !isPast(date) && !isToday(date)
}

/**
 * 获取相对时间描述
 * @param {String|Date} date 日期
 * @returns {String} 相对时间描述
 */
const getRelativeTime = (date) => {
  if (isToday(date)) return '今天'
  if (isFuture(date)) {
    const days = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))
    if (days === 1) return '明天'
    if (days <= 7) return `${days}天后`
    return formatDate(date, 'MM月DD日')
  }
  
  // 过去日期
  const days = Math.ceil((new Date() - new Date(date)) / (1000 * 60 * 60 * 24))
  if (days === 1) return '昨天'
  if (days <= 7) return `${days}天前`
  return formatDate(date, 'MM月DD日')
}

/**
 * 防抖函数
 * @param {Function} func 要防抖的函数
 * @param {Number} wait 等待时间
 * @returns {Function} 防抖后的函数
 */
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 节流函数
 * @param {Function} func 要节流的函数
 * @param {Number} limit 限制时间
 * @returns {Function} 节流后的函数
 */
const throttle = (func, limit) => {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 深拷贝对象
 * @param {Object} obj 要拷贝的对象
 * @returns {Object} 拷贝后的对象
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

/**
 * 生成唯一ID
 * @returns {String} 唯一ID
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 显示提示消息
 * @param {String} title 消息标题
 * @param {String} icon 图标类型 'success', 'error', 'loading', 'none'
 * @param {Number} duration 持续时间
 */
const showToast = (title, icon = 'none', duration = 2000) => {
  wx.showToast({
    title,
    icon,
    duration
  })
}

/**
 * 显示确认对话框
 * @param {String} content 提示内容
 * @returns {Promise<Boolean>} 用户确认结果
 */
const showConfirm = (content) => {
  return new Promise((resolve) => {
    wx.showModal({
      title: '确认',
      content,
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        resolve(res.confirm)
      }
    })
  })
}

module.exports = {
  formatDate,
  formatPrice,
  getMonthRange,
  compareDate,
  isToday,
  isPast,
  isFuture,
  getRelativeTime,
  debounce,
  throttle,
  deepClone,
  generateId,
  showToast,
  showConfirm
}