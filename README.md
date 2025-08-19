# 学术活动日历

一个简洁、现代化的学术活动截止日期追踪工具，帮助您不错过任何重要的学术机会。

## 🎯 项目特色

- **极简主义设计** - 采用纯净的界面设计，专注于内容本身
- **表格式布局** - 便于快速浏览和比较大量学术活动信息
- **智能筛选** - 支持按分类、标签、关键词进行筛选
- **实时倒计时** - 精确显示距离截止时间的剩余时间
- **收藏功能** - 标记重要活动，优先显示
- **日历集成** - 一键添加到Google日历或iCloud日历
- **响应式设计** - 完美适配桌面和移动设备

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run serve
```

### 构建生产版本
```bash
npm run build
```

## 📊 数据管理

项目使用YAML文件管理学术活动数据：

- `public/events/categories.yml` - 活动分类配置
- `public/events/allevents.yml` - 所有学术活动数据

### 添加新活动
1. 在`public/events/allevents.yml`中添加新的活动数据。如有需要，在`public/events/categories.yml`中添加新的活动分类。
2. 活动数据示例：
```yaml
- title: Rust训练营                        // 活动标题
  description: 2025秋季Rust 编译器……       // 活动描述
  category: activity            // 活动分类（根据`public/events/categories.yml`来进行）
  tags:                                   // 活动标签
  - Rust
  - compiler
  - openCamp
  events:
  - year: 2025                            // 活动年份
    id: rustcompiler2025f                 // 活动ID
    link: https://opencamp.cn/rustcompiler/camp/2025fall //活动对应网址的链接
    timeline:                             // 时间表，格式如下
    - deadline: '2025-08-15'
      comment: 报名截止
    - deadline: '2025-08-16'
      comment: 开营仪式
    timezone: UTC+8                       // 时区
    date: 2025年8月4日 - 12月20日          // 活动日期
    place: 线上                           // 活动地点
```

## 🎨 界面特色

- **彩色分类徽章** - 不同类型活动使用不同颜色区分
  - 🔵 Conference（会议） - 蓝色系
  - 🔴 Competition（竞赛） - 红色系  
  - 🟢 Activity（活动） - 绿色系
- **统一的标签设计** - 所有标签元素采用一致的极简风格
- **全屏宽度布局** - 充分利用屏幕空间

## 🛠️ 技术栈

- **前端框架**: Vue.js 2.x
- **UI组件**: Element UI
- **构建工具**: Vue CLI
- **数据格式**: YAML
- **时间处理**: Moment.js

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

---

*让学术生涯更有条理，不错过每一个重要机会。*