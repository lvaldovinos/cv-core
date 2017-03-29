'use strict';

const Model = require('./model');

class Tool extends Model {
  constructor({ id, name, webpage, behavior }) {
    super(behavior);
    this.id = id;
    this.name = name;
    this.webpage = webpage;
  }
  static create({ name, webpage, behavior }) {
    return behavior.create({
      name,
      webpage,
    })
      .then(id => new Tool({
        id,
        name,
        webpage,
        behavior,
      }));
  }
}

class ToolReader extends Model {
  getAll() {
    return this.behavior.getAll();
  }
  getById(searchingId) {
    return this.behavior.getById(searchingId)
      .then(({ id = null, name = null, webpage = null }) => {
        if (id === null && name === null && webpage === null) return null;
        return new Tool({
          name,
          id,
          webpage,
          behavior: this.behavior,
        });
      });
  }
  getByProjectId(projectId) {
    return this.behavior.getByProjectId(projectId);
  }
}

module.exports = Tool;
exports = module.exports;

Tool.Reader = ToolReader;
