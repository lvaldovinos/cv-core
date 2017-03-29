'use strict';

const SqliteConnection = require('../../connection/sqlite');
const ToolSqliteBehavior = require('./sqlite');

function toolBehaviorFactory(connection) {
  let behavior = null;
  if (connection instanceof SqliteConnection) {
    behavior = new ToolSqliteBehavior();
  }
  return behavior;
}

module.exports = toolBehaviorFactory;
