'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stopServer = exports.startServer = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _authRoutes = require('../route/auth-routes');

var _authRoutes2 = _interopRequireDefault(_authRoutes);

var _profileRoute = require('../route/profile-route');

var _profileRoute2 = _interopRequireDefault(_profileRoute);

var _imageRoute = require('../route/image-route');

var _imageRoute2 = _interopRequireDefault(_imageRoute);

var _loggerMiddleware = require('./logger-middleware');

var _loggerMiddleware2 = _interopRequireDefault(_loggerMiddleware);

var _errorMiddleware = require('./error-middleware');

var _errorMiddleware2 = _interopRequireDefault(_errorMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var server = null;

app.use(_loggerMiddleware2.default);
app.use(_authRoutes2.default);
app.use(_profileRoute2.default);
app.use(_imageRoute2.default);

app.all('*', function (request, response) {
  _logger2.default.log(_logger2.default.INFO, 'SERVER - 404 error from catch-all route');
  return response.sendStatus(404);
});

app.use(_errorMiddleware2.default);

var startServer = function startServer() {
  return _mongoose2.default.connect(process.env.MONGODB_URI).then(function () {
    server = app.listen(process.env.PORT, function () {
      _logger2.default.log(_logger2.default.INFO, 'Server listening on port ' + process.env.PORT);
    });
  });
};

var stopServer = function stopServer() {
  return _mongoose2.default.disconnect().then(function () {
    server.close(function () {
      _logger2.default.log(_logger2.default.INFO, 'Server disconnected');
    });
  });
};

exports.startServer = startServer;
exports.stopServer = stopServer;