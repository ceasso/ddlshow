# GitHub Pages和GitHub Actions部署Vue项目指南

## 核心功能

- GitHub Actions自动构建部署
- Vue项目GitHub Pages配置
- CI/CD流程实现
- 静态资源路径优化

## 技术栈

- **前端框架**: Vue.js
- **DevOps工具**: GitHub Actions, GitHub Pages
- **构建工具**: Node.js, npm/yarn

## 设计理念

使用GitHub Actions自动构建Vue项目并部署到GitHub Pages，确保静态资源路径正确配置，实现代码推送后的自动部署流程。

## 部署流程

### 1. 配置Vue项目

在`vue.config.js`文件中设置正确的`publicPath`，确保在GitHub Pages环境下能正确加载资源：

```js
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/ddlshow/'  // 替换为你的GitHub仓库名称
        : '/',
    assetsDir: 'static',
    // 其他配置...
}
```

### 2. 设置GitHub Actions工作流

我们已经创建了`.github/workflows/deploy.yml`文件，使用GitHub官方的Pages部署操作：

```yaml
name: 部署到 GitHub Pages

on:
  push:
    branches: [ main, master ]  # 同时支持main和master分支触发
  workflow_dispatch:  # 允许手动触发工作流

# 设置GITHUB_TOKEN的权限
permissions:
  contents: read
  pages: write
  id-token: write

# 允许一个并发部署
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: 检出代码
        uses: actions/checkout@v3

      - name: 设置 Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'

      - name: 安装依赖
        run: npm install --legacy-peer-deps

      - name: 构建项目
        run: npm run build
        env:
          NODE_ENV: production

      - name: 设置 Pages
        uses: actions/configure-pages@v3

      - name: 上传构建产物
        uses: actions/upload-pages-artifact@v4
        with:
          path: dist

  # 部署工作流
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: 部署到 GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3. 推送代码到GitHub

```bash
# 添加所有文件
git add .

# 提交更改
git commit -m "配置GitHub Actions自动部署"

# 推送到GitHub
git push origin main  # 或者 git push origin master
```

### 4. 启用GitHub Pages

1. 在GitHub仓库页面，点击"Settings"
2. 在左侧菜单中找到"Pages"
3. 在"Build and deployment"部分，选择"GitHub Actions"作为源
4. 系统会自动使用我们配置的工作流进行部署

### 5. 验证部署

部署完成后，你可以通过以下URL访问你的网站：
```
https://你的用户名.github.io/ddlshow/
```

## 工作流程说明

1. **构建阶段**：
   - 检出代码
   - 设置Node.js环境
   - 安装项目依赖
   - 构建Vue项目
   - 准备GitHub Pages配置
   - 上传构建产物

2. **部署阶段**：
   - 将构建产物部署到GitHub Pages环境

## 常见问题解决

### 资源路径404错误

如果部署后发现CSS、JS等资源加载失败，通常是因为`publicPath`设置不正确。确保它与你的GitHub仓库名称一致。

### 部署权限问题

如果遇到权限错误（403 Forbidden），确保工作流文件中的权限设置正确：
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

### 依赖安装失败

如果在构建阶段依赖安装失败，可以尝试使用`--legacy-peer-deps`参数：
```yaml
run: npm install --legacy-peer-deps
```

### 操作版本过时

GitHub Actions的操作版本可能会随时间更新，如果遇到版本弃用警告，请更新到最新版本：
```yaml
# 旧版本
uses: actions/upload-pages-artifact@v2

# 新版本
uses: actions/upload-pages-artifact@v4
```

## 完成情况

- [X] 检查Vue项目结构和配置
- [X] 修改vue.config.js配置文件，设置正确的publicPath
- [X] 创建GitHub Actions工作流配置文件
- [X] 测试GitHub Actions自动部署流程
- [X] 验证部署后的网站功能