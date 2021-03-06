/* eslint-env node */
const path = require('path');
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const browserslist = require('./package.json').browserslist;

const entry = {
  common: [
    './assets/scripts/common.js',
    './assets/scss/common.scss',
  ],
  playground: './assets/scss/playground.scss',
};

// Skip icons if there’s none or Webpack will throw an error
const icons = glob.sync('./assets/icons/**/*.svg');
if (icons.length) {
  entry.icons = icons;
}

// Extract CSS to a dedicated file when we’re not developing
const extractSass = new ExtractTextPlugin({
  filename: '[name].css',
});

// Always extract icons in a SVG file
const extractIcons = new SpriteLoaderPlugin({
  plainSprite: true,
});

module.exports = {
  resolve: {
    modules: [
      path.resolve(__dirname, 'assets/scripts'),
      'node_modules',
    ],
    extensions: ['.js'],
  },
  entry,
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['env', {
              targets: {
                browsers: browserslist,
              },
            }],
          ],
        },
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('autoprefixer')(),
                ],
              },
            },
            {
              loader: 'sass-loader',
              options: {
                includePaths: ['node_modules'],
              },
            },
          ],
        }),
      },
      {
        test: /\.(svg|png|jpe?g|gif|woff|woff2|eot|ttf|otf)$/,
        exclude: path.resolve('./assets/icons'),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        include: path.resolve('./assets/icons'),
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              spriteFilename: 'assets/icons.svg',
              esModule: false,
            },
          },
          'svgo-loader',
        ],
      },
    ],
  },
  plugins: [
    extractSass,
    extractIcons,
  ],
};
