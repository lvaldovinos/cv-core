'use strict';

const Model = require('./model');

class Location extends Model {
  constructor({ id, city, country, behavior }) {
    super(behavior);
    this.id = id;
    this.city = city;
    this.country = country;
  }
  static create({ city, country, behavior }) {
    return behavior.create({
      city,
      country,
    })
      .then(id => new Location({
        id,
        city,
        country,
        behavior,
      }));
  }
}

class LocationReader extends Model {
  getAll() {
    return this.behavior.getAll();
  }
  getById(searchingId) {
    return this.behavior.getById(searchingId)
      .then(({ id = null, city = null, country = null }) => {
        if (id === null && city === null && country === null) return null;
        return new Location({
          city,
          id,
          country,
          behavior: this.behavior,
        });
      });
  }
}

module.exports = Location;
exports = module.exports;

Location.Reader = LocationReader;
