/* eslint-disable no-underscore-dangle */
/* global describe, context, afterEach, it */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const request = require('supertest');
const rewire = require('rewire');
const mongoose = require('mongoose');

const server = rewire('../src/server');
const app = server.__get__('app');

const sandbox = sinon.createSandbox();

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('app.js', () => {
  let insertId;
  let newUser;

  afterEach(() => {
    sandbox.restore();
  });

  context('test 404s', () => {
    it('should return status code 404', () => {
      expect(
        request(app)
          .get('/invalid-path/something')
          .expect('Content-Type', 'application/json')
          .expect(404)
          .then((response) => response.body),
      ).to.eventually.have.property('message', 'Not found');
    });
  });

  context('test /devs', () => {
    it('should return a list of db users', () => {
      const id = new mongoose.Types.ObjectId();

      expect(
        request(app)
          .get('/devs')
          .set('user', id)
          .expect('Content-Type', 'application/json')
          .expect(200)
          .then((response) => response.body),
      ).to.eventually.be.a('array');
    });

    it('should register a new user', () => {
      const reqBody = {
        name: 'Lucio Schenkel',
        user: 'Lucioschenkel',
        bio: 'Software developer',
        avatar: '',
      };

      expect(
        request(app)
          .post('/devs')
          .set('Accept', 'application/json')
          .send({ ...reqBody })
          .expect(200)
          .then((response) => {
            insertId = response.body._id;
            return response.body;
          }),
      ).to.eventually.have.property('_id');
    });

    it('should fetch a inserted user', () => {
      expect(
        request(app)
          .get(`/devs/${insertId}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', 'application/json')
          .expect(200)
          .then((response) => response.body),
      ).to.eventually.have.property('user');
    });

    it('should create another user, and like it', async () => {
      const user = {
        name: 'Diego Fernandes',
        user: 'diego3g',
        bio: '',
        avatar: '',
      };

      expect(
        request(app)
          .post('/devs')
          .set('Accept', 'application/json')
          .send({ ...user })
          .expect(200)
          .then((response) => {
            newUser = response.body._id;
            return request(app)
              .post(`/devs/${newUser}/likes`)
              .set('Accept', 'application/json')
              .set('user', insertId)
              .send()
              .then((result) => result.body);
          }),
      ).to.eventually.have.property('_id');
    });

    it('should dislike a user', async () => {
      expect(
        request(app)
          .post(`/devs/${newUser}/dislikes`)
          .set('Accept', 'application/json')
          .set('user', insertId)
          .send()
          .expect(200)
          .then((result) => result.body),
      ).to.eventually.have.property('_id');
    });
  });
});
