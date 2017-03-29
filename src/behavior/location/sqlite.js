'use strict';

const Behavior = require('../behavior');

class LocationSqliteBehavior extends Behavior {
  create({ city, country }) {
    return this.connection.run('insert into locations(city, country) values($city, $country)', {
      $city: city,
      $country: country,
    })
    .then(({ lastID }) => lastID);
  }
  update({ id, city, country }) {
    return this.connection.run('update locations set city = $city, country = $country where id = $id', {
      $id: id,
      $city: city,
      $country: country,
    });
  }
  removeById(id) {
    return this.connection.run('delete from locations where id = ?', id);
  }
  getAll() {
    return this.connection.all('select * from locations');
  }
  getById(id) {
    return this.connection.get('select * from locations where id = ?', id)
      .then((data) => {
        if (typeof data === 'undefined') return {};
        return data;
      });
  }
}

module.exports = LocationSqliteBehavior;
