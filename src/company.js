'use strict';

const Model = require('./model');

class Company extends Model {
  constructor({ id, name, webpage, imageUrl, locationId, behavior }) {
    super(behavior);
    this.id = id;
    this.name = name;
    this.webpage = webpage;
    this.imageUrl = imageUrl;
    this.locationId = locationId;
  }
  static create({ name, webpage, imageUrl, locationId, behavior }) {
    return behavior.create({
      name,
      webpage,
      imageUrl,
      locationId,
    })
      .then(id => new Company({
        id,
        name,
        webpage,
        imageUrl,
        locationId,
        behavior,
      }));
  }
}

class CompanyReader extends Model {
  getAll() {
    return this.behavior.getAll();
  }
  getById(searchingId) {
    return this.behavior.getById(searchingId)
      .then(({ id = null, name = null, webpage = null, imageUrl = null, locationId = null }) => {
        if (id === null
          && name === null
          && webpage === null
          && imageUrl === null
          && locationId === null) return null;
        return new Company({
          name,
          id,
          webpage,
          imageUrl,
          locationId,
          behavior: this.behavior,
        });
      });
  }
}

module.exports = Company;
exports = module.exports;

Company.Reader = CompanyReader;
