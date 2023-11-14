const { readRcPathObject, writeRcPathObject } = require('./utils/config')

module.exports = async (key, value) => {
  const configObject = await readRcPathObject()
  configObject[key] = value;
  writeRcPathObject(configObject)
}
