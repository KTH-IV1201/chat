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
       */
      this.router.post('/', async (req, res, next) => {
        try {
          if (!await Authorization.checkLogin(this.contr, req, res)) {
            return;
          }
          if (!req.body.msg) {
            return res.status(400).send('fields are missing');
          }
          await this.contr.addMsg(req.body.msg, req.user);
          res.status(200).end();
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
