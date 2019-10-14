const lessToJS = require("less-vars-to-js");
const fs = require("fs");
const path = require("path");
const antdLessLoader = require("next-antd-aza-less")

const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './assets/antd-custom.less'), 'utf8')
)

if (typeof require !== 'undefined') {
  // tslint:disable-next-line: no-empty
  require.extensions['.less'] = file => {}
}

module.exports = antdLessLoader({
  cssModules: true,
  lessLoaderOptions: {
    importLoaders: 1,
    javascriptEnabled: true,
    localIdentName: "[local]___[hash:base64:5]",
    modifyVars: themeVariables,
    url: false
  },
  // tslint:disable-next-line: object-literal-sort-keys
  env: {
    API_URL: process.env.API_URL || "http://localhost:4000",
    GRAPHQL_URL: process.env.GRAPHQL_URL || "http://localhost:4000/graphql"
  }
});
