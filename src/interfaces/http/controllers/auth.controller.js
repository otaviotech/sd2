const { Router } = require('express');
const HttpStatus = require('http-status');
const jwt = require('jsonwebtoken');

class AuthHttpController {
  constructor({ UsuarioSequelizeRepository, logger }) {
    this.BASE_PATH = '/auth';
    this.UsuarioSequelizeRepository = UsuarioSequelizeRepository;
    this.logger = logger;
  }

  get Router() {
    const router = new Router();
    router.post('/login', this.login.bind(this));
    return router;
  }

  async login(req, res) {
    const { email, senha } = req.body;
    const credentials = { email, senha };

    try {
      if (!email || !senha) {
        throw new Error('Unauthorized');
      }

      const users = await this.UsuarioSequelizeRepository.findAll({ filters: credentials });
      const token = jwt.sign(users[0].dataValues, process.env.JWT_SECRET);
      return res
        .status(HttpStatus.OK)
        .json({ token, msg: 'With great power comes great responsibility.' });
    } catch (error) {
      this.logger.debug(error);
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({
          status: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized',
          data: 'Invalid credentials.',
        });
    }
  }
}

module.exports = AuthHttpController;
