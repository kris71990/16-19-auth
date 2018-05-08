'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createAccountMock } from './lib/account-mock';
import { removeProfileMock } from './lib/profile-mock';

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
        expect(response.body.account).toEqual(accountMock.account._id);
        expect(response.body.firstName).toEqual('name');
        expect(response.body.lastName).toEqual('othername');
      });
  });
});
