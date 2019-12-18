'use strict';

const express = require('express');
const app = express();
const port = 8010;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const buildSchemas = require('./src/schemas');

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Xendit API",
            description: "The goal of this project is to assess your proficiency in software engineering that is related to the daily work that we do at Xendit.",
            version: "1.0.0",
            servers: [
                {
                    url: `http://localhost:${port}`,
                    description: "Development server"
                },
            ]
        }
    },
    apis: ["./src/app.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);


const logger = require('./logger');
global.gLogger = logger;

db.serialize(() => {
    buildSchemas(db);

    const app = require('./src/app')(db);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    app.listen(port, () => gLogger.info(`App started and listening on port ${port}`));
});