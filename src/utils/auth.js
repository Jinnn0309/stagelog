// 用户认证工具
const USER_KEY = 'stagelog_user'

/**
 * 获取用户信息
 * @returns {Object|null} 用户信息对象或null
 */
const getUserInfo = () => {
  try {
    const user = wx.getStorageSync(USER_KEY)
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

/**
 * 设置用户信息
 * @param {Object} user 用户信息对象
 * @returns {Boolean} 是否成功
 */
const setUserInfo = (user) => {
  try {
    wx.setStorageSync(USER_KEY, JSON.stringify(user))
    return true
  } catch (error) {
    console.error('保存用户信息失败:', error)
    return false
  }
}

/**
 * 清除用户信息
 * @returns {Boolean} 是否成功
 */
const clearUserInfo = () => {
  try {
    wx.removeStorageSync(USER_KEY)
    return true
  } catch (error) {
    console.error('清除用户信息失败:', error)
    return false
  }
}

/**
 * 检查用户是否已登录
 * @returns {Boolean} 是否已登录
 */
const isLoggedIn = () => {
  const user = getUserInfo()
  return !!(user && user.isLoggedIn && user.username)
}

module.exports = {
  getUserInfo,
  setUserInfo,
  clearUserInfo,
  isLoggedIn
}