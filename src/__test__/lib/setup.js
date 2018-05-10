'use strict';

import faker from 'faker';
import * as awsSDKMock from 'aws-sdk-mock';

awsSDKMock.mock('S3', 'upload', (params, callback) => {
  if (!params.Key || !params.Bucket || !params.ACL || !params.Body) {
    return callback(new Error('AWS error - upload: key/bucket required'));
  }

  if (params.ACL !== 'public-read') {
    return callback(new Error('AWS error: ACL should be public-read'));
  }

  if (params.Bucket !== process.env.AWS_BUCKET) {
    return callback(new Error('AWS error: wrong bucket'));
  }

  return callback(null, { Location: faker.internet.url() });
});

awsSDKMock.mock('S3', 'deleteObject', (params, callback) => {
  if (!params.Key || !params.Bucket) {
    return callback(new Error('AWS error - delete: key/bucket required'));
  }

  if (params.Bucket !== process.env.AWS_BUCKET) {
    return callback(new Error('AWS error: wrong bucket'));
  }

  return callback(null, 'successful deletion');
});
