const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    devServer: {
        contentBase: 'dist',
        port: 3000
    },
    devtool: 'inline-source-map',
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'build/assets',
                    to: 'assets'
                },
                {
                    from: 'build/sounds',
                    to: 'sounds'
                }
            ]  
        }),
        new HTMLWebpackPlugin({
            template: 'build/index.html',
            filename: 'index.html',
            inject: false
        }),
        new HTMLWebpackPlugin({
            template: 'build/styles.css',
            filename: 'styles.css',
            inject: false
        })
    ]
}