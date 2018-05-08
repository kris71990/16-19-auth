'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import logger from '../lib/logger';
import Account from '../model/account';

const authRouter = new Router();
const jsonParser = bodyParser.json();

authRouter.post('/signup', jsonParser, (request, response, next) => {
  return Account.create(request.body.username, request.body.email, request.body.password)
    .then((account) => {
      delete request.body.password;
      logger.log(logger.INFO, 'AUTH - creating token');
      return account.createToken();
    })
    .then((token) => {
      logger.log(logger.INFO, 'AUTH - return 200 code');
      return response.json({ token });
    })
    .catch(next);
});

export default authRouter;
