const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = [
  {
    name: "client",
    entry: "./src/client/app.ts",
    mode: "production",
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/
        },
      ],
    },
    resolve: {
      extensions: [ ".tsx", ".ts", ".js" ]
    },
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist/client"),
    }
  },
  {
    name: "server",
    entry: "./src/server/index.ts",
    mode: "production",
    target: "node",
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/
        },
      ],
    },
    resolve: {
      extensions: [ ".tsx", ".ts", ".js" ]
    },
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "dist/server"),
    }
  }
];