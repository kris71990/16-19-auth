'use strict';

import { Router } from 'express';
import multer from 'multer';
import Image from '../model/image';

const imageRouter = new Router();

imageRouter.post('/images', multer, (request, response, next) => {
  return Image.create();
});
