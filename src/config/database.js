const { DataSource } = require('typeorm');
const path = require('path');
const { User } = require('../entities/User');
const { File } = require('../entities/File');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'file_service',
  synchronize: true, // Set to false and use migrations in production
  logging: false,
  entities: [User, File],
  migrations: [],
  subscribers: [],
});

module.exports = { AppDataSource };
