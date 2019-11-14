const { Router } = require('express');
const HttpStatus = require('http-status');

class UsuarioHttpController {
  constructor({ UsuarioSequelizeRepository, logger }) {
    this.BASE_PATH = '/usuarios';
    this.UsuarioSequelizeRepository = UsuarioSequelizeRepository;
    // console.log(logger.debug);
    this.logger = logger;
  }

  get Router() {
    const router = new Router();
    router.get('/', this.findAll.bind(this));
    router.post('/', this.create.bind(this));
    return router;
  }

  async create(req, res) {
    this.logger.debug('Log4js working');
    const userToCreate = req.body;

    try {
      const newUser = await this.UsuarioSequelizeRepository.create(userToCreate);
      return res
        .status(HttpStatus.OK)
        .json(newUser);
    } catch (error) {
      this.logger.debug(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: process.env.NODE_ENV === 'production'
            ? 'Erro ao processar sua requisição.'
            : error,
        });
    }
  }

  async findAll(req, res) {
    try {
      const usuarios = await this.UsuarioSequelizeRepository.findAll();
      return res
        .status(HttpStatus.OK)
        .json({
          status: HttpStatus.OK,
          data: usuarios,
        });
    } catch (error) {
      this.logger.debug(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: process.env.NODE_ENV === 'production'
            ? 'Erro ao processar sua requisição.'
            : error,
        });
    }
  }
}

module.exports = UsuarioHttpController;
