const { Router } = require('express');
const HttpStatus = require('http-status');

class AutorHttpController {
  constructor({ AutorSequelizeRepository, logger }) {
    this.BASE_PATH = '/autores';
    this.AutorSequelizeRepository = AutorSequelizeRepository;
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
    const autorToCreate = req.body;

    try {
      const newAutor = await this.AutorSequelizeRepository.create(autorToCreate);
      return res
        .status(HttpStatus.OK)
        .json(newAutor);
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
      const autores = await this.AutorSequelizeRepository.findAll({ filters: req.query, includes: ['livros'] });
      return res
        .status(HttpStatus.OK)
        .json({
          status: HttpStatus.OK,
          data: autores,
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
      const autor = await this.AutorSequelizeRepository.findById(req.params.id);
      return res
        .status(HttpStatus.OK)
        .json({
          status: HttpStatus.OK,
          data: autor,
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
      const deleted = await this.AutorSequelizeRepository.remove(req.params.id);
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
    const autorToUpdate = req.body;

    try {
      const updatedAutor = await this.AutorSequelizeRepository.update(autorToUpdate);
      return res
        .status(HttpStatus.OK)
        .json(updatedAutor);
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

module.exports = AutorHttpController;
