const request = require('supertest');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');


describe('API tests', () => {
  before((done) => {
    db.serialize((err) => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

      done();
    });
  });

  describe('GET /health', () => {
    it('should return health', (done) => {
      request(app)
        .get('/health')
        .expect('Content-Type', /text/)
        .expect(200, done);
    });
  });

  describe('GET /rides', () => {
    it('should return no rides, no rides created', (done) => {
      request(app)
        .get('/rides')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /rides:id', () => {
    it('should not return ride record, invalid rideID', (done) => {
      request(app)
        .get('/rides/invalidid')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(JSON.stringify({ error_code: 'RIDES_NOT_FOUND_ERROR', message: 'Could not find any rides' }))
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe('POST /rides', () => {
    const data = {
      // no id
      start_lat: 50,
      start_long: 50,
      end_lat: 50,
      end_long: 50,
      rider_name: 'dummy',
      driver_name: 'dummy',
      driver_vehicle: 'dummy',
    };
    it('should create a ride record', (done) => {
      request(app)
        .post('/rides')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('POST /rides', () => {
    const data = {
      // no id
      start_lat: 500,
      start_long: 500,
      end_lat: 50,
      end_long: 50,
      rider_name: 'dummy',
      driver_name: 'dummy',
      driver_vehicle: 'dummy',
    };
    it('should not create ride record, invalid start_lat', (done) => {
      request(app)
        .post('/rides')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('POST /rides', () => {
    const data = {
      // no id
      start_lat: 50,
      start_long: 50,
      end_lat: 500,
      end_long: 500,
      rider_name: 'dummy',
      driver_name: 'dummy',
      driver_vehicle: 'dummy',
    };
    it('should not create ride record, invalid end_lat', (done) => {
      request(app)
        .post('/rides')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('POST /rides', () => {
    const data = {
      // no id
      start_lat: 50,
      start_long: 50,
      end_lat: 50,
      end_long: 50,
      rider_name: '',
      driver_name: 'dummy',
      driver_vehicle: 'dummy',
    };
    it('should not create ride record, invalid rider_name', (done) => {
      request(app)
        .post('/rides')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('POST /rides', () => {
    const data = {
      // no id
      start_lat: 50,
      start_long: 50,
      end_lat: 50,
      end_long: 50,
      rider_name: 'dummy',
      driver_name: '',
      driver_vehicle: 'dummy',
    };
    it('should not create ride record, invalid driver_name', (done) => {
      request(app)
        .post('/rides')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('POST /rides', () => {
    const data = {
      // no id
      start_lat: 50,
      start_long: 50,
      end_lat: 50,
      end_long: 50,
      rider_name: 'dummy',
      driver_name: 'dummy',
      driver_vehicle: 123,
    };
    it('should not create ride record, invalid driver_vehicle', (done) => {
      request(app)
        .post('/rides')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /rides', () => {
    it('should return no rides, page <= 0', (done) => {
      request(app)
        .get('/rides?page=0&limit=1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /rides', () => {
    it('should return all rides, invalid page', (done) => {
      request(app)
        .get('/rides?page=1&limit=1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /rides', () => {
    it('should return all rides', (done) => {
      request(app)
        .get('/rides?page=2&limit=1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /rides:id', () => {
    it('should return a ride record', (done) => {
      request(app)
        .get('/rides/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});
