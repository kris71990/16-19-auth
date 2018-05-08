'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createAccountMock, removeAccountMock } from './lib/account-mock';


const apiUrl = `http://localhost:${process.env.PORT}/signup`;

describe('User Authentication', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeAccountMock);

  test('POST - 200 - success', () => {
    return superagent.post(apiUrl)
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
    return superagent.post(apiUrl)
      .send({
        username: 'Kris',
        password: 'password',
      })
      .catch((response) => {
        expect(response.status).toEqual(400);
        expect(response.body).toBeFalsy();
      });
  });

  test('POST - 409 - duplicate keys', () => {
    return createAccountMock()
      .then((mock) => {
        return superagent.post(apiUrl)
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
