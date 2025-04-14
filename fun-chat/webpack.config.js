import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import { merge } from 'webpack-merge';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = '/artsemrogovenko-JSFE2024Q4/fun-chat/';

const config = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src', 'index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    publicPath: basePath,
    clean: true,
  },
  devtool: false,
  devServer: {
    open: [basePath],
    host: 'localhost',
    hot: true,
    static: {
      directory: path.join(__dirname, 'dist'),
      publicPath: basePath,
    },
    historyApiFallback: {
      index: basePath,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      favicon: path.resolve(__dirname, 'src','assets','favicon.svg'),
      minify: false
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
    new CleanWebpackPlugin(),
    new ESLintPlugin({
      extensions: 'ts',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          sources: false,
          minimize: false,
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  stats: {
    errorDetails: false,
  },
};


export default async (env, argv) => {
  const mode = argv.mode || 'development';
  
  if (mode === 'production') {
    const prodConfig = await import('./webpack.prod.config.js');
    return merge(config, prodConfig.default);
  }
  
  return config;
};