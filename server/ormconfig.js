module.exports = {
  "type": "postgres",
  "host": process.env.PG_HOST,
  "port": 5432,
  "username": process.env.PG_USER,
  "password": process.env.PG_PASSWORD,
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
