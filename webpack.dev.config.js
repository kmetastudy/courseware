const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

var config = {
  watch: true,
  mode: "development",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  //   plugins: [
  //     new MiniCssExtractPlugin({
  //         filename: '[name]-bundle.css'
  //     }),
  // ]
};

var configML = Object.assign({}, config, {
  name: "configML",

  entry: {
    ml: path.resolve(__dirname, "_ml/static/js/ml.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/ml"),
    library: "mllibrary",
    filename: "ml-bundle-20230807.js",
    libraryTarget: "var",
    clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "ml-bundle-20230807.css",
    }),
  ],
});

var configMN = Object.assign({}, config, {
  name: "configMN",

  entry: {
    mn: path.resolve(__dirname, "_mn/static/js/mn.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/mn"),
    library: "mnlibrary",
    filename: "mn-bundle-20230807.js",
    libraryTarget: "var",
    clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "mn-bundle-20230807.css",
    }),
  ],
});

var configCP = Object.assign({}, config, {
  name: "configCP",

  entry: {
    cp: path.resolve(__dirname, "_cp/static/js/cp.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/cp"),
    library: "cplibrary",
    // filename: "cp-bundle-20230807.js",
    filename: `cp-bundle-20231012.js`,
    libraryTarget: "var",
    clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      // filename: "cp-bundle-20230807.css",
      filename: `cp-bundle-20231012.css`,
    }),
  ],
});

var configTC = Object.assign({}, config, {
  name: "configTC",

  entry: {
    tc: path.resolve(__dirname, "_tc/static/js/tc.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/tc"),
    library: "tclibrary",
    filename: "tc-bundle-20230807.js",
    libraryTarget: "var",
    clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "tc-bundle-20230807.css",
    }),
  ],
});

var configST = Object.assign({}, config, {
  name: "configST",

  entry: {
    st: path.resolve(__dirname, "_st/static/js/st.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/st"),
    library: "stlibrary",
    filename: "st-bundle-20231012.js",
    libraryTarget: "var",
    clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "st-bundle-20231012.css",
    }),
  ],
});

// Return Array of Configurations
// module.exports = [configML, configMN, configCP, configTC, configST ];
// module.exports = [configML, configMN, configCP , configTC, configST];
module.exports = [configCP, configST];

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-based, so we add 1
  const day = today.getDate().toString().padStart(2, "0");

  return `${year}${month}${day}`;
}
