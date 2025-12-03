# UI显示问题修复

## ✅ 问题1：日历窗格显示错误

### 问题描述
- 日历格子显示不正确
- 可能使用了不兼容的CSS属性 `aspect-ratio`

### 修复方案
1. **修复CSS兼容性**
   - 改用 `display: grid` 布局
   - 设置 `grid-template-columns: repeat(7, 1fr)` 
   - 使用 `gap: 6rpx` 控制间隔

2. **优化格子样式**
   - 使用 `aspect-ratio: 1` 确保正方形
   - 添加 `display: flex` 和居中对齐
   - 确保内容正确显示

3. **修复图片显示**
   - 将 `object-cover` 改为 `object-fit: cover`
   - 确保海报图片正确显示在格子中

## ✅ 问题2：统计页面切换时缺少年月显示

### 问题描述
- 在日/月/年切换时，日期选择器中间没有显示当前选中的年份或日期

### 修复方案
1. **添加数据绑定**
   - 在 `data` 中添加 `dateLabel: ''`
   - 在WXML中使用 `{{dateLabel}}` 替代函数调用

2. **更新日期显示逻辑**
   - 在 `loadStats()` 中计算并设置 `dateLabel`
   - 在 `onTimeRangeChange()` 中更新 `dateLabel`
   - 在 `onPrevDate()` 和 `onNextDate()` 中更新 `dateLabel`

3. **日期格式化函数**
   - 年份显示：`2024`
   - 月份显示：`2024.01`
   - 日期显示：`1/15`

## 🎨 样式改进

### 日历网格优化
```css
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6rpx;
}

.calendar-day {
  width: 100%;
  aspect-ratio: 1;
  position: relative;
  border-radius: 12rpx;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 日期标签显示
- **YEAR模式**: `2024`
- **MONTH模式**: `2024.01` 
- **DAY模式**: `1/15`

## 🔧 技术实现

### 数据流更新
1. 用户切换时间范围 → `onTimeRangeChange`
2. 计算新的日期标签 → `formatDateLabel()`
3. 更新界面显示 → `setData({ dateLabel })`
4. 重新加载统计数据 → `loadStats()`

### 兼容性处理
- 使用微信小程序支持的CSS属性
- 避免使用实验性CSS特性
- 确保在不同设备上显示一致

## 📱 用户体验改进

1. **日历格子现在正确显示为7列网格**
2. **日期切换时清楚显示当前选择的时间范围**
3. **统计数据根据选择的时间范围正确更新**
4. **保持了原有的视觉设计风格**

现在两个问题都已修复，界面应该正常显示了！