'use strict';

const assert = require('assert');

class Connection {
  constructor(rawConnection = null) {
    assert(rawConnection !== null, 'Connection rawConnection must be different than null');
    Object.defineProperty(this, 'rawConnection', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: rawConnection,
    });
  }
}

module.exports = Connection;
