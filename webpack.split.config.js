const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { createHash } = require('crypto');

const isProduction = process.env.NODE_ENV === 'production';

// Create a simple hash for cache busting
const getFileHash = (filename) => {
  if (!isProduction) return filename;
  const hash = createHash('md5').update(filename).digest('hex').substring(0, 8);
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);
  return `${name}.${hash}${ext}`;
};

module.exports = {
  mode: isProduction ? 'production' : 'development',
  
  // No entry points - we'll just copy and optimize existing files
  entry: {},
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: './'
  },

  optimization: {
    minimize: false // Don't re-minimize already minified files
  },

  plugins: [
    // Copy and optimize admin bundle
    new CopyWebpackPlugin({
      patterns: [
        { 
          from: 'public/admin.min.js', 
          to: isProduction ? getFileHash('admin.min.js') : 'admin.min.js',
          info: { minimized: true }
        },
        { 
          from: 'public/index.min.js', 
          to: isProduction ? getFileHash('presentation.min.js') : 'presentation.min.js',
          info: { minimized: true }
        },
        { 
          from: 'public/admin.min.css', 
          to: isProduction ? getFileHash('admin.min.css') : 'admin.min.css'
        },
        { 
          from: 'public/index.min.css', 
          to: isProduction ? getFileHash('presentation.min.css') : 'presentation.min.css'
        },
        // Copy all static assets
        { from: 'public/fonts', to: 'fonts' },
        { from: 'public/material-icons', to: 'material-icons' },
        { from: 'public/media', to: 'media' },
        { from: 'public/modules', to: 'modules' }
      ]
    }),

    // Generate optimized HTML files that reference the split bundles
    new HtmlWebpackPlugin({
      template: '!!raw-loader!./public/admin.html',
      filename: 'admin.html',
      inject: false,
      templateParameters: {
        adminJs: isProduction ? getFileHash('admin.min.js') : 'admin.min.js',
        adminCss: isProduction ? getFileHash('admin.min.css') : 'admin.min.css'
      },
      minify: isProduction
    }),

    new HtmlWebpackPlugin({
      template: '!!raw-loader!./public/index.html',
      filename: 'index.html', 
      inject: false,
      templateParameters: {
        presentationJs: isProduction ? getFileHash('presentation.min.js') : 'presentation.min.js',
        presentationCss: isProduction ? getFileHash('presentation.min.css') : 'presentation.min.css'
      },
      minify: isProduction
    })
  ],

  performance: {
    hints: false
  },

  stats: {
    all: false,
    assets: true,
    errors: true,
    warnings: true
  }
};
