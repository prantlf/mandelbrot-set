const http = require('http')
const connect = require('connect')
const morgan = require('morgan')
const serveStatic = require('serve-static')
const serveIndex = require('serve-index')

const host = '0.0.0.0'
const port = 8008

const server = connect()
  .use(morgan('short'))
  .use(serveStatic('pages', { etag: false }))
  .use(serveIndex('pages'))

console.log('Starting web server at http://' + host + ':' + port)
http.createServer(server)
  .listen(port, host)
