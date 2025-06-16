const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 3000;

function serveIndexHtml(res) {
  const filePath = path.join(__dirname, 'index.html');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Internal Server Error');
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(data);
    }
  });
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.js': return 'application/javascript';
    case '.css': return 'text/css';
    case '.html': return 'text/html';
    case '.json': return 'application/json';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    default: return 'application/octet-stream';
  }
}

function handleRequest(req, res) {
  if (req.url === '/' || req.url === '/index.html') {
    serveIndexHtml(res);
  } else {
    // Serve static files from the project directory
    const safePath = path.normalize(req.url).replace(/^\/+/, '');
    const filePath = path.join(__dirname, safePath);
    if (filePath.startsWith(__dirname)) {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Not Found');
        } else {
          fs.readFile(filePath, (err, data) => {
            if (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'text/plain');
              res.end('Internal Server Error');
            } else {
              res.statusCode = 200;
              res.setHeader('Content-Type', getContentType(filePath));
              res.end(data);
            }
          });
        }
      });
    } else {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Forbidden');
    }
  }
}

module.exports = { hostname, port, handleRequest };
