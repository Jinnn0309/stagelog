// 数据库集合创建脚本
const collections = [
  {
    name: 'users',
    description: '用户信息表',
    permissions: {
      read: 'auth',
      write: 'auth'
    },
    indexes: [
      { key: { openid: 1 }, unique: true }
    ]
  },
  {
    name: 'shows',
    description: '演出记录表',
    permissions: {
      read: 'auth',
      write: 'auth'
    },
    indexes: [
      { key: { user_id: 1 } },
      { key: { user_id: 1, date: -1 } },
      { key: { user_id: 1, status: 1 } }
    ]
  },
  {
    name: 'actors',
    description: '演员信息表',
    permissions: {
      read: 'auth',
      write: 'auth'
    },
    indexes: [
      { key: { name: 1 }, unique: true }
    ]
  }
]

module.exports = collections