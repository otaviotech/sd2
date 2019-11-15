class AutorSequelizeRepository {
  constructor({ AutorSequelizeModel, ParseSequelizeIncludes }) {
    this.AutorSequelizeModel = AutorSequelizeModel;
    this.ParseSequelizeIncludes = ParseSequelizeIncludes;
  }

  findById(id) {
    return this.AutorSequelizeModel.findByPk(id, { raw: true });
  }

  findAll({ filters = {}, includes = [], pagination } = {}) {
    const include = this.ParseSequelizeIncludes(includes);

    const where = {};

    Object.keys(filters).forEach((f) => { where[f] = filters[f]; });

    return this.AutorSequelizeModel.findAll({
      include,
      where,
    });
  }

  async create(autor) {
    const dbAutor = await this.AutorSequelizeModel.create(autor);

    if (autor.livros) {
      const livros = autor.livros.map((livro) => (typeof livro === 'number' ? livro : livro.id));
      await dbAutor.addLivros(livros);
    }
    return dbAutor.dataValues;
  }

  remove(id) {
    return this.AutorSequelizeModel.destroy({
      where: { id },
    });
  }

  async update(autor) {
    const dbAutor = await this.AutorSequelizeModel.findByPk(autor.id);

    autor.nome && (dbAutor.nome = autor.nome); // eslint-disable-line

    if (autor.livros) {
      const livrosIds = autor.livros.map((livro) => (typeof livro === 'number' ? livro : livro.id));
      dbAutor.setLivros(livrosIds);
    }

    await dbAutor.save();

    return dbAutor.dataValues;
  }
}

module.exports = AutorSequelizeRepository;
