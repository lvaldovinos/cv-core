'use strict';

const Connection = require('./connection');
const assert = require('assert');
const Promise = require('bluebird');

function transformRow(row, transformMap) {
  if (typeof row === 'undefined') {
    return {};
  }
  const newRow = row;
  const keys = Object.keys(transformMap);
  const transformedProperties = keys.reduce((tempObj, key) => {
    const aux = tempObj;
    aux[transformMap[key]] = row[key];
    return tempObj;
  }, {});
  let index = 0;
  for (index; index < keys.length; index += 1) {
    delete newRow[keys[index]];
  }
  return Object.assign(newRow, transformedProperties);
}

class SqliteConnection extends Connection {
  close() {
    return Promise.resolve(this.rawConnection.close());
  }
  run(...args) {
    return Promise.resolve(this.rawConnection.run(...args));
  }
  exec(...args) {
    return Promise.resolve(this.rawConnection.exec(...args));
  }
  allTransform(query = '', params = [], transform = {}) {
    const rows = [];
    const keys = Object.keys(transform);
    assert(keys.length > 0, 'transform parameter must not be empty object, otherwise use SqliteConneciton#all');
    return Promise.resolve(this.rawConnection.each(query, params, (row) => {
      const newRow = transformRow(row, transform);
      rows.push(newRow);
    }))
    .then(() => rows);
  }
  all(...args) {
    return Promise.resolve(this.rawConnection.all(...args));
  }
  getTransform(query = '', params = [], transform = {}) {
    const keys = Object.keys(transform);
    assert(keys.length > 0, 'transform parameter must not be empty object, otherwise use SqliteConneciton#get');
    return Promise.resolve(this.rawConnection.get(query, params))
      .then(row => transformRow(row, transform));
  }
  get(...args) {
    return Promise.resolve(this.rawConnection.get(...args));
  }
}

module.exports = SqliteConnection;
