'use strict';

const { connectionFactory, schemaBuilder, Role, behaviorFactory } = require('../index');
const Promise = require('bluebird');
const winston = require('winston');
const fs = Promise.promisifyAll(require('fs'));
const should = require('should');

describe('role test suite', () => {
  describe('sqlite behavior', () => {
    let behavior = null;
    let role = null;
    let roleReader = null;
    before((done) => {
      connectionFactory.sqlite({
        database: 'data.db',
        logger: winston,
      })
      .then(conn => schemaBuilder.sqlite(conn)
        .then(() => conn))
      .then((connection) => {
        behavior = behaviorFactory.create({
          connection,
          type: behaviorFactory.types.ROLE,
        });
        return connection;
      })
      .then(conn => conn.close())
      .then(() => done(null))
      .catch(done);
    });
    beforeEach((done) => {
      connectionFactory.sqlite({
        database: 'data.db',
        logger: winston,
      })
      .then((conn) => {
        should(behavior.connection).be.exactly(null);
        behavior.setConnection(conn);
        roleReader = new Role.Reader(behavior);
        return Role.create({
          name: 'Development',
          color: '#FFFFFF',
          behavior,
        });
      })
      .then((ro) => {
        role = ro;
        return done(null);
      })
      .catch(done);
    });
    it('create a new role object', () => {
      should(role).be.instanceof(Role);
      should(Object.getPrototypeOf(role)).have.properties([
        'update',
        'remove',
      ]);
      should(roleReader).be.instanceof(Role.Reader);
      should(Object.getPrototypeOf(roleReader)).have.properties([
        'getAll',
        'getById',
      ]);
    });
    it('read all roles', (done) => {
      roleReader.getAll()
        .then((roles) => {
          should(roles).be.an.Array();
          should(roles).have.length(1);
          should(roles[0]).have.properties([
            'name',
            'id',
            'color',
          ]);
          should(roles[0].name).be.exactly('Development');
          should(roles[0].color).be.exactly('#FFFFFF');
          return done(null);
        })
        .catch(done);
    });
    it('get role by id', (done) => {
      roleReader.getById(role.id)
        .then((newRole) => {
          should(newRole).be.eql(role);
          return done(null);
        })
        .catch(done);
    });
    it('get role by id return null', (done) => {
      roleReader.getById(0)
        .then((newRole) => {
          should(newRole).be.exactly(null);
          return done(null);
        })
        .catch(done);
    });
    it('update role', (done) => {
      role.name = 'backend';
      role.color = '#000000';
      role.update()
        .then(() => roleReader.getById(role.id))
        .then((updatedRole) => {
          should(updatedRole).be.eql(role);
          return done(null);
        })
        .catch(done);
    });
    afterEach((done) => {
      role.remove()
        .then(() => behavior.closeConnection())
        .then(() => {
          should(role.behavior.connection).be.exactly(null);
          should(roleReader.behavior.connection).be.exactly(null);
          role = null;
          roleReader = null;
          return done(null);
        })
        .catch(done);
    });
    after((done) => {
      behavior = null;
      fs.unlinkAsync('data.db')
        .then(() => done(null))
        .catch(done);
    });
  });
});
