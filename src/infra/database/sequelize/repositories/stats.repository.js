class StatsSequelizeRepository {
  constructor({ UsuarioSequelizeModel, LivroSequelizeModel, AutorSequelizeModel }) {
    this.UsuarioSequelizeModel = UsuarioSequelizeModel;
    this.LivroSequelizeModel = LivroSequelizeModel;
    this.AutorSequelizeModel = AutorSequelizeModel;
  }

  async getStats() {
    const [usuarios, autores, livros] = await Promise.all([
      this.UsuarioSequelizeModel.count(),
      this.LivroSequelizeModel.count(),
      this.AutorSequelizeModel.count(),
    ]);

    return {
      usuarios,
      autores,
      livros,
    };
  }
}

module.exports = StatsSequelizeRepository;
