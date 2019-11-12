class LivroSequelizeRepository {
  constructor({ LivroSequelizeModel }) {
    this.LivroSequelizeModel = LivroSequelizeModel;
  }

  findById(id) {
    return this.LivroSequelizeModel.findByPk(id, { raw: true });
  }

  findAll() {
    return this.LivroSequelizeModel.findAll({ raw: true });
  }

  async create(livro) {
    const dbLivro = await this.LivroSequelizeModel.create(livro);

    if (livro.autores && livro.autores.length) {
      const autores = livro.autores.map((autor) => autor.id);
      await dbLivro.addAutores(autores);
    }

    return dbLivro.dataValues;
  }

  remove(id) {
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
      const autores = livro.autores.map((autor) => autor.id);
      await dbLivro.setAutores(autores);
    }

    await dbLivro.save();

    return dbLivro.dataValues;
  }
}

module.exports = LivroSequelizeRepository;
