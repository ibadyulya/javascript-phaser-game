const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './js/app.js',
    output: {
        filename: './dist/app.bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title:'ibaGame',
            template: './js/index.ejs',
        })
    ]
}