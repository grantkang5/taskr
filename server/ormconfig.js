const parser = require('pg-connection-string');
const db = parser(process.env.DATABASE_URL);

const config = {
  development: {
    type: 'postgres',
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    ssl: false,
    entities: ['src/entity/**/*.ts'],
    migrations: ['src/database/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'src/entity',
      migrationsDir: 'src/database/migration',
      subscribersDir: 'src/subscriber'
    }
  },
  production: {
    type: 'postgres',
    host: db.host,
    port: db.port,
    username: db.user,
    password: db.password,
    database: db.database,
    synchronize: true,
    logging: false,
    ssl: true,
    entities: ['dist/entity/**/*.js'],
    migrations: ['dist/database/migration/**/*.js'],
    subscribers: ['dist/subscriber/**/*.js'],
    cli: {
      entitiesDir: 'dist/entity',
      migrationsDir: 'dist/database/migration',
      subscribersDir: 'dist/subscriber'
    }
  },
  test: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    ssl: false,
    entities: ['src/entity/**/*.ts'],
    migrations: ['src/database/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'src/entity',
      migrationsDir: 'src/database/migration',
      subscribersDir: 'src/subscriber'
    }
  }
};

module.exports = config[process.env.NODE_ENV];
