const config = {
  // Server configuration
  port: process.env.PORT || 8080,
  environment: process.env.NODE_ENV || 'development',
  
  // File upload configuration
  upload: {
    maxFileSize: process.env.MAX_FILE_SIZE || '10mb',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    storagePath: process.env.STORAGE_PATH || 'uploads'
  },
  
  // API configuration
  api: {
    baseUrl: process.env.API_BASE_URL || 'https://visionverse-onegtcyvu-robert-bogans-projects.vercel.app',
    timeout: process.env.API_TIMEOUT || 30000,
    retries: process.env.API_RETRIES || 3
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
    output: process.env.LOG_OUTPUT || 'console'
  },
  
  // Health check configuration
  health: {
    interval: process.env.HEALTH_CHECK_INTERVAL || 60000,
    timeout: process.env.HEALTH_CHECK_TIMEOUT || 5000
  }
};

module.exports = config;
