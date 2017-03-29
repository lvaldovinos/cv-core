'use strict';

const assert = require('assert');
const Connection = require('../connection/connection');

class Behavior {
  constructor(connection = null) {
    Object.defineProperty(this, 'connection', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: connection,
    });
  }
  setConnection(connection = null) {
    assert(connection instanceof Connection, 'connection parameter must be Connection');
    this.connection = connection;
    return this;
  }
  closeConnection() {
    return this.connection.close()
      .then(() => {
        this.connection = null;
        return this;
      });
  }
}

module.exports = Behavior;
