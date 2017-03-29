'use strict';

const SqliteConnection = require('../../connection/sqlite');
const ProjectSqliteBehavior = require('./sqlite');

function projectBehaviorFactory(connection) {
  let behavior = null;
  if (connection instanceof SqliteConnection) {
    behavior = new ProjectSqliteBehavior();
  }
  return behavior;
}

module.exports = projectBehaviorFactory;
