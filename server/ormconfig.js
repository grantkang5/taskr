const parser = require('pg-connection-string')

const db = parser(process.env.DATABASE_URL)

module.exports = {
  "type": "postgres",
  "host": db.PG_HOST,
  "port": 5432,
  "username": db.PG_USER,
  "password": db.PG_PASSWORD,
  "database": process.env.DATABASE_URL,
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
