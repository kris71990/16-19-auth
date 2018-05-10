'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createImageMock, removeImageMock } from './lib/image-mock';

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('Testing /images', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeImageMock);

  describe('POST 200 for successful post', () => {
    test('should return 200', () => {
      return createImageMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          return superagent.post(`${apiUrl}/images`)
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'some image')
            .attach('image', `${__dirname}/assets/cloud.png`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('some image');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        })
        .catch((error) => {
          expect(error.status).toEqual(400);
        });
    });
  });
});
