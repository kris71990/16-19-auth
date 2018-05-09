'use strict';

import faker from 'faker';
import Profile from '../../model/profile';
import { createAccountMock, removeAccountMock } from './account-mock';

const createProfileMock = () => {
  const resultMock = {};
  return createAccountMock()
    .then((accountMock) => {
      resultMock.accountMock = accountMock;

      return new Profile({
        bio: faker.lorem.words(5),
        avatar: faker.random.image(),
        lastName: faker.name.lastName(),
        firstName: faker.name.firstName(),
        account: accountMock.account._id,
      }).save();
    })
    .then((profile) => {
      resultMock.profile = profile;
      return resultMock;
    });
};

const removeProfileMock = () => {
  return Promise.all([
    Profile.remove({}),
    removeAccountMock(),
  ]);
};

export { createProfileMock, removeProfileMock };
