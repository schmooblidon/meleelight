const path = require("path");
const srcPath = path.join(process.cwd(), "src");
const distJsPath = path.join(process.cwd(), "dist/js");

module.exports = {
  cache: true,
  debug: false,
  entry: [path.join(srcPath, "animations.js")],
  output: {
    path: distJsPath,
    filename: "animations.js",
  },
  resolve: {
    extensions: ["", ".js"],
    root: [srcPath],
  },
};
