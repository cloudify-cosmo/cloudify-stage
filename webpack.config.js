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
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const Consts = require('./backend/consts');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    const mode = isProduction ? 'production' : 'development';
    const context = path.join(__dirname);
    const devtool = isProduction ? undefined : 'eval-source-map';
    const outputPath = path.join(__dirname, 'dist');
    const extensions = ['js', 'jsx', 'ts', 'tsx'];
    const resolveExtensions = extensions.map(extension => `.${extension}`);
    const globExtensions = `{${extensions.map(extension => `${extension}`).join(',')}}`;

    const externals = {
        react: 'React',
        'react-dom': 'ReactDOM',
        lodash: '_',
        'react-query': 'ReactQuery',
        'styled-components': 'Stage.styled'
    };

    const module = {
        rules: _.compact([
            !isProduction && {
                test: /\.js$/,
                use: ['source-map-loader'],
                enforce: 'pre'
            },
            {
                test: /\.(j|t)s(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader'
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
                // eslint-disable-next-line security/detect-unsafe-regex
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
                // eslint-disable-next-line security/detect-unsafe-regex
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
    const environmentPlugin = new webpack.EnvironmentPlugin({
        NODE_ENV: 'production',
        TEST: ''
    });

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
                extensions: resolveExtensions,
                alias: {
                    jquery: `${__dirname}/node_modules/jquery`, // Always make sure we take jquery from the same place
                    // Necessary to use the same version of React when developing components locally
                    // @see https://github.com/facebook/react/issues/13991#issuecomment-435587809
                    react: `${__dirname}/node_modules/react`
                }
            },
            entry: ['./app/main.ts'],
            output: {
                path: outputPath,
                filename: 'static/js/[name].bundle.js',
                publicPath: Consts.CONTEXT_PATH
            },
            module,
            plugins: _.flatten(
                _.compact([
                    new CopyWebpackPlugin({
                        patterns: [
                            {
                                from: 'node_modules/cloudify-ui-common/images/favicon.png',
                                to: 'static/images'
                            },
                            {
                                from: 'widgets',
                                to: 'appData/widgets',
                                globOptions: {
                                    ignore: ['**/src/**']
                                }
                            },
                            {
                                from: 'templates',
                                to: 'appData/templates'
                            }
                        ]
                    }),
                    new HtmlWebpackPlugin({
                        template: 'app/index.tmpl.html',
                        inject: 'body',
                        filename: 'static/index.html'
                    }),
                    new webpack.ProvidePlugin({
                        $: 'jquery',
                        jQuery: 'jquery',
                        d3: 'd3'
                    }),
                    new ForkTsCheckerWebpackPlugin({
                        eslint: {
                            files: './{app,widgets}/**/*.{ts,tsx,js,tsx}',
                            options: {
                                ignorePattern: 'widgets/**/backend.js'
                            }
                        },
                        typescript: {
                            configFile: './tsconfig.ui.json',
                            build: true,
                            mode: 'write-references'
                        }
                    }),
                    environmentPlugin,
                    isProduction && getProductionPlugins(env && env.analyse === 'main')
                ])
            )
        },
        {
            mode,
            context,
            devtool,
            resolve: {
                extensions: resolveExtensions
            },
            entry: glob.sync(`./widgets/*/src/widget.${globExtensions}`).reduce((acc, item) => {
                const name = item
                    .replace('./widgets/', '')
                    .replace('/src/widget', '/widget')
                    .replace(/(tsx)|(jsx)/, 'js');
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
                    new CopyWebpackPlugin({
                        patterns: [
                            {
                                from: 'widgets/**/src/backend.js',
                                to: '[path]../backend.js'
                            }
                        ]
                    }),
                    environmentPlugin,
                    isProduction && getProductionPlugins(env && env.analyse === 'widgets')
                ])
            ),
            externals
        },
        {
            mode,
            context,
            devtool,
            resolve: {
                extensions: resolveExtensions
            },
            entry: glob
                .sync(`./widgets/common/src/props/*.${globExtensions}`)
                .concat(glob.sync(`./widgets/common/src/hooks/*.${globExtensions}`))
                .concat(glob.sync(`./widgets/common/src/!(props|hooks)/*.${globExtensions}`))
                .concat(glob.sync(`./widgets/common/src/*.${globExtensions}`)),
            output: {
                path: path.join(outputPath, 'appData/widgets'),
                filename: 'common/common.js',
                publicPath: Consts.CONTEXT_PATH
            },
            module,
            plugins: [
                environmentPlugin,
                ...(isProduction ? getProductionPlugins(env && env.analyse === 'widgets-common') : [])
            ],
            externals
        }
    ];

    if (argv.debug) {
        console.log('Webpack Configuration', configuration);
    }

    return configuration;
};
