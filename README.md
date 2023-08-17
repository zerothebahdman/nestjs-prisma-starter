# Nestjs Prisma Starter <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" height="28px" alt="Nest Logo"/></a>

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

This project contains boilerplate for creating APIs using [Nest](https://nestjs.com), a progressive [Node.js](http://nodejs.org) framework for building efficient and scalable server-side applications.

It is mostly built to be used as a starting point and implements common operations such as sign up, JWT authentication, mail validation, model validation and database access.

## Features

1. **PostgreSQL with Prisma**

2. **JWT Authentication**

3. **Mail Verification**

4. **Mail Change**

5. **Password Reset**

6. **Request Validation**

7. **Customizable Mail Templates**

8. **Swagger API Documentation**

9. **Security Techniques**

10. **Logger**

## Getting Started

### Installation

1. Make sure that you have [Node.js](https://nodejs.org)(>= 10.13.0, except for v13) installed.
2. Clone this repository by running `git clone https://github.com/zerothebahdman/nestjs-prisma-starter.git` or [directly create your own GitHub repository using this template](https://github.com/ahmetuysal/nestjs-prisma-starter/generate).
3. Move to the appropriate directory: `cd <YOUR_PROJECT_NAME>`.
4. Run `yarn` to install dependencies.

### Configuration Files

#### [Prisma](https://github.com/prisma/prisma) Configurations

This template uses Postgres by default. If you want to use another database, follow instructions in the [official Nest recipe on Prisma](https://docs.nestjs.com/recipes/prisma).

If you wish to use another database you will also have to edit the connection string on [`.env`](.env) file accordingly.

```bash
Your database url in the `.env` file should as follows

DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"

mydb : The name of the databse you created on your machine
johndoe : The username of the database
randompassword : The password of the database
```

#### [NodeMailer Configurations](https://github.com/nodemailer/nodemailer)

A delivery provider is required for sending mails with Nodemailer. I mostly use [MailTrap](https://mailtrap.io) to send mails, however, Nodemailer can work with any service with SMTP transport.

To get a MailTrap API key:

- Create a free account from [https://mailtrap.io/](https://mailtrap.io/)
- Confirm your account via the activation email and login.
- Create an API Key with mail sending capability.

Enter your API key and sender credentials to [`.env`](,/env) file. Sender credentials are the sender name and sender mail that will be seen by your users.

```js
MAIL_FROM=
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASSWORD=
```

### Migrations

Please refer to the official [Prisma Migrate Guide](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate) to get more info about Prisma migrations.

```bash
# generate migration for local environment
$ yarn migrate:dev:create
# run migrations in local environment
$ yarn migrate:dev

# deploy migration to prod environment
$ yarn migrate:deploy:prod
```

### Running the app

```bash
# development mode
$ yarn start:dev

# production
$ yarn build
$ yarn start:prod
```

### Running the tests

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Support Nest

Nest is an MIT-licensed open source project. If you'd like to join support Nest, please [read more here](https://docs.nestjs.com/support).

## License

Licenced under [MIT License](LICENSE). Nest is also MIT licensed.
