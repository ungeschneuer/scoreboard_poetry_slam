const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'source-map' : false,

  entry: {
    // Use existing minified files but split them
    admin: './public/admin.min.js',
    presentation: './public/index.min.js'
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
            drop_console: false, // Keep console for debugging
            drop_debugger: false,
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
      minSize: 20000,
      maxSize: 500000,
      cacheGroups: {
        // Extract shared vendor code (jQuery, Angular, etc.)
        vendor: {
          test: /node_modules|jquery|angular|material/i,
          name: 'vendor',
          priority: 10,
          chunks: 'all',
          enforce: true
        },
        
        // Extract shared code between admin and presentation
        common: {
          name: 'common',
          minChunks: 2,
          priority: 5,
          chunks: 'all',
          reuseExistingChunk: true
        }
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'public')
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            cacheDirectory: true
          }
        }
      }
    ]
  },

  plugins: [
    ...(isProduction ? [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css'
      })
    ] : []),

    // Generate HTML files that load the correct bundles
    new HtmlWebpackPlugin({
      template: './public/admin.html',
      filename: 'admin.html',
      chunks: ['vendor', 'common', 'admin'],
      inject: 'body',
      scriptLoading: 'blocking',
      minify: false // Keep readable for debugging
    }),

    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      chunks: ['vendor', 'common', 'presentation'],
      inject: 'body', 
      scriptLoading: 'blocking',
      minify: false // Keep readable for debugging
    }),

    // Copy all static assets exactly as they are
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
    hints: false // Disable for now to avoid warnings
  },

  stats: {
    chunks: true,
    modules: false,
    children: false,
    warningsFilter: /exceed the recommended size limit/
  }
};
