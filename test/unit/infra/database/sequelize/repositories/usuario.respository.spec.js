const { expect } = require('chai');
const {
  utils: { createParseIncludesFn },
  models,
} = require('../../../../../../src/infra/database/sequelize');
const UsuarioSequelizeRepository = require('../../../../../../src/infra/database/sequelize/repositories/usuario.repository');
const UsuarioSequelizeModel = require('../../../../../../src/infra/database/sequelize/models/usuario.model');

describe('Infra :: Database :: Sequelize :: Repositories :: UsuarioSequelizeRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new UsuarioSequelizeRepository({
      UsuarioSequelizeModel,
      ParseSequelizeIncludes: createParseIncludesFn(models),
    });
  });

  describe('.findAll', () => {
    beforeEach(() => UsuarioSequelizeModel.bulkCreate([
      {
        nome: 'Usuario 1',
        telefone: '123',
        email: 'usuario1@email.com',
        senha: '123',
      },
      {
        nome: 'Usuario 2',
        telefone: '456',
        email: 'usuario2@email.com',
        senha: '456',
      },
    ]));

    it('Deve retornar todos os usuarios do banco', async () => {
      const usuarios = await repository.findAll();

      expect(usuarios).to.have.lengthOf(2);

      expect(usuarios[0]).to.be.instanceOf(UsuarioSequelizeModel);
      expect(usuarios[0].nome).to.equal('Usuario 1');

      expect(usuarios[1]).to.be.instanceOf(UsuarioSequelizeModel);
      expect(usuarios[1].nome).to.equal('Usuario 2');
    });
  });

  describe(".findAll({ nome: 'Usuario 1'})", () => {
    beforeEach(() => UsuarioSequelizeModel.bulkCreate([
      {
        nome: 'Usuario 1',
        telefone: '123',
        email: 'usuario1@email.com',
        senha: '123',
      },
      {
        nome: 'Usuario 2',
        telefone: '456',
        email: 'usuario2@email.com',
        senha: '456',
      },
    ]));

    it('Deve retornar apenas os usuarios que batem com os parâmetros passados', async () => {
      const usuarios = await repository.findAll({
        filters: { nome: 'Usuario 1' },
      });

      expect(usuarios).to.have.lengthOf(1);
      expect(usuarios[0]).to.be.instanceOf(UsuarioSequelizeModel);
      expect(usuarios[0].nome).to.equal('Usuario 1');
    });
  });

  describe('.findAll({ id: 1 })', () => {
    beforeEach(() => UsuarioSequelizeModel.bulkCreate([
      {
        nome: 'Usuario 1',
        telefone: '123',
        email: 'usuario1@email.com',
        senha: '123',
      },
      {
        nome: 'Usuario 2',
        telefone: '456',
        email: 'usuario2@email.com',
        senha: '456',
      },
    ]));

    it('Deve retornar apenas os usuarios que batem com os parâmetros passados', async () => {
      const usuarios = await repository.findAll({ filters: { id: 1 } });

      expect(usuarios).to.have.lengthOf(1);
      expect(usuarios[0]).to.be.instanceOf(UsuarioSequelizeModel);
      expect(usuarios[0].nome).to.equal('Usuario 1');
      expect(usuarios[0].id).to.equal(1);
    });
  });

  describe(".findAll({ id: 1, nome: 'Usuario 1' })", () => {
    beforeEach(() => UsuarioSequelizeModel.bulkCreate([
      {
        nome: 'Usuario 1',
        telefone: '123',
        email: 'usuario1@email.com',
        senha: '123',
      },
      {
        nome: 'Usuario 2',
        telefone: '456',
        email: 'usuario2@email.com',
        senha: '456',
      },
    ]));

    it('Deve retornar apenas os usuarios que batem com os parâmetros passados', async () => {
      const usuarios = await repository.findAll({
        filters: { id: 1, nome: 'Usuario 1' },
      });

      expect(usuarios).to.have.lengthOf(1);
      expect(usuarios[0]).to.be.instanceOf(UsuarioSequelizeModel);
      expect(usuarios[0].nome).to.equal('Usuario 1');
      expect(usuarios[0].id).to.equal(1);
    });
  });

  describe(".findAll({ id: 1, nome: 'Usuario 1', telefone: '123' })", () => {
    beforeEach(() => UsuarioSequelizeModel.bulkCreate([
      {
        nome: 'Usuario 1',
        telefone: '123',
        email: 'usuario1@email.com',
        senha: '123',
      },
      {
        nome: 'Usuario 2',
        telefone: '456',
        email: 'usuario2@email.com',
        senha: '456',
      },
    ]));

    it('Deve retornar apenas os usuarios que batem com os parâmetros passados', async () => {
      const usuarios = await repository.findAll({
        filters: { id: 1, nome: 'Usuario 1', telefone: '123' },
      });

      expect(usuarios).to.have.lengthOf(1);
      expect(usuarios[0]).to.be.instanceOf(UsuarioSequelizeModel);
      expect(usuarios[0].nome).to.equal('Usuario 1');
      expect(usuarios[0].telefone).to.equal('123');
      expect(usuarios[0].id).to.equal(1);
    });
  });

  describe('.create', () => {
    it('Deve criar usuarios no banco', async () => {
      await Promise.all([
        await repository.create({
          nome: 'Usuario 1',
          telefone: '123',
          email: 'usuario1@email.com',
          senha: '123',
        }),
        await repository.create({
          nome: 'Usuario 2',
          telefone: '456',
          email: 'usuario2@email.com',
          senha: '456',
        }),
      ]);

      const usuarios = await UsuarioSequelizeModel.findAll();

      expect(usuarios).to.have.lengthOf(2);

      expect(usuarios[0]).to.be.instanceOf(UsuarioSequelizeModel);
      expect(usuarios[0].nome).to.equal('Usuario 1');
      expect(usuarios[0].telefone).to.equal('123');
      expect(usuarios[0].email).to.equal('usuario1@email.com');
      expect(usuarios[0].senha).to.equal('123');

      expect(usuarios[1]).to.be.instanceOf(UsuarioSequelizeModel);
      expect(usuarios[1].nome).to.equal('Usuario 2');
      expect(usuarios[1].telefone).to.equal('456');
      expect(usuarios[1].email).to.equal('usuario2@email.com');
      expect(usuarios[1].senha).to.equal('456');
    });
  });

  describe('.update', () => {
    beforeEach(() => UsuarioSequelizeModel.bulkCreate([
      {
        nome: 'Usuario 1',
        telefone: '123',
        email: 'usuario1@email.com',
        senha: '123',
      },
      {
        nome: 'Usuario 2',
        telefone: '456',
        email: 'usuario2@email.com',
        senha: '456',
      },
      {
        nome: 'Usuario 3',
        telefone: '789',
        email: 'usuario3@email.com',
        senha: '789',
      },
    ]));

    it('Deve atualizar usuarios no banco', async () => {
      const usuario1 = {
        id: 1,
        nome: 'Usuario 1 atualizado',
        telefone: '123 atualizado',
        email: 'usuario1@email.com atualizado',
        senha: '123 atualizado',
      };

      const usuario2 = {
        id: 2,
        nome: 'Usuario 2 atualizado',
        telefone: '456 atualizado',
        email: 'usuario2@email.com atualizado',
        senha: '456 atualizado',
      };

      const usuario3 = {
        id: 3,
        nome: 'Usuario 3 atualizado',
        telefone: '789 atualizado',
        email: 'usuario3@email.com atualizado',
        senha: '789 atualizado',
      };

      await repository.update(usuario1);
      await repository.update(usuario2);
      await repository.update(usuario3);

      const [dbUsuario1, dbUsuario2, dbUsuario3] = await Promise.all(
        [1, 2, 3].map((usuarioId) => UsuarioSequelizeModel.findByPk(usuarioId)),
      );

      const usuarios = [usuario1, usuario2, usuario3];

      [dbUsuario1, dbUsuario2, dbUsuario3].forEach((usuario, i) => {
        expect(usuario).to.be.instanceOf(UsuarioSequelizeModel);
        expect(usuario.nome).to.be.equal(usuarios[i].nome);
        expect(usuario.telefone).to.be.equal(usuarios[i].telefone);
        expect(usuario.email).to.be.equal(usuarios[i].email);
        expect(usuario.senha).to.be.equal(usuarios[i].senha);
      });
    });
  });

  describe('.remove(1)', () => {
    beforeEach(() => UsuarioSequelizeModel.bulkCreate([
      {
        nome: 'Usuario 1',
        telefone: '123',
        email: 'usuario1@email.com',
        senha: '123',
      },
      {
        nome: 'Usuario 2',
        telefone: '456',
        email: 'usuario2@email.com',
        senha: '456',
      },
    ]));

    it('Deve excluir usuarios do banco', async () => {
      await repository.remove(1);

      const usuarios = await UsuarioSequelizeModel.findAll();

      expect(usuarios).to.have.lengthOf(1);

      expect(usuarios[0]).to.be.instanceOf(UsuarioSequelizeModel);
      expect(usuarios[0].nome).to.equal('Usuario 2');
    });
  });

  describe('.remove({ id: 1 })', () => {
    beforeEach(() => UsuarioSequelizeModel.bulkCreate([
      {
        nome: 'Usuario 1',
        telefone: '123',
        email: 'usuario1@email.com',
        senha: '123',
      },
      {
        nome: 'Usuario 2',
        telefone: '456',
        email: 'usuario2@email.com',
        senha: '456',
      },
    ]));

    it('Deve excluir usuarios do banco', async () => {
      await repository.remove({ id: 1 });

      const usuarios = await UsuarioSequelizeModel.findAll();

      expect(usuarios).to.have.lengthOf(1);

      expect(usuarios[0]).to.be.instanceOf(UsuarioSequelizeModel);
      expect(usuarios[0].nome).to.equal('Usuario 2');
    });
  });
});
