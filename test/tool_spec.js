'use strict';

const { connectionFactory, schemaBuilder, Tool, behaviorFactory } = require('../index');
const Promise = require('bluebird');
const winston = require('winston');
const fs = Promise.promisifyAll(require('fs'));
const should = require('should');

describe('tool test suite', () => {
  describe('sqlite behavior', () => {
    let behavior = null;
    let tool = null;
    let toolReader = null;
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
          type: behaviorFactory.types.TOOL,
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
        toolReader = new Tool.Reader(behavior);
        return Tool.create({
          name: 'node',
          webpage: 'https://nodejs.org/en/',
          behavior,
        });
      })
      .then((to) => {
        tool = to;
        return done(null);
      })
      .catch(done);
    });
    it('create a new tool object', () => {
      should(tool).be.instanceof(Tool);
      should(Object.getPrototypeOf(tool)).have.properties([
        'update',
        'remove',
      ]);
      should(toolReader).be.instanceof(Tool.Reader);
      should(Object.getPrototypeOf(toolReader)).have.properties([
        'getAll',
        'getById',
      ]);
    });
    it('read all tools', (done) => {
      toolReader.getAll()
        .then((tools) => {
          should(tools).be.an.Array();
          should(tools).have.length(1);
          should(tools[0]).have.properties([
            'name',
            'id',
            'webpage',
          ]);
          should(tools[0].name).be.exactly('node');
          should(tools[0].webpage).be.exactly('https://nodejs.org/en/');
          return done(null);
        })
        .catch(done);
    });
    it('get tool by id', (done) => {
      toolReader.getById(tool.id)
        .then((newTool) => {
          should(newTool).be.eql(tool);
          return done(null);
        })
        .catch(done);
    });
    it('get tool by id return null', (done) => {
      toolReader.getById(0)
        .then((newTool) => {
          should(newTool).be.exactly(null);
          return done(null);
        })
        .catch(done);
    });
    it('update tool', (done) => {
      tool.name = 'nodeee';
      tool.webpage = 'https://nodejs.org/en/updated';
      tool.update()
        .then(() => toolReader.getById(tool.id))
        .then((updatedTool) => {
          should(updatedTool).be.eql(tool);
          return done(null);
        })
        .catch(done);
    });
    afterEach((done) => {
      tool.remove()
        .then(() => behavior.closeConnection())
        .then(() => {
          should(tool.behavior.connection).be.exactly(null);
          should(toolReader.behavior.connection).be.exactly(null);
          tool = null;
          toolReader = null;
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
