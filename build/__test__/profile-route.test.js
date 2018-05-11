'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

var _profileMock = require('./lib/profile-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiUrl = 'http://localhost:' + process.env.PORT;

describe('POST /profile', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_profileMock.removeProfileMock);

  test('POST - should respond with 200 and profile info', function () {
    var accountMock = null;
    return (0, _accountMock.createAccountMock)().then(function (accountSetMock) {
      accountMock = accountSetMock;
      return _superagent2.default.post(apiUrl + '/profile').set('Authorization', 'Bearer ' + accountSetMock.token).send({
        bio: 'bio',
        firstName: 'name',
        lastName: 'othername'
      });
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.account).toEqual(accountMock.account._id.toString());
      expect(response.body.firstName).toEqual('name');
      expect(response.body.lastName).toEqual('othername');
    });
  });

  test('POST - invalid response should send 400', function () {
    return (0, _accountMock.createAccountMock)().then(function (accountSetMock) {
      return _superagent2.default.post(apiUrl + '/profile').set('Authorization', 'Bearer ' + accountSetMock.token).send({
        bio: 'bio',
        firstName: 'name'
      });
    }).then(Promise.reject).catch(function (response) {
      expect(response.status).toEqual(400);
      expect(response.body).toBeFalsy();
    });
  });

  test('POST - 401 for missing token', function () {
    return (0, _accountMock.createAccountMock)().then(function () {
      return _superagent2.default.post(apiUrl + '/profile').send({
        bio: 'bio',
        lastName: 'namename',
        firstName: 'name'
      });
    }).catch(function (response) {
      expect(response.status).toEqual(401);
      expect(response.body).toBeFalsy();
    });
  });

  describe('GET /profile/:id', function () {
    test('GET - 200 for success', function () {
      return (0, _profileMock.createProfileMock)().then(function (mock) {
        return _superagent2.default.get(apiUrl + '/profile/' + mock.profile._id).set('Authorization', 'Bearer ' + mock.accountMock.token);
      }).then(function (response) {
        expect(response.status).toEqual(200);
        // expect(response.body.token).toBeTruthy();
      });
    });

    test('GET - 400 for invalid request', function () {
      return (0, _profileMock.createProfileMock)().then(function (mock) {
        return _superagent2.default.get(apiUrl + '/profile/' + mock.profile._id);
      }).catch(function (response) {
        expect(response.status).toEqual(401);
      });
    });

    test('GET - 401 for no token', function () {
      return (0, _profileMock.createProfileMock)().then(function () {
        return _superagent2.default.get(apiUrl + '/profile/1234').set('Authorization', 'sdsdsa');
      }).catch(function (response) {
        expect(response.status).toEqual(404);
      });
    });
  });
});