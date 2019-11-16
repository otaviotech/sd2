const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const container = require('../src/iocContainer');

const db = container.resolve('sequelizeConnection');

const dropDatabase = async () => {
  try {
    await exec('NODE_ENV=test yarn run sequelize db:drop');
    return Promise.resolve();
  } catch (error) {
    return Promise.resolve();
  }
};
const createDatabase = () => exec('NODE_ENV=test yarn run sequelize db:create');
const truncateDatabase = () => db && db.sync({ force: true });

// before(() => dropDatabase().then(createDatabase));
beforeEach(truncateDatabase);
