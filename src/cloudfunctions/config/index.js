// 云开发配置云函数
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  console.log('配置云函数调用:', event.action)
  
  switch (event.action) {
    case 'test':
      return {
        success: true,
        data: {
          env: cloud.DYNAMIC_CURRENT_ENV,
          openid: cloud.getWXContext().OPENID
        }
      }
    default:
      return {
        success: false,
        error: '未知的操作类型'
      }
  }
}