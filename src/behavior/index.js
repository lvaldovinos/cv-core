'use strict';

const types = require('./types');
const assert = require('assert');
const locationBehaviorFactory = require('./location');
const roleBehaviorFactory = require('./role');
const toolBehaviorFactory = require('./tool');
const companyBehaviorFactory = require('./company');
const projectBehaviorFactory = require('./project');

function factory({ connection, type }) {
  assert(typeof type === 'string', 'type option must be a String');
  let behavior = null;
  switch (type) {
    case types.LOCATION:
      behavior = locationBehaviorFactory(connection);
      break;
    case types.ROLE:
      behavior = roleBehaviorFactory(connection);
      break;
    case types.TOOL:
      behavior = toolBehaviorFactory(connection);
      break;
    case types.COMPANY:
      behavior = companyBehaviorFactory(connection);
      break;
    case types.PROJECT:
      behavior = projectBehaviorFactory(connection);
      break;
    default:
      behavior = null;
  }
  return behavior;
}

module.exports = {
  types,
  create: factory,
};
