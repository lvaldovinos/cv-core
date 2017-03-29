'use strict';

const { connectionFactory, schemaBuilder, Location, behaviorFactory } = require('../index');
const Promise = require('bluebird');
const winston = require('winston');
const fs = Promise.promisifyAll(require('fs'));
const should = require('should');

describe('location test suite', () => {
  describe('sqlite behavior', () => {
    let behavior = null;
    let location = null;
    let locationReader = null;
    before((done) => {
      connectionFactory.sqlite({
        database: 'data.db',
        logger: winston,
      })
      .then(conn => schemaBuilder.sqlite(conn)
        .then(() => conn))
      .then((connection) => {
        behavior = behaviorFactory.create({
          connection,
          type: behaviorFactory.types.LOCATION,
        });
        return connection;
      })
      .then(conn => conn.close())
      .then(() => done(null))
      .catch(done);
    });
    beforeEach((done) => {
      connectionFactory.sqlite({
        database: 'data.db',
        logger: winston,
      })
      .then((conn) => {
        should(behavior.connection).be.exactly(null);
        behavior.setConnection(conn);
        locationReader = new Location.Reader(behavior);
        return Location.create({
          city: 'Guadalajara',
          country: 'Mex',
          behavior,
        });
      })
      .then((loc) => {
        location = loc;
        return done(null);
      })
      .catch(done);
    });
    it('create a new location object', () => {
      should(location).be.instanceof(Location);
      should(Object.getPrototypeOf(location)).have.properties([
        'update',
        'remove',
      ]);
      should(locationReader).be.instanceof(Location.Reader);
      should(Object.getPrototypeOf(locationReader)).have.properties([
        'getAll',
        'getById',
      ]);
    });
    it('read all locations', (done) => {
      locationReader.getAll()
        .then((locations) => {
          should(locations).be.an.Array();
          should(locations).have.length(1);
          should(locations[0]).have.properties([
            'city',
            'id',
            'country',
          ]);
          should(locations[0].city).be.exactly('Guadalajara');
          should(locations[0].country).be.exactly('Mex');
          return done(null);
        })
        .catch(done);
    });
    it('get location by id', (done) => {
      locationReader.getById(location.id)
        .then((newLocation) => {
          should(newLocation).be.eql(location);
          return done(null);
        })
        .catch(done);
    });
    it('get location by id return null', (done) => {
      locationReader.getById(0)
        .then((newLocation) => {
          should(newLocation).be.exactly(null);
          return done(null);
        })
        .catch(done);
    });
    it('update location', (done) => {
      location.city = 'new city';
      location.country = 'new country';
      location.update()
        .then(() => locationReader.getById(location.id))
        .then((updatedLocation) => {
          should(updatedLocation).be.eql(location);
          return done(null);
        })
        .catch(done);
    });
    afterEach((done) => {
      location.remove()
        .then(() => behavior.closeConnection())
        .then(() => {
          should(location.behavior.connection).be.exactly(null);
          should(locationReader.behavior.connection).be.exactly(null);
          location = null;
          locationReader = null;
          return done(null);
        })
        .catch(done);
    });
    after((done) => {
      behavior = null;
      fs.unlinkAsync('data.db')
        .then(() => done(null))
        .catch(done);
    });
  });
});
