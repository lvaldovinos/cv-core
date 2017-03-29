'use strict';

const SqliteConnection = require('../../connection/sqlite');
const LocationSqliteBehavior = require('./sqlite');

function locationBehaviorFactory(connection) {
  let behavior = null;
  if (connection instanceof SqliteConnection) {
    behavior = new LocationSqliteBehavior();
  }
  return behavior;
}

module.exports = locationBehaviorFactory;
