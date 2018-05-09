'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createAccountMock, removeAccountMock } from './lib/account-mock';


const apiUrl = `http://localhost:${process.env.PORT}`;

describe('User Authentication', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeAccountMock);

  describe('POST to /signup', () => {
    test('POST - 200 - success', () => {
      return superagent.post(`${apiUrl}/signup`)
        .send({
          username: 'Kris',
          email: 'test@test.com',
          password: 'password',
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });
  
    test('POST - 400 - bad request', () => {
      return superagent.post(`${apiUrl}/signup`)
        .send({ 
          password: 'Kris',
        })
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(400);
          expect(response.body).toBeFalsy();
        });
    });
  
    test('POST - 409 - duplicate keys', () => {
      return createAccountMock()
        .then((mock) => {
          return superagent.post(`${apiUrl}/signup`)
            .send({
              username: mock.account.username,
              email: 'blahblahblah',
              password: 'blahblah',
            });
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(409);
        });
    });
  });

  describe('GET from /login', () => {
    test('GET - 200 success', () => {
      return createAccountMock()
        .then((mock) => {
          return superagent.get(`${apiUrl}/login`)
            .auth(mock.request.username, mock.request.password);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });

    test('GET - 400 for bad request', () => {
      return createAccountMock()
        .then((mock) => {
          return superagent.get(`${apiUrl}/login`)
            .auth('bad request', mock.request.password);
        })
        .catch((response) => {
          expect(response.status).toEqual(400);
          expect(response.body).toBeFalsy();
        });
    });
  });
});
