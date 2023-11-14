const os = require('os')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')

const getRcPath = (file) => {
  return process.env.PUBLISH_CONFIG_PATH || path.join(os.homedir(), file);
}

module.exports = {
  async readRcPathObject(defaultvalue={}) {
    let rcPath = getRcPath('1.json');
    return new Promise((resolve,reject)=>{
      fs.readFile(rcPath, (err, buffer) => {
        if(err) return reject(err)
        resolve(buffer ? JSON.parse(buffer.toString()) : defaultvalue)
      })
    })
  },
  readRcPathSyncObject(defaultvalue) {
    let rcPath = getRcPath('1.json');
    let configData = defaultvalue
    try {
      const data = fs.readFileSync(rcPath, 'utf-8');
      configData = data ? JSON.parse(data) : defaultvalue
    } catch (err) {
      configData = defaultvalue
    }
    return configData
  },
  writeRcPathObject(configData) {
    let rcPath = getRcPath('1.json');
    const str = JSON.stringify(configData);
    fs.writeFile(rcPath, str, (err) => {
      if(err){
        console.error(err);
      }
      console.log(chalk.cyan(` 新增成功`))
    })
  }
}
