module.exports = {
    publicPath: '/',  // 使用自定义域名时应该使用根路径
    assetsDir: 'static',
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: '学术活动日历',
        }
    }
}
