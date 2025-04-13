import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
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
      minify: false
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
    new CleanWebpackPlugin(),
    new ESLintPlugin({
      extensions: 'ts',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './src/assets'),
          to: path.resolve(__dirname, './dist/assets'),
          noErrorOnMissing: true,
        },
      ],
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
        // generator: {
        //   filename: 'assets/[name]',
        // },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  stats: {
    errorDetails: false,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.esbuildMinify,
        // Link to options - https://esbuild.github.io/api/#minify
        terserOptions: {},
      }),
      new CssMinimizerPlugin({
        minify: CssMinimizerPlugin.esbuildMinify,
        minimizerOptions: {
          legalComments: 'none',
        },
      }),
    ],
    emitOnErrors: false,
  },
};

export default config;
