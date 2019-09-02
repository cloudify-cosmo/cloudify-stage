const webpack = require('webpack');
const path = require('path');
const glob = require('glob');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const BrotliPlugin = require('brotli-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const Consts = require('./backend/consts');

const getWidgetEntries = () => {
    return glob.sync('./widgets/*/src/widget.js').reduce((acc, item) => {
        const name = item.replace('./widgets', '').replace('/src', '');
        acc[name] = item;
        return acc;
    }, {});
};

const rules = [
    {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'babel-loader',
                options: {
                    presets: [['@babel/preset-env', { modules: false }], '@babel/preset-react'],
                    plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties'],
                    babelrc: false
                }
            }
        ]
    },
    {
        test: /\.scss$/,
        use: [
            {
                loader: 'style-loader'
            },
            {
                loader: 'css-loader'
            },
            {
                loader: 'sass-loader',

                options: {
                    modules: true,
                    localIdentName: '[name]---[local]---[hash:base64:5]'
                }
            }
        ]
    },
    {
        test: /\.css$/,
        use: [
            {
                loader: 'style-loader'
            },
            {
                loader: 'css-loader',

                options: {
                    importLoaders: 1
                }
            }
        ]
    },
    {
        test: /\.(eot|woff|woff2|ttf)(\?\S*)?$/,
        use: [
            {
                loader: 'url-loader',

                options: {
                    limit: 100000,
                    name: '/static/fonts/[name].[ext]'
                }
            }
        ]
    },
    {
        test: /\.(svg|png|jpe?g|gif)(\?\S*)?$/,
        use: [
            {
                loader: 'url-loader',

                options: {
                    limit: 100000,
                    name: '/static/images/[name].[ext]'
                }
            }
        ]
    }
];

const compressionPlugins = [
    new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
    new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
    }),
    new BrotliPlugin({
        asset: '[path].br[query]',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
    })
];

module.exports = [
    {
        mode: 'production',
        context: path.join(__dirname),
        resolve: {
            alias: {
                'jquery-ui': 'jquery-ui/ui',
                jquery: `${__dirname}/node_modules/jquery` // Always make sure we take jquery from the same place
            }
        },
        entry: ['./app/main.js'],
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'static/js/[name].bundle.js',
            publicPath: Consts.CONTEXT_PATH
        },
        optimization: {
            splitChunks: {
                chunks: 'initial',
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'initial'
                    }
                }
            }
        },
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: 'node_modules/cloudify-ui-common/images/favicon.png',
                    to: 'static/images'
                },
                {
                    from: 'node_modules/cloudify-ui-common/images/logo.png',
                    to: 'static/images'
                },
                {
                    from: 'widgets',
                    to: 'appData/widgets',
                    ignore: ['**/src/**']
                },
                {
                    from: 'templates',
                    to: 'appData/templates'
                },
                {
                    from: 'tours',
                    to: 'appData/tours'
                }
            ]),
            new HtmlWebpackPlugin({
                template: 'app/index.tmpl.html',
                inject: 'body',
                filename: 'static/index.html'
            }),
            new webpack.optimize.OccurrenceOrderPlugin(false),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                d3: 'd3'
            }),
            // new BundleAnalyzerPlugin(),
            ...compressionPlugins
        ],
        module: {
            rules
        }
    },
    {
        mode: 'production',
        context: path.join(__dirname),
        entry: getWidgetEntries(),
        output: {
            path: path.join(__dirname, 'dist/appData'),
            filename: 'widgets/[name]',
            publicPath: Consts.CONTEXT_PATH
        },
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: 'widgets/**/src/backend.js',
                    to: '[path]../backend.js'
                }
            ]),
            ...compressionPlugins
        ],
        module: {
            rules
        }
    },
    {
        mode: 'production',
        context: path.join(__dirname),
        entry: glob.sync('./widgets/common/src/*.js'),
        output: {
            path: path.join(__dirname, 'dist/appData/widgets'),
            filename: 'common/common.js',
            publicPath: Consts.CONTEXT_PATH
        },
        plugins: compressionPlugins,
        module: {
            rules
        }
    }
];
