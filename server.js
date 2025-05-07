const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const config = require('../config/config');

const app = express();

// For Vercel, we don't need to specify a port
// Vercel will handle the port automatically
const uploadDir = path.join(__dirname, config.upload.storagePath);
const buildDir = path.join(__dirname, 'dist');

// Serve static files from build directory
app.use(express.static(buildDir));

// Fallback to index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(buildDir, 'index.html'));
});

// Create uploads directory if it doesn't exist
fs.mkdir(uploadDir, { recursive: true })
  .catch(err => console.error('Error creating uploads directory:', err));

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: parseInt(config.upload.maxFileSize)
  },
  fileFilter: (req, file, cb) => {
    if (config.upload.allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  }
});

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/generate-poem', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // For now, we'll just return a mock response
    const mockPoem = `In the frame where ${req.file.originalname} lies,
A story unfolds before our eyes.
Pixels dance in digital grace,
Capturing moments in a single space.`;

    res.json({
      poem: mockPoem,
      metadata: {
        model: 'mock-model',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const healthCheck = require('./src/utils/healthCheck');

// Add health check endpoints
healthCheck(app);

// In Vercel, we don't need to listen manually
// Vercel will handle the server startup
module.exports = app;
