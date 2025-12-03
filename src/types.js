/**
 * 类型定义文件
 * 由于微信小程序使用 JavaScript，这里提供数据结构说明
 */

// 演职人员信息
export const CastMemberStructure = {
  role: '', // 角色
  actor: '' // 演员
}

// 演出记录
export const ShowRecordStructure = {
  id: '', // 唯一标识
  title: '', // 演出名称
  date: '', // 日期 YYYY-MM-DD 格式
  time: '', // 时间 HH:MM 格式
  location: '', // 地点
  price: 0, // 价格
  posterImage: '', // 海报图片 Base64 或临时文件路径
  seatImage: '', // 座位/票根图片 Base64 或临时文件路径
  seatLocation: '', // 座位位置
  cast: [], // 演职人员数组
  status: 'watched', // 状态: 'watched' | 'towatch'
  notes: '' // 备注
}

// 月度统计
export const MonthlyStatsStructure = {
  totalSpent: 0, // 总消费
  totalShows: 0, // 总演出数
  uniqueShows: 0 // 不同演出数
}

// 用户信息
export const UserStructure = {
  username: '', // 用户名
  isLoggedIn: false // 是否已登录
}

// 城市列表
export const CITIES = [
  '上海', '北京', '广州', '深圳', 
  '杭州', '南京', '武汉', '成都'
]

// 场馆信息
export const VENUES = {
  '上海': [
    '上海文化广场', '上海大剧院', '美琪大戏院', 
    '上音歌剧院', '1862时尚艺术中心', '人民大舞台', 
    '云峰剧院', '共舞台', '上海大舞台', '东方艺术中心'
  ],
  '北京': [
    '天桥艺术中心', '保利剧院', '二七剧场', 
    '世纪剧院', '展览馆剧场', '国家大剧院', '喜剧院'
  ],
  '广州': ['广州大剧院', '广东艺术剧院', '友谊剧院'],
  '深圳': ['深圳保利剧院', '滨海艺术中心', '南山文体中心'],
  '杭州': ['杭州大剧院', '余杭大剧院', '蝴蝶剧场', '临平大剧院'],
  '南京': ['南京保利大剧院', '江苏大剧院'],
  '武汉': ['武汉琴台大剧院', '武汉剧院'],
  '成都': ['四川大剧院', '城市音乐厅']
}

// 徽章定义
export const BADGES = [
  {
    id: 'first',
    name: '初入剧场',
    desc: '记录第1部剧',
    icon: 'ticket', // 图标类型
    color: 'blue'
  },
  {
    id: 'fan',
    name: '资深剧迷',
    desc: '看过10部剧',
    icon: 'star',
    color: 'orange'
  },
  {
    id: 'rich',
    name: '黄金座席',
    desc: '消费超2000元',
    icon: 'crown',
    color: 'yellow'
  },
  {
    id: 'night',
    name: '夜猫子',
    desc: '看22点后剧目',
    icon: 'moon',
    color: 'purple'
  },
  {
    id: 'early',
    name: '早鸟',
    desc: '记录未来剧目',
    icon: 'zap',
    color: 'green'
  }
]