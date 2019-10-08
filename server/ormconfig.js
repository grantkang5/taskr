const parser = require('pg-connection-string')

const db = parser(process.env.DATABASE_URL)

module.exports = {
  "type": "postgres",
  "host": process.env.NODE_ENV === 'production' ? db.host : 'localhost',
  "port": process.env.NODE_ENV === 'production' ? db.port : 5432,
  "username": process.env.NODE_ENV === 'production' ? db.user : process.env.PG_USER,
  "password": process.env.NODE_ENV === 'production' ? db.password : process.env.PG_PASSWORD,
  "database": process.env.NODE_ENV === 'production' ? db.database : process.env.DATABASE_URL,
  "synchronize": true,
  "logging": false,
  "ssl": process.env.NODE_ENV === 'production' ? true : false,
  "entities": process.env.NODE_ENV === 'production' ? ["dist/entity/**/*.js"] : ["src/entity/**/*.ts"],
  "migrations": process.env.NODE_ENV === 'production' ? ["dist/migration/**/*.js"] : ["src/migration/**/*.ts"],
  "subscribers": process.env.NODE_ENV === 'production' ? ["dist/subscriber/**/*.js"] : ["src/subscriber/**/*.ts"],
  "cli": {
    "entitiesDir": process.env.NODE_ENV === 'production' ? "dist/entity" : "src/entity",
    "migrationsDir": process.env.NODE_ENV === 'production' ? "dist/migration" : "src/migration",
    "subscribersDir": process.env.NODE_ENV === 'production' ? "dist/subscriber" : "src/subscriber"
  }
}
