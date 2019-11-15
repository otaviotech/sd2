const { expect } = require('chai');
const { utils: { createParseIncludesFn }, models } = require('../../../../../../src/infra/database/sequelize');
const AutorSequelizeRepository = require('../../../../../../src/infra/database/sequelize/repositories/autor.repository');
const AutorSequelizeModel = require('../../../../../../src/infra/database/sequelize/models/autor.model');

describe('Infra :: Database :: Sequelize :: Repositories :: AutorSequelizeRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new AutorSequelizeRepository({
      AutorSequelizeModel,
      ParseSequelizeIncludes: createParseIncludesFn(models),
    });
  });

  describe('#findAll', () => {
    beforeEach(() => AutorSequelizeModel.bulkCreate([
      { nome: 'Autor 1' },
      { nome: 'Autor 2' },
    ]));

    it('Deve retornar todos os autores do banco', async () => {
      const autores = await repository.findAll();

      expect(autores).to.have.lengthOf(2);

      expect(autores[0]).to.be.instanceOf(AutorSequelizeModel);
      expect(autores[0].nome).to.equal('Autor 1');

      expect(autores[1]).to.be.instanceOf(AutorSequelizeModel);
      expect(autores[1].nome).to.equal('Autor 2');
    });
  });

  describe('#create', () => {
    beforeEach(() => Promise.all([
      models.Livro.bulkCreate([
        { titulo: 'Livro 1' },
        { titulo: 'Livro 2' },
        { titulo: 'Livro 3' },
      ]),
    ]));

    it('Deve criar autores no banco', async () => {
      await Promise.all([
        await repository.create({ nome: 'Autor 1' }),
        await repository.create({ nome: 'Autor 2' }),
      ]);

      const autores = await AutorSequelizeModel.findAll();

      expect(autores).to.have.lengthOf(2);

      expect(autores[0]).to.be.instanceOf(AutorSequelizeModel);
      expect(autores[0].nome).to.equal('Autor 1');

      expect(autores[1]).to.be.instanceOf(AutorSequelizeModel);
      expect(autores[1].nome).to.equal('Autor 2');
    });

    it('Deve criar autores no banco e incluir seus livros', async () => {
      await Promise.all([
        await repository.create({ nome: 'Autor 1', livros: [1] }),
        await repository.create({ nome: 'Autor 2', livros: [{ id: 2 }] }),
      ]);

      const autores = await AutorSequelizeModel.findAll({ include: [{ model: models.Livro }] });

      expect(autores).to.have.lengthOf(2);

      expect(autores[0]).to.be.instanceOf(AutorSequelizeModel);
      expect(autores[0].nome).to.equal('Autor 1');
      expect(autores[0].livros).to.have.lengthOf(1);
      expect(autores[0].livros[0].titulo).to.equal('Livro 1');

      expect(autores[1]).to.be.instanceOf(AutorSequelizeModel);
      expect(autores[1].nome).to.equal('Autor 2');
      expect(autores[1].livros).to.have.lengthOf(1);
      expect(autores[1].livros[0].titulo).to.equal('Livro 2');
    });

    it('Deve atualizar autores no banco', async () => {
      await Promise.all([
        await repository.create({ nome: 'Autor 1', livros: [1] }),
        await repository.create({ nome: 'Autor 2', livros: [{ id: 2 }] }),
        await repository.create({ nome: 'Autor 3' }),
      ]);

      const autor1 = {
        id: 1,
        livros: [],
      };

      const autor2 = {
        id: 2,
        livros: [{ id: 3 }],
      };

      const autor3 = {
        id: 3,
        livros: [1, { id: 2 }],
      };

      await repository.update(autor1);
      await repository.update(autor2);
      await repository.update(autor3);

      const [dbAutor1, dbAutor2, dbAutor3] = await Promise.all([1, 2, 3].map((autorId) => AutorSequelizeModel.findByPk(autorId)));
      const [dbAutor1Livros, dbAutor2Livros, dbAutor3Livros] = await Promise.all([
        dbAutor1, dbAutor2, dbAutor3,
      ].map((dbAutor) => dbAutor.getLivros()));

      expect(dbAutor1).to.be.instanceOf(AutorSequelizeModel);
      expect(dbAutor1.nome).to.be.equal('Autor 1');
      expect(dbAutor1Livros).to.have.lengthOf(0);

      expect(dbAutor2).to.be.instanceOf(AutorSequelizeModel);
      expect(dbAutor2.nome).to.be.equal('Autor 2');
      expect(dbAutor2Livros).to.have.lengthOf(1);
      expect(dbAutor2Livros[0].id).to.be.equal(3);

      expect(dbAutor3).to.be.instanceOf(AutorSequelizeModel);
      expect(dbAutor3.nome).to.be.equal('Autor 3');
      expect(dbAutor3Livros).to.have.lengthOf(2);
      expect(dbAutor3Livros[0].id).to.be.equal(1);
      expect(dbAutor3Livros[1].id).to.be.equal(2);
    });
  });

  describe('#remove', () => {
    beforeEach(() => AutorSequelizeModel.bulkCreate([
      { nome: 'Autor 1' },
      { nome: 'Autor 2' },
    ]));

    it('Deve excluir autores do banco', async () => {
      await repository.remove(1);

      const autores = await AutorSequelizeModel.findAll();

      expect(autores).to.have.lengthOf(1);

      expect(autores[0]).to.be.instanceOf(AutorSequelizeModel);
      expect(autores[0].nome).to.equal('Autor 2');
    });
  });
});
