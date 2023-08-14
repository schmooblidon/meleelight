
const { Deepstream } = require('@deepstream/server')

const server = new Deepstream({});
server.set('logLevel', 'ERROR');

server.start();
