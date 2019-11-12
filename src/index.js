const { format, addDays, toDate } = require('date-fns');
const container = require('./iocContainer');

container.resolve('AutorSequelizeRepository').findAll({
  includes: ['livros'],
})
  .then((autores) => {
    console.log(autores[0].livros);
  })
  .catch(console.error);
