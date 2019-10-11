const parser = require('pg-connection-string')
const db = parser(process.env.DATABASE_URL)

module.exports = [{
  "name": "development",
  "type": "postgres",
  "host": 'localhost',
  "port": 5432,
  "username": process.env.PG_USER,
  "password": process.env.PG_PASSWORD,
  "database": process.env.DATABASE_URL,
  "synchronize": true,
  "logging": false,
  "ssl": false,
  "entities": ["src/entity/**/*.ts"],
  "migrations": ["src/database/migration/**/*.ts"],
  "subscribers": ["src/subscriber/**/*.ts"],
  "cli": {
    "entitiesDir": "src/entity",
    "migrationsDir": "src/database/migration",
    "subscribersDir": "src/subscriber"
  }
},
{
  "name": "production",
  "type": "postgres",
  "host": db.host,
  "port": db.port,
  "username": db.user,
  "password": db.password,
  "database": db.database,
  "synchronize": false,
  "logging": false,
  "ssl": true,
  "entities": ["dist/entity/**/*.js"],
  "migrations": ["dist/database/migration/**/*.js"],
  "subscribers": ["dist/subscriber/**/*.js"],
  "cli": {
    "entitiesDir": "dist/entity",
    "migrationsDir": "dist/database/migration",
    "subscribersDir": "dist/subscriber"
  },
  "name": "test",
  "type": "postgres",
  "host": 'localhost',
  "port": 5432,
  "username": process.env.PG_USER,
  "password": process.env.PG_PASSWORD,
  "database": process.env.DATABASE_URL,
  "synchronize": true,
  "logging": false,
  "ssl": false,
  "entities": ["src/entity/**/*.ts"],
  "migrations": ["src/database/migration/**/*.ts"],
  "subscribers": ["src/subscriber/**/*.ts"],
  "cli": {
    "entitiesDir": "src/entity",
    "migrationsDir": "src/database/migration",
    "subscribersDir": "src/subscriber"
  }
},
]