const container = require('../src/iocContainer');

const db = container.resolve('sequelizeConnection');
const truncateDatabase = () => db && db.sync({ force: true });

beforeEach(truncateDatabase);
