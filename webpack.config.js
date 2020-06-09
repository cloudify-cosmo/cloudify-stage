const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const _ = require('lodash');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const Consts = require('./backend/consts');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    const mode = isProduction ? 'production' : 'development';
    const context = path.join(__dirname);
    const devtool = isProduction ? undefined : 'eval-source-map';
    const outputPath = path.join(__dirname, 'dist');

    const externals = {
        react: 'React',
        'react-dom': 'ReactDOM'
    };
    const module = {
        rules: _.compact([
            !isProduction && {
                test: /\.js$/,
                use: ['source-map-loader'],
                enforce: 'pre'
            },
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
                            name: `${isProduction ? '/' : ''}static/fonts/[name].[ext]`
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
                            name: `${isProduction ? '/' : ''}static/images/[name].[ext]`
                        }
                    }
                ]
            }
        ])
    };

    const getProductionPlugins = isAnalysisMode =>
        isAnalysisMode
            ? [new BundleAnalyzerPlugin()]
            : [
                  new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
                  new CompressionPlugin({
                      algorithm: 'gzip',
                      test: /\.js$|\.css$|\.html$/,
                      threshold: 10240,
                      minRatio: 0.8
                  })
              ];

    if (isProduction && fs.existsSync(outputPath)) {
        try {
            fs.rmdirSync(outputPath, { recursive: true });
        } catch (err) {
            console.error(`Cannot delete output directory: ${outputPath}. Error: ${err}.`);
            process.exit(-1);
        }
    }

    const configuration = [
        {
            mode,
            optimization: isProduction
                ? {
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
                  }
                : undefined,
            context,
            devtool,
            resolve: {
                alias: {
                    'jquery-ui': 'jquery-ui/ui',
                    jquery: `${__dirname}/node_modules/jquery` // Always make sure we take jquery from the same place
                }
            },
            entry: ['./app/main.js'],
            output: {
                path: outputPath,
                filename: 'static/js/[name].bundle.js',
                publicPath: Consts.CONTEXT_PATH
            },
            module,
            plugins: _.flatten(
                _.compact([
                    new CopyWebpackPlugin(
                        _.compact([
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
                        ])
                    ),
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
                    isProduction && getProductionPlugins(env && env.analyse === 'main')
                ])
            )
        },
        {
            mode,
            context,
            devtool,
            entry: glob.sync('./widgets/*/src/widget.js').reduce((acc, item) => {
                const name = item.replace('./widgets/', '').replace('/src', '');
                acc[name] = item;
                return acc;
            }, {}),
            output: {
                path: path.join(outputPath, 'appData'),
                filename: 'widgets/[name]',
                publicPath: Consts.CONTEXT_PATH
            },
            module,
            plugins: _.flatten(
                _.compact([
                    new CopyWebpackPlugin([
                        {
                            from: 'widgets/**/src/backend.js',
                            to: '[path]../backend.js'
                        }
                    ]),
                    isProduction && getProductionPlugins(env && env.analyse === 'widgets')
                ])
            ),
            externals
        },
        {
            mode,
            context,
            devtool,
            entry: glob.sync('./widgets/common/src/*.js'),
            output: {
                path: path.join(outputPath, 'appData/widgets'),
                filename: 'common/common.js',
                publicPath: Consts.CONTEXT_PATH
            },
            module,
            plugins: isProduction ? getProductionPlugins(env && env.analyse === 'widgets-common') : [],
            externals
        }
    ];

    if (argv.debug) {
        console.log('Webpack Configuration', configuration);
    }

    return configuration;
};
