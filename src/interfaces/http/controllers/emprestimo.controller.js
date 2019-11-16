const { Router } = require('express');
const HttpStatus = require('http-status');

class EmprestimoHttpController {
  constructor({ EmprestimoSequelizeRepository, logger }) {
    this.BASE_PATH = '/emprestimos';
    this.EmprestimoSequelizeRepository = EmprestimoSequelizeRepository;
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
    const emprestimoToCreate = req.body;

    try {
      const newEmprestimo = await this.EmprestimoSequelizeRepository.create(emprestimoToCreate);
      return res
        .status(HttpStatus.OK)
        .json(newEmprestimo);
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
      const emprestimos = await this.EmprestimoSequelizeRepository.findAll({
        filters: req.query,
        includes: ['livros'],
      });
      return res
        .status(HttpStatus.OK)
        .json({
          status: HttpStatus.OK,
          data: emprestimos,
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
      const emprestimo = await this.EmprestimoSequelizeRepository.findById(req.params.id);
      return res
        .status(HttpStatus.OK)
        .json({
          status: HttpStatus.OK,
          data: emprestimo,
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
      const deleted = await this.EmprestimoSequelizeRepository.remove(req.params.id);
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
    const emprestimoToUpdate = req.body;

    try {
      const updatedEmprestimo = await this.EmprestimoSequelizeRepository.update(emprestimoToUpdate);
      return res
        .status(HttpStatus.OK)
        .json(updatedEmprestimo);
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

module.exports = EmprestimoHttpController;
