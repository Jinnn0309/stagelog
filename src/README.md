# StageLog - 演出记录小程序

## 目录结构

```
src/
├── pages/                 # 页面
│   ├── auth/             # 登录页面
│   ├── home/             # 首页
│   ├── form/             # 表单页面
│   ├── calendar/         # 日历页面
│   ├── stats/            # 统计页面
│   └── settings/         # 设置页面
├── components/           # 自定义组件
│   └── show-list/        # 演出列表组件
├── services/             # 服务层
│   ├── storageService.js # 本地存储服务
│   └── cloudService.js   # 云开发服务
├── utils/                # 工具函数
├── cloudfunctions/       # 云函数
│   ├── show/            # 演出相关云函数
│   │   ├── create.js    # 创建演出记录
│   │   ├── list.js      # 获取演出列表
│   │   ├── update.js    # 更新演出记录
│   │   └── delete.js    # 删除演出记录
│   ├── upload/          # 上传相关云函数
│   │   └── image.js     # 图片上传
│   └── config/          # 云开发配置
├── cloud/                # 云开发配置
│   └── database/         # 数据库配置
├── app.js                # 小程序入口
├── app.json              # 小程序配置
├── app.wxss              # 全局样式
└── README.md            # 说明文档
```

## 云开发使用步骤

### 1. 环境准备
1. 登录微信公众平台开通云开发
2. 获取环境ID，替换 `cloudService.js` 中的 `your-env-id`

### 2. 部署云函数
在微信开发者工具中：
1. 右键点击 `src/cloudfunctions/show` → "上传并部署：云端安装依赖"
2. 右键点击 `src/cloudfunctions/upload` → "上传并部署：云端安装依赖"
3. 右键点击 `src/cloudfunctions/config` → "上传并部署：云端安装依赖"

### 3. 创建数据库集合
在云开发控制台中创建以下集合：
- `users` - 用户信息
- `shows` - 演出记录
- `actors` - 演员信息

### 4. 配置文件存储
在云开发控制台的存储中创建：
- `posters/` - 演出海报
- `seats/` - 座位图片
- `avatars/` - 用户头像

## 功能特性

- 📝 演出记录管理
- 🎭 演员信息管理
- 📅 日历视图
- 📊 数据统计
- 🌙 深色模式
- ☁️ 云端同步

## 开发说明

- 支持本地存储和云开发两种模式
- 通过修改服务层可以切换存储方式
- 云函数自动处理用户权限验证