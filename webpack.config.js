const path  = require('path');
const isWsl = require('is-wsl');
const safe  = require('postcss-safe-parser');

// Plugins
const MiniCssExtractPlugin    = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin       = require('html-webpack-plugin');
const { CleanWebpackPlugin }  = require('clean-webpack-plugin');
const TerserPlugin            = require('terser-webpack-plugin');
const CopyPlugin              = require('copy-webpack-plugin');


module.exports = (env, argv) => {
  // Check modes
  const isDevEnv = argv.mode === 'development';
  const isProdEnv = argv.mode === 'production';

  // Define loaders
  const SCSSLoaders = () => {
    const loaders = [];

    if (isDevEnv) loaders.push({
        loader: 'style-loader'
    });

    if (isProdEnv) loaders.push({
        loader: MiniCssExtractPlugin.loader,
    });

    loaders.push({
      loader: 'css-loader',
      options: {
        sourceMap: isDevEnv
      }
    });

    if (isProdEnv) loaders.push({
      loader: 'postcss-loader',
    });

    loaders.push({
      loader: 'sass-loader',
      options: {
        sourceMap: isDevEnv
      }
    });

    return loaders;
  }
  const imageLoaders = () => {
    const loaders = [];
    
    loaders.push({
      loader: 'url-loader',
      options: {
        limit: 8192
      }
    });

    if (isProdEnv) loaders.push({
      loader: 'image-webpack-loader',
      options: {
        mozjpeg: {
          progressive: true,
          quality: 65
        },
        // optipng.enabled: false will disable optipng
        optipng: {
          enabled: false,
        },
        pngquant: {
          quality: [0.65, 0.90],
          speed: 4
        },
        gifsicle: {
          interlaced: false,
        },
        // the webp option will enable WEBP
        webp: {
          quality: 75
        }
      }
    });
    
    return loaders;
  }

  // Define plugins list
  const usePlugins = () => {
    const plugins = [];

    if (isProdEnv) plugins.push(
      new CleanWebpackPlugin(),
      new CopyPlugin([
        { 
          from: 'public',
          to: './',
          ignore: ['index.html'],
        }
      ])
    );
    
    plugins.push(
      new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve(__dirname, 'public/index.html'),
        // only in development?
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      })
    );

    return plugins;
  }

  const config = {
    entry: ['@babel/polyfill', './src/index.tsx'],
    devtool: 'inline-source-map',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'static/js/[name].[contenthash:8].js',
      chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
      publicPath: '/world-visual'
    },
    devServer: {
      contentBase: path.join(__dirname, "public"),
      compress: true,
      hot: true,
      publicPath: '/',
      port: 3000,
      watchContentBase: true,
      historyApiFallback: true,
      clientLogLevel: "warn",
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.(s[ac]|c)ss$/i,
          use: SCSSLoaders()
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: imageLoaders()
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-url-loader',
              options: {
                limit: 10 * 1024,
                noquotes: true,
              }
            }
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            'file-loader',
          ],
        },
      ]
    },
    plugins: usePlugins(),
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg', '.scss'],
      alias: {
        '@': path.resolve(__dirname, 'src/components'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@images': path.resolve(__dirname, 'src/assets/images'),
        '@scss': path.resolve(__dirname, 'src/assets/scss'),
        '@d3-chart': path.resolve(__dirname, 'src/d3-chart/index.ts'),
        '@queries': path.resolve(__dirname, 'src/gql/queries.ts'),
        '@mutations': path.resolve(__dirname, 'src/gql/mutations.ts'),
        '@types': path.resolve(__dirname, 'src/ts-types/index.ts')
      },
    },
    optimization: {
      minimize: isProdEnv,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            keep_classnames: undefined, // `true` to prevent discarding or mangling of class names, `regexp` to only keep class names matching that regex
            keep_fnames: false, // `true` to prevent discarding or mangling of function names, `regexp` to only keep class names matching that regex
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          parallel: !isWsl,
          cache: true,
          sourceMap: true,
        }),
        new OptimizeCssAssetsPlugin({
          cssProcessorOptions: {
            parser: safe,
            map: {
              inline: false,
              annotation: true
            }
          }
        })
      ],
      splitChunks: {
        chunks: 'all'
      },
      runtimeChunk: true,
      mergeDuplicateChunks: true
    }
  }

  if (isDevEnv) {
    config.output.path = undefined;
    config.output.filename = 'static/js/[bundle].js';
    config.output.chunkFilename = 'static/js/[name].chunk.js';
  }

  return config;
}