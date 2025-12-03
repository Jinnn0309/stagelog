const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { title, date, time, location, price, cast, posterImage, seatImage, notes } = event
    const { OPENID } = cloud.getWXContext()

    const showData = {
      user_id: OPENID,
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
      created_at: new Date(),
      updated_at: new Date()
    }

    const result = await db.collection('shows').add({
      data: showData
    })

    return {
      success: true,
      data: { _id: result._id, ...showData }
    }
  } catch (error) {
    console.error('创建演出记录失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}