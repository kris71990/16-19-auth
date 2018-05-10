'use strict';

import { Router } from 'express';
import multer from 'multer';
import HttpError from 'http-errors';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import logger from '../lib/logger';
import Image from '../model/image';
import { s3Upload, s3Remove } from '../lib/s3';

const imageRouter = new Router();
const multerUpload = multer({ dest: `${__dirname}/../temp` });

imageRouter.post('/images', bearerAuthMiddleware, multerUpload.any(), (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(404, 'IMAGE ROUTER ERROR - not found'));
  }

  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'sound') {
    return next(new HttpError(400, 'SOUND ROUTER ERROR - invalid request'));
  }

  const file = request.files[0];
  const key = `${file.filename}.${file.originalname}`;

  return s3Upload(file.path, key)
    .then((url) => {
      return new Image({
        title: request.body.title,
        account: request.account._id,
        url,
      }).save();
    })
    .then((image) => {
      logger.log(logger.INFO, 'Image created and saved');
      return response.json(image);
    })
    .catch(error => next(new HttpError(400, error)));
});

export default imageRouter;
