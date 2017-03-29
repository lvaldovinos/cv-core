'use strict';

const Behavior = require('../behavior');

class ToolSqliteBehavior extends Behavior {
  create({ name, webpage }) {
    return this.connection.run('insert into tools(name, webpage) values($name, $webpage)', {
      $name: name,
      $webpage: webpage,
    })
    .then(({ lastID }) => lastID);
  }
  update({ id, name, webpage }) {
    return this.connection.run('update tools set name = $name, webpage = $webpage where id = $id', {
      $id: id,
      $name: name,
      $webpage: webpage,
    });
  }
  removeById(id) {
    return this.connection.run('delete from tools where id = ?', id);
  }
  getAll() {
    return this.connection.all('select * from tools');
  }
  getById(id) {
    return this.connection.get('select * from tools where id = ?', id)
      .then((data) => {
        if (typeof data === 'undefined') return {};
        return data;
      });
  }
  getByProjectId(projectId) {
    return this.connection.all(`select t.* from tools t, project_tool_links pt
      where t.id = pt.tool_id and pt.project_id = ?`, projectId);
  }
}

module.exports = ToolSqliteBehavior;
