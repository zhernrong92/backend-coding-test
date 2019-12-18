const port = 8010;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const buildSchemas = require('./src/schemas');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Xendit API',
      description: 'The goal of this project is to assess your proficiency in software engineering that is related to the daily work that we do at Xendit.',
      version: '1.0.0',
      servers: [
        {
          url: `http://localhost:${port}`,
          description: 'Development server',
        },
      ],
    },
  },
  apis: ['./src/app.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const logger = require('./logger');
global.gLogger = logger;

const app = require('./src/app')(db);

db.serialize(() => {
  buildSchemas(db);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  app.listen(port, () => gLogger.info(`App started and listening on port ${port}`));
});
