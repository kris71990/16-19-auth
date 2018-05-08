'use strict';

import { Router } from 'express';
import HttpError from 'http-errors';
import bodyParser from 'body-parser';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import logger from '../lib/logger';
import Profile from '../model/profile';

const profileRouter = new Router();
const jsonParser = bodyParser.json();

profileRouter.post('/profile', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  if (!request.account) {
    return new HttpError(400, 'Invalid request');
  }
  return new Profile({
    ...request.body,
    account: request.account._id,
  }).save()
    .then((profile) => {
      logger.log(logger.INFO, 'returning 200 and new profile');
      return response.json(profile);
    })
    .catch(next);
});

export default profileRouter;
