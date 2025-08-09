const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'source-map' : 'eval-source-map',

  entry: {
    // Shared vendor bundle
    vendor: './client/src/vendor-shared.js',
    
    // Separate entry points for admin and presentation
    admin: './client/src/admin/admin.entry.js',
    presentation: './client/src/presentation/presentation.entry.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
    chunkFilename: isProduction ? '[name].[contenthash:8].chunk.js' : '[name].chunk.js',
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
        // Separate chunk for shared vendor libraries
        vendor: {
          test: /[\\/]node_modules[\\/]|vendor-/,
          name: 'shared',
          priority: 10,
          chunks: 'all',
          enforce: true
        },
        
        // Angular Material and AngularJS core
        angular: {
          test: /angular|material|jquery/i,
          name: 'angular-vendor',
          priority: 20,
          chunks: 'all'
        },
        
        // Admin-specific modules
        admin: {
          test: /admin[\\/]/,
          name: 'admin-modules',
          priority: 5,
          chunks: 'all'
        },
        
        // Presentation-specific modules  
        presentation: {
          test: /presentation[\\/]/,
          name: 'presentation-modules',
          priority: 5,
          chunks: 'all'
        },
        
        // Common modules used by both
        common: {
          name: 'common',
          minChunks: 2,
          priority: 1,
          chunks: 'all'
        }
      }
    },
    
    runtimeChunk: {
      name: 'runtime'
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
      },
      
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      },
      
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
      },
      
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        type: 'asset/resource',
        generator: {
          filename: 'media/[name][ext]'
        }
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    
    ...(isProduction ? [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css',
        chunkFilename: '[name].[contenthash:8].chunk.css'
      })
    ] : []),

    // Generate optimized HTML files
    new HtmlWebpackPlugin({
      template: './client/templates/admin.template.html',
      filename: 'admin.html',
      chunks: ['runtime', 'vendor', 'admin'],
      inject: 'body',
      scriptLoading: 'blocking',
      minify: isProduction ? {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      } : false
    }),

    new HtmlWebpackPlugin({
      template: './client/templates/presentation.template.html',
      filename: 'index.html',
      chunks: ['runtime', 'vendor', 'presentation'],
      inject: 'body',
      scriptLoading: 'blocking',
      minify: isProduction ? {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      } : false
    }),

    // Copy static assets
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/fonts',
          to: 'fonts'
        },
        {
          from: 'public/material-icons',
          to: 'material-icons'
        },
        {
          from: 'public/media',
          to: 'media'
        },
        {
          from: 'public/modules',
          to: 'modules'
        }
      ]
    })
  ],

  resolve: {
    alias: {
      '@admin': path.resolve(__dirname, 'client/src/admin'),
      '@presentation': path.resolve(__dirname, 'client/src/presentation'),
      '@shared': path.resolve(__dirname, 'client/src/services'),
      '@components': path.resolve(__dirname, 'client/src/components')
    },
    extensions: ['.js', '.css']
  },

  performance: {
    hints: isProduction ? 'warning' : false,
    maxEntrypointSize: 500000, // 500KB
    maxAssetSize: 300000 // 300KB
  },

  stats: {
    chunks: false,
    modules: false,
    children: false
  }
};
