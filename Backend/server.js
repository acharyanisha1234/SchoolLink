require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');

const User = require('./src/models/User');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/schoollink';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    createAdminIfNotExists();
  })
  .catch(err => console.error('DB connection error:', err.message));

const createAdminIfNotExists = async () => {
  try {
    console.log('Checking for admin user...');
    const existing = await User.findOne({ email: 'admin@school.com' });
    if (!existing) {
      console.log('Admin not found. Creating new admin...');
      await User.create({
        fullName: 'Admin User',
        email: 'admin@school.com',
        password: 'admin123',
        role: 'ADMIN',
        birthday: '2000-01-01',
        gender: 'Other'
      });
      console.log('Admin user created successfully!');
      console.log('  Email: admin@school.com');
      console.log('  Password: admin123');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (err) {
    console.error('Error creating admin:', err.message);
    console.error('Full error:', err);
  }
};

// Auth routes
try {
  const authRoutes = require('./src/routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('Auth routes loaded');
} catch (err) {
  console.warn('Auth routes not found:', err.message);
}

// Student routes
try {
  const studentRoutes = require('./src/routes/studentRoutes');
  app.use('/api/students', studentRoutes);
  console.log('Student routes loaded');
} catch (err) {
  console.warn('Student routes not found:', err.message);
}

// Teacher routes
try {
  const teacherRoutes = require('./src/routes/teacherRoutes');
  app.use('/api/teacher', teacherRoutes);
  console.log('Teacher routes loaded');
} catch (err) {
  console.warn('Teacher routes not found:', err.message);
}

// Admin Teacher routes
try {
  const adminTeacherRoutes = require('./src/routes/adminTeacherRoutes');
  app.use('/api/admin/teachers', adminTeacherRoutes);
  console.log('Admin Teacher routes loaded');
} catch (err) {
  console.warn('Admin Teacher routes not found:', err.message);
}

// ADMIN SUBJECT ROUTES 
try {
  const adminSubjectRoutes = require('./src/routes/adminSubjectRoutes');
  app.use('/api/admin/subjects', adminSubjectRoutes);
  console.log('Admin Subject routes loaded');
} catch (err) {
  console.warn('Admin Subject routes not found:', err.message);
}

// Announcement routes
try {
  const adminAnnouncementRoutes = require('./src/routes/adminAnnouncementRoutes');
  app.use('/api/announcements', adminAnnouncementRoutes);
  console.log('Announcement routes loaded');
} catch (err) {
  console.warn('Announcement routes not found:', err.message);
}

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('SchoolLink Backend is running...');
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

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
  console.log(`Admin Subject API: http://localhost:${PORT}/api/admin/subjects`);

});