// 云开发服务
class CloudService {
  constructor() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'your-env-id', // 替换为你的环境ID
        traceUser: true,
      })
    }
  }

  // 调用云函数
  async callFunction(name, data = {}) {
    try {
      const result = await wx.cloud.callFunction({
        name,
        data
      })
      return result.result
    } catch (error) {
      console.error(`调用云函数 ${name} 失败:`, error)
      throw error
    }
  }

  // 创建演出记录
  async createShow(showData) {
    return await this.callFunction('show', {
      action: 'create',
      ...showData
    })
  }

  // 获取演出列表
  async getShowList(params = {}) {
    return await this.callFunction('show', {
      action: 'list',
      ...params
    })
  }

  // 更新演出记录
  async updateShow(id, updateData) {
    return await this.callFunction('show', {
      action: 'update',
      id,
      ...updateData
    })
  }

  // 删除演出记录
  async deleteShow(id) {
    return await this.callFunction('show', {
      action: 'delete',
      id
    })
  }

  // 上传图片
  async uploadImage(filePath, cloudPath) {
    try {
      const result = await wx.cloud.uploadFile({
        cloudPath,
        filePath
      })
      
      // 处理上传结果
      return await this.callFunction('upload', {
        action: 'image',
        fileID: result.fileID
      })
    } catch (error) {
      console.error('上传图片失败:', error)
      throw error
    }
  }

  // 获取图片临时链接
  async getImageTempUrl(fileID) {
    try {
      const result = await wx.cloud.getTempFileURL({
        fileList: [fileID]
      })
      return result.fileList[0].tempFileURL
    } catch (error) {
      console.error('获取图片链接失败:', error)
      throw error
    }
  }

  // 测试云开发连接
  async testConnection() {
    return await this.callFunction('config', {
      action: 'test'
    })
  }
}

export default new CloudService()