const { Worker } = require('bullmq');
const redis = require('../config/redis');
const fileProcessor = require('../upload/upload.processor');
const { AppDataSource } = require('../config/database');

AppDataSource.initialize()
  .then(() => {
    console.log('Data source initialized');

    const worker = new Worker('fileQueue', fileProcessor, {
      connection: redis,
    });

    worker.on('completed', (job) => {
      console.log(`Job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
      console.error(`Job ${job.id} failed:`, err.message);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize datasource:', err);
  });
