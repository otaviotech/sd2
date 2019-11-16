const HttpStatus = require('http-status');

/* istanbul ignore next */
module.exports = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      status: HttpStatus.UNAUTHORIZED,
      type: err.name,
      message: 'Invalid token.',
    });
  }

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: 'InternalServerError',
    message: 'Erro ao processar requisição.',
  });
};
