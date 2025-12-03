// 存储服务 - 演出记录数据管理
const STORAGE_KEY = 'stagelog_records'

/**
 * 获取所有演出记录
 * @returns {Array} 演出记录数组
 */
const getRecords = () => {
  try {
    const data = wx.getStorageSync(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('获取记录失败:', error)
    return []
  }
}

/**
 * 保存演出记录
 * @param {Object} record 演出记录对象
 */
const saveRecord = (record) => {
  try {
    const records = getRecords()
    console.log('保存前的记录数量:', records.length)
    const updatedRecords = [...records, record]
    console.log('保存后的记录数量:', updatedRecords.length)
    wx.setStorageSync(STORAGE_KEY, JSON.stringify(updatedRecords))
    console.log('记录已保存到本地存储:', record.id)
    return true
  } catch (error) {
    console.error('保存记录失败:', error)
    return false
  }
}

/**
 * 更新演出记录
 * @param {Object} updatedRecord 更新后的演出记录
 */
const updateRecord = (updatedRecord) => {
  try {
    const records = getRecords()
    const index = records.findIndex(r => r.id === updatedRecord.id)
    if (index !== -1) {
      records[index] = updatedRecord
      wx.setStorageSync(STORAGE_KEY, JSON.stringify(records))
      return true
    }
    return false
  } catch (error) {
    console.error('更新记录失败:', error)
    return false
  }
}

/**
 * 删除演出记录
 * @param {String} id 记录ID
 */
const deleteRecord = (id) => {
  try {
    const records = getRecords()
    console.log('删除前记录数量:', records.length)
    const recordToDelete = records.find(r => r.id === id)
    console.log('要删除的记录:', recordToDelete)
    const updatedRecords = records.filter(r => r.id !== id)
    console.log('删除后记录数量:', updatedRecords.length)
    wx.setStorageSync(STORAGE_KEY, JSON.stringify(updatedRecords))
    console.log('记录已从存储中删除')
    return true
  } catch (error) {
    console.error('删除记录失败:', error)
    return false
  }
}

/**
 * 根据ID获取单条记录
 * @param {String} id 记录ID
 * @returns {Object|null} 演出记录对象或null
 */
const getRecordById = (id) => {
  try {
    const records = getRecords()
    return records.find(r => r.id === id) || null
  } catch (error) {
    console.error('获取单条记录失败:', error)
    return null
  }
}

/**
 * 获取指定年月的统计数据
 * @param {Number} year 年份
 * @param {Number} month 月份 (0-11)
 * @returns {Object} 统计数据
 */
const getStatsForMonth = (year, month) => {
  try {
    const records = getRecords()
    const filtered = records.filter(r => {
      const d = new Date(r.date)
      return d.getFullYear() === year && d.getMonth() === month && r.status === 'watched'
    })

    return {
      records: filtered,
      totalSpent: filtered.reduce((acc, curr) => acc + curr.price, 0),
      totalShows: filtered.length,
      uniqueShows: new Set(filtered.map(r => r.title)).size
    }
  } catch (error) {
    console.error('获取月度统计失败:', error)
    return {
      records: [],
      totalSpent: 0,
      totalShows: 0,
      uniqueShows: 0
    }
  }
}

/**
 * 获取指定年份的统计数据
 * @param {Number} year 年份
 * @returns {Object} 年度统计数据
 */
const getStatsForYear = (year) => {
  try {
    const records = getRecords()
    const filtered = records.filter(r => {
      const d = new Date(r.date)
      return d.getFullYear() === year && r.status === 'watched'
    })

    return {
      records: filtered,
      totalSpent: filtered.reduce((acc, curr) => acc + curr.price, 0),
      totalShows: filtered.length,
      uniqueShows: new Set(filtered.map(r => r.title)).size
    }
  } catch (error) {
    console.error('获取年度统计失败:', error)
    return {
      records: [],
      totalSpent: 0,
      totalShows: 0,
      uniqueShows: 0
    }
  }
}

/**
 * 获取指定日期的统计数据
 * @param {String} date 日期 YYYY-MM-DD
 * @returns {Object} 日期统计数据
 */
const getStatsForDate = (date) => {
  try {
    const records = getRecords()
    const filtered = records.filter(r => r.date === date && r.status === 'watched')

    return {
      records: filtered,
      totalSpent: filtered.reduce((acc, curr) => acc + curr.price, 0),
      totalShows: filtered.length,
      uniqueShows: new Set(filtered.map(r => r.title)).size
    }
  } catch (error) {
    console.error('获取日期统计失败:', error)
    return {
      records: [],
      totalSpent: 0,
      totalShows: 0,
      uniqueShows: 0
    }
  }
}

/**
 * 清空所有记录
 * @returns {Boolean} 是否成功
 */
const clearAllRecords = () => {
  try {
    wx.removeStorageSync(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('清空记录失败:', error)
    return false
  }
}

/**
 * 搜索记录
 * @param {String} keyword 搜索关键词
 * @returns {Array} 匹配的记录数组
 */
const searchRecords = (keyword) => {
  try {
    const records = getRecords()
    if (!keyword.trim()) return records

    const lowerKeyword = keyword.toLowerCase()
    return records.filter(r => 
      r.title.toLowerCase().includes(lowerKeyword) ||
      r.location.toLowerCase().includes(lowerKeyword) ||
      r.notes?.toLowerCase().includes(lowerKeyword) ||
      r.cast.some(c => c.actor.toLowerCase().includes(lowerKeyword) || c.role.toLowerCase().includes(lowerKeyword))
    )
  } catch (error) {
    console.error('搜索记录失败:', error)
    return []
  }
}

module.exports = {
  getRecords,
  saveRecord,
  updateRecord,
  deleteRecord,
  getRecordById,
  getStatsForMonth,
  getStatsForYear,
  getStatsForDate,
  clearAllRecords,
  searchRecords
}