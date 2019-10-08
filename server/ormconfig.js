const parser = require('pg-connection-string')

const db = parser(process.env.DATABASE_URL)
console.log('database: ', db)
console.log('NODEENV: ', process.env.NODE_ENV)

module.exports = {
  "type": "postgres",
  "host": db.host,
  "port": db.port || 5432,
  "username": db.user,
  "password": db.password,
  "database": db.database,
  "synchronize": true,
  "logging": false,
  "ssl": process.env.NODE_ENV === 'production' ? true : false,
  "entities": process.env.NODE.ENV === 'production' ? ["dist/entity/**/*.js"] : ["src/entity/**/*.ts"],
  "migrations": process.env.NODE.ENV === 'production' ? ["dist/migration/**/*.js"] : ["src/migration/**/*.ts"],
  "subscribers": process.env.NODE.ENV === 'production' ? ["dist/subscriber/**/*.js"] : ["src/subscriber/**/*.ts"],
  "cli": {
    "entitiesDir": process.env.NODE.ENV === 'production' ? "dist/entity" : "src/entity",
    "migrationsDir": process.env.NODE.ENV === 'production' ? "dist/migration" : "src/migration",
    "subscribersDir": process.env.NODE.ENV === 'production' ? "dist/subscriber" : "src/subscriber"
  }
}
