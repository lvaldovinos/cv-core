'use strict';

const Behavior = require('../behavior');

class CompanySqliteBehavior extends Behavior {
  create({ name, webpage, imageUrl, locationId }) {
    return this.connection.run(`insert into companies(name, webpage, image_url, location_id)
      values($name, $webpage, $imageUrl, $locationId )`, {
        $name: name,
        $webpage: webpage,
        $imageUrl: imageUrl,
        $locationId: locationId,
      })
      .then(({ lastID }) => lastID);
  }
  update({ id, name, webpage, imageUrl, locationId }) {
    return this.connection.run(`update companies set
      name = $name,
      webpage = $webpage,
      image_url = $imageUrl,
      location_id = $locationId where id = $id`, {
        $id: id,
        $name: name,
        $webpage: webpage,
        $imageUrl: imageUrl,
        $locationId: locationId,
      });
  }
  removeById(id) {
    return this.connection.run('delete from companies where id = ?', id);
  }
  getAll() {
    return this.connection.allTransform('select * from companies', [], {
      image_url: 'imageUrl',
      location_id: 'locationId',
    });
  }
  getById(id) {
    return this.connection.getTransform('select * from companies where id = ?', id, {
      image_url: 'imageUrl',
      location_id: 'locationId',
    });
  }
}

module.exports = CompanySqliteBehavior;
