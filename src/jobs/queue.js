const { Queue } = require('bullmq');
const redis = require('../config/redis');

const fileProcessingQueue = new Queue('fileQueue', {
  connection: redis,
});

module.exports = {fileProcessingQueue};
