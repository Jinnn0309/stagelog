const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { id, title, date, time, location, price, cast, posterImage, seatImage, notes } = event
    const { OPENID } = cloud.getWXContext()

    const updateData = {
      title,
      date: new Date(date),
      time,
      location,
      price: Number(price) || 0,
      cast: cast || [],
      poster_image: posterImage || '',
      seat_image: seatImage || '',
      notes: notes || '',
      status: new Date(date) < new Date() ? 'watched' : 'towatch',
      updated_at: new Date()
    }

    const result = await db.collection('shows').where({
      _id: id,
      user_id: OPENID // 确保只能更新自己的记录
    }).update({
      data: updateData
    })

    if (result.stats.updated === 0) {
      return {
        success: false,
        error: '记录不存在或无权修改'
      }
    }

    return {
      success: true,
      data: updateData
    }
  } catch (error) {
    console.error('更新演出记录失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}