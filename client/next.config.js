if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }
const antdLessLoader = require('next-antd-aza-less');

if (typeof require !== 'undefined') {
  // tslint:disable-next-line: no-empty
  require.extensions['.less'] = file => {};
}

module.exports = antdLessLoader({
  cssModules: true,
  // tslint:disable-next-line: object-literal-sort-keys
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]'
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: {
      // 'primary-color': '#1DA57A',
    }
  },
  // tslint:disable-next-line: object-literal-sort-keys
  env: {
    API_URL: process.env.API_URL,
    CLIENT_URL: process.env.CLIENT_URL,
    GRAPHQL_URL: process.env.GRAPHQL_URL
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      const antStyles = /antd\/.*?\/style.*?/;
      const origExternals = [...config.externals];
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) {
            return callback();
          }
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback);
          } else {
            callback();
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals)
      ];

      config.module.rules.unshift({
        test: antStyles,
        use: 'null-loader'
      });
    }
    return config;
  }
});
