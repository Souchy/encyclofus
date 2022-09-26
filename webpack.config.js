/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const Dotenv = require('dotenv-webpack');

const cssLoader = 'css-loader';


const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: ['autoprefixer']
    }
  }
};

module.exports = function(env, { analyze }) {
  const production = env.production || process.env.NODE_ENV === 'production';
  return {
    target: 'web',
    mode: production ? 'production' : 'development',
    devtool: production ? undefined : 'eval-cheap-source-map',
    entry: {
      entry: './src/main.ts'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: production ? '[name].[contenthash].bundle.js' : '[name].bundle.js',
	//   publicPath: "/src/",
	//   publicPath: '/'
    },
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'dev-app'), 'node_modules'],
      alias: production ? {
        // add your production aliasing here
      } : {
        ...[
          'fetch-client',
          'kernel',
          'metadata',
          'platform',
          'platform-browser',
          'plugin-conventions',
          'route-recognizer',
          'router',
          'router-lite',
          'runtime',
          'runtime-html',
          'testing',
          'webpack-loader',
        ].reduce((map, pkg) => {
          const name = `@aurelia/${pkg}`;
          map[name] = path.resolve(__dirname, 'node_modules', name, 'dist/esm/index.dev.mjs');
          return map;
        }, {
          'aurelia': path.resolve(__dirname, 'node_modules/aurelia/dist/esm/index.dev.mjs'),
          // add your development aliasing here
        })
      }
    },
    devServer: {
      historyApiFallback: true,
    //   open: !process.env.CI,
      open: false,
      port: 9000,
	  liveReload: true,
	  static: true,
	  static: path.join(__dirname, '')
    },
    module: {
      rules: [
        { test: /\.(png|svg|jpg|jpeg|gif)$/i, type: 'asset' },
        // { test: /\.(json)$/i, type: 'asset' }, // help
        { test: /\.(woff|woff2|ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,  type: 'asset' },
        { test: /\.css$/i, use: [ 'style-loader', cssLoader, postcssLoader ] },
        { test: /\.less$/i, use: [ 'style-loader', cssLoader, postcssLoader, 'less-loader' ] },
        { test: /\.ts$/i, use: ['ts-loader', '@aurelia/webpack-loader'], exclude: /node_modules/ },
        {
          test: /[/\\]src[/\\].+\.html$/i,
          use: '@aurelia/webpack-loader',
          exclude: /node_modules/
        },
		{ test: /\.md$/i, use: ['@aurelia/webpack-loader', 'markdown-loader'], exclude: /node_modules/ }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({ 
		template: 'index.html', 
		// favicon: 'favicon.ico' 
		favicon: 'helmet.png'
	  }),
      new Dotenv({
        path: `./.env${production ? '' :  '.' + (process.env.NODE_ENV || 'development')}`,
      }),
      analyze && new BundleAnalyzerPlugin()
    ].filter(p => p)
  }
}
