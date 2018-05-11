'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

var _bearerAuthMiddleware2 = _interopRequireDefault(_bearerAuthMiddleware);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _profile = require('../model/profile');

var _profile2 = _interopRequireDefault(_profile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var profileRouter = new _express.Router();
var jsonParser = _bodyParser2.default.json();

profileRouter.post('/profile', _bearerAuthMiddleware2.default, jsonParser, function (request, response, next) {
  if (!request.account) {
    return new _httpErrors2.default(400, 'Invalid request');
  }
  return new _profile2.default(_extends({}, request.body, {
    account: request.account._id
  })).save().then(function (profile) {
    _logger2.default.log(_logger2.default.INFO, 'returning 200 and new profile');
    return response.json(profile);
  }).catch(next);
});

profileRouter.get('/profile/:id', _bearerAuthMiddleware2.default, function (request, response, next) {
  return _profile2.default.findById(request.params.id).then(function (profile) {
    if (!profile) {
      return new _httpErrors2.default(404, 'no profile found');
    }
    _logger2.default.log(_logger2.default.INFO, 'returning 200 and profile info');
    return response.json(profile);
  }).catch(next);
});

exports.default = profileRouter;