'use strict';

const should = require('should');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const winston = require('winston');
const { connectionFactory, schemaBuilder } = require('../index');

describe('schema test suite', () => {
  describe('sqlite schema', () => {
    let connection = null;
    before((done) => {
      connectionFactory
      .sqlite({
        database: 'data.db',
        logger: winston,
      })
      .then((conn) => {
        connection = conn;
        return schemaBuilder.sqlite(conn);
      })
      .then(() => done(null))
      .catch(done);
    });
    it('creates db schema', (done) => {
      connection.all('SELECT name FROM sqlite_master WHERE type=\'table\'')
        .then((tables) => {
          const tableNames = tables.map(table => table.name);
          should(tableNames).containDeep([
            'locations',
            'companies',
            'roles',
            'tools',
            'project_role_links',
            'project_tool_links',
          ]);
          return done(null);
        })
        .catch(done);
    });
    after((done) => {
      connection.close()
        .then(() => fs.unlinkAsync('data.db'))
        .then(() => done(null))
        .catch(done);
    });
  });
});
