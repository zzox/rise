const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const { phaser, phaserModule, nodeModules, dist, dev } = require('./paths');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

// https://webpack.js.org/plugins/define-plugin/
const definePlugin = new webpack.DefinePlugin({
  // set vars needed by phaser
  'typeof SHADER_REQUIRE': JSON.stringify(false),
  'typeof CANVAS_RENDERER': JSON.stringify(true),
  'typeof WEBGL_RENDERER': JSON.stringify(true)
});

// https://github.com/jantimon/html-webpack-plugin
const htmlPlugin = new HtmlWebpackPlugin({
  template: './index.html'
});

// https://www.npmjs.com/package/browser-sync-webpack-plugin
const browserSyncPlugin = new BrowserSyncPlugin(
  {
    host: process.env.IP || 'localhost',
    port: process.env.PORT || 3000,
    proxy: 'http://localhost:8080/'
  },
  { reload: false } // stop BrowserSync reloading page, leave it to Webpack Dev Server
);

// https://www.npmjs.com/package/webpack-bundle-analyzer
const analyzerPlugin = new BundleAnalyzerPlugin();

module.exports = (env, options) => {
  return {
    devServer: {
      host: '0.0.0.0' // allows external access to host (e.g. for testing on mobile)
    },
    mode: 'development', // dictates webpack defaults (development = faster build, production = smaller filesize)
    output: {
      path: dist,
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js',
      publicPath: '/'
    },
    optimization: {
      splitChunks: {
        chunks: 'all' // separates vendor bundles from main
      }
    },
    plugins: [definePlugin, htmlPlugin, analyzerPlugin, browserSyncPlugin],
    module: {
      rules: [
        { // transpile js using babel
          test: /\.js$/,
          exclude: [nodeModules],
          use: {
            loader: 'babel-loader'
          }
        },
        { // loader for media files https://webpack.js.org/loaders/file-loader/
          test: /\.(png|jpg|gif|ico|svg|pvr|pkm|static|ogg|mp3|wav)$/,
          exclude: [nodeModules],
          use: ['file-loader'] 
        },
        { // loader to import files as a string https://webpack.js.org/loaders/raw-loader/
          test: [/\.vert$/, /\.frag$/],
          exclude: [nodeModules],
          use: 'raw-loader' 
        },
        { // load css as part of js bundle saving a request
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]_[local]_[hash:base64]',
                sourceMap: true,
                minimize: true
              }
            }
          ]
        }
      ]
    },
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    }
  };
};


// const path = require('path')
// const webpack = require('webpack')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
// const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
// const HtmlWebpackTemplate = require('html-webpack-template')

// // Phaser webpack config
// const phaserModule = path.join(__dirname, '/node_modules/phaser/')
// const phaser = path.join(phaserModule, 'src/phaser.js')

// const definePlugin = new webpack.DefinePlugin({
//     __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
//     WEBGL_RENDERER: true, // I did this to make webpack work, but I'm not really sure it should always be true
//     CANVAS_RENDERER: true // I did this to make webpack work, but I'm not really sure it should always be true
// })

// module.exports = {
//     entry: {
//         app: [
//             'babel-polyfill',
//             path.resolve(__dirname, 'src/main.js')
//         ],
//         vendor: ['phaser']
//     }, 
//     devtool: 'cheap-source-map',
//     output: {
//         pathinfo: true,
//         path: path.resolve(__dirname, 'dist'),
//         publicPath: './dist/',
//         filename: 'bundle.js'
//     },
//     watch: true,
//     plugins: [
//         definePlugin,
//         new webpack.optimize.CommonsChunkPlugin({ name: 'vendor'/* chunkName= */, filename: 'vendor.bundle.js'/* filename= */ }),
//         new HtmlWebpackPlugin({
//             filename: './src/index.html',
//             template: HtmlWebpackTemplate,
//             chunks: ['vendor', 'app'],
//             chunksSortMode: 'manual',
//             minify: {
//                 removeAttributeQuotes: false,
//                 collapseWhitespace: false,
//                 html5: false,
//                 minifyCSS: false,
//                 minifyJS: false,
//                 minifyURLs: false,
//                 removeComments: false,
//                 removeEmptyAttributes: false
//             },
//             hash: false
//         }),
//         new webpack.LoaderOptionsPlugin({
//           debug: true
//         }),
//         new BrowserSyncPlugin({
//             host: process.env.IP || 'localhost',
//             port: process.env.PORT || 4040,
//             server: {
//                 baseDir: ['./', './build']
//             }
//         })
//     ],
//     module: {
//         rules: [
//             { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
//             { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
//             { test: [/\.vert$/, /\.frag$/], use: 'raw-loader' }
//         ]
//     },
//     // node: {
//     //     fs: 'empty',
//     //     net: 'empty',
//     //     tls: 'empty'
//     // },
//     resolve: {
//         alias: {
//             'phaser': phaser,
//         }
//     }
// }