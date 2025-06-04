const express = require('express');
const multer = require('multer');
const { getRepository } = require('typeorm');
const { File } = require('../entities/File');
const { User } = require('../entities/User');
const { fileProcessingQueue } = require('../jobs/queue');
const { AppDataSource } = require('../config/database');
const authMiddleware = require('../auth/auth.middleware');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const upload = multer({
  dest: process.env.UPLOAD_DIR,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  const fileRepo = AppDataSource.getRepository(File);
  const userRepo = AppDataSource.getRepository(User);
  const { title, description } = req.body;
  const file = req.file;

  const titleFromFile = path.parse(file.originalname).name;
  const defaultDescription = 'Uploaded file on ' + new Date().toLocaleString();

  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const user = await userRepo.findOneBy({ id: req.user.userId });
  console.log('Uploading file for user:', user);

  if (!user) return res.status(401).json({ error: 'User not found' });

  const fileRecord = await fileRepo.save({
    user: user,
    original_filename: file.originalname,
    storage_path: file.path,
    title: title || titleFromFile,
    description: description || defaultDescription,
    status: 'uploaded',
  });

  await fileProcessingQueue.add('process-file', {
    fileId: fileRecord.id,
    path: file.path,
  });

  res.json({ fileId: fileRecord.id, status: 'uploaded' });
});

router.get('/:id', authMiddleware, async (req, res) => {
    const fileRepo = AppDataSource.getRepository(File);
    const file = await fileRepo.findOne({
      where: { id: req.params.id },
      relations: ['user'],
    });

    console.log('Fetched file:', file);
    console.log('Current user ID:', req.user.userId);
  
    if (!file || file.user.id !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  
    res.json({
      metadata: {
        title: file.title,
        description: file.description,
        original_filename: file.original_filename,
      },
      status: file.status,
      extracted_data: file.extracted_data,
    });
  });
  

module.exports = router;
