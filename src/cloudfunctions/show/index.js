// 演出相关云函数主入口
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  console.log('云函数调用:', event.action)
  
  switch (event.action) {
    case 'create':
      return await require('./create').main(event, context)
    case 'list':
      return await require('./list').main(event, context)
    case 'update':
      return await require('./update').main(event, context)
    case 'delete':
      return await require('./delete').main(event, context)
    default:
      return {
        success: false,
        error: '未知的操作类型'
      }
  }
}