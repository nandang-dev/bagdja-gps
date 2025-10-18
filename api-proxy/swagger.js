const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bagdja GPS Tracker API Proxy',
      version: '1.0.0',
      description: 'HTTP Proxy API for GPS devices to communicate with Supabase Edge Functions. This API acts as a bridge for devices that require HTTP-only connections.',
      contact: {
        name: 'Bagdja GPS Support',
        email: 'support@bagdja-gps.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'http://your-production-domain.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        DeviceAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'avl',
          description: 'Device AVL authentication key (16-digit alphanumeric)'
        },
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'api-key',
          description: 'Device API key (10-digit alphanumeric)'
        }
      },
      schemas: {
        GpsData: {
          type: 'object',
          required: ['lat', 'lng', 'date_time'],
          properties: {
            lat: {
              type: 'number',
              format: 'double',
              minimum: -90,
              maximum: 90,
              description: 'Latitude coordinate',
              example: -7.039333
            },
            lng: {
              type: 'number',
              format: 'double',
              minimum: -180,
              maximum: 180,
              description: 'Longitude coordinate',
              example: 107.975278
            },
            date_time: {
              type: 'integer',
              format: 'int64',
              description: 'Unix timestamp in milliseconds',
              example: 1697644800000
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'GPS data received successfully'
            },
            data: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                  example: '81fa2354-f68c-4e63-8abb-caba165a512b'
                },
                device_id: {
                  type: 'string',
                  format: 'uuid',
                  example: '1af661ff-0544-4d1f-83f5-e861f4fcec54'
                },
                lat: {
                  type: 'number',
                  example: -7.039333
                },
                lng: {
                  type: 'number',
                  example: 107.975278
                },
                date_time: {
                  type: 'integer',
                  example: 1697644800000
                },
                created_at: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-10-18T17:08:28.51833+00:00'
                }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Invalid authentication credentials'
            },
            details: {
              type: 'string',
              example: 'Additional error information'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'GPS',
        description: 'GPS data tracking endpoints'
      },
      {
        name: 'Health',
        description: 'Service health check endpoints'
      }
    ]
  },
  apis: ['./server.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;

