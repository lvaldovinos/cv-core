'use strict';

const assert = require('assert');
const Behavior = require('./behavior/behavior');

class Model {
  constructor(behavior) {
    assert(behavior instanceof Behavior, 'behavior parameter must be Behavior');
    Object.defineProperty(this, 'behavior', {
      enumerable: false,
      configurable: false,
      writable: true,
      value: behavior,
    });
  }
  update() {
    return this.behavior.update(this);
  }
  remove() {
    return this.behavior.removeById(this.id);
  }
}

module.exports = Model;
