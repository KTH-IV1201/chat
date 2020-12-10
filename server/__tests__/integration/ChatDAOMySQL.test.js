'use strict';

const mysql = require('mysql');
const ChatDAO = require('../../src/integration/ChatDAO');

let connection = null;
let chatDAO = null;
const username = 'stina';

beforeAll(async () => {
  connection = await connectToChatDb();
  await clearDb();
});

beforeEach(async () => {
  chatDAO = new ChatDAO();
  await forSomeReasonJestDoesNotWaitForCompletionThereforeWait();
  await chatDAO.createTables();
  await createUser();
});

afterEach(async () => {
  await clearDb();
});

afterAll(async () => {
  await clearDb();
  await connection.destroy();
});

describe('tests for findUserByUsername', () => {
  test('existing user', async () => {
    const users = await chatDAO.findUserByUsername(username);
    expect(users[0].username).toBe(username);
  });
});

const forSomeReasonJestDoesNotWaitForCompletionThereforeWait = async () => {
  await sleep(100);
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const connectToChatDb = async () => {
  const result = require('dotenv-safe').config();

  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
  await connection.connect((err) => {
    if (err) {
      throw err;
    }
  });
  return connection;
};

const clearDb = async () => {
  let sql = 'drop table if exists msgs';
  await connection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
  });
  sql = 'drop table if exists users';
  await connection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
  });
};

const createUser = async () => {
  const sql =
    'insert into users (userName, createdAt, updatedAt) ' +
    'values(\'' +
    username +
    '\', \'2019-07-02 15:21\', \'2019-07-02 15:21\')';
  await connection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
  });
};
