const chalk = require('chalk')
const { readRcPathObject } = require('./utils/config')

module.exports = async () => {
  const configObject = await readRcPathObject()
  console.log(chalk.yellow(JSON.stringify(configObject)));
}
