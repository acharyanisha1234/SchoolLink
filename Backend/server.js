require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration to allow multiple origins
const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:5173', 
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (for materials)
app.use('/uploads', express.static('uploads'));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/schoollink';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('DB error:', err.message));

// Auth routes
try {
  const authRoutes = require('./src/routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('Auth routes loaded');
} catch (err) {
  console.warn('Auth routes not found – skipping:', err.message);
}

// Student routes
try {
  const studentRoutes = require('./src/routes/studentRoutes');
  app.use('/api/students', studentRoutes);
  console.log('Student routes loaded');
} catch (err) {
  console.warn('Student routes not found – skipping:', err.message);
}

// Teacher routes (for teacher role)
try {
  const teacherRoutes = require('./src/routes/teacherRoutes');
  app.use('/api/teacher', teacherRoutes);
  console.log('Teacher routes loaded');
} catch (err) {
  console.warn('Teacher routes not found – skipping:', err.message);
}

// Admin Teacher routes (for admin role)
try {
  const adminTeacherRoutes = require('./src/routes/adminTeacherRoutes');
  app.use('/api/admin/teachers', adminTeacherRoutes);
  console.log('Admin Teacher routes loaded');
} catch (err) {
  console.warn('Admin Teacher routes not found – skipping:', err.message);
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Test route
app.get('/', (req, res) => {
  res.send('SchoolLink Backend is running...');
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!'
  });
});

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Students API: http://localhost:${PORT}/api/students`);
  console.log(`Teacher API: http://localhost:${PORT}/api/teacher`);
  console.log(`Admin Teacher API: http://localhost:${PORT}/api/admin/teachers`);
});