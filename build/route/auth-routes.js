'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _basicAuthMiddleware = require('../lib/basic-auth-middleware');

var _basicAuthMiddleware2 = _interopRequireDefault(_basicAuthMiddleware);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _account = require('../model/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authRouter = new _express.Router();
var jsonParser = _bodyParser2.default.json();

authRouter.post('/signup', jsonParser, function (request, response, next) {
  return _account2.default.create(request.body.username, request.body.email, request.body.password).then(function (account) {
    delete request.body.password;
    _logger2.default.log(_logger2.default.INFO, 'AUTH - creating token');
    return account.createToken();
  }).then(function (token) {
    _logger2.default.log(_logger2.default.INFO, 'AUTH - return 200 code');
    return response.json({ token: token });
  }).catch(next);
});

authRouter.get('/login', _basicAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) {
    return next(new _httpErrors2.default(400, 'AUTH - Invalid request'));
  }
  return request.account.createToken().then(function (token) {
    _logger2.default.log(_logger2.default.INFO, 'responding with 200 status and token');
    return response.json({ token: token });
  }).catch(next);
});

exports.default = authRouter;