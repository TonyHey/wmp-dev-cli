const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "production",
  // devtool: "source-map",
  entry: {
    cli: "./lib/cli.js"
  },
  output: {
    path: path.resolve(__dirname, "bin"),
    filename: "[name].js",
    publicPath: "/",
    libraryTarget: "umd",
  },
  target: "node",
  node: {
    __filename: false,
    __dirname: false,
  },
  optimization: {
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [{
          loader: "babel-loader",
          options: {
            presets: [
              "env",
              "stage-0",
            ]
          }
        }],
        exclude: /node_modules/,
        include: `${__dirname}lib`,
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
    }),
  ],
}
