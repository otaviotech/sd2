class LivroSequelizeRepository {
  constructor({ LivroSequelizeModel, ParseSequelizeIncludes }) {
    this.LivroSequelizeModel = LivroSequelizeModel;
    this.ParseSequelizeIncludes = ParseSequelizeIncludes;
  }

  findById(id) {
    return this.LivroSequelizeModel.findByPk(id, { raw: true });
  }

  findAll({ filters = {}, includes = [], pagination } = {}) {
    const include = this.ParseSequelizeIncludes(includes);

    const where = {};

    Object.keys(filters).forEach((f) => { where[f] = Number(filters[f]) || filters[f]; });

    if (filters.autorId) {
      include.push({
        model: this.LivroSequelizeModel.sequelize.models.autor,
        where: { id: filters.autorId },
      });

      delete where.autorId;
    }

    return this.LivroSequelizeModel.findAll({
      include,
      where,
    });
  }

  async create(livro) {
    const dbLivro = await this.LivroSequelizeModel.create(livro);

    if (livro.autores && livro.autores.length) {
      const autores = livro.autores.map((autor) => (typeof autor === 'number' ? autor : autor.id));
      await dbLivro.addAutores(autores);
    }

    return dbLivro.dataValues;
  }

  remove(mixed) {
    const id = (typeof mixed === 'number')
      ? mixed
      : mixed.id;

    return this.LivroSequelizeModel.destroy({
      where: { id },
    });
  }

  async update(livro) {
    const dbLivro = await this.LivroSequelizeModel.findByPk(livro.id);

    livro.titulo && (dbLivro.titulo = livro.titulo); // eslint-disable-line
    livro.foto && (dbLivro.foto = livro.foto); // eslint-disable-line
    typeof livro.quantidade === 'number' && (dbLivro.quantidade = livro.quantidade); // eslint-disable-line

    if (livro.autores && livro.autores.length) {
      const autores = livro.autores.map((autor) => (typeof autor === 'number' ? autor : autor.id));
      await dbLivro.setAutores(autores);
    }

    await dbLivro.save();

    return dbLivro.dataValues;
  }
}

module.exports = LivroSequelizeRepository;
