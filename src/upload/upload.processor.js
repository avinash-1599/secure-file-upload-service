const { AppDataSource } = require('../config/database');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

module.exports = async function fileProcessor(job) {
  const fileRepo = AppDataSource.getRepository('File');
  const fileRecord = await fileRepo.findOneBy({ id: job.data.fileId });

  if (!fileRecord) throw new Error('File not found');

  // Update status to processing
  fileRecord.status = 'processing';
  await fileRepo.save(fileRecord);

  try {
    const filePath = path.resolve(fileRecord.storage_path);
    const buffer = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    fileRecord.status = 'processed';
    fileRecord.extracted_data = `SHA256 Hash: ${hash}`;
  } catch (err) {
    fileRecord.status = 'failed';
    fileRecord.extracted_data = `Error: ${err.message}`;
  }

  await fileRepo.save(fileRecord);
};
