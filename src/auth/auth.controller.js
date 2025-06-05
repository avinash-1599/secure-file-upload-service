const express = require('express');
const jwt = require('jsonwebtoken');
const { AppDataSource } = require('../config/database');
const {User} = require('../entities/User');
const bcrypt = require('bcrypt');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userRepo = AppDataSource.getRepository(User);

  try {
    const user = await userRepo.findOneBy({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
