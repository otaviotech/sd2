const express = require('express');

module.exports = ({ HttpRouter, config }) => {
  const app = express();

  app.use(HttpRouter);

  app.listen(config.port, config.host, () => {
    console.log(`Http server listening on port ${config.port}`);
    return app;
  });
};
