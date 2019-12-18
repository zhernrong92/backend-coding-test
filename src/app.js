const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

module.exports = (db) => {
  /**
    * @swagger
    * /health:
    *  get:
    *   tags:
    *   -   Diagnostic
    *   description: Check if server is running
    *   responses:
    *     '200':
    *       description: Expect "Healthy" text
    */
  app.get('/health', (req, res) => res.send('Healthy'));


  /**
    * @swagger
    * /rides:
    *  post:
    *   tags:
    *   -   Rides
    *   description: Create a ride record and return it
    *   parameters:
    *   -   in: body
    *       name: body
    *       description: the ride to create
    *       schema:
    *           type: object
    *           properties:
    *               start_lat:
    *                   type: integer
    *               start_long:
    *                   type: integer
    *               end_lat:
    *                   type: integer
    *               end_long:
    *                   type: integer
    *               rider_name:
    *                   type: string
    *               driver_name:
    *                   type: string
    *               driver_vehicle:
    *                   type: string
    *   responses:
    *     '200':
    *       description: Created ride object
    *       schema:
    *           type: object
    *           properties:
    *               rideID:
    *                   type: integer
    *               startLat:
    *                   type: integer
    *               startLong:
    *                   type: integer
    *               endLat:
    *                   type: integer
    *               endLong:
    *                   type: integer
    *               riderName:
    *                   type: string
    *               driverName:
    *                   type: string
    *               driverVehicle:
    *                   type: string
    *               created:
    *                   type: string
    *
    */
  app.post('/rides', jsonParser, (req, res) => {
    const startLatitude = Number(req.body.start_lat);
    const startLongitude = Number(req.body.start_long);
    const endLatitude = Number(req.body.end_lat);
    const endLongitude = Number(req.body.end_long);
    const riderName = req.body.rider_name;
    const driverName = req.body.driver_name;
    const driverVehicle = req.body.driver_vehicle;

    if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180
      || startLongitude > 180) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
      });
    }

    if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
      });
    }

    if (typeof riderName !== 'string' || riderName.length < 1) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    if (typeof driverName !== 'string' || driverName.length < 1) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    const values = [
      req.body.start_lat,
      req.body.start_long,
      req.body.end_lat,
      req.body.end_long,
      req.body.rider_name,
      req.body.driver_name,
      req.body.driver_vehicle,
    ];

    db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
      if (err) {
        return res.send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function (err2, rows) {
        if (err2) {
          return res.send({
            error_code: 'SERVER_ERROR',
            message: 'Unknown error',
          });
        }

        res.send(rows);
      });
    });
  });

  /**
    * @swagger
    * /rides:
    *  get:
    *   tags:
    *   -   Rides
    *   description: Get all ride records
    *   responses:
    *     '200':
    *       description: An array of ride records
    *       schema:
    *           type: array
    *           items:
    *               type: object
    *               properties:
    *                   rideID:
    *                       type: integer
    *                   startLat:
    *                       type: integer
    *                   startLong:
    *                       type: integer
    *                   endLat:
    *                       type: integer
    *                   endLong:
    *                       type: integer
    *                   riderName:
    *                       type: string
    *                   driverName:
    *                       type: string
    *                   driverVehicle:
    *                       type: string
    *                   created:
    *                       type: string
    *
    */
  app.get('/rides', (req, res) => {
    db.all('SELECT * FROM Rides', function (err, rows) {
      if (err) {
        return res.send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      if (rows.length === 0) {
        return res.send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        });
      }

      res.send(rows);
    });
  });

  /**
    * @swagger
    * /rides/{id}:
    *  get:
    *   tags:
    *   -   Rides
    *   description: To query a specific ride
    *   parameters:
    *   -   in: path
    *       name: rideid
    *       description: ID of the ride
    *       required: true
    *       type: integer
    *   responses:
    *     '200':
    *       description: The Ride object which matches the rideid
    *       schema:
    *           type: object
    *           properties:
    *               rideID:
    *                   type: integer
    *               startLat:
    *                   type: integer
    *               startLong:
    *                   type: integer
    *               endLat:
    *                   type: integer
    *               endLong:
    *                   type: integer
    *               riderName:
    *                   type: string
    *               driverName:
    *                   type: string
    *               driverVehicle:
    *                   type: string
    *               created:
    *                   type: string
    *
    */
  app.get('/rides/:id', (req, res) => {
    db.all(`SELECT * FROM Rides WHERE rideID='${req.params.id}'`, function (err, rows) {
      if (err) {
        return res.send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      if (rows.length === 0) {
        return res.send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        });
      }

      res.send(rows);
    });
  });

  return app;
};
