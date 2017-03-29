'use strict';

const { connectionFactory, schemaBuilder, Role, Location, Tool, Company, Project, behaviorFactory } = require('../index');
const Promise = require('bluebird');
const winston = require('winston');
const fs = Promise.promisifyAll(require('fs'));
const should = require('should');

describe('project test suite', () => {
  describe('sqlite behavior', () => {
    let locations = {};
    let companies = {};
    let behavior = {};
    let project = {};
    let projectReader = {};
    let companyReader = {};
    let role = {};
    let roleReader = {};
    let tool = {};
    let toolReader = {};
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
          type: behaviorFactory.types.PROJECT,
        });
        projectReader = new Project.Reader(behavior);
        const locationBehavior = behaviorFactory.create({
          connection,
          type: behaviorFactory.types.LOCATION,
        });
        locationBehavior.setConnection(connection);
        return Promise.props({
          gdl: Location.create({
            city: 'Gudalajara',
            country: 'MEX',
            behavior: locationBehavior,
          }).reflect(),
          boston: Location.create({
            city: 'Boston',
            country: 'USA',
            behavior: locationBehavior,
          }).reflect(),
        })
          .then((result) => {
            should(result.gdl.isFulfilled()).be.exactly(true);
            should(result.boston.isFulfilled()).be.exactly(true);
            locations.gdl = result.gdl.value();
            locations.boston = result.boston.value();
            return connection;
          });
      })
      .then((connection) => {
        const companyBehavior = behaviorFactory.create({
          connection,
          type: behaviorFactory.types.COMPANY,
        });
        companyBehavior.setConnection(connection);
        companyReader = new Company.Reader(companyBehavior);
        return Promise.props({
          unosquare: Company.create({
            name: 'unosquare',
            webpage: 'https://www.unosquare.com/',
            imageUrl: 'https://www.unosquare.com/images/logo_178.png',
            locationId: locations.gdl.id,
            behavior: companyBehavior,
          }).reflect(),
          fmi: Company.create({
            name: 'foundation medicine',
            webpage: 'http://www.foundationmedicine.com/',
            imageUrl: 'http://www.foundationmedicine.com/wp-content/themes/foundationmedicine/img/logos/foundation-medicine-2x.png',
            locationId: locations.boston.id,
            behavior: companyBehavior,
          }).reflect(),
        })
          .then((result) => {
            should(result.unosquare.isFulfilled()).be.exactly(true);
            should(result.fmi.isFulfilled()).be.exactly(true);
            companies.unosquare = result.unosquare.value();
            companies.fmi = result.fmi.value();
            return connection.close();
          });
      })
      .then(() => done(null))
      .catch(done);
    });
    beforeEach((done) => {
      connectionFactory.sqlite({
        database: 'data.db',
        logger: winston,
      })
      .then((connection) => {
        behavior.setConnection(connection);
        companyReader.behavior.setConnection(connection);
        const roleBehavior = behaviorFactory.create({
          connection,
          type: behaviorFactory.types.ROLE,
        });
        roleReader = new Role.Reader(roleBehavior);
        roleBehavior.setConnection(connection);
        const toolBehavior = behaviorFactory.create({
          connection,
          type: behaviorFactory.types.TOOL,
        });
        toolReader = new Tool.Reader(toolBehavior);
        toolBehavior.setConnection(connection);
        Promise.props({
          project: Project.create({
            name: 'bluejay',
            startDate: 'Aug 2015',
            highlight: 'a great project',
            clientId: companies.fmi.id,
            vendorId: companies.unosquare.id,
            behavior,
          }).reflect(),
          role: Role.create({
            name: 'Development',
            color: '#FFFFFF',
            behavior: roleBehavior,
          }).reflect(),
          tool: Tool.create({
            name: 'node',
            webpage: 'https://nodejs.org/en/',
            behavior: toolBehavior,
          }).reflect(),
        })
        .then((result) => {
          should(result.project.isFulfilled()).be.exactly(true);
          should(result.role.isFulfilled()).be.exactly(true);
          should(result.tool.isFulfilled()).be.exactly(true);
          project = result.project.value();
          role = result.role.value();
          tool = result.tool.value();
          return done(null);
        });
      })
      .catch(done);
    });
    it('create a new project', () => {
      should(project).be.instanceof(Project);
      should(Object.getPrototypeOf(project)).have.properties([
        'update',
        'remove',
        'addRole',
        'removeRole',
        'addTool',
        'removeTool',
      ]);
    });
    it('get all projects', (done) => {
      projectReader.getAll()
        .then((projects) => {
          should(projects).be.an.Array();
          should(projects).have.length(1);
          should(projects[0]).have.properties([
            'name',
            'id',
            'startDate',
            'endDate',
            'highlight',
            'clientId',
            'vendorId',
          ]);
          should(projects[0].name).be.exactly('bluejay');
          should(projects[0].startDate).be.exactly('Aug 2015');
          should(projects[0].endDate).be.exactly(null);
          should(projects[0].highlight).be.exactly('a great project');
          Promise.props({
            fmi: companyReader.getById(projects[0].clientId).reflect(),
            unosquare: companyReader.getById(projects[0].vendorId).reflect(),
          })
            .then((result) => {
              should(result.unosquare.isFulfilled()).be.exactly(true);
              should(result.fmi.isFulfilled()).be.exactly(true);
              return {
                unosquare: result.unosquare.value(),
                fmi: result.fmi.value(),
              };
            })
            .then((expectedCompanies) => {
              should(expectedCompanies.unosquare).be.eql(companies.unosquare);
              should(expectedCompanies.fmi).be.eql(companies.fmi);
              return done(null);
            });
        })
        .catch(done);
    });
    it('get project by id', (done) => {
      projectReader.getById(project.id)
        .then((newProject) => {
          should(newProject).be.eql(project);
          return done(null);
        })
        .catch(done);
    });
    it('get project by id return null', (done) => {
      projectReader.getById(0)
        .then((newProject) => {
          should(newProject).be.exactly(null);
          return done(null);
        })
        .catch(done);
    });
    it('update project', (done) => {
      project.name = 'bluejay updated';
      project.startDate = 'Sep 2016';
      project.endDate = 'Jan 2017';
      project.highlight = 'an updated highlight';
      project.update()
        .then(() => projectReader.getById(project.id))
        .then((updatedProject) => {
          should(updatedProject).be.eql(project);
          return done(null);
        })
        .catch(done);
    });
    it('update project thorw error if invalid clientId', (done) => {
      project.clientId = 0;
      project.update()
        .then(() => done(new Error('validate pragma foreign key is on')))
        .catch((err) => {
          should(err).be.ok();
          should(err.code).be.exactly('SQLITE_CONSTRAINT');
          should(/FOREIGN KEY constraint/g.test(err.message)).be.exactly(true);
          return done(null);
        });
    });
    it('update project thorw error if invalid vendorId', (done) => {
      project.vendorId = 0;
      project.update()
        .then(() => done(new Error('validate pragma foreign key is on')))
        .catch((err) => {
          should(err).be.ok();
          should(err.code).be.exactly('SQLITE_CONSTRAINT');
          should(/FOREIGN KEY constraint/g.test(err.message)).be.exactly(true);
          return done(null);
        });
    });
    it('add a role to a project & remove it', (done) => {
      project.addRole(role)
        .then(() => roleReader.getByProjectId(project.id))
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
          return project.removeRole(role);
        })
        .then(() => roleReader.getByProjectId(project.id))
        .then((roles) => {
          should(roles).be.an.Array();
          should(roles).be.empty();
          return done(null);
        });
    });
    it('add a tool to a project & remove it', (done) => {
      project.addTool(tool)
        .then(() => toolReader.getByProjectId(project.id))
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
          return project.removeTool(tool);
        })
        .then(() => toolReader.getByProjectId(project.id))
        .then((tools) => {
          should(tools).be.an.Array();
          should(tools).be.empty();
          return done(null);
        });
    });
    afterEach((done) => {
      Promise.props({
        project: project.remove().reflect(),
        role: role.remove().reflect(),
        tool: tool.remove().reflect(),
      })
        .then((result) => {
          should(result.project.isFulfilled()).be.exactly(true);
          should(result.role.isFulfilled()).be.exactly(true);
          should(result.tool.isFulfilled()).be.exactly(true);
          return Promise.resolve();
        })
        .then(() => behavior.closeConnection())
        .then(() => {
          should(project.behavior.connection).be.exactly(null);
          return done(null);
        })
        .catch(done);
    });
    after((done) => {
      behavior = null;
      companies = null;
      locations = null;
      fs.unlinkAsync('data.db')
        .then(() => done(null))
        .catch(done);
    });
  });
});
