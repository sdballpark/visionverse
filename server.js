const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3001;
const uploadDir = path.join(__dirname, 'uploads');
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
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

app.use(cors({
  origin: 'http://localhost:5173',
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
