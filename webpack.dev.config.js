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

const tailwindModuleConfig = {
  rules: [
    {
      test: /\.css$/i,
      use: [
        MiniCssExtractPlugin.loader,
        { loader: "css-loader", options: { importLoaders: 1 } },
        { loader: "postcss-loader" },
      ],
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
    filename: `cp-bundle-20240717.js`,
    libraryTarget: "var",
    clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      // filename: "cp-bundle-20230807.css",
      filename: `cp-bundle-20240717.css`,
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
    filename: "st-bundle-20240717.js",
    libraryTarget: "var",
    clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "st-bundle-20240717.css",
    }),
  ],
  module: tailwindModuleConfig,
});

var configSTSchool = Object.assign({}, config, {
  name: "configSTSchool",

  entry: {
    stSchool: path.resolve(__dirname, "_st/static/js/st_school.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/st_school"),
    library: "stSchoollibrary",
    filename: "st-school-bundle-20240717.js",
    libraryTarget: "var",
    clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "st-school-bundle-20240717.css",
    }),
  ],
});

var configSchool = Object.assign({}, config, {
  name: "configSchool",

  entry: {
    school: path.resolve(__dirname, "_school/static/js/school.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/school"),
    library: "schoollibrary",
    filename: "school-bundle-20240717.js",
    libraryTarget: "var",
    clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "school-bundle-20240717.css",
    }),
  ],
  module: tailwindModuleConfig,
});

var configUser = Object.assign({}, config, {
  name: "configUser",

  entry: {
    class: path.resolve(__dirname, "_user/static/js/user.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/user"),
    library: "userlibrary",
    filename: "user-bundle-20240717.js",
    libraryTarget: "var",
    clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "user-bundle-20240717.css",
    }),
  ],
  module: tailwindModuleConfig,
});

var configMain = Object.assign({}, config, {
  name: "configMain",

  entry: {
    st: path.resolve(__dirname, "_main/static/js/main.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/main"),
    library: "mainlibrary",
    filename: "main-bundle-20240717.js",
    libraryTarget: "var",
    // clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "main-bundle-20240717.css",
    }),
  ],
  module: tailwindModuleConfig,
});

var configCM = Object.assign({}, config, {
  name: "configCM",

  entry: {
    cm: path.resolve(__dirname, "_cm/static/js/cm.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/cm"),
    library: "cmlibrary",
    filename: "cm-bundle-20240717.js",
    libraryTarget: "var",
    clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "cm-bundle-20240717.css",
    }),
  ],
  module: tailwindModuleConfig,
});

var configDashboard = Object.assign({}, config, {
  name: "configDashboard",

  entry: {
    dashboard: path.resolve(__dirname, "_main/static/js/dashboard.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/dashboard"),
    library: "dashboardlibrary",
    filename: "dashboard-bundle-20240717.js",
    libraryTarget: "var",
    // clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "dashboard-bundle-20240717.css",
    }),
  ],
  module: tailwindModuleConfig,
});

var configStats = Object.assign({}, config, {
  name: "configStats",

  entry: {
    stats: path.resolve(__dirname, "_main/static/js/stats.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/stats"),
    library: "statslibrary",
    filename: "stats-bundle-20240717.js",
    libraryTarget: "var",
    clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "stats-bundle-20240717.css",
    }),
  ],
  module: tailwindModuleConfig,
});

var configStatsDetail = Object.assign({}, config, {
  name: "configStatsDetail",

  entry: {
    statsdetail: path.resolve(__dirname, "_main/static/js/stats-detail.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/statsdetail"),
    library: "statsdetaillibrary",
    filename: "stats-detail-bundle-20240717.js",
    libraryTarget: "var",
    clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "stats-detail-bundle-20240717.css",
    }),
  ],
  module: tailwindModuleConfig,
});

var configClass = Object.assign({}, config, {
  name: "configClass",

  entry: {
    class: path.resolve(__dirname, "_class/static/js/class.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/class"),
    library: "classlibrary",
    filename: "class-bundle-20240717.js",
    libraryTarget: "var",
    clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "class-bundle-20240717.css",
    }),
  ],
  module: tailwindModuleConfig,
});

var configClassLaunch = Object.assign({}, config, {
  name: "configClassLaunch",

  entry: {
    class: path.resolve(__dirname, "_class/static/js/class_launch.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/class_launch"),
    library: "classLaunchLibrary",
    filename: "class_launch-bundle-20240717.js",
    libraryTarget: "var",
    clean: true,
    // assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "class_launch-bundle-20240717.css",
    }),
  ],
  module: tailwindModuleConfig,
});

var configClassRoomTeacher = Object.assign({}, config, {
  name: "configClassRoomTeacher",

  entry: {
    classroomTeacher: path.resolve(__dirname, "_class/static/js/classroom-teacher.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/classroom/teacher"),
    library: "classroomTeacherLibrary",
    filename: "classroom-teacher-bundle-20240717.js",
    libraryTarget: "var",
    clean: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "classroom-teacher-bundle-20240717.css",
    }),
  ],
  module: tailwindModuleConfig,
});

var configClassroomStudent = Object.assign({}, config, {
  name: "configClassroomStudent",

  entry: {
    classroomStudent: path.resolve(__dirname, "_class/static/js/classroom-student.js"),
  },
  output: {
    path: path.resolve(__dirname, "static/_bundle/classroom/student"),
    library: "classroomStudentLibrary",
    filename: `classroom-student-bundle-20240717.js`,
    libraryTarget: "var",
    clean: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `classroom-student-bundle-20240717.css`,
    }),
  ],
  module: tailwindModuleConfig,
});

// Return Array of Configurations
module.exports = [
  configMain,
  configCP,
  configCM,
  configST,
  configSTSchool,
  configSchool,
  configUser,
  configDashboard,
  configStats,
  configStatsDetail,
  configClass,
  configClassLaunch,
  configClassRoomTeacher,
  configClassroomStudent,
];
