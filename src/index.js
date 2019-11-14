const container = require('./iocContainer');

const app = container.resolve('HttpServer');

const bootstrap = async () => {
  // console.log(app.routes);
};

bootstrap();
