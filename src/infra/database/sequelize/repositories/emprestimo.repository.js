class EmprestimoSequelizeRepository {
  constructor({ EmprestimoSequelizeModel }) {
    this.EmprestimoSequelizeModel = EmprestimoSequelizeModel;
  }

  findById(id) {
    return this.EmprestimoSequelizeModel.findByPk(id, { raw: true });
  }

  findAll({ filters = {} }) {
    const where = {};

    filters.usuarioId && (where.usuarioId = filters.usuarioId); // eslint-disable-line

    return this.EmprestimoSequelizeModel.findAll({
      where,
      raw: true,
    });
  }

  async create(emprestimo) {
    const dbEmprestimo = await this.EmprestimoSequelizeModel.create(emprestimo);

    if (emprestimo.livros && emprestimo.livros.length) {
      const livros = emprestimo.livros.map((autor) => autor.id);
      await dbEmprestimo.addLivros(livros);
    }

    return dbEmprestimo.dataValues;
  }

  remove(id) {
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

    if (emprestimo.livros && emprestimo.livros.length) {
      const livros = emprestimo.livros.map((autor) => autor.id);
      await dbEmprestimo.addLivros(livros);
    }

    await dbEmprestimo.save();

    return dbEmprestimo.dataValues;
  }
}

module.exports = EmprestimoSequelizeRepository;
