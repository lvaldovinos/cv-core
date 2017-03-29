'use strict';

const Behavior = require('../behavior');

class RoleSqliteBehavior extends Behavior {
  create({ name, color }) {
    return this.connection.run('insert into roles(name, color) values($name, $color)', {
      $name: name,
      $color: color,
    })
    .then(({ lastID }) => lastID);
  }
  update({ id, name, color }) {
    return this.connection.run('update roles set name = $name, color = $color where id = $id', {
      $id: id,
      $name: name,
      $color: color,
    });
  }
  removeById(id) {
    return this.connection.run('delete from roles where id = ?', id);
  }
  getAll() {
    return this.connection.all('select * from roles');
  }
  getById(id) {
    return this.connection.get('select * from roles where id = ?', id)
      .then((data) => {
        if (typeof data === 'undefined') return {};
        return data;
      });
  }
  getByProjectId(projectId) {
    return this.connection.all(`select r.* from roles r, project_role_links pr
      where r.id = pr.role_id and pr.project_id = ?`, projectId);
  }
}

module.exports = RoleSqliteBehavior;
