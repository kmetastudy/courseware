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

var configUser = Object.assign({}, config, {
  name: "configUser",

  entry: {
    class: path.resolve(__dirname, "_user/static/js/user.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/user"),
    library: "userlibrary",
    filename: "user-bundle.js",
    libraryTarget: "var",
    clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "user-bundle.css",
    }),
  ],
});

var configMain = Object.assign({}, config, {
  name: "configMain",

  entry: {
    st: path.resolve(__dirname, "_main/static/js/main.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/main"),
    library: "mainlibrary",
    filename: "main-bundle.js",
    libraryTarget: "var",
    // clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "main-bundle.css",
    }),
  ],
});

var configCM = Object.assign({}, config, {
  name: "configCM",

  entry: {
    st: path.resolve(__dirname, "_cm/static/js/cm.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/cm"),
    library: "cmlibrary",
    filename: "cm-bundle.js",
    libraryTarget: "var",
    clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "cm-bundle.css",
    }),
  ],
});

var configDashboard = Object.assign({}, config, {
  name: "configDashboard",

  entry: {
    dashboard: path.resolve(__dirname, "_main/static/js/dashboard.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/dashboard"),
    library: "dashboardlibrary",
    filename: "dashboard-bundle.js",
    libraryTarget: "var",
    // clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "dashboard-bundle.css",
    }),
  ],
});

var configStats = Object.assign({}, config, {
  name: "configStats",

  entry: {
    stats: path.resolve(__dirname, "_main/static/js/stats.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/stats"),
    library: "statslibrary",
    filename: "stats-bundle.js",
    libraryTarget: "var",
    clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "stats-bundle.css",
    }),
  ],
});

var configStatsDetail = Object.assign({}, config, {
  name: "configStatsDetail",

  entry: {
    statsdetail: path.resolve(__dirname, "_main/static/js/stats-detail.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/statsdetail"),
    library: "statsdetaillibrary",
    filename: "stats-detail-bundle.js",
    libraryTarget: "var",
    clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "stats-detail-bundle.css",
    }),
  ],
});

var configClass = Object.assign({}, config, {
  name: "configClass",

  entry: {
    class: path.resolve(__dirname, "_class/static/js/class.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/class"),
    library: "classlibrary",
    filename: "class-bundle.js",
    libraryTarget: "var",
    clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "class-bundle.css",
    }),
  ],
});

var configClassLaunch = Object.assign({}, config, {
  name: "configClassLaunch",

  entry: {
    class: path.resolve(__dirname, "_class/static/js/class_launch.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/class_launch"),
    library: "classLaunchLibrary",
    filename: "class_launch-bundle.js",
    libraryTarget: "var",
    clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "class_launch-bundle.css",
    }),
  ],
});

var configClassRoomTeacher = Object.assign({}, config, {
  name: "configClassRoomTeacher",

  entry: {
    classroomTeacher: path.resolve(__dirname, "_class/static/js/classroom-teacher.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/classroom/teacher"),
    library: "classroomTeacherLibrary",
    filename: "classroom-teacher-bundle.js",
    libraryTarget: "var",
    clean: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "classroom-teacher-bundle.css",
    }),
  ],
});

var configClassroomStudent = Object.assign({}, config, {
  name: "configClassroomStudent",

  entry: {
    classroomStudent: path.resolve(__dirname, "_class/static/js/classroom-student.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/classroom/student"),
    library: "classroomStudentLibrary",
    filename: `classroom-student-bundle.js`,
    libraryTarget: "var",
    clean: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `classroom-student-bundle.css`,
    }),
  ],
});

// Return Array of Configurations
module.exports = [
  configMain,
  configCP,
  configCM,
  configST,
  configUser,
  configDashboard,
  configStats,
  configStatsDetail,
  configClass,
  configClassLaunch,
  configClassRoomTeacher,
  configClassroomStudent,
];
