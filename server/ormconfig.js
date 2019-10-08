const parser = require('pg-connection-string')

const db = parser(process.env.DATABASE_URL)

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
  "entities": ["src/entity/**/*.ts"],
  "migrations": ["src/migration/**/*.ts"],
  "subscribers": ["src/subscriber/**/*.ts"],
  "cli": {
    "entitiesDir": "src/entity",
    "migrationsDir": "src/migration",
    "subscribersDir": "src/subscriber"
  }
}
