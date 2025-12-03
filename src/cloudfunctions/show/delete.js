const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { id } = event
    const { OPENID } = cloud.getWXContext()

    const result = await db.collection('shows').where({
      _id: id,
      user_id: OPENID // 确保只能删除自己的记录
    }).remove()

    if (result.stats.removed === 0) {
      return {
        success: false,
        error: '记录不存在或无权删除'
      }
    }

    return {
      success: true,
      message: '删除成功'
    }
  } catch (error) {
    console.error('删除演出记录失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}