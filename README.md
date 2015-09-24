# Polltogether

This is a fork of Polltogether app.

## What's new

* Uses mongoose
* User registration
* Poll management
* Small QOL features


## Getting Started

* Environment variable `JWT_PASS` must be set or the secret key for JSON web token defaults to 'pass'.
* Environment variable CONSUMER_KEY and CONSUMER_SECRET for twitter must be set.

.env file contains env var. run
```
source .env
```
to set the env var.

### Start app

```
npm install
bower install

gulp develop
```
