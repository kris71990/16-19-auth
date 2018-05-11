'use strict';

import faker from 'faker';
import { createAccountMock } from './account-mock';
import Image from '../../model/image';
import Account from '../../model/account';

const createImageMock = () => {
  const resultMock = {};
  return createAccountMock()
    .then((accountMockSet) => {
      resultMock.accountMock = accountMockSet;
      
      return new Image({
        title: faker.random.words(5),
        url: faker.random.image(),
        account: resultMock.accountMock.account._id,
      }).save();
    })
    .then((image) => {
      resultMock.image = image;
      return resultMock;
    });
};

const removeImageMock = () => Promise.all([Account.remove({}), Image.remove({})]);

export { createImageMock, removeImageMock };
