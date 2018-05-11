'use strict';

process.env.NODE_ENV = 'development';
process.env.PORT = 9000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';
process.env.SECRET = 'ImB126yeie93aAPjYD8lS2XEB@!hf%ioIh3UjzhgCuxP0gpFVo%7^1#&5ag@mZmn3k^#Caaa$tKQE5Ix5NAGRES#0GzMUGh8Mxqo';

var isAwsMock = true;

if (isAwsMock) {
  process.env.AWS_BUCKET = 'fake';
  process.env.AWS_SECRET_ACCESS_KEY = 'fakeaccesskey';
  process.env.AWS_ACCESS_KEY_ID = 'thisisnotarealkey';
  require('./setup');
} else {
  require('dotenv').config();
}