'use strict';

const { connectionFactory, schemaBuilder, Location, Company, behaviorFactory } = require('../index');
const Promise = require('bluebird');
const winston = require('winston');
const fs = Promise.promisifyAll(require('fs'));
const should = require('should');

describe('company test suite', () => {
  describe('sqlite behavior', () => {
    let behavior = null;
    let company = null;
    let location = null;
    let locationReader = null;
    let companyReader = null;
    before((done) => {
      connectionFactory.sqlite({
        database: 'data.db',
        logger: winston,
      })
      .then(conn => schemaBuilder.sqlite(conn)
        .then(() => conn))
      .then((connection) => {
        const locationBehavior = behaviorFactory.create({
          connection,
          type: behaviorFactory.types.LOCATION,
        });
        behavior = behaviorFactory.create({
          connection,
          type: behaviorFactory.types.COMPANY,
        });
        locationBehavior.setConnection(connection);
        locationReader = new Location.Reader(locationBehavior);
        companyReader = new Company.Reader(behavior);
        return Location.create({
          city: 'Guadalajara',
          country: 'Mex',
          behavior: locationBehavior,
        })
        .then((loc) => {
          location = loc;
        });
      })
      .then(() => location.behavior.closeConnection())
      .then(() => done(null))
      .catch(done);
    });
    beforeEach((done) => {
      connectionFactory.sqlite({
        database: 'data.db',
        logger: winston,
      })
      .then((conn) => {
        behavior.setConnection(conn);
        locationReader.behavior.setConnection(conn);
        return Company.create({
          name: 'unosquare',
          webpage: 'https://www.unosquare.com/',
          imageUrl: 'https://www.unosquare.com/images/logo_178.png',
          locationId: location.id,
          behavior,
        });
      })
      .then((com) => {
        company = com;
        return done(null);
      })
      .catch(done);
    });
    it('create new company', () => {
      should(company).be.instanceof(Company);
      should(Object.getPrototypeOf(company)).have.properties([
        'update',
        'remove',
      ]);
      should(companyReader).be.instanceof(Company.Reader);
      should(Object.getPrototypeOf(companyReader)).have.properties([
        'getAll',
        'getById',
      ]);
    });
    it('read all companies', (done) => {
      companyReader.getAll()
        .then((companies) => {
          should(companies).be.an.Array();
          should(companies).have.length(1);
          should(companies[0]).have.properties([
            'name',
            'id',
            'webpage',
            'imageUrl',
            'locationId',
          ]);
          should(companies[0].name).be.exactly('unosquare');
          should(companies[0].webpage).be.exactly('https://www.unosquare.com/');
          should(companies[0].imageUrl).be.exactly('https://www.unosquare.com/images/logo_178.png');
          locationReader.getById(companies[0].locationId)
            .then((companyLocation) => {
              should(companyLocation).be.eql(location);
              return done(null);
            });
        })
        .catch(done);
    });
    it('get company by id', (done) => {
      companyReader.getById(company.id)
        .then((newCompany) => {
          should(newCompany).be.eql(company);
          return done(null);
        })
        .catch(done);
    });
    it('get company by id return null', (done) => {
      companyReader.getById(0)
        .then((newCompany) => {
          should(newCompany).be.exactly(null);
          return done(null);
        })
        .catch(done);
    });
    it('update company', (done) => {
      company.name = 'Unosquare';
      company.webpage = 'https://unosquare.com/updated';
      company.imageUrl = 'https://www.unosquare.com/images/logo_178.updated';
      company.update()
        .then(() => companyReader.getById(company.id))
        .then((updatedCompany) => {
          should(updatedCompany).be.eql(company);
          return done(null);
        })
        .catch(done);
    });
    it('update company thorw error if invalid locationId', (done) => {
      company.locationId = 0;
      company.update()
        .then(() => done(new Error('validate pragma foreign key is on')))
        .catch((err) => {
          should(err).be.ok();
          should(err.code).be.exactly('SQLITE_CONSTRAINT');
          should(/FOREIGN KEY constraint/g.test(err.message)).be.exactly(true);
          return done(null);
        });
    });
    afterEach((done) => {
      company.remove()
        .then(() => behavior.closeConnection())
        .then(() => {
          should(company.behavior.connection).be.exactly(null);
          should(companyReader.behavior.connection).be.exactly(null);
          return done(null);
        })
        .catch(done);
    });
    after((done) => {
      company = null;
      companyReader = null;
      behavior = null;
      fs.unlinkAsync('data.db')
        .then(() => done(null))
        .catch(done);
    });
  });
});
