const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]",
    url: false,
  },
  cssModules: true,
  env: {
    "API_URL": process.env.API_URL || "http://localhost:4000", 
    "GRAPHQL_URL": process.env.GRAPHQL_URL || "http://localhost:4000/graphql"
  }
})