'use strict';

import HttpError from 'http-errors';
import jsonWebToken from 'jsonwebtoken';
import Account from '../model/account';

const promisify = callback => (...args) => {
  return new Promise((resolve, reject) => {
    callback(...args, (error, data) => {
      if (error) return reject(error);
      return resolve(data);
    });
  });
};

export default (request, response, next) => {
  if (!request.headers.authorization) {
    return next(new HttpError(401, 'AUTH - invalid request'));
  }
  const token = request.headers.authorization.split('Bearer ')[1];
  if (!token) {
    return next(new HttpError(404, 'Invalid request'));
  }

  return promisify(jsonWebToken.verify)(token, process.env.SECRET)
    .catch((error) => {
      return Promise.reject(new HttpError(401, `JWT error ${error}`));
    })
    .then((seed) => {
      return Account.findOne({ tokenSeed: seed.tokenSeed });
    })
    .then((account) => {
      if (!account) {
        return new HttpError(400, 'Invalid request');
      }
      request.account = account;
      return next();
    })
    .catch(next);
};
