# 云开发部署指南

## 第一步：开通云开发环境

1. 登录[微信公众平台](https://mp.weixin.qq.com/)
2. 进入你的小程序管理后台
3. 点击左侧菜单「开发」→「云开发」
4. 点击「开通云开发」
5. 选择环境（建议选择「按量付费」）
6. 设置环境名称（如：`stagelog-dev`）
7. 等待环境创建完成
8. 复制环境ID（类似：`cloud1-xxx`）

## 第二步：配置项目

1. 打开微信开发者工具
2. 导入项目，选择项目根目录
3. 修改 `src/services/cloudService.js`：
   ```javascript
   wx.cloud.init({
     env: 'stagelog-dev', // 替换为你的环境ID
     traceUser: true,
   })
   ```

## 第三步：部署云函数

在微信开发者工具中：

1. **部署show云函数**
   - 在左侧文件树中找到 `src/cloudfunctions/show` 文件夹
   - 右键点击 `show` 文件夹
   - 选择「创建并部署：云端安装依赖」

2. **部署upload云函数**
   - 右键点击 `src/cloudfunctions/upload` 文件夹
   - 选择「创建并部署：云端安装依赖」

3. **部署config云函数**
   - 右键点击 `src/cloudfunctions/config` 文件夹
   - 选择「创建并部署：云端安装依赖」

## 第四步：创建数据库集合

1. 在微信开发者工具中点击「云开发」
2. 选择「数据库」
3. 点击「+」创建集合，分别创建：
   - `users` - 用户信息
   - `shows` - 演出记录
   - `actors` - 演员信息

4. 设置集合权限：
   - 所有集合都选择「自定义」权限
   - 读取权限：所有用户可读
   - 写入权限：仅创建者可写

## 第五步：配置文件存储

1. 在云开发中选择「存储」
2. 点击「新建文件夹」创建：
   - `posters` - 演出海报
   - `seats` - 座位图片
   - `avatars` - 用户头像

## 第六步：测试连接

在app.js中添加测试代码：

```javascript
// 测试云开发连接
const cloudService = require('./services/cloudService.js')
cloudService.testConnection().then(result => {
  console.log('云开发连接成功:', result)
}).catch(error => {
  console.error('云开发连接失败:', error)
})
```

## 故障排除

### 1. 找不到"上传并部署"选项
- 确保右键点击的是文件夹名称，不是文件
- 文件夹名称应该和云函数名称一致

### 2. 部署失败
- 检查网络连接
- 确保云开发环境已开通
- 检查环境ID是否正确

### 3. 云函数调用失败
- 检查云函数是否正确部署
- 查看云函数日志排错
- 确保用户已登录（需要OPENID）

## 云函数使用示例

```javascript
// 创建演出记录
cloudService.createShow({
  title: '音乐剧',
  date: '2024-12-20',
  // ...其他参数
})

// 获取演出列表
cloudService.getShowList({
  status: 'towatch',
  page: 1,
  limit: 10
})

// 更新演出记录
cloudService.updateShow('record_id', {
  title: '更新的标题'
})

// 删除演出记录
cloudService.deleteShow('record_id')
```