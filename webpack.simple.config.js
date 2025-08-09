const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'source-map' : 'eval-source-map',

  entry: {
    // Use existing compiled files as entry points for now
    admin: './public/admin.js',
    presentation: './public/index.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
    clean: true,
    publicPath: './'
  },

  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: isProduction,
            drop_debugger: isProduction,
          },
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
    
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Split vendor libraries (jQuery, Angular, etc.)
        vendor: {
          test: /angular|jquery|material/i,
          name: 'vendor',
          priority: 10,
          chunks: 'all'
        },
        
        // Common code shared between admin and presentation
        common: {
          name: 'common',
          minChunks: 2,
          priority: 5,
          chunks: 'all'
        }
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            cacheDirectory: true
          }
        }
      },
      
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader'
        ]
      }
    ]
  },

  plugins: [
    ...(isProduction ? [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css'
      })
    ] : []),

    // Generate HTML files with injected bundles
    new HtmlWebpackPlugin({
      template: './public/admin.html',
      filename: 'admin.html',
      chunks: ['vendor', 'common', 'admin'],
      inject: 'body',
      scriptLoading: 'blocking'
    }),

    new HtmlWebpackPlugin({
      template: './public/index.html', 
      filename: 'index.html',
      chunks: ['vendor', 'common', 'presentation'],
      inject: 'body',
      scriptLoading: 'blocking'
    }),

    // Copy static assets
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/fonts', to: 'fonts' },
        { from: 'public/material-icons', to: 'material-icons' },
        { from: 'public/media', to: 'media' },
        { from: 'public/modules', to: 'modules' },
        { from: 'public/admin.min.css', to: 'admin.min.css' },
        { from: 'public/index.min.css', to: 'index.min.css' }
      ]
    })
  ],

  performance: {
    hints: isProduction ? 'warning' : false,
    maxEntrypointSize: 1000000, // 1MB - more realistic for legacy code
    maxAssetSize: 500000 // 500KB
  },

  stats: {
    chunks: true,
    modules: false,
    children: false
  }
};
