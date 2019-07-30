const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin'); //自动生成HTML
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); //删除多余打包的JS
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const plugins = [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        filename: 'index.html',//输出文件的名称
        template: path.resolve(__dirname, 'src/index.html'),//模板文件的路径
        minify:{
            removeRedundantAttributes:true, // 删除多余的属性
            collapseWhitespace:true, // 折叠空白区域
            removeAttributeQuotes: true, // 移除属性的引号
            removeComments: true, // 移除注释
            collapseBooleanAttributes: true // 省略只有 boolean 值的属性值 例如：readonly checked
        }
    }),
    new webpack.HashedModuleIdsPlugin(), //实现持久化缓存
    new MiniCssExtractPlugin({   //分离CSS
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[hash].css',
    }),
]


let entry = {};
let output = {};
const initCwd = path.relative(__dirname, process.env.INIT_CWD);
if (path.relative(__dirname, process.env.INIT_CWD).indexOf('src') == 0) {
    entry['index'] = path.resolve(__dirname, initCwd);
    output = {
        path: path.resolve(process.env.INIT_CWD, 'dist'),
        publicPath: '/',
        filename: 'js/[name].[chunkhash].js',
        chunkFilename: 'js/[name].[chunkhash].js'
    }
} else {
    console.error('请cd到制定工程目录在执行npm程序');
    throw '请cd到制定工程目录在执行npm程序';
}
module.exports = {
    // 入口文件配置项
    entry,
    output,
    optimization: {
        // splitChunks: {
        //     chunks: 'initial', // 只对入口文件处理
        //     cacheGroups:{
        //         vendors: {
        //             test: /node_modules\//,
        //             name: 'vendor',
        //             priority: 10,
        //             enforce: true,
        //         },
        //     }
        // },
        // runtimeChunk: {
        //     name: 'manifest'
        // },
        minimizer: [ // 用于配置 minimizers 和选项
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true, // set to true if you want JS source maps
                uglifyOptions:{
                    compress:{
                        // drop_debugger: true,
                        // drop_console: true
                        pure_funcs:['console.log']
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    resolve: {
        // 设置可省略文件后缀名
        extensions: [' ','.js','.json','.jsx'],
        // 查找 module 的话从这里开始查找;
        modules: [path.resolve(__dirname, "src"), path.resolve(__dirname, "node_modules")], // 绝对路径;
        // 配置路径映射（别名）
        alias: {
            pages: path.resolve(__dirname, 'src/pages'),
            utils: path.resolve(__dirname, 'src/utils')
        }
    },
    // webpack4.x 环境配置项
    mode: "production", //development 开发   production 生产
    plugins,
    devtool: 'cheap-module-source-map', // 开发工具
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader'
                }, {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true,
                        config: {
                            path: 'postcss.config.js'
                        }
                    }
                }]
            },
            {
                test: /\.scss$/,
                use: [ MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            config: {
                                path: 'postcss.config.js'
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                use: [ MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            config: {
                                path: 'postcss.config.js'
                            }
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                        }
                    }
                ]
            },
            {
                test: /\.(png|jp?g|gif|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192, // 小于8192字节的图片打包成base 64图片
                        name: 'images/[name].[hash:8].[ext]',
                        publicPath: ''
                    }
                }]
            },
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: {
                        attrs: ["img:src", "img:data-src"]
                    }
                }]
            },
            {
                // 文件依赖配置项——字体图标
                test: /\.(woff|woff2|svg|eot|ttf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192,
                        name: 'fonts/[name].[ext]?[hash:8]',
                        publicPath: ''
                    },
                }],
            }, {
                // 文件依赖配置项——音频
                test: /\.(wav|mp3|ogg)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192,
                        name: 'audios/[name].[ext]?[hash:8]',
                        publicPath: ''
                    },
                }],
            }, {
                // 文件依赖配置项——视频
                test: /\.(ogg|mpeg4|webm)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192,
                        name: 'videos/[name].[ext]?[hash:8]',
                        publicPath: ''
                    },
                }],
            },
            {
                test: /\.(js|jsx)$/,
                use: ['babel-loader?cacheDirectory=true'],
                include: path.resolve(__dirname, 'src')
            }
        ]
    },
};