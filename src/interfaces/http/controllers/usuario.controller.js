const { Router } = require('express');
const HttpStatus = require('http-status');

class UsuarioHttpController {
  constructor({ UsuarioSequelizeRepository, logger }) {
    this.BASE_PATH = '/usuarios';
    this.UsuarioSequelizeRepository = UsuarioSequelizeRepository;
    this.logger = logger;
  }

  get Router() {
    const router = new Router();
    router.get('/', this.findAll.bind(this));
    router.get('/:id', this.remove.bind(this));
    router.post('/', this.create.bind(this));
    router.put('/:id', this.update.bind(this));
    router.delete('/:id', this.remove.bind(this));
    return router;
  }

  async create(req, res) {
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
      const usuarios = await this.UsuarioSequelizeRepository.findAll({
        filters: req.query,
        includes: ['emprestimos.livros'],
      });
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

  async get(req, res) {
    try {
      const usuario = await this.UsuarioSequelizeRepository.findById(req.params.id);
      return res
        .status(HttpStatus.OK)
        .json({
          status: HttpStatus.OK,
          data: usuario,
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

  async remove(req, res) {
    try {
      const deleted = await this.UsuarioSequelizeRepository.remove(Number(req.params.id));
      return res
        .status(HttpStatus.OK)
        .json({
          status: HttpStatus.OK,
          data: deleted,
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

  async update(req, res) {
    const usuarioToUpdate = req.body;

    try {
      const updatedUsuario = await this.UsuarioSequelizeRepository.update(usuarioToUpdate);
      return res
        .status(HttpStatus.OK)
        .json(updatedUsuario);
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
