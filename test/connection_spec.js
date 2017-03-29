'use strict';

const should = require('should');
const sqlite = require('promise-sqlite');
const winston = require('winston');
const Connection = require('../src/connection/connection');
const SqliteConnection = require('../src/connection/sqlite');
const { connectionFactory } = require('../index');

sqlite.verbose();

describe('connection test suite', () => {
  let connection = null;
  describe('sqlite connection', () => {
    before((done) => {
      connectionFactory
        .sqlite({
          database: 'data.db',
          logger: winston,
        })
        .then((conn) => {
          connection = conn;
          return done(null);
        });
    });
    it('open new connection', () => {
      should(connection).be.an.instanceof(Connection);
      should(connection).be.an.instanceof(SqliteConnection);
      should(Object.getPrototypeOf(connection)).have.properties([
        'close',
        'run',
        'exec',
        'all',
        'allTransform',
        'get',
        'getTransform',
      ]);
    });
    it('validate foreign key constraint are enabled in connection', (done) => {
      connection.get('PRAGMA foreign_keys;')
        .then((row) => {
          should(row.foreign_keys).be.exactly(1);
          return done(null);
        })
        .catch(done);
    });
    after((done) => {
      connection.close()
        .then(() => done(null));
    });
  });
});
