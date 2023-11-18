## Description

Simple backend application built with NestJS for a banking system.

Features:
    - Authentication with JWT
    - Authorization based on user role
    - Uses HTTPModule to communicate with 3rd parties

### Endpoints

GET     /health
POST    /v1/auth/register
POST    /v1/auth/login
POST    /v1/auth/logout
POST    /v1/auth/refresh

GET     /v1/rates/:currency (eg. usd)

GET     /v1/accounts
POST    /v1/accounts
GET     /v1/accounts/:id
PATCH   /v1/accounts/:id

GET     /v1/accounts/:id/transactions

POST    /v1/accounts/:id/deposit
POST    /v1/accounts/:id/withdraw
POST    /v1/accounts/:id/transfer

GET     /v1/users/profile
get     /v1/users/profile/accounts
PATCH   /v1/users/profile

users

## Installation

```bash
$ yarn install
```

## Setup

Copy the contents of `.env.example` file to new `.env` file in the root directory of the project.

```bash
yarn db:dev:up
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

```

## Notes

- The app should be available on http://localhost:3000
- Swagger documentation on http://localhost:3000/api

