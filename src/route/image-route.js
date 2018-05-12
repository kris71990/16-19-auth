'use strict';

import { Router } from 'express';
import multer from 'multer';
import HttpError from 'http-errors';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import logger from '../lib/logger';
import Image from '../model/image';
import { s3Upload } from '../lib/s3';

const imageRouter = new Router();
const multerUpload = multer({ dest: `${__dirname}/../temp` });

imageRouter.post('/images', bearerAuthMiddleware, multerUpload.any(), (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(404, 'IMAGE ROUTER ERROR - not found'));
  }

  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'image') {
    return next(new HttpError(400, 'IMAGE ROUTER ERROR - invalid request'));
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

imageRouter.delete('/images/:id', bearerAuthMiddleware, (request, response, next) => {
  return Image.findByIdAndRemove(request.params.id)
    .then((image) => {
      if (!image) {
        return new HttpError(404, 'no image found');
      }
      logger.log(logger.INFO, 'return 204 for successful deletion');
      return response.sendStatus(204);
    })
    .catch(next);
});

imageRouter.get('/images/:id', bearerAuthMiddleware, (request, response, next) => {
  return Image.findById(request.params.id)
    .then((image) => {
      if (!image) {
        return new HttpError(404, 'no image found');
      }
      logger.log(logger.INFO, 'returning 200 and image info');
      return response.json(image);
    })
    .catch(next);
});


export default imageRouter;
