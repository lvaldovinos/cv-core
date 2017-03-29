'use strict';

const SqliteConnection = require('../../connection/sqlite');
const CompanySqliteBehavior = require('./sqlite');

function companyBehaviorFactory(connection) {
  let behavior = null;
  if (connection instanceof SqliteConnection) {
    behavior = new CompanySqliteBehavior();
  }
  return behavior;
}

module.exports = companyBehaviorFactory;
