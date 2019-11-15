const { Router } = require('express');
const HttpStatus = require('http-status');

class LivroHttpController {
  constructor({ LivroSequelizeRepository, logger }) {
    this.BASE_PATH = '/livros';
    this.LivroSequelizeRepository = LivroSequelizeRepository;
    this.logger = logger;
  }

  get Router() {
    const router = new Router();
    router.get('/', this.findAll.bind(this));
    router.get('/:id', this.remove.bind(this));
    router.post('/', this.create.bind(this));
    router.delete('/:id', this.remove.bind(this));
    return router;
  }

  async create(req, res) {
    const livroToCreate = req.body;

    try {
      const newLivro = await this.LivroSequelizeRepository.create(livroToCreate);
      return res
        .status(HttpStatus.OK)
        .json(newLivro);
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
      const livros = await this.LivroSequelizeRepository.findAll();
      return res
        .status(HttpStatus.OK)
        .json({
          status: HttpStatus.OK,
          data: livros,
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
      const livro = await this.LivroSequelizeRepository.findById(req.params.id);
      return res
        .status(HttpStatus.OK)
        .json({
          status: HttpStatus.OK,
          data: livro,
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
      const deleted = await this.LivroSequelizeRepository.remove(req.params.id);
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
    const livroToUpdate = req.body;

    try {
      const updatedLivro = await this.LivroSequelizeRepository.update(livroToUpdate);
      return res
        .status(HttpStatus.OK)
        .json(updatedLivro);
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

module.exports = LivroHttpController;
