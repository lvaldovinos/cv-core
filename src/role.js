'use strict';

const Model = require('./model');

class Role extends Model {
  constructor({ id, name, color, behavior }) {
    super(behavior);
    this.id = id;
    this.name = name;
    this.color = color;
  }
  static create({ name, color, behavior }) {
    return behavior.create({
      name,
      color,
    })
      .then(id => new Role({
        id,
        name,
        color,
        behavior,
      }));
  }
}

class RoleReader extends Model {
  getAll() {
    return this.behavior.getAll();
  }
  getById(searchingId) {
    return this.behavior.getById(searchingId)
      .then(({ id = null, name = null, color = null }) => {
        if (id === null && name === null && color === null) return null;
        return new Role({
          name,
          id,
          color,
          behavior: this.behavior,
        });
      });
  }
  getByProjectId(projectId) {
    return this.behavior.getByProjectId(projectId);
  }
}

module.exports = Role;
exports = module.exports;

Role.Reader = RoleReader;
