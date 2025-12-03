const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  try {
    const { fileID, type = 'poster' } = event
    const { OPENID } = cloud.getWXContext()

    // 获取文件下载链接
    const fileList = await cloud.getTempFileURL({
      fileList: [fileID]
    })

    if (fileList.fileList.length === 0) {
      return {
        success: false,
        error: '文件上传失败'
      }
    }

    const { tempFileURL } = fileList.fileList[0]

    // 可以在这里记录文件信息到数据库
    // 例如：将文件URL存储到用户记录中

    return {
      success: true,
      data: {
        fileID,
        tempFileURL,
        type
      }
    }
  } catch (error) {
    console.error('处理图片上传失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}