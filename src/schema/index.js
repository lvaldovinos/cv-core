'use strict';

const assert = require('assert');
const SqliteConnection = require('../connection/sqlite');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

function sqliteSchemaBuilder(connection) {
  assert(connection instanceof SqliteConnection, 'connection must be SqliteConnection');
  return fs.readFileAsync(path.resolve(__dirname, 'sqlite.sql'), 'utf8')
    .then(sqliteSchemaQuery => connection.exec(sqliteSchemaQuery));
}

module.exports = {
  sqlite: sqliteSchemaBuilder,
};
