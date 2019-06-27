const result = require('dotenv').config();
if (result.error) {
  throw result.error;
}

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/', (req, res) => {
  return res.send('Welcome to the API');
});

const reqHandlerLoader = require('./api');
reqHandlerLoader.loadHandlers(app);

const server = app.listen(process.env.SERVER_PORT, () => {
  console.log(`Running server on port ${server.address().port}`);
});
