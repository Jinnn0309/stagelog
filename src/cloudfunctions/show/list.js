const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { status = 'all', page = 1, limit = 20 } = event
    const { OPENID } = cloud.getWXContext()

    let query = db.collection('shows').where({
      user_id: OPENID
    })

    // 按状态过滤
    if (status !== 'all') {
      query = query.where({ status })
    }

    // 计算跳过的记录数
    const skip = (page - 1) * limit

    const result = await query
      .orderBy('date', 'asc')
      .skip(skip)
      .limit(limit)
      .get()

    const total = await query.count()

    return {
      success: true,
      data: {
        list: result.data,
        total: total.total,
        page,
        limit,
        hasMore: skip + result.data.length < total.total
      }
    }
  } catch (error) {
    console.error('获取演出列表失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}