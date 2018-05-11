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

1. A POST to /signup
    - A post to /signup with a username, password, and email will be sent to the server. The password is immediately hashed and deleted, and an authentication token is generated and sent back to the user. The user's account is saved into the database with the password hash and current token seed.

2. A GET from /login
    - A get request with a username and password will authenticate and return the user a token.

3. A POST to /profile
    - This post request allows an authenticated user to create a new profile which is saved to the database and returned to the user.

4. A GET from /profile/:id
    - This get request allows an authenticated user to retrieve their profile.

5. A POST to /images
    - A post request from an authenticated user will post a new image to the database and also upload it to AWS.

6. A GET from /images/:id
    - A get request with an image id will allow the user to find the desired image.

7. A DELETE from /images/:id
    - This delete request allows the user to delete an image from the database and from AWS.