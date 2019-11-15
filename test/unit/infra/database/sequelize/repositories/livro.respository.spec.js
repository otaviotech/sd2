const { expect } = require('chai');
const {
  utils: { createParseIncludesFn },
  models,
} = require('../../../../../../src/infra/database/sequelize');
const LivroSequelizeRepository = require('../../../../../../src/infra/database/sequelize/repositories/livro.repository');
const LivroSequelizeModel = require('../../../../../../src/infra/database/sequelize/models/livro.model');

describe('Infra :: Database :: Sequelize :: Repositories :: LivroSequelizeRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new LivroSequelizeRepository({
      LivroSequelizeModel,
      ParseSequelizeIncludes: createParseIncludesFn(models),
    });
  });

  describe('.findAll', () => {
    beforeEach(() => LivroSequelizeModel.bulkCreate([
      { titulo: 'Livro 1', quantidade: 3, foto: 'http://foto.com/foto.jpg' },
      { titulo: 'Livro 2', quantidade: 12, foto: 'http://foto.com/foto2.jpg' },
    ]));

    it('Deve retornar todos os livros do banco', async () => {
      const livros = await repository.findAll();

      expect(livros).to.have.lengthOf(2);

      expect(livros[0]).to.be.instanceOf(LivroSequelizeModel);
      expect(livros[0].titulo).to.equal('Livro 1');
      expect(livros[0].quantidade).to.equal(3);
      expect(livros[0].foto).to.equal('http://foto.com/foto.jpg');

      expect(livros[1]).to.be.instanceOf(LivroSequelizeModel);
      expect(livros[1].titulo).to.equal('Livro 2');
      expect(livros[1].quantidade).to.equal(12);
      expect(livros[1].foto).to.equal('http://foto.com/foto2.jpg');
    });
  });

  describe(".findAll({ titulo: 'Livro 1'})", () => {
    beforeEach(() => LivroSequelizeModel.bulkCreate([
      { titulo: 'Livro 1', quantidade: 3, foto: 'http://foto.com/foto.jpg' },
      { titulo: 'Livro 2', quantidade: 12, foto: 'http://foto.com/foto2.jpg' },
    ]));

    it('Deve retornar apenas os livros que batem com os parâmetros passados', async () => {
      const livros = await repository.findAll({
        filters: { titulo: 'Livro 1' },
      });

      expect(livros).to.have.lengthOf(1);
      expect(livros[0]).to.be.instanceOf(LivroSequelizeModel);
      expect(livros[0].id).to.equal(1);
      expect(livros[0].titulo).to.equal('Livro 1');
      expect(livros[0].quantidade).to.equal(3);
    });
  });

  describe('.findAll({ id: 1 })', () => {
    beforeEach(() => LivroSequelizeModel.bulkCreate([
      { titulo: 'Livro 1', quantidade: 3, foto: 'http://foto.com/foto.jpg' },
      { titulo: 'Livro 2', quantidade: 12, foto: 'http://foto.com/foto2.jpg' },
    ]));

    it('Deve retornar apenas os livros que batem com os parâmetros passados', async () => {
      const livros = await repository.findAll({ filters: { id: 1 } });

      expect(livros).to.have.lengthOf(1);
      expect(livros[0]).to.be.instanceOf(LivroSequelizeModel);
      expect(livros[0].id).to.equal(1);
      expect(livros[0].titulo).to.equal('Livro 1');
      expect(livros[0].quantidade).to.equal(3);
    });
  });

  describe(".findAll({ id: 1, titulo: 'Livro 1' })", () => {
    beforeEach(() => LivroSequelizeModel.bulkCreate([
      { titulo: 'Livro 1', quantidade: 3, foto: 'http://foto.com/foto.jpg' },
      { titulo: 'Livro 2', quantidade: 12, foto: 'http://foto.com/foto2.jpg' },
    ]));

    it('Deve retornar apenas os livros que batem com os parâmetros passados', async () => {
      const livros = await repository.findAll({
        filters: { id: 1, titulo: 'Livro 1' },
      });

      expect(livros).to.have.lengthOf(1);
      expect(livros[0]).to.be.instanceOf(LivroSequelizeModel);
      expect(livros[0].id).to.equal(1);
      expect(livros[0].titulo).to.equal('Livro 1');
      expect(livros[0].quantidade).to.equal(3);
    });
  });

  describe('.create', () => {
    beforeEach(() => Promise.all([
      models.Autor.bulkCreate([{ nome: 'Autor 1' }, { nome: 'Autor 2' }]),
    ]));

    it('Deve criar livros no banco', async () => {
      await Promise.all([
        await repository.create({
          titulo: 'Livro 1',
          quantidade: 3,
          foto: 'http://foto.com/foto.jpg',
        }),
        await repository.create({
          titulo: 'Livro 2',
          quantidade: 12,
          foto: 'http://foto.com/foto2.jpg',
        }),
      ]);

      const livros = await LivroSequelizeModel.findAll();

      expect(livros).to.have.lengthOf(2);

      expect(livros[0]).to.be.instanceOf(LivroSequelizeModel);
      expect(livros[0].titulo).to.equal('Livro 1');
      expect(livros[0].quantidade).to.equal(3);
      expect(livros[0].foto).to.equal('http://foto.com/foto.jpg');

      expect(livros[1]).to.be.instanceOf(LivroSequelizeModel);
      expect(livros[1].titulo).to.equal('Livro 2');
      expect(livros[1].quantidade).to.equal(12);
      expect(livros[1].foto).to.equal('http://foto.com/foto2.jpg');
    });

    it('Deve criar livros no banco e incluir seus autores', async () => {
      await Promise.all([
        repository.create({
          titulo: 'Livro 1',
          quantidade: 3,
          foto: 'http://foto.com/foto.jpg',
          autores: [1, { id: 2 }],
        }),
        repository.create({
          titulo: 'Livro 2',
          quantidade: 12,
          foto: 'http://foto.com/foto2.jpg',
          autores: [{ id: 2 }],
        }),
      ]);

      const livros = await LivroSequelizeModel.findAll({
        include: [{ model: models.Autor }],
      });

      expect(livros).to.have.lengthOf(2);

      expect(livros[0]).to.be.instanceOf(LivroSequelizeModel);
      expect(livros[0].titulo).to.equal('Livro 1');
      expect(livros[0].quantidade).to.equal(3);
      expect(livros[0].foto).to.equal('http://foto.com/foto.jpg');
      expect(livros[0].autores).to.have.lengthOf(2);
      expect(livros[0].autores[0].id).to.equal(1);
      expect(livros[0].autores[1].id).to.equal(2);

      expect(livros[1]).to.be.instanceOf(LivroSequelizeModel);
      expect(livros[1].titulo).to.equal('Livro 2');
      expect(livros[1].quantidade).to.equal(12);
      expect(livros[1].autores).to.have.lengthOf(1);
      expect(livros[1].foto).to.equal('http://foto.com/foto2.jpg');
      expect(livros[1].autores[0].id).to.equal(2);
    });
  });

  describe('.update', () => {
    beforeEach(() => Promise.all([
      models.Autor.bulkCreate([
        { nome: 'Autor 1' },
        { nome: 'Autor 2' },
        { nome: 'Autor 3' },
      ]),
      models.Livro.bulkCreate([
        {
          titulo: 'Livro 1',
          quantidade: 3,
          foto: 'http://foto.com/foto.jpg',
          autores: [],
        },
        {
          titulo: 'Livro 2',
          quantidade: 12,
          foto: 'http://foto.com/foto2.jpg',
          autores: [1],
        },
        { titulo: 'Livro 3' },
      ]),
    ]));

    it('Deve atualizar livros no banco, incluindo seus autores', async () => {
      await Promise.all([
        await repository.create({
          titulo: 'Livro 1',
          quantidade: 3,
          foto: 'http://foto.com/foto.jpg',
          autores: [1],
        }),
        await repository.create({
          titulo: 'Livro 2',
          quantidade: 12,
          foto: 'http://foto.com/foto2.jpg',
          autores: [{ id: 2 }],
        }),
        await repository.create({
          titulo: 'Livro 3',
          quantidade: 5,
          foto: 'http://foto.com/foto3.jpg',
        }),
      ]);

      const livro1 = {
        id: 1,
        titulo: 'Updated title 1',
        quantidade: 4,
        foto: 'http://updated.com/foto.jpg',
        autores: [],
      };

      const livro2 = {
        id: 2,
        titulo: 'Updated title 2',
        quantidade: 4,
        foto: 'http://updated.com/foto2.jpg',
        autores: [3],
      };

      const livro3 = {
        id: 3,
        titulo: 'Updated title 3',
        quantidade: 6,
        foto: 'http://updated.com/foto3.jpg',
        autores: [1, { id: 2 }],
      };

      await repository.update(livro1);
      await repository.update(livro2);
      await repository.update(livro3);

      const [dbLivro1, dbLivro2, dbLivro3] = await Promise.all(
        [1, 2, 3].map((livroId) => LivroSequelizeModel.findByPk(livroId)),
      );
      const [
        dbLivro1Autores,
        dbLivro2Autores,
        dbLivro3Autores,
      ] = await Promise.all(
        [dbLivro1, dbLivro2, dbLivro3].map((dbLivro) => dbLivro.getAutores()),
      );

      expect(dbLivro1).to.be.instanceOf(LivroSequelizeModel);
      expect(dbLivro1.titulo).to.be.equal(livro1.titulo);
      expect(dbLivro1.quantidade).to.be.equal(livro1.quantidade);
      expect(dbLivro1.foto).to.be.equal(livro1.foto);
      expect(dbLivro1Autores).to.have.lengthOf(livro1.autores.length);

      expect(dbLivro2.titulo).to.be.equal(livro2.titulo);
      expect(dbLivro2.quantidade).to.be.equal(livro2.quantidade);
      expect(dbLivro2.foto).to.be.equal(livro2.foto);
      expect(dbLivro2Autores).to.have.lengthOf(livro2.autores.length);

      expect(dbLivro3.titulo).to.be.equal(livro3.titulo);
      expect(dbLivro3.quantidade).to.be.equal(livro3.quantidade);
      expect(dbLivro3.foto).to.be.equal(livro3.foto);
      expect(dbLivro3Autores).to.have.lengthOf(livro3.autores.length);
    });
  });

  describe('.remove(1)', () => {
    beforeEach(() => LivroSequelizeModel.bulkCreate([
      { titulo: 'Livro 1', quantidade: 3, foto: 'http://foto.com/foto.jpg' },
      { titulo: 'Livro 2', quantidade: 12, foto: 'http://foto.com/foto2.jpg' },
    ]));

    it('Deve excluir livros do banco', async () => {
      await repository.remove(1);

      const livros = await LivroSequelizeModel.findAll();

      expect(livros).to.have.lengthOf(1);
      expect(livros[0].titulo).to.equal('Livro 2');
    });
  });

  describe('.remove({ id: 1 })', () => {
    beforeEach(() => LivroSequelizeModel.bulkCreate([
      { titulo: 'Livro 1', quantidade: 3, foto: 'http://foto.com/foto.jpg' },
      { titulo: 'Livro 2', quantidade: 12, foto: 'http://foto.com/foto2.jpg' },
    ]));

    it('Deve excluir livros do banco', async () => {
      await repository.remove({ id: 1 });

      const livros = await LivroSequelizeModel.findAll();

      expect(livros).to.have.lengthOf(1);

      expect(livros[0]).to.be.instanceOf(LivroSequelizeModel);
      expect(livros[0].titulo).to.equal('Livro 2');
    });
  });
});
