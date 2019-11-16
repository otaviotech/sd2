const { expect } = require('chai');
const {
  utils: { createParseIncludesFn },
  models,
} = require('../../../../../../src/infra/database/sequelize');
const EmprestimoSequelizeRepository = require('../../../../../../src/infra/database/sequelize/repositories/emprestimo.repository');
const EmprestimoSequelizeModel = require('../../../../../../src/infra/database/sequelize/models/emprestimo.model');

describe('Infra :: Database :: Sequelize :: Repositories :: EmprestimoSequelizeRepository', () => {
  let repository;
  let usuarios = []; // eslint-disable-line
  let livros = []; // eslint-disable-line
  let emprestimos = [];

  const populate = async ({
    populateUsuarios = true,
    populateLivros = true,
    populateEmprestimos = true,
  } = {}) => {
    if (populateUsuarios) {
      usuarios = await models.Usuario.bulkCreate([
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
      ]);
    }

    if (populateLivros) {
      livros = await models.Livro.bulkCreate([
        { titulo: 'Livro 1' },
        { titulo: 'Livro 2' },
      ]);
    }

    if (populateEmprestimos) {
      emprestimos = await EmprestimoSequelizeModel.bulkCreate([
        { usuarioId: 1 },
        { usuarioId: 1 },
        { usuarioId: 2 },
      ]);

      if (populateLivros) {
        await Promise.all([
          emprestimos[0].setLivros([1, 2]),
          emprestimos[1].setLivros([1]),
        ]);
      }
    }
  };

  beforeEach(() => {
    repository = new EmprestimoSequelizeRepository({
      EmprestimoSequelizeModel,
      ParseSequelizeIncludes: createParseIncludesFn(models),
    });
  });

  describe('.findAll', () => {
    beforeEach(populate);

    it('Deve retornar todos os emprestimos do banco', async () => {
      const dbEmprestimos = await repository.findAll();
      expect(dbEmprestimos).to.have.lengthOf(3);
    });
  });

  describe('.findAll({ usuarioId: 1 })', () => {
    beforeEach(populate);

    it('Deve retornar apenas os emprestimos que batem com os parâmetros passados', async () => {
      const dbEmprestimos = await repository.findAll({
        filters: { usuarioId: 1 },
      });

      expect(dbEmprestimos).to.have.lengthOf(2);

      dbEmprestimos.forEach((emprestimo) => {
        expect(emprestimo).to.be.instanceOf(EmprestimoSequelizeModel);
        expect(emprestimo.usuarioId).to.equal(1);
      });
    });
  });

  describe('.findAll({ id: 1 })', () => {
    beforeEach(populate);

    it('Deve retornar apenas os emprestimos que batem com os parâmetros passados', async () => {
      const dbEmprestimos = await repository.findAll({ filters: { id: 1 } });

      expect(dbEmprestimos).to.have.lengthOf(1);
      expect(dbEmprestimos[0]).to.be.instanceOf(EmprestimoSequelizeModel);
      expect(dbEmprestimos[0].id).to.equal(1);
    });
  });

  describe('.create', () => {
    beforeEach(() => populate({ populateEmprestimos: false }));

    it('Deve criar emprestimos no banco', async () => {
      await Promise.all([
        await repository.create({ usuarioId: 1, livros: [1] }),
        await repository.create({ usuarioId: 2, livros: [1, { id: 2 }] }),
      ]);

      const dbEmprestimos = await EmprestimoSequelizeModel.findAll({
        include: { model: models.Livro },
      });

      expect(dbEmprestimos).to.have.lengthOf(2);

      expect(dbEmprestimos[0]).to.be.instanceOf(EmprestimoSequelizeModel);
      expect(dbEmprestimos[0].usuarioId).to.equal(1);
      expect(dbEmprestimos[0].livros).to.have.lengthOf(1);
      expect(dbEmprestimos[0].livros[0].id).to.equal(1);

      expect(dbEmprestimos[1]).to.be.instanceOf(EmprestimoSequelizeModel);
      expect(dbEmprestimos[1].usuarioId).to.equal(2);
      expect(dbEmprestimos[1].livros).to.have.lengthOf(2);
      expect(dbEmprestimos[1].livros[0].id).to.equal(1);
      expect(dbEmprestimos[1].livros[1].id).to.equal(2);
    });

    // it('Deve criar emprestimos no banco e incluir seus livros', async () => {
    //   await Promise.all([
    //     await repository.create({ nome: 'Emprestimo 1', livros: [1] }),
    //     await repository.create({ nome: 'Emprestimo 2', livros: [{ id: 2 }] }),
    //   ]);

    //   const dbEmprestimos = await EmprestimoSequelizeModel.findAll({
    //     include: [{ model: models.Livro }],
    //   });

    //   expect(dbEmprestimos).to.have.lengthOf(2);

    //   expect(dbEmprestimos[0]).to.be.instanceOf(EmprestimoSequelizeModel);
    //   expect(dbEmprestimos[0].nome).to.equal('Emprestimo 1');
    //   expect(dbEmprestimos[0].livros).to.have.lengthOf(1);
    //   expect(dbEmprestimos[0].livros[0].titulo).to.equal('Livro 1');

    //   expect(dbEmprestimos[1]).to.be.instanceOf(EmprestimoSequelizeModel);
    //   expect(dbEmprestimos[1].nome).to.equal('Emprestimo 2');
    //   expect(dbEmprestimos[1].livros).to.have.lengthOf(1);
    //   expect(dbEmprestimos[1].livros[0].titulo).to.equal('Livro 2');
    // });
  });

  describe('.update', () => {
    beforeEach(populate);

    it('Deve atualizar emprestimos no banco, incluindo seus livros', async () => {
      const emprestimo1 = {
        id: 1,
        livros: [],
      };

      const emprestimo2 = {
        id: 2,
        livros: [{ id: 2 }],
      };

      const emprestimo3 = {
        id: 3,
        livros: [2, { id: 1 }],
      };

      await repository.update(emprestimo1);
      await repository.update(emprestimo2);
      await repository.update(emprestimo3);

      const [dbEmprestimo1, dbEmprestimo2, dbEmprestimo3] = await Promise.all(
        [1, 2, 3].map((emprestimoId) => EmprestimoSequelizeModel.findByPk(emprestimoId)),
      );
      const [
        dbEmprestimo1Livros,
        dbEmprestimo2Livros,
        dbEmprestimo3Livros,
      ] = await Promise.all(
        [dbEmprestimo1, dbEmprestimo2, dbEmprestimo3]
          .map((dbEmprestimo) => dbEmprestimo.getLivros()),
      );

      expect(dbEmprestimo1).to.be.instanceOf(EmprestimoSequelizeModel);
      expect(dbEmprestimo1Livros).to.have.lengthOf(0);

      expect(dbEmprestimo2).to.be.instanceOf(EmprestimoSequelizeModel);
      expect(dbEmprestimo2Livros).to.have.lengthOf(1);
      expect(dbEmprestimo2Livros[0].id).to.be.equal(2);

      expect(dbEmprestimo3).to.be.instanceOf(EmprestimoSequelizeModel);
      expect(dbEmprestimo3Livros).to.have.lengthOf(2);
      expect(dbEmprestimo3Livros[0].id).to.be.equal(1);
      expect(dbEmprestimo3Livros[1].id).to.be.equal(2);
    });
  });

  describe('.remove(1)', () => {
    beforeEach(populate);

    it('Deve excluir emprestimos do banco', async () => {
      await repository.remove(1);

      const dbEmprestimos = await EmprestimoSequelizeModel.findAll();

      expect(dbEmprestimos).to.have.lengthOf(2);

      expect(dbEmprestimos[0]).to.be.instanceOf(EmprestimoSequelizeModel);
      expect(dbEmprestimos[0].id).to.equal(2);
    });
  });

  describe('.remove({ id: 1 })', () => {
    beforeEach(populate);

    it('Deve excluir emprestimos do banco', async () => {
      await repository.remove({ id: 1 });

      const dbEmprestimos = await EmprestimoSequelizeModel.findAll();

      expect(dbEmprestimos).to.have.lengthOf(2);

      expect(dbEmprestimos[0]).to.be.instanceOf(EmprestimoSequelizeModel);
      expect(dbEmprestimos[0].id).to.equal(2);
    });
  });
});
