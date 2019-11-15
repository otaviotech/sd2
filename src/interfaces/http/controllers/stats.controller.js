const { Router } = require('express');
const HttpStatus = require('http-status');

class StatsHttpController {
  constructor({ StatsSequelizeRepository, logger }) {
    this.BASE_PATH = '/stats';
    this.StatsSequelizeRepository = StatsSequelizeRepository;
    this.logger = logger;
  }

  get Router() {
    const router = new Router();
    router.get('/', this.getStats.bind(this));
    return router;
  }

  async getStats(req, res) {
    try {
      const stats = await this.StatsSequelizeRepository.getStats();
      return res
        .status(HttpStatus.OK)
        .json({
          status: HttpStatus.OK,
          data: stats,
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

module.exports = StatsHttpController;
