require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/schoollink';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('DB error:', err.message));

// Auth routes (create a minimal one if not exist)
try {
  const authRoutes = require('./src/routes/auth');
  app.use('/api/auth', authRoutes);
  console.log(' Auth routes loaded');
} catch (err) {
  console.warn('Auth routes not found – skipping:', err.message);
}

// Test route
app.get('/', (req, res) => {
  res.send('SchoolLink Backend is running...');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});