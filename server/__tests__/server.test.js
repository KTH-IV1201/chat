const request = require('supertest');
const server = require('../src/server');

afterAll(async (done) => {
  await server.close();
  done();
});

describe('basic route tests', () => {
  test('get home route GET /', async () => {
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.text).toContain('Welcome');
  });
});
