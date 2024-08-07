var path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src/index.umd.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "vue.js",
    library: "Vue",
    libraryTarget: "umd",
  },
  module: {
    loaders: [{ test: /\.js/, loader: "babel", exclude: /node_modules/ }],
  },
};
