'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createAccountMock } from './lib/account-mock';
import { createProfileMock, removeProfileMock } from './lib/profile-mock';

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('POST /profile', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeProfileMock);

  test('POST - should respond with 200 and profile info', () => {
    let accountMock = null;
    return createAccountMock()
      .then((accountSetMock) => {
        accountMock = accountSetMock;
        return superagent.post(`${apiUrl}/profile`)
          .set('Authorization', `Bearer ${accountSetMock.token}`)
          .send({
            bio: 'bio',
            firstName: 'name',
            lastName: 'othername',
          });
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.body.firstName).toEqual('name');
        expect(response.body.lastName).toEqual('othername');
      });
  });

  test('POST - invalid response should send 400', () => {
    return createAccountMock()
      .then((accountSetMock) => {
        return superagent.post(`${apiUrl}/profile`)
          .set('Authorization', `Bearer ${accountSetMock.token}`)
          .send({
            bio: 'bio',
            firstName: 'name',
          });
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
        expect(response.body).toBeFalsy();
      });
  });

  test('POST - 401 for missing token', () => {
    return createAccountMock()
      .then(() => {
        return superagent.post(`${apiUrl}/profile`)
          .send({
            bio: 'bio',
            lastName: 'namename',
            firstName: 'name',
          });
      })
      .catch((response) => {
        expect(response.status).toEqual(401);
        expect(response.body).toBeFalsy();
      });
  });

  describe.only('GET /profile/:id', () => {
    test('GET - 200 for success', () => {
      return createProfileMock()
        .then((mock) => {
          console.log(mock.accountMock.token)
          return superagent.get(`${apiUrl}/profile/${mock.profile.account}`)
            .auth('Authorization', `Bearer ${mock.accountMock.token}`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.token).toBeTruthy();
            });
        });
    });
  });
});

