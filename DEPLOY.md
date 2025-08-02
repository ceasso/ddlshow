# GitHub Pages 部署指南

## 🚀 自动部署配置

本项目已配置GitHub Actions自动部署到GitHub Pages。每当您推送代码到`main`分支时，会自动触发构建和部署流程。

## 📋 部署步骤

### 1. 推送代码到GitHub
```bash
git add .
git commit -m "部署学术活动日历"
git push origin main
```

### 2. 启用GitHub Pages
1. 进入您的GitHub仓库
2. 点击 `Settings` 选项卡
3. 在左侧菜单中找到 `Pages`
4. 在 `Source` 部分选择 `Deploy from a branch`
5. 选择 `gh-pages` 分支
6. 点击 `Save`

### 3. 等待部署完成
- GitHub Actions会自动运行构建流程
- 您可以在 `Actions` 选项卡中查看部署进度
- 部署完成后，您的网站将在以下地址可用：
  ```
  https://[您的用户名].github.io/[仓库名]/
  ```

## ⚙️ 配置说明

### GitHub Actions 工作流程
- **触发条件**: 推送到`main`分支
- **Node.js版本**: 18
- **构建命令**: `npm run build`
- **部署目录**: `./dist`

### Vue.js 配置
- **生产环境路径**: `/academic-calendar/`
- **开发环境路径**: `/`
- **静态资源目录**: `static`

## 🔧 自定义配置

### 修改仓库名称
如果您的GitHub仓库名称不是`academic-calendar`，请修改`vue.config.js`中的`publicPath`：

```javascript
publicPath: process.env.NODE_ENV === 'production'
    ? '/您的仓库名/'
    : '/',
```

### 自定义域名
如果您有自定义域名，请在`.github/workflows/deploy.yml`中的`cname`字段填写您的域名：

```yaml
cname: your-domain.com
```

## 📝 注意事项

1. **首次部署**: 第一次部署可能需要几分钟时间
2. **缓存问题**: 如果更新后网站没有变化，请清除浏览器缓存
3. **HTTPS**: GitHub Pages默认启用HTTPS
4. **构建失败**: 如果构建失败，请检查Actions日志中的错误信息

## 🎯 部署后验证

部署成功后，您可以验证以下功能：
- ✅ 页面正常加载
- ✅ 搜索功能正常
- ✅ 筛选功能正常
- ✅ 收藏功能正常
- ✅ 倒计时显示正常
- ✅ 日历集成链接正常

## 🔄 更新部署

要更新网站内容，只需：
1. 修改代码
2. 提交并推送到`main`分支
3. GitHub Actions会自动重新部署

---

**祝您部署顺利！** 🎉