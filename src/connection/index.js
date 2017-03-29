'use strict';

const assert = require('assert');
const { DB, OPEN_READWRITE, verbose } = require('promise-sqlite');
const SqliteConnection = require('./sqlite');
const winston = require('winston');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

// call sqlite verbose
verbose();

function sqliteFactory({ database = null, logger = winston, mode = OPEN_READWRITE }) {
  assert(typeof database === 'string', 'sqlitefactory database must be String');
  return fs.appendFileAsync(database, '', 'utf8')
    .then(() => DB.open(database, {
      mode,
      logger,
    }))
    .then(rawConnection => new SqliteConnection(rawConnection))
    .then(connection => connection.run('PRAGMA foreign_keys = ON;')
      .then(() => connection));
}

module.exports = {
  sqlite: sqliteFactory,
};
