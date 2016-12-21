function createConfig(options) {
  const path = require("path");
  const webpack = require("webpack");
  const WebpackNotifierPlugin = require("webpack-notifier");
  var HappyPack = require('happypack');

  var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
  const { isMinified } = options;

  const srcDir = path.join(process.cwd(), "src");
  const distDir = path.join(process.cwd(), "dist");
  const distJsDir = path.join(distDir, "js");
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
    plugins.push(
        new SWPrecacheWebpackPlugin(
            {
              cacheId: 'meleelight',
              filename: 'service-worker.js',
              maximumFileSizeToCacheInBytes: 4194304,
              runtimeCaching: [{
                handler: 'cacheFirst',
                urlPattern: /.*/,
              }],
            }
        )
    );
    plugins.push(
        new HappyPack({
          // loaders is the only required parameter:
          loaders: [ 'babel?presets[]=es2015,presets[]=stage-0' ],
          threads:8

        })
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

    plugins.push(
        new SWPrecacheWebpackPlugin(
            {
              cacheId: 'meleelight',
              filename: 'service-worker.js',
              maximumFileSizeToCacheInBytes: 4194304,
              runtimeCaching: [{
                handler: 'cacheFirst',
                urlPattern: /.*/,
              }]
            }
        )
    );
    plugins.push(
        new HappyPack({
          // loaders is the only required parameter:
          loaders: [ 'babel?presets[]=es2015,presets[]=stage-0' ],
          threads:8

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
      ],
    }],

    loaders: [{
      // Babel
      test: /\.jsx?$/,
      exclude: [
        /node_modules/,
      ],
      loader: "happypack/loader",
    }],
  };



  /// CONFIG ///

  return {
    cache: true,
    debug: !isMinified,
    devtool: isMinified ? undefined : "eval",
    entry: {
      index: path.join(srcDir, "index"),
      main: path.join(srcDir, "main"),
    },
    output: {
      path: distJsDir,
      filename: `[name]${min}.js`,
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
