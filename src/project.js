'use strict';

const Model = require('./model');
const Role = require('./role');
const Tool = require('./tool');
const assert = require('assert');

class Project extends Model {
  constructor({ id, name, startDate, endDate = null, highlight, clientId, vendorId, behavior }) {
    super(behavior);
    this.id = id;
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.highlight = highlight;
    this.clientId = clientId;
    this.vendorId = vendorId;
  }
  addRole(role) {
    assert(role instanceof Role, 'role parameter must be Role');
    return this.behavior.addRoleToProject({
      projectId: this.id,
      roleId: role.id,
    });
  }
  removeRole(role) {
    assert(role instanceof Role, 'role parameter must be Role');
    return this.behavior.removeRoleFromProject({
      projectId: this.id,
      roleId: role.id,
    });
  }
  addTool(tool) {
    assert(tool instanceof Tool, 'tool parameter must be Tool');
    return this.behavior.addToolToProject({
      projectId: this.id,
      toolId: tool.id,
    });
  }
  removeTool(tool) {
    assert(tool instanceof Tool, 'tool parameter must be Tool');
    return this.behavior.removeToolFromProject({
      projectId: this.id,
      toolId: tool.id,
    });
  }
  static create({ name, startDate, endDate = null, highlight, clientId, vendorId, behavior }) {
    return behavior.create({
      name,
      startDate,
      endDate,
      highlight,
      clientId,
      vendorId,
    })
      .then(id => new Project({
        id,
        name,
        startDate,
        endDate,
        highlight,
        clientId,
        vendorId,
        behavior,
      }));
  }
}

class ProjectReader extends Model {
  getAll() {
    return this.behavior.getAll();
  }
  getById(searchingId) {
    return this.behavior.getById(searchingId)
      .then(({
        id = null,
        name = null,
        startDate = null,
        endDate = null,
        highlight = null,
        clientId = null,
        vendorId = null }) => {
        if (id === null
          && name === null
          && startDate === null
          && endDate === null
          && highlight === null
          && clientId === null
          && vendorId === null) return null;
        return new Project({
          id,
          name,
          startDate,
          endDate,
          highlight,
          clientId,
          vendorId,
          behavior: this.behavior,
        });
      });
  }
}

module.exports = Project;
exports = module.exports;

Project.Reader = ProjectReader;
