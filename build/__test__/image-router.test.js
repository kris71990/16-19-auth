'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _imageMock = require('./lib/image-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiUrl = 'http://localhost:' + process.env.PORT;

describe('Testing /images', function () {
  beforeAll(_server.startServer);
  afterEach(_imageMock.removeImageMock);
  afterAll(_server.stopServer);

  describe('POST /images', function () {
    test('should return 200 for successful post', function () {
      // jest.setTimeout(30000);
      return (0, _imageMock.createImageMock)().then(function (mockResponse) {
        var token = mockResponse.accountMock.token;

        return _superagent2.default.post(apiUrl + '/images').set('Authorization', 'Bearer ' + token).field('title', 'some image').attach('image', __dirname + '/assets/cloud.png').then(function (response) {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual('some image');
          expect(response.body._id).toBeTruthy();
          expect(response.body.url).toBeTruthy();
        });
      }).catch(function (error) {
        expect(error.status).toEqual(400);
      });
    });

    test('should return 400 for bad request', function () {
      return (0, _imageMock.createImageMock)().then(function (mockResponse) {
        var token = mockResponse.accountMock.token;

        return _superagent2.default.post(apiUrl + '/images').set('Authorization', 'Bearer ' + token).field('title', '').attach('image', __dirname + '/assets/cloud.png').catch(function (response) {
          expect(response.status).toEqual(400);
          expect(response.body).toBeFalsy();
        });
      });
    });

    test('should return 401 for bad/missing token', function () {
      return (0, _imageMock.createImageMock)().then(function () {
        var token = 1234;
        return _superagent2.default.post(apiUrl + '/images').set('Authorization', 'Bearer ' + token).field('title', 'some image').attach('image', __dirname + '/assets/cloud.png').catch(function (response) {
          expect(response.status).toEqual(401);
          expect(response.body).toBeFalsy();
        });
      });
    });
  });

  describe('GET /images/:id', function () {
    test('should return 200 for success', function () {
      return (0, _imageMock.createImageMock)().then(function (mockResponse) {
        var token = mockResponse.accountMock.token;

        return _superagent2.default.get(apiUrl + '/images/' + mockResponse.image._id).set('Authorization', 'Bearer ' + token).then(function (response) {
          expect(response.status).toEqual(200);
        });
      });
    });

    test('should return 401 for bad/missing token', function () {
      return (0, _imageMock.createImageMock)().then(function (mockResponse) {
        var token = 1234;
        return _superagent2.default.get(apiUrl + '/images/' + mockResponse.image._id).set('Authorization', 'Bearer ' + token).catch(function (response) {
          expect(response.status).toEqual(401);
          expect(response.body).toBeFalsy();
        });
      });
    });

    test('should return 404 for image not found/bad id', function () {
      return (0, _imageMock.createImageMock)().then(function (mockResponse) {
        var token = mockResponse.accountMock.token;

        return _superagent2.default.get(apiUrl + '/images/1234').set('Authorization', 'Bearer ' + token).catch(function (response) {
          expect(response.status).toEqual(404);
          expect(response.body).toBeFalsy();
        });
      });
    });
  });

  describe('DELETE /images/:id', function () {
    test('should return 204 for successful deletion', function () {
      jest.setTimeout(1000);
      return (0, _imageMock.createImageMock)().then(function (mockResponse) {
        var token = mockResponse.accountMock.token;

        return _superagent2.default.delete(apiUrl + '/images/' + mockResponse.image._id).set('Authorization', 'Bearer ' + token).then(function (response) {
          expect(response.status).toEqual(204);
          expect(response.body).toEqual({});
        });
      });
    });

    test('should return 401 for bad/missing token', function () {
      jest.setTimeout(1000);
      return (0, _imageMock.createImageMock)().then(function (mockResponse) {
        return _superagent2.default.delete(apiUrl + '/images/' + mockResponse.image._id).then(function () {}).catch(function (error) {
          expect(error.status).toEqual(401);
        });
      });
    });

    test('should return 404 for image not found', function () {
      jest.setTimeout(1000);
      return (0, _imageMock.createImageMock)().then(function (mockResponse) {
        var token = mockResponse.accountMock.token;

        return _superagent2.default.delete(apiUrl + '/images/1234').set('Authorization', 'Bearer ' + token).then(function () {}).catch(function (error) {
          expect(error.status).toEqual(404);
        });
      });
    });
  });
});