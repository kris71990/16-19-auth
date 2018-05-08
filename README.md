# Account Authentication

**Author** Kris Sakarias

**Version** 1.0.0 

## Overview
This is a server built with the web framework Express. It creates users, hashes their passwords and returns an authentication token that is sent to the client and allows the user access to the system. 

### Documentation
Starting the Server:

```
git clone https://github.com/kris71990/16-19-auth

npm i

mongod

npm run test
```

The tests test performance of these requests:

1. A POST request to /signup
    - A post to /signup with a username, password, and email will be sent to the server. The password is immediately hashed and deleted, and an authentication token is generated and sent back to the user. The user's account is saved into the database with the password hash and current token seed.
