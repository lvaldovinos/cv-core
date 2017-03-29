'use strict';

const SqliteConnection = require('../../connection/sqlite');
const RoleSqliteBehavior = require('./sqlite');

function roleBehaviorFactory(connection) {
  let behavior = null;
  if (connection instanceof SqliteConnection) {
    behavior = new RoleSqliteBehavior();
  }
  return behavior;
}

module.exports = roleBehaviorFactory;
