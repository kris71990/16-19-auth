'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jsonWebToken from 'jsonwebtoken';
import HttpError from 'http-errors';

const HASH_ROUND_COUNT = 8;
const TOKEN_SEED_LENGTH = 128;

const accountSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String, 
    required: true,
  },
  tokenSeed: {
    type: String, 
    required: true,
    unique: true,
  },
});

function createToken() {
  this.tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  return this.save()
    .then((account) => {
      return jsonWebToken.sign({
        tokenSeed: account.tokenSeed,
      }, process.env.SECRET);
    })
    .catch(() => new HttpError(401, 'Error creating token'));
}

function verifyPassword(password) {
  return bcrypt.compare(password, this.passwordHash)
    .then((result) => {
      if (!result) {
        throw new HttpError(400, 'AUTH - incorrect data');
      }
      return this;
    });
}

accountSchema.methods.createToken = createToken;
accountSchema.methods.verifyPassword = verifyPassword;

const Account = mongoose.model('account', accountSchema);

Account.create = (username, email, password) => {
  return bcrypt.hash(password, HASH_ROUND_COUNT)
    .then((passwordHash) => {
      password = null; // eslint-disable-line
      const tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
      return new Account({
        username,
        email, 
        passwordHash,
        tokenSeed,
      }).save();
    });
};

export default Account;
