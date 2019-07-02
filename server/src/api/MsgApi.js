'use strict';

const RequestHandler = require('./RequestHandler');
const Authorization = require('./auth/Authorization');

/**
 * Defines the REST API with endpoints related to messages.
 */
class MsgApi extends RequestHandler {
  /**
   * Constructs a new instance.
   */
  constructor() {
    super();
  }

  /**
   * @return {string} The URL paths handled by this request handler.
   */
  get path() {
    return '/msg';
  }

  /**
   * Registers the request handling functions.
   */
  async registerHandler() {
    try {
      await this.retrieveController();

      /*
       * Adds a new message to the conversation. The author will be set to the
       * username in the 'chatAuth' cookie.
       *
       * parameter msg: The chat message.
       * return 200: If the message was added.
       *        400: If the body did not contain a JSON-formatted property
       *             called 'msg'.
       *        401: If the user was not authenticated.
       */
      this.router.post('/', async (req, res, next) => {
        try {
          if (!(await Authorization.checkLogin(this.contr, req, res))) {
            return;
          }
          if (!req.body.msg) {
            return res.status(400).send('fields are missing');
          }
          const msg = await this.contr.addMsg(req.body.msg, req.user);
          res.status(200).send(msg);
        } catch (err) {
          next(err);
        }
      });

      /*
       * Deletes the specified message.
       *
       * parameter msgId The id of the message that shall be deleted.
       * return 204: If the message was deleted.
       *        401: If the user was not authenticated, or was not the author
       *             of the specified message.
       *        404: If the specified message did not exist.
       */
      this.router.delete('/:id', async (req, res, next) => {
        try {
          if (!(await Authorization.checkLogin(this.contr, req, res))) {
            return;
          }
          const msg = await this.contr.findMsg(parseInt(req.params.id, 10));
          if (msg === null) {
            res.status(404).send('No such message');
            return;
          }
          if (req.user.id !== msg.authorId) {
            res.status(401).send('Unauthorised user');
            return;
          }
          await this.contr.deleteMsg(parseInt(req.params.id, 10));
          res.status(204).end();
        } catch (err) {
          next(err);
        }
      });
    } catch (err) {
      this.logger.logException(err);
    }
  }
}

module.exports = MsgApi;
