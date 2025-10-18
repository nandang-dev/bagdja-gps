require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const basicAuth = require('express-basic-auth');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Swagger UI with Basic Authentication
const swaggerAuthMiddleware = basicAuth({
  users: {
    [process.env.SWAGGER_USERNAME]: process.env.SWAGGER_PASSWORD
  },
  challenge: true,
  realm: 'Bagdja GPS API Documentation'
});

app.use('/api-docs', swaggerAuthMiddleware, swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Bagdja GPS API Docs',
  customfavIcon: '/favicon.ico'
}));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the API proxy is running properly
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   example: 12345.67
 *                 environment:
 *                   type: string
 *                   example: development
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * @swagger
 * /api/gps:
 *   post:
 *     summary: Send GPS data from device
 *     description: |
 *       Endpoint for GPS tracking devices to send location data. 
 *       Acts as a proxy to Supabase Edge Function.
 *       
 *       **Authentication:**
 *       - AVL: 16-digit device identifier (header)
 *       - API Key: 10-digit device authentication key (header)
 *       
 *       **Rate Limits:**
 *       - Maximum 1 request per second per device
 *       - Data older than 24 hours will be rejected
 *     tags: [GPS]
 *     security:
 *       - DeviceAuth: []
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GpsData'
 *           examples:
 *             example1:
 *               summary: Sample GPS data from Garut
 *               value:
 *                 lat: -7.039333
 *                 lng: 107.975278
 *                 date_time: 1697644800000
 *             example2:
 *               summary: Sample GPS data from Bandung
 *               value:
 *                 lat: -6.9175
 *                 lng: 107.6191
 *                 date_time: 1697648400000
 *     parameters:
 *       - in: header
 *         name: avl
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[A-Z0-9]{16}$'
 *           example: '3ZQONE9QTBKZ00UK'
 *         description: Device AVL authentication key
 *       - in: header
 *         name: api-key
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[A-Z0-9]{10}$'
 *           example: 'HNBZM1ETEK'
 *         description: Device API key
 *     responses:
 *       200:
 *         description: GPS data received and stored successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad request - Invalid data format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidData:
 *                 value:
 *                   error: 'Invalid GPS data format'
 *                   details: 'Latitude must be between -90 and 90'
 *       401:
 *         description: Unauthorized - Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidAuth:
 *                 value:
 *                   error: 'Invalid authentication credentials'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               serverError:
 *                 value:
 *                   error: 'Internal server error'
 *                   details: 'Failed to connect to database'
 */
app.post('/api/gps', async (req, res) => {
  try {
    const { lat, lng, date_time } = req.body;
    const avl = req.headers['avl'];
    const apiKey = req.headers['api-key'];

    // Validate required headers
    if (!avl || !apiKey) {
      return res.status(401).json({
        error: 'Missing authentication headers',
        details: 'Both AVL and API-Key headers are required'
      });
    }

    // Validate GPS data
    if (!lat || !lng || !date_time) {
      return res.status(400).json({
        error: 'Invalid GPS data format',
        details: 'lat, lng, and date_time are required fields'
      });
    }

    // Validate coordinate ranges
    if (lat < -90 || lat > 90) {
      return res.status(400).json({
        error: 'Invalid latitude',
        details: 'Latitude must be between -90 and 90'
      });
    }

    if (lng < -180 || lng > 180) {
      return res.status(400).json({
        error: 'Invalid longitude',
        details: 'Longitude must be between -180 and 180'
      });
    }

    // Forward request to GPS Receiver Edge Function
    const gpsReceiverUrl = process.env.GPS_RECEIVER_URL;
    
    console.log(`[PROXY] Forwarding GPS data to GPS Receiver - AVL: ${avl}`);
    
    const response = await axios.post(
      gpsReceiverUrl,
      { lat, lng, date_time },
      {
        headers: {
          'avl': avl,
          'api-key': apiKey,
          'Content-Type': 'application/json'
        },
        timeout: parseInt(process.env.API_TIMEOUT) || 30000
      }
    );

    console.log(`[PROXY] Success - Device: ${avl}, Lat: ${lat}, Lng: ${lng}`);

    // Return Supabase response
    res.status(response.status).json(response.data);

  } catch (error) {
    console.error('[PROXY] Error:', error.message);

    if (error.response) {
      // Error from Supabase Edge Function
      return res.status(error.response.status).json(error.response.data);
    }

    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        error: 'Request timeout',
        details: 'The request took too long to process'
      });
    }

    // Generic error
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: API root endpoint
 *     description: Get basic information about the API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 version:
 *                   type: string
 *                 description:
 *                   type: string
 *                 documentation:
 *                   type: string
 */
app.get('/', (req, res) => {
  res.json({
    name: 'Bagdja GPS Tracker API Proxy',
    version: '1.0.0',
    description: 'HTTP Proxy for GPS devices to Supabase Edge Functions',
    documentation: '/api-docs',
    endpoints: {
      health: '/health',
      gps: '/api/gps'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 Bagdja GPS Tracker API Proxy');
  console.log('='.repeat(60));
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`   Username: ${process.env.SWAGGER_USERNAME}`);
  console.log(`   Password: ${process.env.SWAGGER_PASSWORD}`);
  console.log(`🔗 GPS Receiver: ${process.env.GPS_RECEIVER_URL}`);
  console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(60));
});

module.exports = app;

