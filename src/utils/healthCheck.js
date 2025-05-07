const healthCheck = (app) => {
  // Basic health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  });

  // Detailed health check
  app.get('/health/detailed', (req, res) => {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      dependencies: {
        node: process.version,
        npm: process.env.npm_version
      },
      memory: {
        total: process.memoryUsage().heapTotal,
        used: process.memoryUsage().heapUsed
      }
    };

    // Add custom health checks here
    // For example, database connection check
    // or external service availability check

    res.json(health);
  });
};

module.exports = healthCheck;
