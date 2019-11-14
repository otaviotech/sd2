const Status = require('http-status');

/* istanbul ignore next */
module.exports = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(Status.INTERNAL_SERVER_ERROR).json({
    status: Status.INTERNAL_SERVER_ERROR,
    type: 'InternalServerError',
    message: 'Erro ao processar requisição.',
  });
};
