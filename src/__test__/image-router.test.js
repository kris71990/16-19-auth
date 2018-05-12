'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createImageMock, removeImageMock } from './lib/image-mock';

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('Testing /images', () => {
  beforeAll(startServer);
  afterEach(removeImageMock);
  afterAll(stopServer);

  describe('POST /images', () => {
    test('should return 200 for successful post', () => {
      // jest.setTimeout(30000);
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

    test('should return 400 for bad request', () => {
      return createImageMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          return superagent.post(`${apiUrl}/images`)
            .set('Authorization', `Bearer ${token}`)
            .field('title', '')
            .attach('image', `${__dirname}/assets/cloud.png`)
            .catch((response) => {
              expect(response.status).toEqual(400);
              expect(response.body).toBeFalsy();
            });
        });
    });

    test('should return 401 for bad/missing token', () => {
      return createImageMock()
        .then(() => {
          const token = 1234;
          return superagent.post(`${apiUrl}/images`)
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'some image')
            .attach('image', `${__dirname}/assets/cloud.png`)
            .catch((response) => {
              expect(response.status).toEqual(401);
              expect(response.body).toBeFalsy();
            });
        });
    });
  });

  describe('GET /images/:id', () => {
    test('should return 200 for success', () => {
      return createImageMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          return superagent.get(`${apiUrl}/images/${mockResponse.image._id}`)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
              expect(response.status).toEqual(200);
            });
        });
    });

    test('should return 401 for bad/missing token', () => {
      return createImageMock()
        .then((mockResponse) => {
          const token = 1234;
          return superagent.get(`${apiUrl}/images/${mockResponse.image._id}`)
            .set('Authorization', `Bearer ${token}`)
            .catch((response) => {
              expect(response.status).toEqual(401);
              expect(response.body).toBeFalsy();
            });
        });
    });

    test('should return 404 for image not found/bad id', () => {
      return createImageMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          return superagent.get(`${apiUrl}/images/1234`)
            .set('Authorization', `Bearer ${token}`)
            .catch((response) => {
              expect(response.status).toEqual(404);
              expect(response.body).toBeFalsy();
            });
        });
    });
  });

  describe('DELETE /images/:id', () => {
    test('should return 204 for successful deletion', () => {
      jest.setTimeout(1000);
      return createImageMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          return superagent.delete(`${apiUrl}/images/${mockResponse.image._id}`)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
              expect(response.status).toEqual(204);
              expect(response.body).toEqual({});
            });
        });
    });

    test('should return 401 for bad/missing token', () => {
      jest.setTimeout(1000);
      return createImageMock()
        .then((mockResponse) => {
          return superagent.delete(`${apiUrl}/images/${mockResponse.image._id}`)
            .then(() => {})
            .catch((error) => {
              expect(error.status).toEqual(401);
            });
        });
    });

    test('should return 404 for image not found', () => {
      jest.setTimeout(1000);
      return createImageMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          return superagent.delete(`${apiUrl}/images/1234`)
            .set('Authorization', `Bearer ${token}`)
            .then(() => {})
            .catch((error) => {
              expect(error.status).toEqual(404);
            });
        });
    });
  });
});
