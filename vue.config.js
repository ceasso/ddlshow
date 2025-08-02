module.exports = {
    publicPath: '/',  // 使用自定义域名时应该使用根路径, 本地开发环境使用相对地址
    assetsDir: 'static',
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: '活动日历',
        }
    }
}
