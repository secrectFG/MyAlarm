const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const appDirectory = path.resolve(__dirname);

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary
// `node_module`.
const babelLoaderConfiguration = {
  test: /\.js$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(appDirectory, "index.web.js"),
    path.resolve(appDirectory, "src"),
    path.resolve(appDirectory, "App.js"),
    path.resolve(appDirectory, "node_modules/react-native-uncompiled"),
  ],
  use: {
    loader: "babel-loader",
    options: {
      cacheDirectory: true,
    },
  },
};

// This is needed for webpack to import static images in JavaScript files.
const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: "url-loader",
    options: {
      name: "[name].[ext]",
      esModule: false,
    },
  },
};

module.exports = {
  entry: [
    // load any web API polyfills
    // path.resolve(appDirectory, 'polyfills-web.js'),
    // your web-specific entry file
    path.resolve(appDirectory, "src/index.js"),
  ],

  // configures where the build ends up
  output: {
    filename: "static/js/[name].[contenthash:8].js",
    path: path.resolve(appDirectory, "android/app/src/main/assets"),
    publicPath: "/",
    clean: true, // Clean the output directory before emit.
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(appDirectory, "public/index.html"),
      filename: "index.html",
    }),
  ],

  module: {
    rules: [babelLoaderConfiguration, imageLoaderConfiguration],
  },

  resolve: {
    // This will only alias the exact import "react-native"
    alias: {
      "react-native$": "react-native-web",
    },
    // If you're working on a multi-platform React Native app, web-specific
    // module implementations should be written in files using the extension
    // `.web.js`.
    extensions: [".web.js", ".js"],
  },

  mode: "production",
};
