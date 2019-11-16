class EmprestimoSequelizeRepository {
  constructor({ EmprestimoSequelizeModel, ParseSequelizeIncludes }) {
    this.EmprestimoSequelizeModel = EmprestimoSequelizeModel;
    this.ParseSequelizeIncludes = ParseSequelizeIncludes;
  }

  findById(id) {
    return this.EmprestimoSequelizeModel.findByPk(id, { raw: true });
  }

  findAll({ filters = {}, includes = [] } = {}) {
    const include = this.ParseSequelizeIncludes(includes);

    const where = {};

    Object.keys(filters).forEach((f) => { where[f] = filters[f]; });

    return this.EmprestimoSequelizeModel.findAll({
      where,
      include,
    });
  }

  async create(emprestimo) {
    const dbEmprestimo = await this.EmprestimoSequelizeModel.create(emprestimo);

    if (emprestimo.livros) {
      const livros = emprestimo.livros.map((livro) => (typeof livro === 'number' ? livro : livro.id));
      await dbEmprestimo.addLivros(livros);
    }

    return dbEmprestimo.dataValues;
  }

  remove(mixed) {
    const id = (typeof mixed === 'number')
      ? mixed
      : mixed.id;

    return this.EmprestimoSequelizeModel.destroy({
      where: { id },
    });
  }

  async update(emprestimo) {
    const dbEmprestimo = await this.EmprestimoSequelizeModel.findByPk(emprestimo.id);

    emprestimo.usuarioId && (dbEmprestimo.usuarioId = emprestimo.usuarioId); // eslint-disable-line
    emprestimo.dataInicio && (dbEmprestimo.dataInicio = emprestimo.dataInicio); // eslint-disable-line
    emprestimo.dataFim && (dbEmprestimo.dataFim = emprestimo.dataFim); // eslint-disable-line
    emprestimo.dataDevolucao && (dbEmprestimo.dataDevolucao = emprestimo.dataDevolucao); // eslint-disable-line

    if (emprestimo.livros) {
      const livros = emprestimo.livros.map((livro) => (typeof livro === 'number' ? livro : livro.id));
      await dbEmprestimo.setLivros(livros);
    }

    await dbEmprestimo.save();

    return dbEmprestimo.dataValues;
  }
}

module.exports = EmprestimoSequelizeRepository;
