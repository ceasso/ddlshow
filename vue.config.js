module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/academic-calendar/'
        : '/',
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
