
const DeepstreamServer = require('deepstream.io')
const C = DeepstreamServer.constants;

const server = new DeepstreamServer({
  host: 'localhost',
  port: 6020,
  logLevel:'DEBUG'
});
server.set('logLevel', 'ERROR');

server.start();