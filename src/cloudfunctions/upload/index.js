// 上传相关云函数主入口
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  console.log('上传云函数调用:', event.action)
  
  switch (event.action) {
    case 'image':
      return await require('./image').main(event, context)
    default:
      return {
        success: false,
        error: '未知的操作类型'
      }
  }
}