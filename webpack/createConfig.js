function createConfig(options) {
  const path = require("path");
  const webpack = require("webpack");
  const WebpackNotifierPlugin = require("webpack-notifier");

  const { isMinified } = options;

  const srcDir = path.join(process.cwd(), "src");
  const distDir = path.join(process.cwd(), "dist");
  const min = isMinified ? ".min" : "";

  /// PLUGINS ///

  const plugins = [
    // Growl notifications
    new WebpackNotifierPlugin(),
  ];

  if (isMinified) {
    // Allow production-only code
    plugins.push(
      new webpack.DefinePlugin({
        "process.env": {
          "NODE_ENV": '"prod"'
        }
      })
    );

    // Minify JS
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      })
    );

    // Give the most commonly used chunks lower IDs
    plugins.push(
      new webpack.optimize.OccurenceOrderPlugin(true)
    );
  }
  else {
    // Allow dev-only code
    plugins.push(
      new webpack.DefinePlugin({
        "process.env": {
          "NODE_ENV": '"dev"'
        }
      })
    );
  }

  /// MODULES (LOADERS) ///

  const modules = {
    preLoaders: [{
      // ESLint
      test: /\.jsx?$/,
      loader: "eslint-loader",
      exclude: [
        /node_modules/,
        /legacy/,
        /shared\/modules/,
      ],
    }],

    loaders: [{
      // Babel
      test: /\.jsx?$/,
      exclude: [
        /node_modules/,
        /legacy\/lib/,
      ],
      loader: "babel",
    }],
  };



  /// CONFIG ///

  return {
    cache: true,
    debug: !isMinified,
    devtool: isMinified ? undefined : "eval",
    entry: path.join(srcDir, "index"),
    output: {
      path: distDir,
      filename: `main${min}.js`,
    },
    resolve: {
      extensions: ["", ".js"],
      root: [srcDir],
    },
    eslint: {
      emitError: true,
      emitWarning: true,
    },
    module: modules,
    plugins: plugins,
  };
}

module.exports = createConfig;
