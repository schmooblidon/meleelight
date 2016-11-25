function createConfig(options) {
  const path = require("path");
  const webpack = require("webpack");
  const WebpackNotifierPlugin = require("webpack-notifier");

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
        // For now, exclude all old javascript. But mark my words, this won't
        // be the case forever.
        /node_modules/,
        /main\/sfx.js/,
        /settings.js/,
        /characters\/marth\/marthanimations.js/,
        /characters\/marth\/ecbmarth.js/,
        /characters\/puff\/puffanimations.js/,
        /characters\/puff\/ecbpuff.js/,
        /characters\/baseActionStates.js/,
        /main\/swordSwings.js/,
        /main\/vfx.js/,
        /physics\/hitDetection.js/,
        /main\/characters.js/,
        /characters\/marth\/marthAttributes.js/,
        /characters\/puff\/puffAttributes.js/,
        /physics\/article.js/,
        /main\/player.js/,
        /physics\/actionStateShortcuts.js/,
        /characters\/marth\/marth.js/,
        /characters\/puff\/puff.js/,
        /main\/render.js/,
        /menus\/startup.js/,
        /menus\/startscreen.js/,
        /menus\/menu.js/,
        /menus\/audiomenu.js/,
        /menus\/gameplaymenu.js/,
        /menus\/keytest.js/,
        /menus\/keyboardmenu.js/,
        /menus\/credits.js/,
        /menus\/css.js/,
        /target\/targetbuilder.js/,
        /target\/targetplay.js/,
        /menus\/targetselect.js/,
        /stages\/stages.js/,
        /stages\/stagerender.js/,
        /menus\/stageselect.js/,
        /physics\/physics.js/,
        /main\/ai.js/,
        /main\/resize.js/,
        /main\/main.js/,
      ],
    }],

    loaders: [{
      // Babel
      test: /\.jsx?$/,
      exclude: [
        /node_modules/,
      ],
      loader: "babel",
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
      "characters/fox": path.join(srcDir, "characters/fox"),
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
