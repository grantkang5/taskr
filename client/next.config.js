module.exports = {
  env: {
    "SOMETHING": process.env.API_URL,
    "API_URL": process.env.NODE_ENV === 'production' ? "https://dorya-api.herokuapp.com" : "http://localhost:4000", 
    "GRAPHQL_URL": process.env.NODE_ENV === 'production' ? "https://dorya-api.herokuapp.com/graphql" : "http://localhost:4000/graphql"
  }
}