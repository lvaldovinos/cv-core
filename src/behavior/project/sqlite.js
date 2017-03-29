'use strict';

const Behavior = require('../behavior');

class ProjectSqliteBehavior extends Behavior {
  create({ name, startDate, endDate = null, highlight, clientId, vendorId }) {
    return this.connection.run(`insert into projects(name, start_date, end_date, highlight, client_id, vendor_id)
      values($name, $startDate, $endDate, $highlight, $clientId, $vendorId )`, {
        $name: name,
        $startDate: startDate,
        $endDate: endDate,
        $highlight: highlight,
        $clientId: clientId,
        $vendorId: vendorId,
      })
      .then(({ lastID }) => lastID);
  }
  update({ id, name, startDate, endDate = null, highlight, clientId, vendorId }) {
    return this.connection.run(`update projects set name = $name,
      start_date = $startDate,
      end_date = $endDate,
      highlight = $highlight,
      client_id = $clientId,
      vendor_id = $vendorId
    where id = $id`, {
      $id: id,
      $name: name,
      $startDate: startDate,
      $endDate: endDate,
      $highlight: highlight,
      $clientId: clientId,
      $vendorId: vendorId,
    });
  }
  addRoleToProject({ roleId, projectId }) {
    return this.connection.run(`insert into project_role_links(role_id, project_id)
      values ($roleId, $projectId)`, {
        $roleId: roleId,
        $projectId: projectId,
      });
  }
  removeRoleFromProject({ roleId, projectId }) {
    return this.connection.run(`delete from project_role_links
      where role_id = $roleId and project_id = $projectId`, {
        $roleId: roleId,
        $projectId: projectId,
      });
  }
  addToolToProject({ toolId, projectId }) {
    return this.connection.run(`insert into project_tool_links(tool_id, project_id)
      values ($toolId, $projectId)`, {
        $toolId: toolId,
        $projectId: projectId,
      });
  }
  removeToolFromProject({ toolId, projectId }) {
    return this.connection.run(`delete from project_tool_links
      where tool_id = $toolId and project_id = $projectId`, {
        $toolId: toolId,
        $projectId: projectId,
      });
  }
  removeById(id) {
    return this.connection.run('delete from projects where id = ?', id);
  }
  getAll() {
    return this.connection.allTransform('select * from projects', [], {
      start_date: 'startDate',
      end_date: 'endDate',
      client_id: 'clientId',
      vendor_id: 'vendorId',
    });
  }
  getById(id) {
    return this.connection.getTransform('select * from projects where id = ?', id, {
      start_date: 'startDate',
      end_date: 'endDate',
      client_id: 'clientId',
      vendor_id: 'vendorId',
    });
  }
}

module.exports = ProjectSqliteBehavior;
