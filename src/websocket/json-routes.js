const http = require('http');
const chalk = require('chalk');
const webSocketServer = require('./socket-routes.js');
const jsonServer = require('../server/index');
const load = require('../cli/utils/load')

module.exports = (argv) => {
  const source = argv._[0]
  return load(source, true).then(db => {
    const app = jsonServer.create();
    const middlewares = jsonServer.defaults();
    app.use(middlewares);
    
    const router = jsonServer.router(db);
    app.use('/api', router);
  
    const server = http.createServer(app)

    webSocketServer(server, '/io', 30_000, db);

    server.listen(4000, 'localhost', () => {
      console.log(chalk.green('http://localhost:4000 连接建立!'))
    })
  })
}
