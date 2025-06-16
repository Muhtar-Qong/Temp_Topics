const http = require('http');
const { hostname, port, handleRequest } = require('./serverCore');

const server = http.createServer(handleRequest);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
