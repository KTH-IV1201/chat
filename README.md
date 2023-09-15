# The Chat Application

This is the chat sample application for IV1201. The purpose is to show usage of
JavaScript frameworks and tools.

## Tools

The following software development tools are used.

- Version control (Git)
- Project management (npm)
- Test (Jest and Supertest)
- Automatic restart (nodemon)
- Static analysis (ESLint)

## Frameworks

The following frameworks are used.

- express
- sequelize
- mariadb
- mysql
- jsonwebtoken
- body-parser
- cookie-parser
- dotenv-safe
- express-validator
- verror

## Installation

1. Install node.js
1. Clone this git repository
1. Only for Windows users:
   1. Change line 11 in `package.json` to`"start-dev": "SET NODE_ENV=development & nodemon src/server"`
   1. Change line 12 in `package.json` to`"start": "SET NODE_ENV=production & nodemon src/server"`
1. Install all required npm packages by giving the command `npm install` in the `server` directory.

## Start the Application

The repository contains only a REST api, no client. The API can be tried by using for example *insomnia*, [https://insomnia.rest/]

1. Copy the file `.env.example` to a file called `.env` and specify values for all settings.
1. Create the database. You do not have to create any tables in the database, they will be created by the application.
1. Start the application by giving the command `npm run start-dev` in the `server` directory.
1. Start insomnia
1. Import the file `insomnia-chat-api-requests.json`, which will populate insomnia with all requests that can be made to tha chat api.

## Execute Tests

The tests are started by giving the command `npm test` in the `server` directory.

## More Documentation

The file `js-rest-api.pdf` is a presentation that provides some background on REST apis, and covers most of the frameworks and apis used in the chat api.
