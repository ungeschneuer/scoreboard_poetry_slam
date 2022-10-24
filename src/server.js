const { fastify } = require('fastify');
const static = require('@fastify/static');
const open = require('open');

const path = require('path');

const startServer = async () => {
  const server = fastify({ logger: false });
  server.register(static, { root: path.join(__dirname, '..', 'public') });

  try {
    await server.listen({ port: 4200, host: '0.0.0.0' });
    console.log('server listening on http://localhost:4200');
    await open('http://localhost:4200/admin.html');
    await open('http://localhost:4200/index.html');
  } catch (error) {
    console.log(error);
  }
};

startServer();
