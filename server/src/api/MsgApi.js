'use strict';

const {check, validationResult} = require('express-validator');
const RequestHandler = require('./RequestHandler');
const Authorization = require('./auth/Authorization');
const UserApi = require('./UserApi');

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
       * return 200: The newly created message, if the message was added.
       *        400: If the body did not contain a JSON-formatted property
       *             called 'msg'.
       *        401: If the user was not authenticated.
       */
      this.router.post(
          '/',
          check('msg')
              .not()
              .isEmpty()
              .stripLow(true)
              .escape(),
          async (req, res, next) => {
            try {
              const errors = validationResult(req);
              if (!errors.isEmpty()) {
                this.sendHttpResponse(res, 400, errors.array());
                return;
              }

              if (
                !(await Authorization.checkLogin(
                    this.contr,
                    req,
                    res,
                    this.sendHttpResponse
                ))
              ) {
                return;
              }
              const msg = await this.contr.addMsg(req.body.msg, req.user);
              this.convertAuthorIdToUrl(msg);
              this.sendHttpResponse(res, 200, msg);
            } catch (err) {
              next(err);
            }
          }
      );

      /*
       * Deletes the specified message.
       *
       * parameter id The id of the message that shall be deleted.
       * return 204: If the message was deleted.
       *        401: If the user was not authenticated, or was not the author
       *             of the specified message.
       *        404: If the specified message did not exist.
       */
      this.router.delete(
          '/:id',
          check('id').isNumeric({no_symbols: true}),
          async (req, res, next) => {
            try {
              const errors = validationResult(req);
              if (!errors.isEmpty()) {
                this.sendHttpResponse(res, 400, errors.array());
                return;
              }

              if (
                !(await Authorization.checkLogin(
                    this.contr,
                    req,
                    res,
                    this.sendHttpResponse
                ))
              ) {
                return;
              }
              const msg = await this.contr.findMsg(parseInt(req.params.id, 10));
              if (msg === null) {
                this.sendHttpResponse(res, 404, 'No such message');
                return;
              }
              if (req.user.id !== msg.author.id) {
                this.sendHttpResponse(res, 401, 'Unauthorised user');
                return;
              }
              await this.contr.deleteMsg(parseInt(req.params.id, 10));
              this.sendHttpResponse(res, 204);
            } catch (err) {
              next(err);
            }
          }
      );

      /*
       * Reads all messages
       *
       * return 200: An array containing all messages, if messages were read.
       *        401: If the user was not authenticated.
       *        404: If there are no messages at all.
       */
      this.router.get('/', async (req, res, next) => {
        try {
          if (
            !(await Authorization.checkLogin(
                this.contr,
                req,
                res,
                this.sendHttpResponse
            ))
          ) {
            return;
          }
          const msgs = await this.contr.findAllMsgs();
          if (msgs.length === 0) {
            this.sendHttpResponse(res, 404, 'No messages');
            return;
          }
          for (const msg of msgs) {
            this.convertAuthorIdToUrl(msg);
          }
          this.sendHttpResponse(res, 200, msgs);
        } catch (err) {
          next(err);
        }
      });
    } catch (err) {
      this.logger.logException(err);
    }
  }

  // eslint-disable-next-line require-jsdoc
  convertAuthorIdToUrl(msg) {
    msg.author =
      RequestHandler.URL_PREFIX +
      process.env.SERVER_HOST +
      ':' +
      process.env.SERVER_PORT +
      UserApi.USER_API_PATH +
      '/' +
      msg.author.id;
  }
}

module.exports = MsgApi;
