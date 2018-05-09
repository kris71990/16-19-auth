'use strict';

import HttpError from 'http-errors';
import Account from '../model/account';

export default (request, response, next) => {
  if (!request.headers.authorization) {
    return next(new HttpError(400, 'Invalid request - no information'));
  }

  const base64AuthHeader = request.headers.authorization.split(' ')[1];
  if (!base64AuthHeader) {
    return next(new HttpError(400, 'Invalid request - improper information'));
  }
  const stringAuthHeader = Buffer.from(base64AuthHeader, 'base64').toString();
  const [username, password] = stringAuthHeader.split(':');

  if (!username || !password) {
    return next(new HttpError(400, 'Invalid request - no username or no password'));
  }

  return Account.findOne({ username })
    .then((account) => {
      if (!account) {
        return next(new HttpError(400, 'Invalid request'));
      }
      return account.verifyPassword(password);
    })
    .then((account) => {
      request.account = account;
      return next();
    })
    .catch(next);
};

