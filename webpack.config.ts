import webpack from 'webpack';
import path from 'path';
import glob from 'glob';
import { existsSync, rmSync } from 'fs-extra';
import _ from 'lodash';

import TerserPlugin from 'terser-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import ImageminPlugin from 'imagemin-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const CONTEXT_PATH = '/console';

export default (
    env: { analyse?: 'widgets' | 'main'; widget?: string },
    argv: { debug?: boolean; mode?: webpack.Configuration['mode'] | 'test' }
) => {
    const isProduction = argv.mode === 'production';
    const isDevelopment = argv.mode === 'development';
    const isSingleWidgetBuild = !!env.widget;
    const widgetName = env.widget;
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

    const module: webpack.Configuration['module'] = {
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
                        loader: 'sass-loader'
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
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                math: 'always'
                            }
                        }
                    }
                ]
            },
            {
                // eslint-disable-next-line security/detect-unsafe-regex
                test: /\.(eot|woff|woff2|ttf)(\?\S*)?$/,
                type: 'asset/resource',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10000
                    }
                },
                generator: {
                    filename: `${isProduction ? '/' : ''}static/fonts/[name][ext]`
                }
            },
            {
                // eslint-disable-next-line security/detect-unsafe-regex
                test: /\.(svg|png|jpe?g|gif)(\?\S*)?$/,
                type: 'asset/resource',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10000
                    }
                },
                generator: {
                    filename: `${isProduction ? '/' : ''}static/images/[name][ext]`
                }
            }
        ])
    };

    const getProductionPlugins = (isAnalysisMode: boolean) =>
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
        'process.env.NODE_ENV': 'production',
        'process.env.TEST': ''
    });

    const exitWithError = (error: string) => {
        console.error(`ERROR: ${error}`);
        process.exit(-1);
    };

    if (isProduction && existsSync(outputPath)) {
        try {
            rmSync(outputPath, { recursive: true });
        } catch (err) {
            exitWithError(`Cannot delete output directory: ${outputPath}. Error: ${err}.`);
        }
    }

    const widgetsConfiguration: webpack.Configuration = {
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
            publicPath: CONTEXT_PATH
        },
        module,
        plugins: _.flatten(
            _.compact([
                new CopyWebpackPlugin({
                    patterns: _.compact([
                        {
                            from: 'widgets',
                            to: 'widgets',
                            globOptions: {
                                ignore: ['**/src/**']
                            }
                        }
                    ])
                }),
                environmentPlugin,
                isProduction && getProductionPlugins(env && env.analyse === 'widgets')
            ])
        ),
        externals
    };

    if (isSingleWidgetBuild) {
        const widgetPath = path.join(__dirname, `./widgets/${widgetName}`);
        if (existsSync(widgetPath)) {
            console.log('Building widget', widgetName);
        } else {
            exitWithError(`Invalid widget name provided. Widget directory "${widgetPath}" does not exist.`);
        }

        const singleWidgetConfiguration: webpack.Configuration = {
            ...widgetsConfiguration,
            entry: glob.sync(`./widgets/${widgetName}/src/widget.${globExtensions}`).reduce((acc, item) => {
                const name = item
                    .replace('./widgets/', '')
                    .replace('/src/widget', '/widget')
                    .replace(/(tsx)|(jsx)/, 'js');
                acc[name] = item;
                return acc;
            }, {}),
            output: {
                path: outputPath,
                filename: 'widgets/[name]',
                publicPath: CONTEXT_PATH
            },
            plugins: _.flatten(
                _.compact([
                    new CopyWebpackPlugin({
                        patterns: [
                            {
                                from: `widgets/${widgetName}`,
                                to: `widgets/${widgetName}`,
                                globOptions: {
                                    ignore: ['**/src/**']
                                }
                            }
                        ]
                    }),
                    environmentPlugin,
                    isProduction && getProductionPlugins(env && env.analyse === 'widgets')
                ])
            )
        };

        return singleWidgetConfiguration;
    }

    const configuration: webpack.Configuration[] = [
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
                      },
                      minimizer: [
                          new TerserPlugin({
                              extractComments: false
                          })
                      ]
                  }
                : undefined,
            context,
            devtool,
            resolve: {
                extensions: resolveExtensions,
                alias: {
                    // Necessary to use the same version of React when developing components locally
                    // @see https://github.com/facebook/react/issues/13991#issuecomment-435587809
                    react: `${__dirname}/node_modules/react`,
                    // Necessary to map semantic react ui theming paths
                    // @see "Configuring Webpack for theming" https://react.semantic-ui.com/theming/
                    '../../theme.config$': `${__dirname}/semantic-ui/theme.config`,
                    '../semantic-ui/site': `${__dirname}/semantic-ui/site`
                },
                fallback: {
                    // Required by the cypress, as from the webpack@5.x.x is not including node.js core modules by default
                    // If some other node.js core module (like 'fs') would be used within the cypress code, it should be listed below
                    path: false
                }
            },
            entry: ['./app/main.ts'],
            output: {
                path: outputPath,
                filename: 'static/js/[name].bundle.js',
                publicPath: CONTEXT_PATH
            },
            module,
            plugins: _.flatten(
                _.compact([
                    new CopyWebpackPlugin({
                        patterns: [
                            {
                                from: 'node_modules/cloudify-ui-common-frontend/images/favicon.png',
                                to: 'static/images'
                            },
                            {
                                from: 'app/images/*',
                                to: 'static/images/[name].[ext]'
                            },
                            {
                                from: 'templates',
                                to: 'appData/templates'
                            },
                            {
                                context: 'node_modules/cloudify-blueprint-topology/dist/icons',
                                from: '**/*',
                                to: 'static/images/topology'
                            }
                        ]
                    }),
                    new HtmlWebpackPlugin({
                        template: 'app/index.tmpl.html',
                        inject: 'body',
                        filename: 'static/index.html'
                    }),
                    new webpack.ProvidePlugin({
                        d3: 'd3'
                    }),
                    isDevelopment &&
                        new ForkTsCheckerWebpackPlugin({
                            eslint: {
                                files: './{app,widgets}/**/*.{ts,tsx,js,tsx}'
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
        widgetsConfiguration
    ];

    if (argv.debug) {
        console.log('Webpack Configuration', configuration);
    }

    return configuration;
};
