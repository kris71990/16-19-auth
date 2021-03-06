'use strict';

import fs from 'fs-extra';
import logger from './logger';

const s3Upload = (path, key) => {
  const AWS = require('aws-sdk');
  const amazonS3 = new AWS.S3();

  const uploadOptions = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: fs.createReadStream(path),
  };

  return amazonS3.upload(uploadOptions)
    .promise()
    .then((response) => {
      return fs.remove(path)
        .then(() => response.Location)
        .catch(error => Promise.reject(error));
    })
    .catch((error) => {
      return fs.remove(path)
        .then(() => Promise.reject(error))
        .catch(err => Promise.reject(err));
    });
};

const s3Remove = (key) => {
  const AWS = require('aws-sdk');
  const amazonS3 = new AWS.S3();

  const removeOptions = {
    Key: key,
    Bucket: process.env.AWS_BUCKET,
  };

  return amazonS3.deleteObject(removeOptions)
    .promise()
    .then((data) => {
      logger.log(logger.INFO, `${data} deleted from bucket`);
    })
    .catch((err) => {
      logger.log(logger.ERROR, 'error occurred in deletion');
      Promise.reject(err);
    });
};

export { s3Upload, s3Remove };
