var path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env = {}, argv = {}) => {
    return {
        entry: {
            main: './src/index.js'
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx']
        },
        output: {
           // path: path.resolve(__dirname, '../wwwroot/dist'),
            path: path.resolve(__dirname, '/public/dist'),
            filename: 'bundle.js',
            publicPath: '/dist'
        },
        mode: argv.mode || 'development',
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'style.css'
            })
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'awesome-typescript-loader'
                },
                {
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.(png|jpg|svg)$/,
                    loader: 'url-loader'
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    loader: 'file-loader'
                }
            ]
        }
    }
};