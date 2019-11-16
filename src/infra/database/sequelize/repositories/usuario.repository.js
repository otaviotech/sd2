class UsuarioSequelizeRepository {
  constructor({ UsuarioSequelizeModel, ParseSequelizeIncludes }) {
    this.UsuarioSequelizeModel = UsuarioSequelizeModel;
    this.ParseSequelizeIncludes = ParseSequelizeIncludes;
  }

  findById(id) {
    return this.UsuarioSequelizeModel.findByPk(id, { raw: true });
  }

  findAll({ filters = {}, includes = [], pagination } = {}) {
    const include = this.ParseSequelizeIncludes(includes);

    const where = {};

    Object.keys(filters).forEach((f) => { where[f] = filters[f]; });

    const usuarios = this.UsuarioSequelizeModel.findAll({
      include,
      where,
    });

    return usuarios;
  }

  async create(usuario) {
    const dbUsuario = await this.UsuarioSequelizeModel.create(usuario);
    return dbUsuario.dataValues;
  }

  remove(mixed = {}) {
    const id = (typeof mixed === 'number')
      ? mixed
      : mixed.id;

    return this.UsuarioSequelizeModel.destroy({
      where: { id },
    });
  }

  async update(usuario) {
    const dbUsuario = await this.UsuarioSequelizeModel.findByPk(usuario.id);

    usuario.nome && (dbUsuario.nome = usuario.nome); // eslint-disable-line
    usuario.telefone && (dbUsuario.telefone = usuario.telefone); // eslint-disable-line
    usuario.email && (dbUsuario.email = usuario.email); // eslint-disable-line
    usuario.senha && (dbUsuario.senha = usuario.senha); // eslint-disable-line

    await dbUsuario.save();

    return dbUsuario.dataValues;
  }
}

module.exports = UsuarioSequelizeRepository;
