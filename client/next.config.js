module.exports = {
  env: {
    API_URL: process.env.API_URL || 'http://localhost:4000',
    GRAPHQL_URL: process.env.GRAPHQL_URL || 'http://localhost:4000/graphql'
  }
};
