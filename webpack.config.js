const webpack = require('webpack');
const path = require('path');
const glob = require('glob');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const Consts = require('./backend/consts');

const getWidgetEntries = () => {
    return glob.sync('./widgets/*/src/widget.js').reduce((acc, item) => {
        const name = item.replace('./widgets/', '').replace('/src', '');
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

module.exports = [
    {
        mode: 'development',
        context: path.join(__dirname),
        devtool: 'eval-source-map',
        resolve: {
            alias: {
                'jquery-ui': 'jquery-ui/ui',
                jquery: `${__dirname}/node_modules/jquery` // Always make sure we take jquery from the same place
            },
            modules: [path.resolve(__dirname, 'node_modules')]
        },
        entry: {
            'main.bundle': ['./app/main.js']
        },
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'static/js/[name].js',
            publicPath: Consts.CONTEXT_PATH
        },
        optimization: {
            namedModules: true
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
                    ignore: ['**/src/**', '*/widget.js', '*/backend.js', '*/common.js']
                },
                {
                    from: 'templates',
                    to: 'appData/templates'
                },
                {
                    from: 'tours',
                    to: 'appData/tours'
                },
                {
                    from: 'userData',
                    to: 'userData'
                }
            ]),
            new HtmlWebpackPlugin({
                template: 'app/index.tmpl.html',
                inject: 'body',
                filename: 'static/index.html',
                chunks: ['main.bundle']
            }),
            new webpack.optimize.OccurrenceOrderPlugin(false),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                d3: 'd3'
            })
        ],
        module: {
            rules
        }
    },
    {
        mode: 'development',
        context: path.join(__dirname),
        devtool: 'eval-source-map',
        resolve: {
            modules: [path.resolve(__dirname, 'node_modules')]
        },
        entry: getWidgetEntries(),
        output: {
            path: path.join(__dirname, 'dist/appData'),
            filename: 'widgets/[name]',
            publicPath: Consts.CONTEXT_PATH
        },
        optimization: {
            namedModules: true
        },
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: 'widgets/**/src/backend.js',
                    to: '[path]../backend.js'
                }
            ])
        ],
        externals: {
            react: 'React',
            'react-dom': 'ReactDOM'
        },
        module: {
            rules
        }
    },
    {
        mode: 'development',
        context: path.join(__dirname),
        devtool: 'eval-source-map',
        resolve: {
            modules: [path.resolve(__dirname, 'node_modules')]
        },
        entry: glob.sync('./widgets/common/src/*.js'),
        output: {
            path: path.join(__dirname, 'dist/appData/widgets'),
            filename: 'common/common.js',
            publicPath: Consts.CONTEXT_PATH
        },
        optimization: {
            namedModules: true
        },
        module: {
            rules
        }
    }
];
