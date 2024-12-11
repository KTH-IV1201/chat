'use strict';

const pgp = require('pg-promise')();
const ChatDAO = require('../../src/integration/ChatDAO');

let db = null;
let chatDAO = null;
const username = 'stina';

beforeAll(async () => {
  db = await connectToChatDb();
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
  require('dotenv-safe').config();
  const db = pgp({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });
  return db;
};

const clearDb = async () => {
  await db.none('drop table if exists msgs');
  await db.none('drop table if exists users');
};

const createUser = async () => {
  const data = {
    username: username,
    createdAt: 'now()',
    updatedAt: 'now()',
  };
  await db.none(
      'insert into ${table:name} (${valuesToInsert:name}) values (${valuesToInsert:csv})',
      {valuesToInsert: data, table: 'users'}
  );
};
