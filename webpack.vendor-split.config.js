const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

/**
 * 🚀 Vendor Chunk Splitting Configuration
 * 
 * This configuration extracts shared dependencies into vendor chunks for optimal loading.
 * Expected savings: 805KB from Material Design + 500KB from other shared dependencies = 1.3MB total
 */

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'source-map' : 'eval-source-map',

  // Multiple entry points for admin and presentation
  entry: {
    admin: './public/admin.min.js',
    presentation: './public/index.min.js',
  },

  output: {
    path: path.resolve(__dirname, 'public/vendor-split'),
    filename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
    chunkFilename: isProduction ? '[name].[contenthash:8].chunk.js' : '[name].chunk.js',
    publicPath: '/',
    clean: true
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
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|mp4|woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name].[hash:8][ext]',
        },
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    
    // Admin HTML with vendor chunks
    new HtmlWebpackPlugin({
      template: './public/admin.html',
      filename: 'admin.html',
      chunks: ['vendor-material', 'vendor-libs', 'admin'],
      inject: 'body',
      scriptLoading: 'blocking',
      minify: isProduction
    }),
    
    // Presentation HTML with vendor chunks
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      chunks: ['vendor-material', 'vendor-libs', 'presentation'],
      inject: 'body',
      scriptLoading: 'blocking',
      minify: isProduction
    }),
    
    // Copy static assets
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/fonts', to: 'fonts' },
        { from: 'public/material-icons', to: 'material-icons' },
        { from: 'public/media', to: 'media' },
        { from: 'public/modules', to: 'modules' },
        // Copy CSS files as-is for now
        { from: 'public/admin.min.css', to: 'admin.min.css' },
        { from: 'public/index.min.css', to: 'index.min.css' },
      ],
    }),
    
    ...(isProduction ? [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css',
        chunkFilename: '[name].[contenthash:8].chunk.css'
      })
    ] : []),
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Material Design vendor chunk (highest priority)
        'vendor-material': {
          test: /angular\.material|material-design|md[A-Z]/,
          name: 'vendor-material',
          chunks: 'all',
          priority: 20,
          enforce: true
        },
        
        // Other vendor libraries (Angular, jQuery)
        'vendor-libs': {
          test: /angular\.|jquery|\$|angular\.forEach|angular\.module/,
          name: 'vendor-libs',
          chunks: 'all',
          priority: 15,
          minSize: 20000, // 20KB minimum
          enforce: true
        },
        
        // Common utilities shared between admin and presentation
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 10,
          minSize: 10000, // 10KB minimum
          enforce: true
        },
        
        // Default vendor chunk for remaining node_modules
        default: {
          minChunks: 2,
          priority: -10,
          reuseExistingChunk: true
        }
      },
    },
    
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: isProduction,
            drop_debugger: isProduction,
          },
        },
      }),
    ],
    
    // Enable better caching
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
  },
  
  // Performance hints
  performance: {
    hints: isProduction ? 'warning' : false,
    maxEntrypointSize: 1000000, // 1MB
    maxAssetSize: 500000,       // 500KB
  },
  
  // Development server configuration
  devServer: {
    static: {
      directory: path.join(__dirname, 'public/vendor-split'),
    },
    compress: true,
    port: 4201,
    hot: true,
  },
};
